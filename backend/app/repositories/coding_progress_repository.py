from sqlalchemy.orm import Session

from app.models.coding_progress import CodingProgress

from app.repositories.base_repository import BaseRepository


class CodingProgressRepository(
    BaseRepository[CodingProgress]
):

    def __init__(self):
        super().__init__(CodingProgress)

    def get_by_user_id(
        self,
        db: Session,
        user_id: int,
    ) -> CodingProgress | None:

        return (
            db.query(CodingProgress)
            .filter(
                CodingProgress.user_id == user_id
            )
            .first()
        )

    def create_progress(
        self,
        db: Session,
        user_id: int,
    ) -> CodingProgress:

        progress = CodingProgress(
            user_id=user_id,
        )

        db.add(progress)

        return progress

    def update_progress(
        self,
        db: Session,
        progress: CodingProgress,
        **kwargs,
    ) -> CodingProgress:

        for key, value in kwargs.items():
            setattr(progress, key, value)

        db.add(progress)

        return progress

    def increment_easy(
        self,
        progress: CodingProgress,
    ) -> None:

        progress.easy_solved += 1
        progress.total_solved += 1

    def increment_medium(
        self,
        progress: CodingProgress,
    ) -> None:

        progress.medium_solved += 1
        progress.total_solved += 1

    def increment_hard(
        self,
        progress: CodingProgress,
    ) -> None:

        progress.hard_solved += 1
        progress.total_solved += 1

    def increment_attempts(
        self,
        progress: CodingProgress,
    ) -> None:

        progress.total_attempted += 1

    def increment_submissions(
        self,
        progress: CodingProgress,
    ) -> None:

        progress.total_submissions += 1

    def increment_accepted(
        self,
        progress: CodingProgress,
    ) -> None:

        progress.accepted_submissions += 1

    def update_acceptance_rate(
        self,
        progress: CodingProgress,
    ) -> None:

        if progress.total_submissions == 0:
            progress.acceptance_rate = 0.0
            return

        progress.acceptance_rate = round(
            (
                progress.accepted_submissions
                / progress.total_submissions
            ) * 100,
            2,
        )


coding_progress_repository = CodingProgressRepository()