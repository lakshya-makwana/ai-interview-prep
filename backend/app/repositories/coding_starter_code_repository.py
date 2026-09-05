from sqlalchemy.orm import Session

from app.models.coding_starter_code import CodingStarterCode
from app.repositories.base_repository import BaseRepository


class CodingStarterCodeRepository(
    BaseRepository[CodingStarterCode]
):

    def __init__(self):
        super().__init__(CodingStarterCode)

    def get_by_question_and_language(
        self,
        db: Session,
        question_id: int,
        language: str,
    ):
        return (
            db.query(CodingStarterCode)
            .filter(
                CodingStarterCode.question_id == question_id,
                CodingStarterCode.language == language,
            )
            .first()
        )


coding_starter_code_repository = CodingStarterCodeRepository()