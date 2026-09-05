from sqlalchemy.orm import Session

from app.repositories.coding_test_case_repository import (
    coding_test_case_repository,
)

from app.schemas.coding_test_case import (
    CodingSampleTestCaseListResponse,
    CodingSampleTestCaseResponse,
)


class CodingTestCaseService:

    def get_sample_test_cases(
        self,
        db: Session,
        question_id: int,
    ) -> CodingSampleTestCaseListResponse:

        test_cases = (
            coding_test_case_repository.get_sample_test_cases(
                db,
                question_id,
            )
        )

        return CodingSampleTestCaseListResponse(
            test_cases=[
                CodingSampleTestCaseResponse(
                    id=test_case.id,
                    input=test_case.input_data,
                    expected_output=test_case.expected_output,
                )
                for test_case in test_cases
            ],
        )


coding_test_case_service = CodingTestCaseService()
