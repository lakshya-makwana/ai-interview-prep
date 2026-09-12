import unittest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.database import SessionLocal
from app.main import app
from app.models.interview import Interview, InterviewQuestion
from app.models.interview_dataset import InterviewDataset
from app.models.interview_evaluation import InterviewEvaluation
from app.models.user import User
from app.services.dataset_service import get_dataset_statistics, save_interview_dataset


class TestDataset(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        # Clean up existing test user
        existing_user = (
            self.db.query(User)
            .filter(User.email == "test_dataset_user@example.com")
            .first()
        )
        if existing_user:
            self.db.delete(existing_user)
            self.db.commit()

        self.user = User(
            name="Test Dataset User",
            email="test_dataset_user@example.com",
            hashed_password="hashed_dummy_password",
        )
        self.db.add(self.user)
        self.db.commit()
        self.db.refresh(self.user)

        self.token = create_access_token(data={"sub": self.user.email})
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def tearDown(self):
        user_to_delete = (
            self.db.query(User)
            .filter(User.id == self.user.id)
            .first()
        )
        if user_to_delete:
            self.db.delete(user_to_delete)
            self.db.commit()
        self.db.close()

    def _create_mock_interview_with_evaluations(self):
        interview = Interview(
            user_id=self.user.id,
            status="Completed",
            interview_type="Technical",
            total_questions=2,
            current_question=2,
        )
        self.db.add(interview)
        self.db.commit()
        self.db.refresh(interview)

        q1 = InterviewQuestion(
            interview_id=interview.id,
            question_id="Q_01",
            question_text="Explain Python GIL",
            topic="Python",
            difficulty="Medium",
            display_order=1,
            candidate_answer="The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once.",
        )
        q2 = InterviewQuestion(
            interview_id=interview.id,
            question_id="Q_02",
            question_text="What are ACID properties?",
            topic="Databases",
            difficulty="Hard",
            display_order=2,
            candidate_answer="Atomicity, Consistency, Isolation, Durability ensure database transaction reliability.",
        )
        self.db.add_all([q1, q2])
        self.db.commit()
        self.db.refresh(q1)
        self.db.refresh(q2)

        eval1 = InterviewEvaluation(
            interview_question_id=q1.id,
            technical_correctness=8.5,
            completeness=8.0,
            relevance=9.0,
            communication=8.5,
            overall_score=8.5,
            summary="Strong understanding of GIL.",
            strengths=["Concise", "Accurate"],
            missing_concepts=["multiprocessing alternative"],
            feedback="Great explanation of the Python mutex.",
        )
        eval2 = InterviewEvaluation(
            interview_question_id=q2.id,
            technical_correctness=9.5,
            completeness=9.0,
            relevance=9.5,
            communication=9.0,
            overall_score=9.3,
            summary="Solid ACID answer.",
            strengths=["Clear definitions"],
            missing_concepts=[],
            feedback="Excellent depth on database transactions.",
        )
        self.db.add_all([eval1, eval2])
        self.db.commit()
        self.db.refresh(interview)
        return interview

    def test_save_interview_dataset_and_idempotency(self):
        interview = self._create_mock_interview_with_evaluations()

        # First save
        records = save_interview_dataset(self.db, interview)
        self.assertEqual(len(records), 2)

        # Check in DB
        db_records = (
            self.db.query(InterviewDataset)
            .filter(InterviewDataset.interview_id == interview.id)
            .all()
        )
        self.assertEqual(len(db_records), 2)
        self.assertEqual(db_records[0].user_id, self.user.id)
        self.assertEqual(db_records[0].topic, "Python")
        self.assertEqual(db_records[0].technical_correctness, 8.5)

        # Second save (should NOT create duplicates)
        records_second = save_interview_dataset(self.db, interview)
        self.assertEqual(len(records_second), 2)
        total_in_db = (
            self.db.query(InterviewDataset)
            .filter(InterviewDataset.interview_id == interview.id)
            .count()
        )
        self.assertEqual(total_in_db, 2)

    def test_get_dataset_endpoint(self):
        interview = self._create_mock_interview_with_evaluations()
        save_interview_dataset(self.db, interview)

        response = self.client.get("/dataset", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertIn("topic", data[0])
        self.assertIn("candidate_answer", data[0])
        self.assertIn("overall_score", data[0])
        self.assertNotIn("resume_match_score", data[0])  # Verified removed from row

    def test_get_dataset_statistics_endpoint(self):
        interview = self._create_mock_interview_with_evaluations()
        save_interview_dataset(self.db, interview)

        response = self.client.get("/dataset/statistics", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        stats = response.json()
        self.assertEqual(stats["total_interviews"], 1)
        self.assertEqual(stats["total_answered_questions"], 2)
        self.assertEqual(stats["total_dataset_records"], 2)
        # Average of 8.5 and 9.3 = 8.9
        self.assertEqual(stats["average_overall_score"], 8.9)
        self.assertEqual(stats["topics_encountered"], ["Databases", "Python"])
        self.assertEqual(stats["difficulty_distribution"]["Medium"], 1)
        self.assertEqual(stats["difficulty_distribution"]["Hard"], 1)

    def test_empty_dataset(self):
        response = self.client.get("/dataset", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

        stats_resp = self.client.get("/dataset/statistics", headers=self.headers)
        self.assertEqual(stats_resp.status_code, 200)
        stats = stats_resp.json()
        self.assertEqual(stats["total_dataset_records"], 0)
        self.assertEqual(stats["average_overall_score"], 0.0)


if __name__ == "__main__":
    unittest.main()
