from sqlalchemy.orm import Session

from app.repositories.coding_question_repository import (
    coding_question_repository,
)

from app.schemas.coding_question import (
    CodingQuestionResponse,
    CodingQuestionListResponse,
    CodingTagResponse,
    RelatedCodingQuestionResponse,
)
from app.schemas.enums import DifficultyLevel
from app.schemas.enums import QuestionCategory


class CodingQuestionService:

    def _is_favorited(
        self,
        question,
        user_id: int | None = None,
    ) -> bool:

        if user_id is None:
            return False

        return any(
            favorite.user_id == user_id
            for favorite in question.favorites
        )

    def _build_question_response(
        self,
        question,
        user_id: int | None = None,
        include_hints: bool = False,
        include_related: bool = False,
        db: Session | None = None,
    ) -> CodingQuestionResponse:

        tags = [
            question_tag.tag
            for question_tag in question.tags
            if question_tag.tag is not None
        ]

        companies = [
            question_company.company
            for question_company in question.companies
            if question_company.company is not None
        ]

        hints = []

        if include_hints:
            hints = question.hints

        related_problems = []

        if include_related and db is not None:
            related_questions = (
                coding_question_repository.get_related_questions(
                    db,
                    question,
                )
            )
            related_problems = [
                RelatedCodingQuestionResponse.model_validate(
                    related_question
                )
                for related_question in related_questions
            ]

        return CodingQuestionResponse(
            id=question.id,
            title=question.title,
            slug=question.slug,
            description=question.description,
            difficulty=question.difficulty,
            category=question.category,
            constraints=question.constraints,
            input_format=question.input_format,
            output_format=question.output_format,
            explanation=question.explanation,
            estimated_time=question.estimated_time,
            acceptance_rate=question.acceptance_rate,
            is_premium=question.is_premium,
            created_at=question.created_at,
            updated_at=question.updated_at,
            tags=tags,
            companies=companies,
            hints=hints,
            related_problems=related_problems,
            is_favorited=self._is_favorited(
                question,
                user_id,
            ),
        )

    def get_all_tags(
        self,
        db: Session,
    ) -> list[CodingTagResponse]:

        tags = coding_question_repository.get_all_tags(db)
        return [
            CodingTagResponse.model_validate(tag)
            for tag in tags
        ]

    def get_all_questions(
        self,
        db: Session,
        user_id: int | None = None,
    ) -> CodingQuestionListResponse:

        questions = coding_question_repository.get_all(db)

        return CodingQuestionListResponse(
            questions=[
                self._build_question_response(
                    question,
                    user_id,
                )
                for question in questions
            ],
            total=len(questions),
        )

    def get_question_by_id(
        self,
        db: Session,
        question_id: int,
        user_id: int | None = None,
    ) -> CodingQuestionResponse | None:

        question = coding_question_repository.get_by_id(
            db,
            question_id,
        )

        if question is None:
            return None

        return self._build_question_response(
            question,
            user_id,
            include_hints=True,
            include_related=True,
            db=db,
        )

    def get_question_by_slug(
        self,
        db: Session,
        slug: str,
        user_id: int | None = None,
    ) -> CodingQuestionResponse | None:

        question = (
            coding_question_repository.get_by_slug(
                db,
                slug,
            )
        )

        if question is None:
            return None

        return self._build_question_response(
            question,
            user_id,
            include_hints=True,
            include_related=True,
            db=db,
        )

    def search_questions(
        self,
        db: Session,
        keyword: str,
        user_id: int | None = None,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.search(
                db,
                keyword,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                self._build_question_response(
                    question,
                    user_id,
                )
                for question in questions
            ],
            total=len(questions),
        )

    def get_by_difficulty(
        self,
        db: Session,
        difficulty: DifficultyLevel,
        user_id: int | None = None,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.get_by_difficulty(
                db,
                difficulty,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                self._build_question_response(
                    question,
                    user_id,
                )
                for question in questions
            ],
            total=len(questions),
        )

    def get_by_category(
        self,
        db: Session,
        category: QuestionCategory,
        user_id: int | None = None,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.get_by_category(
                db,
                category,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                self._build_question_response(
                    question,
                    user_id,
                )
                for question in questions
            ],
            total=len(questions),
        )

    def get_free_questions(
        self,
        db: Session,
        user_id: int | None = None,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.published_questions(
                db,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                self._build_question_response(
                    question,
                    user_id,
                )
                for question in questions
            ],
            total=len(questions),
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
        sort_by: str | None = None,
        sort_order: str | None = None,
        user_id: int | None = None,
    ) -> CodingQuestionListResponse:

        questions, total = (
            coding_question_repository.get_questions(
                db=db,
                page=page,
                limit=limit,
                search=search,
                difficulty=difficulty,
                category=category,
                tag=tag,
                solved=solved,
                favorite=favorite,
                user_id=user_id,
                sort_by=sort_by,
                sort_order=sort_order,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                self._build_question_response(
                    question,
                    user_id,
                )
                for question in questions
            ],
            total=total,
        )


coding_question_service = CodingQuestionService()
