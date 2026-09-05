from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.coding_question import CodingQuestion
from app.models.coding_question_tag import CodingQuestionTag
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
                CodingQuestion.is_premium.is_(False)
            )
            .order_by(
                CodingQuestion.id
            )
            .all()
        )
    
    def get_questions(
        self,
        db: Session,
        page: int = 1,
        limit: int = 20,
        search: str | None = None,
        difficulty: DifficultyLevel | None = None,
        category: QuestionCategory | None = None,
    ) -> tuple[list[CodingQuestion], int]:
            query = db.query(CodingQuestion)

            if search:
                query = query.filter(
                    or_(
                        CodingQuestion.title.ilike(f"%{search}%"),
                        CodingQuestion.description.ilike(f"%{search}%"),
                    )
                )

            if difficulty:
                query = query.filter(
                    CodingQuestion.difficulty == difficulty
                )

            if category:
                query = query.filter(
                    CodingQuestion.category == category
                )

            total = query.count()

            questions = (
                query.order_by(CodingQuestion.id)
                .offset((page - 1) * limit)
                .limit(limit)
                .all()
            )

            return questions, total

    def get_related_questions(
        self,
        db: Session,
        question: CodingQuestion,
        limit: int = 5,
    ) -> list[CodingQuestion]:

        tag_ids = [
            question_tag.tag_id
            for question_tag in question.tags
        ]

        query = (
            db.query(CodingQuestion)
            .outerjoin(CodingQuestionTag)
            .filter(CodingQuestion.id != question.id)
        )

        filters = [
            CodingQuestion.category == question.category,
            CodingQuestion.difficulty == question.difficulty,
        ]

        if tag_ids:
            filters.append(
                CodingQuestionTag.tag_id.in_(tag_ids)
            )

        return (
            query.filter(or_(*filters))
            .distinct()
            .order_by(CodingQuestion.id)
            .limit(limit)
            .all()
        )


coding_question_repository = CodingQuestionRepository()
