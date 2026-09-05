from datetime import date
from datetime import timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.coding_question import CodingQuestion
from app.models.coding_submission import CodingSubmission
from app.repositories.base_repository import BaseRepository


class CodingSubmissionRepository(
    BaseRepository[CodingSubmission]
):

    def __init__(self):
        super().__init__(CodingSubmission)

    def get_user_submissions(
        self,
        db: Session,
        user_id: int,
    ) -> list[CodingSubmission]:

        return (
            db.query(CodingSubmission)
            .filter(
                CodingSubmission.user_id == user_id,
            )
            .order_by(
                CodingSubmission.submitted_at.desc(),
            )
            .all()
        )

    def get_question_submissions(
        self,
        db: Session,
        user_id: int,
        question_id: int,
    ) -> list[CodingSubmission]:

        return (
            db.query(CodingSubmission)
            .filter(
                CodingSubmission.user_id == user_id,
                CodingSubmission.question_id == question_id,
            )
            .order_by(
                CodingSubmission.submitted_at.desc(),
            )
            .all()
        )

    def get_user_submission_history(
        self,
        db: Session,
        user_id: int,
        question_id: int | None = None,
        limit: int | None = None,
    ):

        query = (
            db.query(
                CodingSubmission,
                CodingQuestion,
            )
            .join(
                CodingQuestion,
                CodingQuestion.id == CodingSubmission.question_id,
            )
            .filter(
                CodingSubmission.user_id == user_id,
            )
        )

        if question_id is not None:
            query = query.filter(
                CodingSubmission.question_id == question_id,
            )

        query = query.order_by(
            CodingSubmission.submitted_at.desc(),
        )

        if limit is not None:
            query = query.limit(limit)

        return query.all()

    def get_user_submission_detail(
        self,
        db: Session,
        user_id: int,
        submission_id: int,
    ):

        return (
            db.query(
                CodingSubmission,
                CodingQuestion,
            )
            .join(
                CodingQuestion,
                CodingQuestion.id == CodingSubmission.question_id,
            )
            .filter(
                CodingSubmission.id == submission_id,
                CodingSubmission.user_id == user_id,
            )
            .first()
        )

    def create_submission(
        self,
        db: Session,
        user_id: int,
        question_id: int,
        language: str,
        source_code: str,
        status: str,
        runtime_ms: int,
        memory_kb: int,
        passed_test_cases: int,
        total_test_cases: int,
        score: int,
        compiler_output: str | None,
        is_submission: bool = True,
    ) -> CodingSubmission:

        submission = CodingSubmission(
            user_id=user_id,
            question_id=question_id,
            language=language,
            source_code=source_code,
            status=status,
            runtime_ms=runtime_ms,
            memory_kb=memory_kb,
            passed_test_cases=passed_test_cases,
            total_test_cases=total_test_cases,
            score=score,
            compiler_output=compiler_output,
            is_submission=is_submission,
        )

        db.add(submission)
        return submission

    def count_user_submissions(
        self,
        db: Session,
        user_id: int,
    ) -> int:

        return (
            db.query(
                func.count(CodingSubmission.id)
            )
            .filter(
                CodingSubmission.user_id == user_id,
            )
            .scalar()
            or 0
        )

    def count_user_accepted_submissions(
        self,
        db: Session,
        user_id: int,
    ) -> int:

        return (
            db.query(
                func.count(CodingSubmission.id)
            )
            .filter(
                CodingSubmission.user_id == user_id,
                CodingSubmission.status.in_(
                    ["Accepted", "accepted"]
                ),
            )
            .scalar()
            or 0
        )

    def get_user_solved_questions(
        self,
        db: Session,
        user_id: int,
    ) -> list[tuple[int, str]]:

        return (
            db.query(
                CodingSubmission.question_id,
                CodingQuestion.difficulty,
            )
            .join(
                CodingQuestion,
                CodingQuestion.id == CodingSubmission.question_id,
            )
            .filter(
                CodingSubmission.user_id == user_id,
                CodingSubmission.status.in_(
                    ["Accepted", "accepted"]
                ),
            )
            .group_by(
                CodingSubmission.question_id,
                CodingQuestion.difficulty,
            )
            .all()
        )

    def get_recent_submission_status(
        self,
        db: Session,
        user_id: int,
    ) -> str | None:

        submission = (
            db.query(CodingSubmission)
            .filter(
                CodingSubmission.user_id == user_id,
            )
            .order_by(
                CodingSubmission.submitted_at.desc(),
            )
            .first()
        )

        if submission is None:
            return None

        return submission.status

    def count_recent_submissions(
        self,
        db: Session,
        user_id: int,
    ) -> int:

        return (
            db.query(
                func.count(CodingSubmission.id)
            )
            .filter(
                CodingSubmission.user_id == user_id,
            )
            .scalar()
            or 0
        )

    def count_solved_today(
        self,
        db: Session,
        user_id: int,
    ) -> int:

        today = date.today()

        return (
            db.query(
                func.count(CodingSubmission.id)
            )
            .filter(
                CodingSubmission.user_id == user_id,
                CodingSubmission.score == 100,
                func.date(CodingSubmission.submitted_at) == today,
            )
            .scalar()
            or 0
        )

    def count_solved_this_week(
        self,
        db: Session,
        user_id: int,
    ) -> int:

        week_start = date.today() - timedelta(days=7)

        return (
            db.query(
                func.count(CodingSubmission.id)
            )
            .filter(
                CodingSubmission.user_id == user_id,
                CodingSubmission.score == 100,
                func.date(CodingSubmission.submitted_at) >= week_start,
            )
            .scalar()
            or 0
        )

    def count_solved_this_month(
        self,
        db: Session,
        user_id: int,
    ) -> int:

        month_start = date.today().replace(day=1)

        return (
            db.query(
                func.count(CodingSubmission.id)
            )
            .filter(
                CodingSubmission.user_id == user_id,
                CodingSubmission.score == 100,
                func.date(CodingSubmission.submitted_at) >= month_start,
            )
            .scalar()
            or 0
        )

    def get_favorite_language(
        self,
        db: Session,
        user_id: int,
    ) -> str | None:

        result = (
            db.query(
                CodingSubmission.language,
                func.count(CodingSubmission.id).label("count"),
            )
            .filter(
                CodingSubmission.user_id == user_id,
            )
            .group_by(
                CodingSubmission.language,
            )
            .order_by(
                func.count(CodingSubmission.id).desc(),
            )
            .first()
        )

        return result[0] if result else None


coding_submission_repository = CodingSubmissionRepository()
