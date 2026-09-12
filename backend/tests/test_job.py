import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.database.database import SessionLocal
from app.models.user import User
from app.models.job import Job
from app.models.job_requirement import JobRequirement
from app.core.security import create_access_token


class TestJobEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        self.user = self.db.query(User).filter(User.email == "test_job_user@example.com").first()
        if not self.user:
            self.user = User(
                name="Test Job User",
                email="test_job_user@example.com",
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
                # Delete any jobs associated with user
                self.db.query(Job).filter(Job.user_id == self.user.id).delete()
                user_to_delete = self.db.query(User).filter(User.id == self.user.id).first()
                if user_to_delete:
                    self.db.delete(user_to_delete)
                self.db.commit()
        except Exception:
            self.db.rollback()
        finally:
            self.db.close()

    def test_get_job_me_empty(self):
        response = self.client.get("/jobs/me", headers=self.headers)
        self.assertEqual(response.status_code, 404)

    @patch("app.services.job_service.extract_job_intelligence")
    def test_analyze_and_get_job(self, mock_extract):
        mock_extract.return_value = {
            "title": "Senior Software Engineer",
            "company_name": "Acme Tech",
            "required_skills": "Python\nFastAPI\nPostgreSQL",
            "preferred_skills": "Docker\nKubernetes",
            "responsibilities": "Design APIs\nLead team",
            "qualifications": "B.S. in Computer Science",
            "experience_requirements": "5+ years of software development",
            "technologies": "Git\nAWS\nLinux",
            "domain_knowledge": "Fintech\nCloud computing",
        }

        # 1. Analyze job
        response = self.client.post(
            "/jobs/analyze",
            headers=self.headers,
            json={"job_description": "We are hiring a Senior Software Engineer at Acme Tech..."},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["title"], "Senior Software Engineer")
        self.assertEqual(data["company_name"], "Acme Tech")
        self.assertIn("job_description", data)
        self.assertIsNotNone(data["requirement"])
        self.assertEqual(data["requirement"]["required_skills"], "Python\nFastAPI\nPostgreSQL")
        self.assertEqual(data["requirement"]["company_name" if "company_name" in data["requirement"] else "technologies"], "Git\nAWS\nLinux")

        # 2. Get active job
        get_resp = self.client.get("/jobs/me", headers=self.headers)
        self.assertEqual(get_resp.status_code, 200)
        get_data = get_resp.json()
        self.assertEqual(get_data["id"], data["id"])
        self.assertEqual(get_data["title"], "Senior Software Engineer")
        self.assertEqual(get_data["requirement"]["preferred_skills"], "Docker\nKubernetes")

        # 3. Delete job
        del_resp = self.client.delete("/jobs/me", headers=self.headers)
        self.assertEqual(del_resp.status_code, 200)

        # 4. Verify 404 after deletion
        get_resp_after = self.client.get("/jobs/me", headers=self.headers)
        self.assertEqual(get_resp_after.status_code, 404)


if __name__ == "__main__":
    unittest.main()
