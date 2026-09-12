import unittest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.database import SessionLocal
from app.main import app
from app.models.interview import Interview, InterviewQuestion
from app.models.interview_dataset import InterviewDataset
from app.models.user import User
from app.services.ml_readiness_service import assess_ml_readiness


class TestMLReadiness(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        # Clean up any leftover test user
        existing_user = (
            self.db.query(User)
            .filter(User.email == "test_ml_readiness@example.com")
            .first()
        )
        if existing_user:
            self.db.delete(existing_user)
            self.db.commit()

        self.user = User(
            name="Test ML User",
            email="test_ml_readiness@example.com",
            hashed_password="dummy_hashed_password",
        )
        self.db.add(self.user)
        self.db.commit()
        self.db.refresh(self.user)

        self.token = create_access_token(data={"sub": self.user.email})
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def tearDown(self):
        self.db.rollback()
        user_to_delete = (
            self.db.query(User)
            .filter(User.id == self.user.id)
            .first()
        )
        if user_to_delete:
            self.db.delete(user_to_delete)
            self.db.commit()
        self.db.close()

    def _create_interview_and_question(self, interview_cache, interview_key=1, topic="OOP", difficulty="Medium"):
        if interview_key not in interview_cache:
            interview = Interview(
                user_id=self.user.id,
                status="Completed",
                interview_type="Technical",
                total_questions=5,
                current_question=5,
            )
            self.db.add(interview)
            self.db.commit()
            self.db.refresh(interview)
            interview_cache[interview_key] = interview

        interview = interview_cache[interview_key]

        q = InterviewQuestion(
            interview_id=interview.id,
            question_id=f"Q_{interview_key}_{topic}_{difficulty}",
            question_text=f"Question on {topic} ({difficulty})",
            topic=topic,
            difficulty=difficulty,
            display_order=1,
            candidate_answer="Sample answer for testing ML readiness assessment.",
        )
        self.db.add(q)
        self.db.commit()
        self.db.refresh(q)
        return interview, q

    def _create_mock_record(
        self,
        interview_id,
        question_id,
        topic="OOP",
        difficulty="Medium",
        overall_score=8.0,
        complete=True,
    ):
        return InterviewDataset(
            user_id=self.user.id,
            interview_id=interview_id,
            interview_question_id=question_id,
            topic=topic,
            difficulty=difficulty,
            question_text=f"Question about {topic} ({difficulty})",
            candidate_answer="Sample answer demonstrating technical knowledge.",
            technical_correctness=8.0 if complete else None,
            completeness=8.0 if complete else None,
            relevance=8.0 if complete else None,
            communication=8.0 if complete else None,
            overall_score=overall_score if complete else None,
            strengths=["Good understanding"],
            missing_concepts=[],
            feedback="Great explanation.",
        )

    def test_empty_dataset(self):
        """Test assessing ML readiness with zero records."""
        report = assess_ml_readiness(self.db, current_user=self.user)
        self.assertFalse(report.is_ready)
        self.assertEqual(report.readiness_status, "Continue Collecting Data")
        self.assertEqual(report.total_dataset_records, 0)
        self.assertEqual(report.completed_interviews, 0)
        self.assertEqual(report.answered_questions, 0)
        self.assertEqual(report.average_score, 0.0)
        self.assertIn("No structured interview records", report.summary)
        self.assertTrue(len(report.recommendations) > 0)
        # All criteria should fail for empty dataset
        for c in report.criteria:
            self.assertFalse(c.passed)

    def test_small_dataset(self):
        """Test with small dataset (< 100 records)."""
        interview_cache = {}
        # Add 10 records across 2 interviews
        for i in range(10):
            topic = "OOP" if i < 5 else "DBMS"
            diff = "Easy" if i % 2 == 0 else "Medium"
            int_key = 1 if i < 5 else 2
            interview, q = self._create_interview_and_question(interview_cache, int_key, topic, diff)
            rec = self._create_mock_record(
                interview_id=interview.id,
                question_id=q.id,
                topic=topic,
                difficulty=diff,
            )
            self.db.add(rec)
        self.db.commit()

        report = assess_ml_readiness(self.db, current_user=self.user)
        self.assertFalse(report.is_ready)
        self.assertEqual(report.readiness_status, "Continue Collecting Data")
        self.assertEqual(report.total_dataset_records, 10)
        self.assertEqual(report.completed_interviews, 2)
        self.assertEqual(report.answered_questions, 10)
        self.assertIn("Shortfall of 90 records", report.criteria[0].detail)

    def test_incomplete_evaluations(self):
        """Test evaluation completeness criteria failure (< 95%)."""
        from unittest.mock import MagicMock

        # Create in-memory mock records with 5 complete and 5 incomplete
        mock_records = []
        for i in range(10):
            complete = (i < 5)
            mock_rec = InterviewDataset(
                user_id=self.user.id,
                interview_id=1,
                interview_question_id=200 + i,
                topic="OOP",
                difficulty="Medium",
                question_text="Explain polymorphism",
                candidate_answer="Polymorphism allows objects of different types to be treated as instances of the same class.",
                technical_correctness=8.0 if complete else None,
                completeness=8.0 if complete else None,
                relevance=8.0 if complete else None,
                communication=8.0 if complete else None,
                overall_score=8.0 if complete else None,
                strengths=["Good"],
                missing_concepts=[],
                feedback="Good answer",
            )
            mock_records.append(mock_rec)

        mock_db = MagicMock()
        mock_db.query.return_value.filter.return_value.all.return_value = mock_records

        report = assess_ml_readiness(mock_db, current_user=self.user)
        completeness_criterion = next(c for c in report.criteria if c.name == "Evaluation Completeness")
        self.assertFalse(completeness_criterion.passed)
        self.assertEqual(report.label_quality.completeness_percentage, 50.0)
        self.assertEqual(report.label_quality.complete_records, 5)
        self.assertEqual(report.label_quality.missing_records, 5)

    def test_ready_dataset(self):
        """Test complete dataset passing all readiness thresholds."""
        topics = ["OOP", "DBMS", "OS", "Computer Networks", "DSA", "Backend"]
        difficulties = ["Easy", "Medium", "Hard"]
        interview_cache = {}

        # Generate 102 complete records evenly distributed
        for i in range(102):
            topic = topics[i % len(topics)]
            difficulty = difficulties[i % len(difficulties)]
            int_key = (i // 5) + 1
            interview, q = self._create_interview_and_question(interview_cache, int_key, topic, difficulty)
            rec = self._create_mock_record(
                interview_id=interview.id,
                question_id=q.id,
                topic=topic,
                difficulty=difficulty,
                overall_score=7.5 + (i % 3) * 0.5,
                complete=True,
            )
            self.db.add(rec)
        self.db.commit()

        report = assess_ml_readiness(self.db, current_user=self.user)
        self.assertTrue(report.is_ready)
        self.assertEqual(report.readiness_status, "Ready for ML")
        self.assertEqual(report.total_dataset_records, 102)
        self.assertGreaterEqual(report.label_quality.completeness_percentage, 95.0)
        self.assertTrue(all(c.passed for c in report.criteria))
        self.assertEqual(len(report.topic_distribution), 6)
        self.assertEqual(len(report.difficulty_distribution), 3)

    def test_api_endpoint(self):
        """Test GET /ml-readiness endpoint returns 200 for authenticated user and 401 without auth."""
        # Unauthenticated request
        unauth_res = self.client.get("/ml-readiness")
        self.assertEqual(unauth_res.status_code, 401)

        # Authenticated request
        auth_res = self.client.get("/ml-readiness", headers=self.headers)
        self.assertEqual(auth_res.status_code, 200)
        data = auth_res.json()
        self.assertIn("total_dataset_records", data)
        self.assertIn("is_ready", data)
        self.assertIn("readiness_status", data)
        self.assertIn("criteria", data)
        self.assertIn("topic_distribution", data)
        self.assertIn("difficulty_distribution", data)
        self.assertIn("recommendations", data)
