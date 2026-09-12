from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.candidate_profile import CandidateProfile
from app.services.ai_service import analyze_resume


def analyze_user_resume(
    db: Session,
    resume: Resume,
):
    result = analyze_resume(resume.resume_text)

    analysis = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.resume_id == resume.id)
        .first()
    )

    if analysis is None:
        analysis = ResumeAnalysis(
            resume_id=resume.id,
        )
        db.add(analysis)

    analysis.ats_score = result["ats_score"]
    analysis.strengths = "\n".join(result["strengths"])
    analysis.weaknesses = "\n".join(result["weaknesses"])
    analysis.missing_keywords = "\n".join(result["missing_keywords"])
    analysis.suggestions = "\n".join(result["suggestions"])

    # Extract skills for CandidateProfile
    skills_list = result.get("skills") or result.get("strengths") or []
    extracted_skills = "\n".join(skills_list)

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.resume_id == resume.id)
        .first()
    )

    if profile is None:
        profile = CandidateProfile(
            resume_id=resume.id,
            skills=extracted_skills,
            verified_skills=None,
            skills_verified=False,
        )
        db.add(profile)
    else:
        profile.skills = extracted_skills

    db.commit()
    db.refresh(analysis)

    return analysis

from app.models.user import User

def get_saved_analysis(
    db: Session,
    current_user: User,
) -> ResumeAnalysis | None:
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if resume is None:
        return None

    return (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.resume_id == resume.id)
        .first()
    )