import unittest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.database import SessionLocal
from app.main import app
from app.models.candidate_profile import CandidateProfile
from app.models.job import Job
from app.models.job_requirement import JobRequirement
from app.models.resume import Resume
from app.models.user import User
from app.services.matching_service import calculate_match_report


class TestMatchingEngine(unittest.TestCase):

    def test_calculate_match_report_exact_and_alias_and_missing(self):
        candidate_skills = ["Python", "JS", "Postgres"]
        required_skills = ["python", "JavaScript", "Docker"]
        preferred_skills = ["PostgreSQL", "Kubernetes"]

        report = calculate_match_report(
            verified_candidate_skills=candidate_skills,
            required_skills=required_skills,
            preferred_skills=preferred_skills,
        )

        # Total weight:
        # required: 3 * 2.0 = 6.0
        # preferred: 2 * 1.0 = 2.0
        # total_weight = 8.0
        # Evidence:
        # - python: Strong (1.0), weight 2.0 -> 2.0 * 1.0 = 2.0, contrib = 25.0%
        # - JavaScript: Partial (0.5 via 'js'), weight 2.0 -> 2.0 * 0.5 = 1.0, contrib = 12.5%
        # - Docker: Missing (0.0), weight 2.0 -> 0.0, contrib = 0.0%
        # - PostgreSQL: Partial (0.5 via 'postgres'), weight 1.0 -> 1.0 * 0.5 = 0.5, contrib = 6.25% -> 6.2 or 6.3%
        # - Kubernetes: Missing (0.0), weight 1.0 -> 0.0, contrib = 0.0%
        # Total weighted evidence: 2.0 + 1.0 + 0.0 + 0.5 + 0.0 = 3.5
        # Expected score: (3.5 / 8.0) * 100 = 43.75 -> 43.8%

        self.assertEqual(report.match_score, 43.8)
        self.assertEqual(report.total_required_skills, 3)
        self.assertEqual(report.total_preferred_skills, 2)
        self.assertEqual(report.matched_required_count, 2)  # python, JavaScript
        self.assertEqual(report.matched_preferred_count, 1)  # PostgreSQL
        self.assertIn("Docker", report.missing_required_skills)
        self.assertIn("Kubernetes", report.missing_preferred_skills)

        # Check comparisons
        comp_map = {item.skill: item for item in report.comparison}
        self.assertEqual(comp_map["python"].candidate_evidence, "Strong")
        self.assertEqual(comp_map["python"].weight, 2.0)
        self.assertEqual(comp_map["python"].contribution, 25.0)

        self.assertEqual(comp_map["JavaScript"].candidate_evidence, "Partial")
        self.assertEqual(comp_map["JavaScript"].weight, 2.0)
        self.assertEqual(comp_map["JavaScript"].contribution, 12.5)

        self.assertEqual(comp_map["Docker"].candidate_evidence, "Missing")
        self.assertEqual(comp_map["Docker"].contribution, 0.0)

        self.assertEqual(comp_map["PostgreSQL"].candidate_evidence, "Partial")
        self.assertEqual(comp_map["Kubernetes"].candidate_evidence, "Missing")

    def test_calculate_match_report_all_perfect(self):
        candidate_skills = ["Python", "React", "Docker"]
        required_skills = ["python", "react"]
        preferred_skills = ["docker"]

        report = calculate_match_report(
            verified_candidate_skills=candidate_skills,
            required_skills=required_skills,
            preferred_skills=preferred_skills,
        )

        # Total weight: 2*2.0 + 1*1.0 = 5.0
        # All strong: (5.0 / 5.0) * 100 = 100.0%
        self.assertEqual(report.match_score, 100.0)
        self.assertEqual(len(report.missing_required_skills), 0)
        self.assertEqual(len(report.missing_preferred_skills), 0)
        self.assertEqual(report.matched_required_count, 2)
        self.assertEqual(report.matched_preferred_count, 1)

    def test_calculate_match_report_all_missing(self):
        candidate_skills = ["Go", "Rust"]
        required_skills = ["Python", "FastAPI"]
        preferred_skills = ["React"]

        report = calculate_match_report(
            verified_candidate_skills=candidate_skills,
            required_skills=required_skills,
            preferred_skills=preferred_skills,
        )

        self.assertEqual(report.match_score, 0.0)
        self.assertEqual(len(report.matched_skills), 0)
        self.assertEqual(report.missing_required_skills, ["Python", "FastAPI"])
        self.assertEqual(report.missing_preferred_skills, ["React"])


