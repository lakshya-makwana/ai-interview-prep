from sqlalchemy.orm import Session

from app.models.coding_test_case import CodingTestCase

from app.repositories.base_repository import BaseRepository


class CodingTestCaseRepository(
    BaseRepository[CodingTestCase]
):

    def __init__(self):
        super().__init__(CodingTestCase)

    def get_sample_test_cases(
        self,
        db: Session,
        question_id: int,
    ) -> list[CodingTestCase]:

        return (
            db.query(CodingTestCase)
            .filter(
                CodingTestCase.question_id == question_id,
                CodingTestCase.is_sample.is_(True),
            )
            .order_by(CodingTestCase.id)
            .all()
        )

    def get_hidden_test_cases(
        self,
        db: Session,
        question_id: int,
    ) -> list[CodingTestCase]:

        return (
            db.query(CodingTestCase)
            .filter(
                CodingTestCase.question_id == question_id,
                CodingTestCase.is_sample.is_(False),
            )
            .order_by(CodingTestCase.id)
            .all()
        )


coding_test_case_repository = CodingTestCaseRepository()
