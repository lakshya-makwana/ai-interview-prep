import unittest
from fastapi.testclient import TestClient

from app.main import app
from app.database.database import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.coding_question import CodingQuestion
from app.models.coding_submission import CodingSubmission
from app.core.security import create_access_token


class TestUserProfile(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        # Find or create a test user
        self.user = self.db.query(User).filter(User.email == "test_profile_user@example.com").first()
        if not self.user:
            self.user = User(
                name="Test Profile User",
                email="test_profile_user@example.com",
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
                user_to_delete = self.db.query(User).filter(User.id == self.user.id).first()
                if user_to_delete:
                    self.db.delete(user_to_delete)
                    self.db.commit()
        except Exception:
            self.db.rollback()
        finally:
            self.db.close()


    def test_unauthorized_access(self):
        response = self.client.get("/users/profile")
        self.assertEqual(response.status_code, 401)

    def test_profile_structure(self):
        response = self.client.get("/users/profile", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Verify top-level sections
        self.assertIn("user", data)
        self.assertIn("resume", data)
        self.assertIn("coding", data)

        # Verify user section
        self.assertEqual(data["user"]["name"], self.user.name)
        self.assertEqual(data["user"]["email"], self.user.email)
        self.assertIn("joined_at", data["user"])

        # Verify resume section
        self.assertIn("uploaded", data["resume"])
        self.assertIn("filename", data["resume"])
        self.assertIn("ats_score", data["resume"])

        # Verify coding section
        self.assertIn("total_solved", data["coding"])
        self.assertIn("easy", data["coding"])
        self.assertIn("medium", data["coding"])
        self.assertIn("hard", data["coding"])
        self.assertIn("total_submissions", data["coding"])
        self.assertIn("acceptance_rate", data["coding"])
        self.assertIn("favorite_language", data["coding"])
        self.assertIn("recent_activity", data["coding"])
        self.assertIsInstance(data["coding"]["recent_activity"], list)

    def test_profile_with_resume_and_submissions(self):
        # Create a mock resume if not present
        existing_resume = self.db.query(Resume).filter(Resume.user_id == self.user.id).first()
        if not existing_resume:
            existing_resume = Resume(
                filename="test_resume.pdf",
                stored_filename="test_resume_uuid.pdf",
                filepath="uploads/resumes/test.pdf",
                resume_text="Experienced Software Engineer",
                user_id=self.user.id,
            )
            self.db.add(existing_resume)
            self.db.commit()
            self.db.refresh(existing_resume)

            analysis = ResumeAnalysis(
                resume_id=existing_resume.id,
                ats_score=85,
                strengths="Python, Algorithms",
                weaknesses="Cloud Architecture",
                missing_keywords="Docker, Kubernetes",
                suggestions="Add metrics",
            )
            self.db.add(analysis)
            self.db.commit()

        # Check question exists
        question = self.db.query(CodingQuestion).first()
        if question:
            # Create a submission
            sub = CodingSubmission(
                user_id=self.user.id,
                question_id=question.id,
                language="python",
                status="Accepted",
                source_code="def solution(): pass",
                runtime_ms=35,
                score=100,
                passed_test_cases=5,
                total_test_cases=5,
            )
            self.db.add(sub)
            self.db.commit()

        response = self.client.get("/users/profile", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertTrue(data["resume"]["uploaded"])
        self.assertEqual(data["resume"]["filename"], "test_resume.pdf")
        self.assertEqual(data["resume"]["ats_score"], 85)
        self.assertGreaterEqual(data["coding"]["total_submissions"], 1)
        self.assertEqual(data["coding"]["favorite_language"], "Python")
        self.assertGreaterEqual(len(data["coding"]["recent_activity"]), 1)
        activity_item = data["coding"]["recent_activity"][0]
        self.assertIn("problem_name", activity_item)
        self.assertIn("status", activity_item)
        self.assertIn("language", activity_item)
        self.assertIn("runtime_ms", activity_item)
        self.assertIn("submitted_at", activity_item)


if __name__ == "__main__":
    unittest.main()
