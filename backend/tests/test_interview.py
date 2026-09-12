import unittest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.database import SessionLocal
from app.main import app
from app.models.interview import Interview, InterviewQuestion
from app.models.user import User


class TestInterviewEngine(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        self.user = (
            self.db.query(User)
            .filter(User.email == "test_interview_user@example.com")
            .first()
        )
        if not self.user:
            self.user = User(
                name="Test Interview User",
                email="test_interview_user@example.com",
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
                # Delete user (cascades to interviews, interview_questions)
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

    def test_get_current_404_when_no_interview(self):
        response = self.client.get("/interviews/current", headers=self.headers)
        self.assertEqual(response.status_code, 404)
        self.assertIn("No interview currently in progress", response.json()["detail"])

    def test_full_interview_flow(self):
        # 1. Start Interview
        start_res = self.client.post("/interviews/start", headers=self.headers)
        self.assertEqual(start_res.status_code, 200)
        start_data = start_res.json()

        interview_id = start_data["interview_id"]
        self.assertEqual(start_data["status"], "In Progress")
        self.assertEqual(start_data["total_questions"], 5)
        self.assertEqual(start_data["current_question_number"], 1)

        first_q = start_data["current_question"]
        self.assertEqual(first_q["display_order"], 1)
        self.assertTrue(bool(first_q["question_id"]))
        self.assertTrue(bool(first_q["question_text"]))
        self.assertTrue(bool(first_q["topic"]))
        self.assertTrue(bool(first_q["difficulty"]))

        # 2. Test Refinement: Calling /start again returns existing active interview
        resume_res = self.client.post("/interviews/start", headers=self.headers)
        self.assertEqual(resume_res.status_code, 200)
        self.assertEqual(resume_res.json()["interview_id"], interview_id)
        self.assertEqual(resume_res.json()["current_question_number"], 1)

        # 3. GET /interviews/current returns current question
        current_res = self.client.get("/interviews/current", headers=self.headers)
        self.assertEqual(current_res.status_code, 200)
        curr_data = current_res.json()
        self.assertEqual(curr_data["interview_id"], interview_id)
        self.assertEqual(curr_data["current_question_number"], 1)
        self.assertEqual(curr_data["current_question"]["id"], first_q["id"])

        # 4. Answer Questions 1 through 5 sequentially
        current_q_id = first_q["id"]
        for q_num in range(1, 6):
            ans_res = self.client.post(
                "/interviews/answer",
                headers=self.headers,
                json={
                    "interview_question_id": current_q_id,
                    "answer": f"This is my detailed technical answer for question {q_num}.",
                },
            )
            self.assertEqual(ans_res.status_code, 200)
            ans_data = ans_res.json()

            if q_num < 5:
                self.assertFalse(ans_data["is_completed"])
                self.assertEqual(ans_data["status"], "In Progress")
                self.assertEqual(ans_data["current_question_number"], q_num + 1)
                self.assertIsNotNone(ans_data["next_question"])
                self.assertEqual(ans_data["next_question"]["display_order"], q_num + 1)
                current_q_id = ans_data["next_question"]["id"]
            else:
                # 5th question completes the interview
                self.assertTrue(ans_data["is_completed"])
                self.assertEqual(ans_data["status"], "Completed")
                self.assertIsNone(ans_data["next_question"])

        # 5. After completion, GET /interviews/current returns 404
        after_comp_res = self.client.get("/interviews/current", headers=self.headers)
        self.assertEqual(after_comp_res.status_code, 404)

        # 6. View completed interview via GET /interviews/{id}
        detail_res = self.client.get(f"/interviews/{interview_id}", headers=self.headers)
        self.assertEqual(detail_res.status_code, 200)
        detail_data = detail_res.json()

        self.assertEqual(detail_data["id"], interview_id)
        self.assertEqual(detail_data["status"], "Completed")
        self.assertEqual(len(detail_data["questions"]), 5)
        self.assertIsNotNone(detail_data["completed_at"])

        # Verify all answers and question_ids are preserved
        seen_question_ids = set()
        for idx, q in enumerate(detail_data["questions"], start=1):
            self.assertEqual(q["display_order"], idx)
            self.assertIn(f"answer for question {idx}", q["candidate_answer"])
            self.assertIsNotNone(q["answered_at"])
            self.assertTrue(bool(q["question_id"]))
            seen_question_ids.add(q["question_id"])

        # Verify all 5 questions were distinct
        self.assertEqual(len(seen_question_ids), 5)
