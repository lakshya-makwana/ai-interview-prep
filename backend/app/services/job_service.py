from typing import Optional
from sqlalchemy.orm import Session

from app.models.job import Job
from app.repositories.job_repository import job_repository
from app.services.job_ai_service import extract_job_intelligence


def analyze_job_description(
    db: Session,
    user_id: int,
    job_description: str,
) -> Job:
    # 1. Save initial job description
    job = job_repository.save_or_replace_job(
        db=db,
        user_id=user_id,
        job_description=job_description,
    )
    db.commit()
    db.refresh(job)

    # 2. Extract structured intelligence with Gemini
    extracted = extract_job_intelligence(job_description)

    # 3. Update job with title and company name
    job.title = extracted.get("title") or None
    job.company_name = extracted.get("company_name") or None

    # 4. Save extracted requirements
    job_repository.create_or_update_requirement(
        db=db,
        job_id=job.id,
        required_skills=extracted.get("required_skills"),
        preferred_skills=extracted.get("preferred_skills"),
        responsibilities=extracted.get("responsibilities"),
        qualifications=extracted.get("qualifications"),
        experience_requirements=extracted.get("experience_requirements"),
        technologies=extracted.get("technologies"),
        domain_knowledge=extracted.get("domain_knowledge"),
    )

    db.commit()
    db.refresh(job)
    return job


def get_user_job(
    db: Session,
    user_id: int,
) -> Optional[Job]:
    return job_repository.get_by_user_id(db, user_id)


def delete_user_job(
    db: Session,
    user_id: int,
) -> bool:
    return job_repository.delete_by_user_id(db, user_id)
