import unittest
from unittest.mock import patch
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


class TestCareerReadiness(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

        # Clean up existing test user
        existing_user = (
            self.db.query(User)
            .filter(User.email == "test_readiness_user@example.com")
            .first()
        )
        if existing_user:
            self.db.delete(existing_user)
            self.db.commit()

        self.user = User(
            name="Test Readiness User",
            email="test_readiness_user@example.com",
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

    def test_readiness_error_when_prerequisites_missing(self):
        # 1. No resume/job/interview
        res = self.client.get("/career-readiness", headers=self.headers)
        self.assertEqual(res.status_code, 404)

    def test_career_readiness_calculation_and_priority_skills(self):
        # Setup Resume and CandidateProfile
        resume = Resume(
            user_id=self.user.id,
            filename="resume.pdf",
            stored_filename="resume_123.pdf",
            filepath="/tmp/resume_123.pdf",
            resume_text="Experienced Python and React developer",
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)

        profile = CandidateProfile(
            resume_id=resume.id,
            skills="Python\nReact\nGit",
            verified_skills="Python\nReact\nGit",
            skills_verified=True,
        )
        self.db.add(profile)

        # Setup Job and JobRequirement
        # Required: Python (matched, weight 2.0), Docker (missing, weight 2.0), PostgreSQL (missing, weight 2.0)
        # Preferred: React (matched, weight 1.0), AWS (missing, weight 1.0)
        # Total weight = 2*3 + 1*2 = 8.0
        # Matched weight = 2.0*1.0 (Python) + 1.0*1.0 (React) = 3.0
        # Expected Match Score = (3.0 / 8.0) * 100 = 37.5%
        job = Job(
            user_id=self.user.id,
            title="Backend Engineer",
            company_name="Tech Co",
            job_description="We need Python and Docker",
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        req = JobRequirement(
            job_id=job.id,
            required_skills="Python\nDocker\nPostgreSQL",
            preferred_skills="React\nAWS",
            responsibilities="Develop APIs",
            qualifications="CS Degree",
            experience_requirements="2+ years",
            technologies="Python, Docker",
            domain_knowledge="Distributed systems",
        )
        self.db.add(req)

        # Setup Completed Interview with 5 questions and evaluations
        # Scores: 8.0, 9.0, 7.0, 8.5, 9.5
        # Average = (8.0 + 9.0 + 7.0 + 8.5 + 9.5) / 5 = 42.0 / 5 = 8.4
        # Interview score out of 100 = 84.0%
        # Career Readiness Score = round(0.40 * 37.5 + 0.60 * 84.0, 1) = round(15.0 + 50.4, 1) = 65.4%
        interview = Interview(
            user_id=self.user.id,
            job_id=job.id,
            interview_type="Technical",
            status="Completed",
            total_questions=5,
            current_question=5,
        )
        self.db.add(interview)
        self.db.commit()
        self.db.refresh(interview)

        scores = [8.0, 9.0, 7.0, 8.5, 9.5]
        topics = ["OOP", "DBMS", "Operating Systems", "Computer Networks", "DSA"]

        for idx, (score, topic) in enumerate(zip(scores, topics), start=1):
            q = InterviewQuestion(
                interview_id=interview.id,
                question_id=f"Q_{idx}",
                question_text=f"Question text {idx}",
                topic=topic,
                difficulty="Medium",
                display_order=idx,
                candidate_answer=f"Candidate answer {idx}",
            )
            self.db.add(q)
            self.db.commit()
            self.db.refresh(q)

            evaluation = InterviewEvaluation(
                interview_question_id=q.id,
                technical_correctness=score,
                completeness=score,
                relevance=score,
                communication=score,
                overall_score=score,
                summary=f"Summary for {topic}",
                strengths=[f"Strong understanding of {topic}"],
                missing_concepts=[f"Omitted details in {topic}"],
                feedback=f"Feedback for {topic}",
            )
            self.db.add(evaluation)

        self.db.commit()

        # Fetch Career Readiness Report
        res = self.client.get("/career-readiness", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Check Scores
        self.assertEqual(data["resume_match_score"], 37.5)
        self.assertEqual(data["average_interview_score"], 8.4)
        self.assertEqual(data["career_readiness_score"], 65.4)

        # Check Missing Skills
        self.assertIn("Docker", data["missing_required_skills"])
        self.assertIn("PostgreSQL", data["missing_required_skills"])
        self.assertIn("AWS", data["missing_preferred_skills"])

        # Check Priority Skills Ordering:
        # 1. Missing required skills (Docker, PostgreSQL)
        # 2. Weak interview topics (Operating Systems score was 7.0 < 8.0)
        # 3. Missing preferred skills (AWS)
        priority = data["priority_skills"]
        self.assertEqual(priority[0], "Docker")
        self.assertEqual(priority[1], "PostgreSQL")
        self.assertEqual(priority[2], "Operating Systems")
        self.assertEqual(priority[3], "AWS")

        # Check Strengths and Weaknesses exist
        self.assertTrue(len(data["strengths"]) > 0)
        self.assertTrue(len(data["weaknesses"]) > 0)

        # Check Stored Feedback has 5 items
        self.assertEqual(len(data["interview_feedback"]), 5)
        self.assertEqual(data["interview_feedback"][0]["topic"], "OOP")
        self.assertEqual(data["interview_feedback"][0]["overall_score"], 8.0)
