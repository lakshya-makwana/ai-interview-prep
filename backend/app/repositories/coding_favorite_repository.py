from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.coding_favorite import CodingFavorite

from app.repositories.base_repository import BaseRepository


class CodingFavoriteRepository(
    BaseRepository[CodingFavorite]
):

    def __init__(self):
        super().__init__(CodingFavorite)

    def get_by_user_and_question(
        self,
        db: Session,
        user_id: int,
        question_id: int,
    ) -> CodingFavorite | None:

        return (
            db.query(CodingFavorite)
            .filter(
                CodingFavorite.user_id == user_id,
                CodingFavorite.question_id == question_id,
            )
            .first()
        )

    def get_user_favorites(
        self,
        db: Session,
        user_id: int,
    ) -> list[CodingFavorite]:

        return (
            db.query(CodingFavorite)
            .options(
                joinedload(CodingFavorite.question)
            )
            .filter(
                CodingFavorite.user_id == user_id
            )
            .order_by(
                CodingFavorite.created_at.desc()
            )
            .all()
        )


coding_favorite_repository = CodingFavoriteRepository()
