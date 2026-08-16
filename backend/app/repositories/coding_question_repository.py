from typing import Optional

from sqlalchemy.orm import Session

from app.models.coding_question import CodingQuestion
from app.models.enums import DifficultyLevel
from app.models.enums import QuestionCategory

from app.repositories.base_repository import BaseRepository


class CodingQuestionRepository(
    BaseRepository[CodingQuestion]
):

    def __init__(self):
        super().__init__(CodingQuestion)

    def get_by_slug(
        self,
        db: Session,
        slug: str,
    ) -> Optional[CodingQuestion]:

        return (
            db.query(CodingQuestion)
            .filter(CodingQuestion.slug == slug)
            .first()
        )

    def get_by_difficulty(
        self,
        db: Session,
        difficulty: DifficultyLevel,
    ) -> list[CodingQuestion]:

        return (
            db.query(CodingQuestion)
            .filter(
                CodingQuestion.difficulty == difficulty
            )
            .all()
        )

    def get_by_category(
        self,
        db: Session,
        category: QuestionCategory,
    ) -> list[CodingQuestion]:

        return (
            db.query(CodingQuestion)
            .filter(
                CodingQuestion.category == category
            )
            .all()
        )

    def search(
        self,
        db: Session,
        keyword: str,
    ) -> list[CodingQuestion]:

        return (
            db.query(CodingQuestion)
            .filter(
                CodingQuestion.title.ilike(
                    f"%{keyword}%"
                )
            )
            .all()
        )

    def published_questions(
        self,
        db: Session,
    ) -> list[CodingQuestion]:

        return (
            db.query(CodingQuestion)
            .filter(
                CodingQuestion.is_premium == False
            )
            .order_by(
                CodingQuestion.id
            )
            .all()
        )


coding_question_repository = CodingQuestionRepository()