class TestMatchingApi(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        self.user = self.db.query(User).filter(User.email == "test_match_user@example.com").first()
        if not self.user:
            self.user = User(
                name="Test Match User",
                email="test_match_user@example.com",
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
                # Delete user (cascades to resume, candidate profile, job, job requirement)
                user_to_delete = self.db.query(User).filter(User.id == self.user.id).first()
                if user_to_delete:
                    self.db.delete(user_to_delete)
                self.db.commit()
        except Exception:
            self.db.rollback()
        finally:
            self.db.close()

    def test_get_report_404_when_profile_missing(self):
        # User has no resume or candidate profile
        response = self.client.get("/matching/report", headers=self.headers)
        self.assertEqual(response.status_code, 404)
        self.assertIn("Candidate profile is missing", response.json()["detail"])

    def test_get_report_404_when_job_missing(self):
        # Create resume and candidate profile, but no job
        resume = Resume(
            filename="resume.pdf",
            stored_filename="stored_123.pdf",
            filepath="/tmp/stored_123.pdf",
            resume_text="Python React developer",
            user_id=self.user.id,
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)

        profile = CandidateProfile(
            resume_id=resume.id,
            skills="Python\nReact",
            verified_skills="Python\nReact",
            skills_verified=True,
        )
        self.db.add(profile)
        self.db.commit()

        response = self.client.get("/matching/report", headers=self.headers)
        self.assertEqual(response.status_code, 404)
        self.assertIn("Job description has not been analyzed", response.json()["detail"])

    def test_get_report_success(self):
        # 1. Create resume and candidate profile
        resume = Resume(
            filename="resume.pdf",
            stored_filename="stored_123.pdf",
            filepath="/tmp/stored_123.pdf",
            resume_text="Python React developer",
            user_id=self.user.id,
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)

        profile = CandidateProfile(
            resume_id=resume.id,
            skills="Python\nReact\nPostgreSQL",
            verified_skills="Python\nReact\nPostgreSQL",
            skills_verified=True,
        )
        self.db.add(profile)

        # 2. Create job and job requirement
        job = Job(
            user_id=self.user.id,
            job_description="Seeking a Python developer with React and Docker experience.",
            title="Full Stack Developer",
            company_name="Acme Inc",
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        requirement = JobRequirement(
            job_id=job.id,
            required_skills="Python\nReact",
            preferred_skills="Docker\nPostgreSQL",
        )
        self.db.add(requirement)
        self.db.commit()

        # 3. Request matching report
        response = self.client.get("/matching/report", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Required: Python (Strong), React (Strong) -> weight 2*2=4, ev 4
        # Preferred: Docker (Missing), PostgreSQL (Strong) -> weight 2*1=2, ev 1
        # Total weight = 6.0, total ev = 5.0
        # Score = (5.0 / 6.0) * 100 = 83.3%
        self.assertEqual(data["match_score"], 83.3)
        self.assertIn("Python", data["matched_skills"])
        self.assertIn("React", data["matched_skills"])
        self.assertIn("PostgreSQL", data["matched_skills"])
        self.assertIn("Docker", data["missing_preferred_skills"])
        self.assertEqual(len(data["missing_required_skills"]), 0)
        self.assertEqual(len(data["comparison"]), 4)
