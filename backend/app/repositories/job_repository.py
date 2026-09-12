from typing import Optional
from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.job_requirement import JobRequirement
from app.repositories.base_repository import BaseRepository


class JobRepository(BaseRepository[Job]):

    def __init__(self):
        super().__init__(Job)

    def get_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> Optional[Job]:
        return (
            db.query(Job)
            .filter(Job.user_id == user_id)
            .order_by(Job.created_at.desc())
            .first()
        )

    def save_or_replace_job(
        self,
        db: Session,
        user_id: int,
        job_description: str,
        title: Optional[str] = None,
        company_name: Optional[str] = None,
    ) -> Job:
        job = self.get_by_user_id(db, user_id)
        if job is None:
            job = Job(
                user_id=user_id,
                job_description=job_description,
                title=title,
                company_name=company_name,
            )
            db.add(job)
        else:
            job.job_description = job_description
            job.title = title
            job.company_name = company_name

        db.flush()
        return job

    def delete_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> bool:
        job = self.get_by_user_id(db, user_id)
        if job is None:
            return False

        db.delete(job)
        db.commit()
        return True

    def create_or_update_requirement(
        self,
        db: Session,
        job_id: int,
        **requirement_data,
    ) -> JobRequirement:
        requirement = (
            db.query(JobRequirement)
            .filter(JobRequirement.job_id == job_id)
            .first()
        )

        if requirement is None:
            requirement = JobRequirement(
                job_id=job_id,
                **requirement_data,
            )
            db.add(requirement)
        else:
            for key, value in requirement_data.items():
                setattr(requirement, key, value)

        db.flush()
        return requirement


job_repository = JobRepository()
