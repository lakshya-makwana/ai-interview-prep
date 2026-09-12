import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.database import SessionLocal
from app.main import app
from app.models.interview import Interview, InterviewQuestion
from app.models.interview_evaluation import InterviewEvaluation
from app.models.user import User
from app.services.interview_evaluation_service import (
    build_evaluation_prompt,
    evaluate_candidate_answer,
)


class TestInterviewEvaluation(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        # Clean up any leftover test user from previous interrupted runs
        existing_user = (
            self.db.query(User)
            .filter(User.email == "test_eval_user@example.com")
            .first()
        )
        if existing_user:
            self.db.delete(existing_user)
            self.db.commit()

        self.user = User(
            name="Test Eval User",
            email="test_eval_user@example.com",
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

    def test_build_evaluation_prompt(self):
        prompt = build_evaluation_prompt(
            question_text="Explain ACID properties.",
            topic="DBMS",
            difficulty="Medium",
            candidate_answer="Atomicity, Consistency, Isolation, Durability.",
        )
        self.assertIn("Explain ACID properties.", prompt)
        self.assertIn("DBMS", prompt)
        self.assertIn("Medium", prompt)
        self.assertIn("Atomicity, Consistency, Isolation, Durability.", prompt)
        self.assertIn("technical_correctness", prompt)
        self.assertIn("summary", prompt)

    @patch("app.services.interview_evaluation_service.client.models.generate_content")
    def test_evaluate_candidate_answer_parsing(self, mock_generate):
        mock_generate.return_value.text = """
        ```json
        {
          "technical_correctness": 8.5,
          "completeness": 8.0,
          "relevance": 9.0,
          "communication": 8.5,
          "overall_score": 8.5,
          "summary": "Clear explanation of ACID properties.",
          "strengths": ["Clear definitions", "Accurate terms"],
          "missing_concepts": ["Could discuss WAL / journaling"],
          "feedback": "Great concise answer. Mention implementation techniques."
        }
        ```
        """
        result = evaluate_candidate_answer(
            question_text="Explain ACID",
            topic="DBMS",
            difficulty="Medium",
            candidate_answer="ACID guarantees database reliability.",
        )
        self.assertEqual(result["technical_correctness"], 8.5)
        self.assertEqual(result["completeness"], 8.0)
        self.assertEqual(result["relevance"], 9.0)
        self.assertEqual(result["communication"], 8.5)
        self.assertEqual(result["overall_score"], 8.5)
        self.assertEqual(result["summary"], "Clear explanation of ACID properties.")
        self.assertIn("Clear definitions", result["strengths"])
        self.assertIn("Could discuss WAL / journaling", result["missing_concepts"])
        self.assertIn("Great concise answer", result["feedback"])

    @patch("app.services.interview_evaluation_service.evaluate_candidate_answer")
    def test_evaluation_endpoint_and_persistence(self, mock_eval):
        mock_eval.return_value = {
            "technical_correctness": 8.0,
            "completeness": 7.5,
            "relevance": 9.0,
            "communication": 8.0,
            "overall_score": 8.0,
            "summary": "Solid explanation.",
            "strengths": ["Well structured"],
            "missing_concepts": ["Edge cases omitted"],
            "feedback": "Good job, elaborate more.",
        }

        # 1. Start interview
        start_res = self.client.post("/interviews/start", headers=self.headers)
        self.assertEqual(start_res.status_code, 200)
        interview_id = start_res.json()["interview_id"]
        first_q_id = start_res.json()["current_question"]["id"]

        # 2. Answer question 1
        ans_res = self.client.post(
            "/interviews/answer",
            headers=self.headers,
            json={
                "interview_question_id": first_q_id,
                "answer": "This is my technical answer.",
            },
        )
        self.assertEqual(ans_res.status_code, 200)

        # 3. Call GET /interviews/{id}/evaluation
        eval_res = self.client.get(
            f"/interviews/{interview_id}/evaluation",
            headers=self.headers,
        )
        self.assertEqual(eval_res.status_code, 200)
        eval_data = eval_res.json()
        self.assertEqual(eval_data["interview_id"], interview_id)
        self.assertEqual(len(eval_data["questions"]), 5)

        # First question was answered, so it must have an evaluation
        q1 = eval_data["questions"][0]
        self.assertEqual(q1["id"], first_q_id)
        self.assertEqual(q1["candidate_answer"], "This is my technical answer.")
        self.assertIsNotNone(q1["evaluation"])
        self.assertEqual(q1["evaluation"]["overall_score"], 8.0)
        self.assertEqual(q1["evaluation"]["summary"], "Solid explanation.")
        self.assertIn("Well structured", q1["evaluation"]["strengths"])

        # Remaining questions were not answered, so evaluation must be None/null
        for q in eval_data["questions"][1:]:
            self.assertIsNone(q["evaluation"])

        # 4. Verify evaluation was persisted in PostgreSQL database
        saved_eval = (
            self.db.query(InterviewEvaluation)
            .filter(InterviewEvaluation.interview_question_id == first_q_id)
            .first()
        )
        self.assertIsNotNone(saved_eval)
        self.assertEqual(saved_eval.overall_score, 8.0)

        # Calling GET /interviews/{id}/evaluation again should load from DB without re-evaluating
        mock_eval.reset_mock()
        second_res = self.client.get(
            f"/interviews/{interview_id}/evaluation",
            headers=self.headers,
        )
        self.assertEqual(second_res.status_code, 200)
        mock_eval.assert_not_called()
