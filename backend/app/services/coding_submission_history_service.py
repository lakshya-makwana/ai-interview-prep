from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User

from app.repositories.coding_submission_repository import (
    coding_submission_repository,
)

from app.schemas.coding_submission import (
    CodingSubmissionDetailResponse,
    CodingSubmissionListItemResponse,
    CodingSubmissionListResponse,
)


class CodingSubmissionHistoryService:

    def get_my_submissions(
        self,
        db: Session,
        current_user: User,
        question_id: int | None = None,
    ) -> CodingSubmissionListResponse:

        rows = (
            coding_submission_repository.get_user_submission_history(
                db,
                current_user.id,
                question_id,
            )
        )

        return CodingSubmissionListResponse(
            submissions=[
                CodingSubmissionListItemResponse(
                    id=submission.id,
                    question_id=submission.question_id,
                    question_title=question.title,
                    language=submission.language,
                    status=submission.status,
                    runtime_ms=submission.runtime_ms,
                    score=submission.score,
                    submitted_at=submission.submitted_at,
                )
                for submission, question in rows
            ],
        )

    def get_submission_detail(
        self,
        db: Session,
        current_user: User,
        submission_id: int,
    ) -> CodingSubmissionDetailResponse:

        row = (
            coding_submission_repository.get_user_submission_detail(
                db,
                current_user.id,
                submission_id,
            )
        )

        if row is None:
            raise HTTPException(
                status_code=404,
                detail="Submission not found",
            )

        submission, question = row

        return CodingSubmissionDetailResponse(
            id=submission.id,
            question_id=submission.question_id,
            question_title=question.title,
            question_slug=question.slug,
            question_difficulty=question.difficulty,
            question_category=question.category,
            language=submission.language,
            status=submission.status,
            source_code=submission.source_code,
            runtime_ms=submission.runtime_ms,
            memory_kb=submission.memory_kb,
            passed_test_cases=submission.passed_test_cases,
            total_test_cases=submission.total_test_cases,
            score=submission.score,
            compiler_output=submission.compiler_output,
            submitted_at=submission.submitted_at,
        )


coding_submission_history_service = CodingSubmissionHistoryService()
