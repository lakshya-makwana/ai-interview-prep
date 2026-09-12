import unittest
from fastapi.testclient import TestClient

from app.main import app
from app.database.database import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
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
        self.assertNotIn("coding", data)

        # Verify user section
        self.assertEqual(data["user"]["name"], self.user.name)
        self.assertEqual(data["user"]["email"], self.user.email)
        self.assertIn("joined_at", data["user"])

        # Verify resume section
        self.assertIn("uploaded", data["resume"])
        self.assertIn("filename", data["resume"])
        self.assertIn("ats_score", data["resume"])

    def test_profile_with_resume(self):
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

        response = self.client.get("/users/profile", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertTrue(data["resume"]["uploaded"])
        self.assertEqual(data["resume"]["filename"], "test_resume.pdf")
        self.assertEqual(data["resume"]["ats_score"], 85)


if __name__ == "__main__":
    unittest.main()

