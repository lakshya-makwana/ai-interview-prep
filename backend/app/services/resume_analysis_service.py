from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
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