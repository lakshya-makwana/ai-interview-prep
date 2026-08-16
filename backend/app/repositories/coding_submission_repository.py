from datetime import date
from datetime import timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

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


coding_submission_repository = CodingSubmissionRepository()