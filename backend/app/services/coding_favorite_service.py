from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User

from app.repositories.coding_favorite_repository import (
    coding_favorite_repository,
)
from app.repositories.coding_question_repository import (
    coding_question_repository,
)

from app.schemas.coding_favorite import (
    CodingFavoriteListResponse,
    CodingFavoriteResponse,
)

from app.services.coding_question_service import (
    coding_question_service,
)


class CodingFavoriteService:

    def add_favorite(
        self,
        db: Session,
        current_user: User,
        question_id: int,
    ) -> CodingFavoriteResponse:

        question = coding_question_repository.get_by_id(
            db,
            question_id,
        )

        if question is None:
            raise HTTPException(
                status_code=404,
                detail="Question not found",
            )

        favorite = (
            coding_favorite_repository.get_by_user_and_question(
                db,
                current_user.id,
                question_id,
            )
        )

        if favorite is None:
            favorite = coding_favorite_repository.create(
                db,
                user_id=current_user.id,
                question_id=question_id,
            )
            db.commit()
            db.refresh(favorite)

        favorite.question = question

        return self._build_favorite_response(
            favorite,
            current_user.id,
        )

    def remove_favorite(
        self,
        db: Session,
        current_user: User,
        question_id: int,
    ) -> None:

        favorite = (
            coding_favorite_repository.get_by_user_and_question(
                db,
                current_user.id,
                question_id,
            )
        )

        if favorite is None:
            raise HTTPException(
                status_code=404,
                detail="Favorite not found",
            )

        coding_favorite_repository.delete(
            db,
            favorite,
        )
        db.commit()

    def get_favorites(
        self,
        db: Session,
        current_user: User,
    ) -> CodingFavoriteListResponse:

        favorites = coding_favorite_repository.get_user_favorites(
            db,
            current_user.id,
        )

        return CodingFavoriteListResponse(
            favorites=[
                self._build_favorite_response(
                    favorite,
                    current_user.id,
                )
                for favorite in favorites
            ],
            total=len(favorites),
        )

    def _build_favorite_response(
        self,
        favorite,
        user_id: int,
    ) -> CodingFavoriteResponse:

        return CodingFavoriteResponse(
            id=favorite.id,
            question_id=favorite.question_id,
            created_at=favorite.created_at,
            question=(
                coding_question_service._build_question_response(
                    favorite.question,
                    user_id,
                )
            ),
        )


coding_favorite_service = CodingFavoriteService()
