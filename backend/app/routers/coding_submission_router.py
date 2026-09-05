from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User

from app.schemas.coding_submission import (
    CodingSubmissionDetailResponse,
    CodingSubmissionListResponse,
)

from app.services.coding_submission_history_service import (
    coding_submission_history_service,
)


router = APIRouter(
    prefix="/coding/submissions",
    tags=["Coding Submissions"],
)


@router.get(
    "/me",
    response_model=CodingSubmissionListResponse,
)
def get_my_submissions(
    question_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return coding_submission_history_service.get_my_submissions(
        db,
        current_user,
        question_id,
    )


@router.get(
    "/{submission_id}",
    response_model=CodingSubmissionDetailResponse,
)
def get_submission_detail(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return coding_submission_history_service.get_submission_detail(
        db,
        current_user,
        submission_id,
    )
