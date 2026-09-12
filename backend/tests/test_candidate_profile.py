import unittest
from fastapi.testclient import TestClient

from app.main import app
from app.database.database import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.candidate_profile import CandidateProfile
from app.core.security import create_access_token


class TestCandidateProfile(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        self.user = self.db.query(User).filter(User.email == "test_cand_user@example.com").first()
        if not self.user:
            self.user = User(
                name="Test Candidate User",
                email="test_cand_user@example.com",
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
                # Cascade deletes resume, analysis, candidate_profile
                user_to_delete = self.db.query(User).filter(User.id == self.user.id).first()
                if user_to_delete:
                    self.db.delete(user_to_delete)
                self.db.commit()
        except Exception:
            self.db.rollback()
        finally:
            self.db.close()

    def test_get_profile_no_resume(self):
        response = self.client.get("/candidate-profile", headers=self.headers)
        self.assertEqual(response.status_code, 404)

    def test_candidate_profile_flow(self):
        # 1. Create a dummy resume and analysis
        resume = Resume(
            filename="my_resume.pdf",
            stored_filename="my_resume_123.pdf",
            filepath="/tmp/my_resume_123.pdf",
            resume_text="Experienced Python and React developer",
            user_id=self.user.id,
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)

        analysis = ResumeAnalysis(
            resume_id=resume.id,
            ats_score=88,
            strengths="Python\nReact\nPostgreSQL",
            weaknesses="Docker",
            missing_keywords="Kubernetes",
            suggestions="Add metrics",
        )
        self.db.add(analysis)
        self.db.commit()

        # 2. GET /candidate-profile (initializes profile from analysis strengths)
        get_resp = self.client.get("/candidate-profile", headers=self.headers)
        self.assertEqual(get_resp.status_code, 200)
        data = get_resp.json()
        self.assertEqual(data["resume_id"], resume.id)
        self.assertIn("Python", data["extracted_skills"])
        self.assertIn("React", data["extracted_skills"])
        self.assertIn("PostgreSQL", data["extracted_skills"])
        self.assertFalse(data["skills_verified"])

        # 3. PUT /candidate-profile/skills (update verified skills)
        new_skills = ["Python", "FastAPI", "React", "PostgreSQL", "TailwindCSS"]
        put_resp = self.client.put(
            "/candidate-profile/skills",
            headers=self.headers,
            json={"verified_skills": new_skills},
        )
        self.assertEqual(put_resp.status_code, 200)
        put_data = put_resp.json()
        self.assertEqual(put_data["verified_skills"], new_skills)
        # Original extracted skills must remain unchanged
        self.assertEqual(put_data["extracted_skills"], ["Python", "React", "PostgreSQL"])
        self.assertFalse(put_data["skills_verified"])

        # 4. POST /candidate-profile/confirm
        post_resp = self.client.post(
            "/candidate-profile/confirm",
            headers=self.headers,
            json={"confirm": True},
        )
        self.assertEqual(post_resp.status_code, 200)
        confirm_data = post_resp.json()
        self.assertTrue(confirm_data["skills_verified"])
        self.assertEqual(confirm_data["verified_skills"], new_skills)

        # 5. GET /candidate-profile again to verify persistence in DB
        verify_resp = self.client.get("/candidate-profile", headers=self.headers)
        self.assertEqual(verify_resp.status_code, 200)
        final_data = verify_resp.json()
        self.assertTrue(final_data["skills_verified"])
        self.assertEqual(final_data["verified_skills"], new_skills)


if __name__ == "__main__":
    unittest.main()
