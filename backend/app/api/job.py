from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.job import JobAnalyzeRequest, JobResponse
from app.services.job_service import (
    analyze_job_description,
    delete_user_job,
    get_user_job,
)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.post(
    "/analyze",
    response_model=JobResponse,
    status_code=status.HTTP_200_OK,
)
def analyze_job(
    request: JobAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not request.job_description or not request.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description cannot be empty.",
        )

    job = analyze_job_description(
        db=db,
        user_id=current_user.id,
        job_description=request.job_description.strip(),
    )
    return job


@router.get(
    "/me",
    response_model=JobResponse,
)
def get_my_job(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = get_user_job(
        db=db,
        user_id=current_user.id,
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No job description found.",
        )

    return job


@router.delete(
    "/me",
    status_code=status.HTTP_200_OK,
)
def delete_my_job(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_user_job(
        db=db,
        user_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No job description found to delete.",
        )

    return {"message": "Job description deleted successfully"}
