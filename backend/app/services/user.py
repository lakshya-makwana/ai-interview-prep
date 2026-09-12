from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.user import User
from app.schemas.user import (
    ProfileResume,
    ProfileUser,
    UserProfileResponse,
)
from app.services.resume_analysis_service import (
    get_saved_analysis,
)


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

    return UserProfileResponse(
        user=user_info,
        resume=resume_info,
    )

