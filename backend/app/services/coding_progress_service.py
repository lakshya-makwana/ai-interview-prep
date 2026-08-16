from datetime import date

from sqlalchemy.orm import Session

from app.models.enums import DifficultyLevel
from app.repositories.coding_progress_repository import (
    coding_progress_repository,
)
from app.schemas.coding_progress import CodingProgressResponse


class CodingProgressService:

    def get_progress(
        self,
        db: Session,
        user_id: int,
    ) -> CodingProgressResponse | None:

        progress = coding_progress_repository.get_by_user_id(
            db,
            user_id,
        )

        if progress is None:
            return None

        return CodingProgressResponse.model_validate(
            progress
        )

    def create_progress(
        self,
        db: Session,
        user_id: int,
    ) -> CodingProgressResponse:

        progress = coding_progress_repository.create_progress(
            db,
            user_id,
        )

        db.commit()
        db.refresh(progress)

        return CodingProgressResponse.model_validate(
            progress
        )

    def update_after_accepted_submission(
        self,
        db: Session,
        user_id: int,
        difficulty: DifficultyLevel,
    ) -> CodingProgressResponse:

        progress = coding_progress_repository.get_by_user_id(
            db,
            user_id,
        )

        if progress is None:
            progress = coding_progress_repository.create_progress(
                db,
                user_id,
            )

        coding_progress_repository.increment_submissions(
            progress,
        )

        coding_progress_repository.increment_accepted(
            progress,
        )

        coding_progress_repository.increment_attempts(
            progress,
        )

        if difficulty == DifficultyLevel.EASY:
            coding_progress_repository.increment_easy(
                progress,
            )

        elif difficulty == DifficultyLevel.MEDIUM:
            coding_progress_repository.increment_medium(
                progress,
            )

        else:
            coding_progress_repository.increment_hard(
                progress,
            )

        progress.last_solved_date = date.today()

        progress.current_streak += 1

        progress.longest_streak = max(
            progress.longest_streak,
            progress.current_streak,
        )

        coding_progress_repository.update_acceptance_rate(
            progress,
        )

        db.commit()

        db.refresh(progress)

        return CodingProgressResponse.model_validate(
            progress
        )

    def update_after_failed_submission(
        self,
        db: Session,
        user_id: int,
    ) -> CodingProgressResponse:

        progress = coding_progress_repository.get_by_user_id(
            db,
            user_id,
        )

        if progress is None:
            progress = coding_progress_repository.create_progress(
                db,
                user_id,
            )

        coding_progress_repository.increment_submissions(
            progress,
        )

        coding_progress_repository.increment_attempts(
            progress,
        )

        coding_progress_repository.update_acceptance_rate(
            progress,
        )

        db.commit()

        db.refresh(progress)

        return CodingProgressResponse.model_validate(
            progress,
        )


coding_progress_service = CodingProgressService()