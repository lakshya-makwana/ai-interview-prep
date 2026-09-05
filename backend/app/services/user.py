from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.user import User
from app.repositories.coding_submission_repository import (
    coding_submission_repository,
)
from app.schemas.user import (
    ProfileCodingStats,
    ProfileRecentActivityItem,
    ProfileResume,
    ProfileUser,
    UserProfileResponse,
)
from app.services.coding_progress_service import (
    coding_progress_service,
)
from app.services.resume_analysis_service import (
    get_saved_analysis,
)


def _format_language(lang: str | None) -> str:
    if not lang:
        return "N/A"

    mapping = {
        "python": "Python",
        "java": "Java",
        "cpp": "C++",
        "c": "C",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
    }
    return mapping.get(lang.lower(), lang.capitalize())


def get_user_profile(
    db: Session,
    current_user: User,
) -> UserProfileResponse:
    # ---------------- 1. User Information ---------------- #
    joined_at = current_user.created_at or datetime.now(timezone.utc)
    user_info = ProfileUser(
        name=current_user.name,
        email=current_user.email,
        joined_at=joined_at,
    )

    # ---------------- 2. Resume Information ---------------- #
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if resume:
        analysis = get_saved_analysis(db, current_user)
        resume_info = ProfileResume(
            uploaded=True,
            filename=resume.filename,
            ats_score=analysis.ats_score if analysis else None,
        )
    else:
        resume_info = ProfileResume(
            uploaded=False,
            filename=None,
            ats_score=None,
        )

    # ---------------- 3. Coding Progress & Stats ---------------- #
    progress_summary = (
        coding_progress_service.get_user_progress_summary(
            db,
            current_user.id,
        )
    )

    fav_lang_raw = coding_submission_repository.get_favorite_language(
        db,
        current_user.id,
    )
    favorite_language = _format_language(fav_lang_raw)

    # ---------------- 4. Recent Activity (Latest 10) ---------------- #
    recent_rows = (
        coding_submission_repository.get_user_submission_history(
            db,
            current_user.id,
            limit=10,
        )
    )

    recent_activity = [
        ProfileRecentActivityItem(
            id=submission.id,
            problem_name=question.title,
            question_title=question.title,
            question_id=submission.question_id,
            status=submission.status,
            language=submission.language,
            runtime_ms=submission.runtime_ms,
            submitted_at=submission.submitted_at,
        )
        for submission, question in recent_rows
    ]

    coding_info = ProfileCodingStats(
        total_solved=progress_summary.total_solved,
        easy=progress_summary.easy_solved,
        medium=progress_summary.medium_solved,
        hard=progress_summary.hard_solved,
        total_submissions=progress_summary.total_submissions,
        acceptance_rate=progress_summary.acceptance_rate,
        favorite_language=favorite_language,
        recent_activity=recent_activity,
    )

    return UserProfileResponse(
        user=user_info,
        resume=resume_info,
        coding=coding_info,
    )
