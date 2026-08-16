from sqlalchemy.orm import Session

from app.repositories.coding_submission_repository import (
    coding_submission_repository,
)

from app.schemas.coding_progress import (
    CodingDashboardResponse,
)

from app.services.coding_progress_service import (
    coding_progress_service,
)


class CodingStatisticsService:

    def get_dashboard(
        self,
        db: Session,
        user_id: int,
    ) -> CodingDashboardResponse:

        progress = coding_progress_service.get_progress(
            db,
            user_id,
        )

        if progress is None:
            progress = coding_progress_service.create_progress(
                db,
                user_id,
            )

        return CodingDashboardResponse(
            progress=progress,
            recent_submissions=(
                coding_submission_repository.count_recent_submissions(
                    db,
                    user_id,
                )
            ),
            solved_today=(
                coding_submission_repository.count_solved_today(
                    db,
                    user_id,
                )
            ),
            solved_this_week=(
                coding_submission_repository.count_solved_this_week(
                    db,
                    user_id,
                )
            ),
            solved_this_month=(
                coding_submission_repository.count_solved_this_month(
                    db,
                    user_id,
                )
            ),
            acceptance_rate=progress.acceptance_rate,
        )


coding_statistics_service = CodingStatisticsService()