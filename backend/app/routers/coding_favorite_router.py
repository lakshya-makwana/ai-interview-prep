from fastapi import APIRouter
from fastapi import Depends
from fastapi import Response
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User

from app.schemas.coding_favorite import (
    CodingFavoriteListResponse,
    CodingFavoriteResponse,
)

from app.services.coding_favorite_service import (
    coding_favorite_service,
)


router = APIRouter(
    prefix="/coding/favorites",
    tags=["Coding Favorites"],
)


@router.post(
    "/{question_id}",
    response_model=CodingFavoriteResponse,
)
def add_favorite(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return coding_favorite_service.add_favorite(
        db,
        current_user,
        question_id,
    )


@router.delete(
    "/{question_id}",
    status_code=204,
)
def remove_favorite(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    coding_favorite_service.remove_favorite(
        db,
        current_user,
        question_id,
    )

    return Response(status_code=204)


@router.get(
    "",
    response_model=CodingFavoriteListResponse,
)
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return coding_favorite_service.get_favorites(
        db,
        current_user,
    )
