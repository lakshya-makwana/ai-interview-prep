from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.progress import ProgressReport
from app.services.progress_service import generate_progress_report

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get(
    "",
    response_model=ProgressReport,
    summary="Get candidate longitudinal progress report",
)
def get_progress_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProgressReport:
    """Returns candidate progress report tracking longitudinal performance and topic trends."""
    return generate_progress_report(db, current_user)
