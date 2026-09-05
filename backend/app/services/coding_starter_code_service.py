from sqlalchemy.orm import Session

from app.repositories.coding_starter_code_repository import (
    coding_starter_code_repository,
)


class CodingStarterCodeService:

    def get_starter_code(
        self,
        db: Session,
        question_id: int,
        language: str,
    ):
        return coding_starter_code_repository.get_by_question_and_language(
            db,
            question_id,
            language,
        )


coding_starter_code_service = CodingStarterCodeService()