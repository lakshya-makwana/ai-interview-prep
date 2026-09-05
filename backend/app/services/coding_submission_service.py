from time import perf_counter

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User

from app.repositories.coding_question_repository import (
    coding_question_repository,
)
from app.repositories.coding_submission_repository import (
    coding_submission_repository,
)
from app.repositories.coding_test_case_repository import (
    coding_test_case_repository,
)

from app.schemas.code_execution import (
    CodeExecutionRequest,
    CodeSubmitRequest,
    CodeSubmitResponse,
)

from app.services.code_execution_service import execute_code


class CodingSubmissionService:

    def submit_solution(
        self,
        db: Session,
        request: CodeSubmitRequest,
        current_user: User,
    ) -> CodeSubmitResponse:

        question = coding_question_repository.get_by_id(
            db,
            request.question_id,
        )

        if question is None:
            raise HTTPException(
                status_code=404,
                detail="Question not found",
            )

        test_cases = (
            coding_test_case_repository.get_hidden_test_cases(
                db,
                request.question_id,
            )
        )

        if len(test_cases) == 0:
            raise HTTPException(
                status_code=400,
                detail="No hidden test cases found.",
            )

        passed = 0
        total = len(test_cases)
        runtime_ms = 0
        status = "Accepted"
        compiler_output = ""

        for test_case in test_cases:
            execution_request = CodeExecutionRequest(
                language=request.language,
                source_code=request.source_code,
                stdin=test_case.input_data,
            )

            start_time = perf_counter()
            result = execute_code(execution_request)
            elapsed_ms = int(
                (perf_counter() - start_time) * 1000
            )
            runtime_ms += elapsed_ms

            if result.stderr == "Execution timed out.":
                status = "Time Limit Exceeded"
                compiler_output = result.stderr
                break

            if result.exit_code != 0:
                status = "Runtime Error"
                compiler_output = result.stderr
                break

            if (
                result.stdout.strip()
                == test_case.expected_output.strip()
            ):
                passed += 1
            else:
                status = "Wrong Answer"

        score = int((passed / total) * 100)

        submission = coding_submission_repository.create_submission(
            db=db,
            user_id=current_user.id,
            question_id=request.question_id,
            language=request.language,
            source_code=request.source_code,
            status=status,
            runtime_ms=runtime_ms,
            memory_kb=0,
            passed_test_cases=passed,
            total_test_cases=total,
            score=score,
            compiler_output=compiler_output,
            is_submission=True,
        )

        db.commit()
        db.refresh(submission)

        return CodeSubmitResponse(
            status=status,
            passed=passed,
            total=total,
            score=score,
            runtime_ms=runtime_ms,
            stderr=compiler_output,
        )


coding_submission_service = CodingSubmissionService()
