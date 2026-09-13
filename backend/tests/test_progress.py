import unittest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.database import SessionLocal
from app.main import app
from app.models.interview import Interview, InterviewQuestion
from app.models.interview_evaluation import InterviewEvaluation
from app.models.user import User
from app.services.progress_service import generate_progress_report


class TestProgressIntelligence(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        self.user = (
            self.db.query(User)
            .filter(User.email == "test_progress_user@example.com")
            .first()
        )
        if not self.user:
            self.user = User(
                name="Test Progress User",
                email="test_progress_user@example.com",
                hashed_password="hashed_dummy_password",
            )
            self.db.add(self.user)
            self.db.commit()
            self.db.refresh(self.user)

        self.token = create_access_token(data={"sub": self.user.email})
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def tearDown(self):
        try:
            if self.user:
                user_to_delete = (
                    self.db.query(User).filter(User.id == self.user.id).first()
                )
                if user_to_delete:
                    self.db.delete(user_to_delete)
                self.db.commit()
        except Exception:
            self.db.rollback()
        finally:
            self.db.close()

    def _create_interview_with_evals(self, scores_and_topics: list[tuple[float, str]]) -> Interview:
        interview = Interview(
            user_id=self.user.id,
            interview_type="Technical",
            status="Completed",
            total_questions=len(scores_and_topics),
            current_question=len(scores_and_topics),
        )
        self.db.add(interview)
        self.db.flush()

        for idx, (score, topic) in enumerate(scores_and_topics, start=1):
            q = InterviewQuestion(
                interview_id=interview.id,
                question_id=f"Q_{topic}_{idx}",
                question_text=f"Question on {topic}",
                topic=topic,
                difficulty="Medium",
                display_order=idx,
                candidate_answer=f"Answer for {topic}",
            )
            self.db.add(q)
            self.db.flush()

            eval_rec = InterviewEvaluation(
                interview_question_id=q.id,
                technical_correctness=score,
                completeness=score,
                relevance=score,
                communication=score,
                overall_score=score,
                summary=f"Evaluation on {topic}",
                strengths=[f"Understands {topic}"],
                missing_concepts=[],
                feedback="Keep practicing.",
            )
            self.db.add(eval_rec)

        self.db.commit()
        self.db.refresh(interview)
        return interview

    def test_get_progress_unauthorized(self):
        """Calling GET /progress without auth token returns 401."""
        res = self.client.get("/progress")
        self.assertEqual(res.status_code, 401)

    def test_get_progress_empty_state(self):
        """Zero completed interviews returns empty state with has_sufficient_data=False."""
        res = self.client.get("/progress", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertFalse(data["has_sufficient_data"])
        self.assertEqual(data["summary"]["total_interviews"], 0)
        self.assertEqual(data["summary"]["average_score"], 0.0)
        self.assertEqual(data["summary"]["consistency_rating"], "Pending Data")
        self.assertIn("at least two", data["insights"][0].lower())

    def test_get_progress_single_interview(self):
        """One completed interview returns summary but has_sufficient_data=False."""
        self._create_interview_with_evals([(7.0, "DBMS"), (8.0, "OOP")])

        res = self.client.get("/progress", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertFalse(data["has_sufficient_data"])
        self.assertEqual(data["summary"]["total_interviews"], 1)
        self.assertEqual(data["summary"]["average_score"], 7.5)
        self.assertEqual(data["summary"]["total_questions_answered"], 2)
        self.assertEqual(data["summary"]["consistency_rating"], "Pending Data")

    def test_get_progress_multiple_interviews_improvement(self):
        """Two completed interviews calculates improvement percentage and net improvement."""
        # Interview 1: avg 6.0
        self._create_interview_with_evals([(6.0, "Operating Systems"), (6.0, "DBMS")])
        # Interview 2: avg 8.0
        self._create_interview_with_evals([(8.0, "Operating Systems"), (8.0, "DBMS")])

        res = self.client.get("/progress", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertTrue(data["has_sufficient_data"])
        self.assertEqual(data["summary"]["total_interviews"], 2)
        self.assertEqual(data["summary"]["average_score"], 7.0)
        self.assertEqual(data["summary"]["first_score" if "first_score" in data["summary"] else "lowest_score"], 6.0)
        self.assertEqual(data["summary"]["latest_score"], 8.0)
        self.assertEqual(data["summary"]["net_improvement"], 2.0)
        self.assertEqual(data["summary"]["improvement_percentage"], 33.3)
        self.assertEqual(len(data["interview_history"]), 2)

    def test_topic_trends_improving_stable_declining(self):
        """Verify topic trends determine Improving, Stable, and Declining."""
        # Interview 1
        self._create_interview_with_evals([
            (6.0, "Operating Systems"),  # will improve
            (8.0, "DBMS"),               # will stay stable
            (9.0, "Computer Networks"),  # will decline
        ])
        # Interview 2
        self._create_interview_with_evals([
            (8.5, "Operating Systems"),  # 6.0 -> 8.5 (+2.5) Improving
            (8.2, "DBMS"),               # 8.0 -> 8.2 (+0.2) Stable
            (6.0, "Computer Networks"),  # 9.0 -> 6.0 (-3.0) Declining
        ])

        report = generate_progress_report(self.db, self.user)
        self.assertTrue(report.has_sufficient_data)

        topic_map = {t.topic: t for t in report.topic_trends}
        self.assertIn("Operating Systems", topic_map)
        self.assertIn("DBMS", topic_map)
        self.assertIn("Computer Networks", topic_map)

        self.assertEqual(topic_map["Operating Systems"].status, "Improving")
        self.assertEqual(topic_map["Operating Systems"].delta, 2.5)

        self.assertEqual(topic_map["DBMS"].status, "Stable")
        self.assertEqual(topic_map["DBMS"].delta, 0.2)

        self.assertEqual(topic_map["Computer Networks"].status, "Declining")
        self.assertEqual(topic_map["Computer Networks"].delta, -3.0)

    def test_strongest_and_weakest_topics(self):
        """Verify strongest and weakest topics ranking."""
        self._create_interview_with_evals([
            (9.5, "OOP"),
            (8.8, "SQL"),
            (5.0, "Operating Systems"),
            (5.5, "System Design"),
        ])
        self._create_interview_with_evals([
            (9.5, "OOP"),
            (8.6, "SQL"),
            (5.2, "Operating Systems"),
            (5.6, "System Design"),
        ])

        report = generate_progress_report(self.db, self.user)
        self.assertIn("OOP", report.strongest_topics)
        self.assertIn("SQL", report.strongest_topics)
        self.assertIn("Operating Systems", report.weakest_topics)

    def test_consistency_rating(self):
        """Verify score consistency rating calculation."""
        # Near identical scores across 3 sessions -> Highly Consistent
        self._create_interview_with_evals([(8.0, "OOP")])
        self._create_interview_with_evals([(8.1, "OOP")])
        self._create_interview_with_evals([(8.0, "OOP")])

        report = generate_progress_report(self.db, self.user)
        self.assertEqual(report.summary.consistency_rating, "Highly Consistent")


if __name__ == "__main__":
    unittest.main()
