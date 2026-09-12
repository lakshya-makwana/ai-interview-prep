import unittest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.database import SessionLocal
from app.main import app
from app.models.candidate_profile import CandidateProfile
from app.models.interview import Interview, InterviewQuestion
from app.models.interview_evaluation import InterviewEvaluation
from app.models.job import Job
from app.models.job_requirement import JobRequirement
from app.models.resume import Resume
from app.models.user import User
from app.services.adaptive_interview_service import (
    adapt_next_question,
    collect_candidate_context,
    determine_priority_topics,
    select_questions,
)


class TestAdaptiveInterviewEngine(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        self.user = (
            self.db.query(User)
            .filter(User.email == "test_adaptive_user@example.com")
            .first()
        )
        if not self.user:
            self.user = User(
                name="Test Adaptive User",
                email="test_adaptive_user@example.com",
                hashed_password="hashed_test_password",
            )
            self.db.add(self.user)
            self.db.commit()
            self.db.refresh(self.user)

        self.token = create_access_token(data={"sub": self.user.email})
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def tearDown(self):
        try:
            if self.user:
                # Cleanup user and cascaded records
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

    def test_missing_required_skills_prioritized(self):
        """Verify that missing required skills receive highest priority."""
        # Candidate verified skills: Python, Git
        resume = Resume(
            user_id=self.user.id,
            filename="resume.pdf",
            stored_filename="test_stored.pdf",
            filepath="/tmp/resume.pdf",
            resume_text="Experienced developer with Python and Git.",
        )
        self.db.add(resume)
        self.db.flush()

        profile = CandidateProfile(
            resume_id=resume.id,
            skills="Python\nGit",
            verified_skills="Python\nGit",
        )
        self.db.add(profile)

        # Job requires Spring Boot, Kafka, and PostgreSQL (DBMS)
        job = Job(
            user_id=self.user.id,
            title="Senior Backend Engineer",
            company_name="Acme Corp",
            job_description="Job description",
        )
        self.db.add(job)
        self.db.flush()

        req = JobRequirement(
            job_id=job.id,
            required_skills="Spring Boot\nKafka\nPostgreSQL",
            preferred_skills="Docker\nRedis",
        )
        self.db.add(req)
        self.db.commit()

        context = collect_candidate_context(self.db, self.user)
        priorities = determine_priority_topics(context)

        # The missing required skills must be at the very top of priority topics
        self.assertIn("Spring Boot", priorities[:3])
        self.assertIn("Kafka", priorities[:3])
        self.assertIn("PostgreSQL", priorities[:3])

        questions, focus, topics = select_questions(self.db, self.user)
        self.assertEqual(len(questions), 5)
        self.assertEqual(focus, "Senior Backend Engineer")

        # Questions selected must cover the missing skills
        selected_topics = {q["topic"] for q in questions}
        self.assertTrue("Spring Boot" in selected_topics or "Kafka" in selected_topics or "DBMS" in selected_topics)

    def test_weak_interview_topics_prioritized(self):
        """Verify that topics with weak previous scores (< 7.0) are prioritized."""
        # Create a previous completed interview with weak performance in Operating Systems (4.5)
        past_interview = Interview(
            user_id=self.user.id,
            interview_type="Technical",
            status="Completed",
            total_questions=2,
            current_question=2,
        )
        self.db.add(past_interview)
        self.db.flush()

        q1 = InterviewQuestion(
            interview_id=past_interview.id,
            question_id="OS_01",
            question_text="Process vs Thread",
            topic="Operating Systems",
            difficulty="Easy",
            display_order=1,
            candidate_answer="A process is a program in execution.",
        )
        q2 = InterviewQuestion(
            interview_id=past_interview.id,
            question_id="OOP_01",
            question_text="Four pillars of OOP",
            topic="OOP",
            difficulty="Easy",
            display_order=2,
            candidate_answer="Encapsulation, inheritance, polymorphism, abstraction.",
        )
        self.db.add_all([q1, q2])
        self.db.flush()

        eval1 = InterviewEvaluation(
            interview_question_id=q1.id,
            technical_correctness=4.0,
            completeness=5.0,
            relevance=5.0,
            communication=4.0,
            overall_score=4.5,  # Weak topic!
            summary="Needs improvement in OS.",
            strengths=["Attempted answer"],
            missing_concepts=["Memory layout", "Cost of context switching"],
            feedback="Review OS concepts.",
        )
        eval2 = InterviewEvaluation(
            interview_question_id=q2.id,
            technical_correctness=9.0,
            completeness=9.0,
            relevance=9.0,
            communication=9.0,
            overall_score=9.0,  # Strong topic!
            summary="Excellent answer.",
            strengths=["All pillars explained"],
            missing_concepts=[],
            feedback="Great work.",
        )
        self.db.add_all([eval1, eval2])
        self.db.commit()

        context = collect_candidate_context(self.db, self.user)
        self.assertIn("Operating Systems", context["weak_topics"])
        self.assertIn("OOP", context["strong_topics"])

        priorities = determine_priority_topics(context)
        # Operating Systems must appear before OOP
        os_idx = priorities.index("Operating Systems")
        oop_idx = priorities.index("OOP")
        self.assertLess(os_idx, oop_idx)

    def test_duplicate_questions_avoided(self):
        """Verify that all 5 selected questions in a session are unique."""
        questions, _, _ = select_questions(self.db, self.user)
        self.assertEqual(len(questions), 5)
        question_ids = [q["question_id"] for q in questions]
        self.assertEqual(len(question_ids), len(set(question_ids)))

    def test_previous_interview_questions_not_repeated(self):
        """Verify that questions answered in prior interviews are not repeated if alternatives exist."""
        # Completed interview where user answered DBMS_01
        past_interview = Interview(
            user_id=self.user.id,
            interview_type="Technical",
            status="Completed",
            total_questions=1,
            current_question=1,
        )
        self.db.add(past_interview)
        self.db.flush()

        q = InterviewQuestion(
            interview_id=past_interview.id,
            question_id="DBMS_01",
            question_text="ACID properties",
            topic="DBMS",
            difficulty="Easy",
            display_order=1,
            candidate_answer="Atomicity, Consistency, Isolation, Durability.",
        )
        self.db.add(q)
        self.db.commit()

        questions, _, _ = select_questions(self.db, self.user)
        selected_ids = [q["question_id"] for q in questions]
        self.assertNotIn("DBMS_01", selected_ids)

    def test_difficulty_progression_default(self):
        """Verify the starting difficulty progression matches Medium -> Medium -> Hard -> Medium -> Hard."""
        questions, _, _ = select_questions(self.db, self.user)
        difficulties = [q["difficulty"] for q in questions]
        expected = ["Medium", "Medium", "Hard", "Medium", "Hard"]
        self.assertEqual(difficulties, expected)

    def test_in_session_adaptation_high_score(self):
        """Verify that high candidate score (>= 7.5) promotes next question difficulty to Hard."""
        interview = Interview(
            user_id=self.user.id,
            interview_type="Technical",
            status="In Progress",
            total_questions=2,
            current_question=1,
        )
        self.db.add(interview)
        self.db.flush()

        q1 = InterviewQuestion(
            interview_id=interview.id,
            question_id="OS_02",
            question_text="What is a deadlock?",
            topic="Operating Systems",
            difficulty="Medium",
            display_order=1,
            candidate_answer="Four Coffman conditions: mutual exclusion, hold and wait, no preemption, circular wait.",
        )
        q2 = InterviewQuestion(
            interview_id=interview.id,
            question_id="DBMS_02",
            question_text="Clustered vs non-clustered index",
            topic="DBMS",
            difficulty="Medium",
            display_order=2,
        )
        self.db.add_all([q1, q2])
        self.db.commit()

        # Score is 8.5 (high score) -> next question should be promoted from Medium to Hard
        adapted_q = adapt_next_question(self.db, interview, q1, answer_score=8.5)
        self.assertIsNotNone(adapted_q)
        self.assertEqual(adapted_q.difficulty, "Hard")
        self.assertNotEqual(adapted_q.question_id, "DBMS_02")

    def test_in_session_adaptation_low_score(self):
        """Verify that low candidate score (< 5.5) demotes next question difficulty to Easy."""
        interview = Interview(
            user_id=self.user.id,
            interview_type="Technical",
            status="In Progress",
            total_questions=2,
            current_question=1,
        )
        self.db.add(interview)
        self.db.flush()

        q1 = InterviewQuestion(
            interview_id=interview.id,
            question_id="OS_02",
            question_text="What is a deadlock?",
            topic="Operating Systems",
            difficulty="Medium",
            display_order=1,
            candidate_answer="I am not sure.",
        )
        q2 = InterviewQuestion(
            interview_id=interview.id,
            question_id="DBMS_02",
            question_text="Clustered vs non-clustered index",
            topic="DBMS",
            difficulty="Medium",
            display_order=2,
        )
        self.db.add_all([q1, q2])
        self.db.commit()

        # Score is 4.0 (low score) -> next question should be demoted from Medium to Easy
        adapted_q = adapt_next_question(self.db, interview, q1, answer_score=4.0)
        self.assertIsNotNone(adapted_q)
        self.assertEqual(adapted_q.difficulty, "Easy")

    def test_start_interview_api_includes_context(self):
        """Verify POST /interviews/start returns interview_focus and topics."""
        res = self.client.post("/interviews/start", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertIn("interview_id", data)
        self.assertIn("interview_focus", data)
        self.assertIn("topics", data)
        self.assertIsInstance(data["topics"], list)
        self.assertGreater(len(data["topics"]), 0)


if __name__ == "__main__":
    unittest.main()
