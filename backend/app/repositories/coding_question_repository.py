from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import case, or_

from app.models.coding_question import CodingQuestion
from app.models.coding_question_tag import CodingQuestionTag
from app.models.coding_tag import CodingTag
from app.models.coding_favorite import CodingFavorite
from app.models.coding_submission import CodingSubmission
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

    def get_all_tags(
        self,
        db: Session,
    ) -> list[CodingTag]:

        return (
            db.query(CodingTag)
            .order_by(CodingTag.name.asc())
            .all()
        )

    def get_questions(
        self,
        db: Session,
        page: int = 1,
        limit: int = 20,
        search: str | None = None,
        difficulty: str | DifficultyLevel | None = None,
        category: str | QuestionCategory | None = None,
        tag: str | None = None,
        solved: bool | None = None,
        favorite: bool | None = None,
        user_id: int | None = None,
        sort_by: str | None = None,
        sort_order: str | None = None,
    ) -> tuple[list[CodingQuestion], int]:
        query = db.query(CodingQuestion)

        if search:
            query = query.filter(
                or_(
                    CodingQuestion.title.ilike(f"%{search}%"),
                    CodingQuestion.slug.ilike(f"%{search}%"),
                )
            )

        if difficulty:
            diff_val = difficulty.value if hasattr(difficulty, "value") else str(difficulty)
            query = query.filter(
                CodingQuestion.difficulty == diff_val
            )

        if category:
            cat_val = category.value if hasattr(category, "value") else str(category)
            query = query.filter(
                CodingQuestion.category == cat_val
            )

        if tag:
            query = (
                query.join(CodingQuestion.tags)
                .join(CodingQuestionTag.tag)
                .filter(
                    or_(
                        CodingTag.name.ilike(f"%{tag}%"),
                        CodingTag.id == int(tag) if str(tag).isdigit() else False,
                    )
                )
            )

        if solved is not None and user_id is not None:
            solved_subquery = (
                db.query(CodingSubmission.question_id)
                .filter(
                    CodingSubmission.user_id == user_id,
                    CodingSubmission.status.in_(["Accepted", "accepted"]),
                )
                .scalar_subquery()
            )
            if solved:
                query = query.filter(CodingQuestion.id.in_(solved_subquery))
            else:
                query = query.filter(CodingQuestion.id.notin_(solved_subquery))

        if favorite is not None and user_id is not None:
            fav_subquery = (
                db.query(CodingFavorite.question_id)
                .filter(CodingFavorite.user_id == user_id)
                .scalar_subquery()
            )
            if favorite:
                query = query.filter(CodingQuestion.id.in_(fav_subquery))
            else:
                query = query.filter(CodingQuestion.id.notin_(fav_subquery))

        total = query.distinct().count()

        is_desc = str(sort_order).lower() == "desc"

        if sort_by == "title":
            order_col = CodingQuestion.title.desc() if is_desc else CodingQuestion.title.asc()
        elif sort_by == "difficulty":
            diff_case = case(
                (CodingQuestion.difficulty == "easy", 1),
                (CodingQuestion.difficulty == "medium", 2),
                (CodingQuestion.difficulty == "hard", 3),
                else_=4,
            )
            order_col = diff_case.desc() if is_desc else diff_case.asc()
        elif sort_by == "acceptance_rate":
            order_col = CodingQuestion.acceptance_rate.desc() if is_desc else CodingQuestion.acceptance_rate.asc()
        elif sort_by == "estimated_time":
            order_col = CodingQuestion.estimated_time.desc() if is_desc else CodingQuestion.estimated_time.asc()
        elif sort_by == "newest" or sort_by == "created_at":
            order_col = CodingQuestion.created_at.desc() if is_desc else CodingQuestion.created_at.asc()
        else:
            order_col = CodingQuestion.id.desc() if is_desc else CodingQuestion.id.asc()

        questions = (
            query.distinct()
            .order_by(order_col)
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
