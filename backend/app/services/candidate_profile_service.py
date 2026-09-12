from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.candidate_profile import CandidateProfile
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.user import User


def get_or_create_candidate_profile(
    db: Session,
    current_user: User,
) -> Optional[CandidateProfile]:
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if resume is None:
        return None

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.resume_id == resume.id)
        .first()
    )

    if profile is None:
        # Check if an analysis exists to initialize skills from strengths
        analysis = (
            db.query(ResumeAnalysis)
            .filter(ResumeAnalysis.resume_id == resume.id)
            .first()
        )

        initial_skills = analysis.strengths if analysis and analysis.strengths else ""

        profile = CandidateProfile(
            resume_id=resume.id,
            skills=initial_skills,
            verified_skills=None,
            skills_verified=False,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile


def update_verified_skills(
    db: Session,
    current_user: User,
    verified_skills: list[str],
) -> CandidateProfile:
    profile = get_or_create_candidate_profile(db, current_user)

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume or candidate profile found.",
        )

    # Store verified skills as newline-separated text
    cleaned_skills = [s.strip() for s in verified_skills if s and s.strip()]
    profile.verified_skills = "\n".join(cleaned_skills)

    db.commit()
    db.refresh(profile)
    return profile


def confirm_verified_skills(
    db: Session,
    current_user: User,
) -> CandidateProfile:
    profile = get_or_create_candidate_profile(db, current_user)

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume or candidate profile found.",
        )

    # If verified_skills hasn't been set yet, use extracted skills
    if not profile.verified_skills and profile.skills:
        profile.verified_skills = profile.skills

    profile.skills_verified = True

    db.commit()
    db.refresh(profile)
    return profile


def profile_to_response_dict(profile: CandidateProfile) -> dict:
    extracted_skills = [
        s.strip()
        for s in (profile.skills or "").split("\n")
        if s.strip()
    ]

    verified_skills = [
        s.strip()
        for s in (profile.verified_skills or "").split("\n")
        if s.strip()
    ]

    return {
        "id": profile.id,
        "resume_id": profile.resume_id,
        "extracted_skills": extracted_skills,
        "verified_skills": verified_skills,
        "skills_verified": profile.skills_verified,
        "created_at": profile.created_at,
    }
