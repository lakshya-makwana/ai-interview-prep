from sqlalchemy.orm import Session

from app.repositories.coding_question_repository import (
    coding_question_repository,
)

from app.schemas.coding_question import (
    CodingQuestionResponse,
    CodingQuestionListResponse,
)
from app.schemas.enums import DifficultyLevel
from app.schemas.enums import QuestionCategory


class CodingQuestionService:

    def get_all_questions(
        self,
        db: Session,
    ) -> CodingQuestionListResponse:

        questions = coding_question_repository.get_all(db)

        return CodingQuestionListResponse(
            questions=[
                CodingQuestionResponse.model_validate(question)
                for question in questions
            ],
            total=len(questions),
        )

    def get_question_by_id(
        self,
        db: Session,
        question_id: int,
    ) -> CodingQuestionResponse | None:

        question = coding_question_repository.get_by_id(
            db,
            question_id,
        )

        if question is None:
            return None

        return CodingQuestionResponse.model_validate(
            question
        )

    def get_question_by_slug(
        self,
        db: Session,
        slug: str,
    ) -> CodingQuestionResponse | None:

        question = (
            coding_question_repository.get_by_slug(
                db,
                slug,
            )
        )

        if question is None:
            return None

        return CodingQuestionResponse.model_validate(
            question
        )

    def search_questions(
        self,
        db: Session,
        keyword: str,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.search(
                db,
                keyword,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                CodingQuestionResponse.model_validate(question)
                for question in questions
            ],
            total=len(questions),
        )

    def get_by_difficulty(
        self,
        db: Session,
        difficulty: DifficultyLevel,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.get_by_difficulty(
                db,
                difficulty,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                CodingQuestionResponse.model_validate(question)
                for question in questions
            ],
            total=len(questions),
        )

    def get_by_category(
        self,
        db: Session,
        category: QuestionCategory,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.get_by_category(
                db,
                category,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                CodingQuestionResponse.model_validate(question)
                for question in questions
            ],
            total=len(questions),
        )

    def get_free_questions(
        self,
        db: Session,
    ) -> CodingQuestionListResponse:

        questions = (
            coding_question_repository.published_questions(
                db,
            )
        )

        return CodingQuestionListResponse(
            questions=[
                CodingQuestionResponse.model_validate(question)
                for question in questions
            ],
            total=len(questions),
        )


coding_question_service = CodingQuestionService()