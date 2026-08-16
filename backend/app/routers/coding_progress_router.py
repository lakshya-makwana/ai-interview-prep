from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.coding_progress import (
    CodingProgressResponse,
)

from app.services.coding_progress_service import (
    coding_progress_service,
)


router = APIRouter(
    prefix="/coding/progress",
    tags=["Coding Progress"],
)


@router.get(
    "/{user_id}",
    response_model=CodingProgressResponse,
)
def get_progress(
    user_id: int,
    db: Session = Depends(get_db),
):

    progress = coding_progress_service.get_progress(
        db,
        user_id,
    )

    if progress is None:
        raise HTTPException(
            status_code=404,
            detail="Progress not found",
        )

    return progress


@router.post(
    "/{user_id}",
    response_model=CodingProgressResponse,
)
def create_progress(
    user_id: int,
    db: Session = Depends(get_db),
):

    progress = coding_progress_service.get_progress(
        db,
        user_id,
    )

    if progress is not None:
        return progress

    return coding_progress_service.create_progress(
        db,
        user_id,
    )