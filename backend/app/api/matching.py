from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.matching import MatchReport
from app.services.matching_service import generate_matching_report

router = APIRouter(prefix="/matching", tags=["matching"])


@router.get(
    "/report",
    response_model=MatchReport,
    summary="Get deterministic match report between candidate skills and job requirements",
)
def get_matching_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MatchReport:
    return generate_matching_report(db, current_user)
