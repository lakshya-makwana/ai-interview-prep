from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.career_readiness import CareerReadinessResponse
from app.services.career_readiness_service import generate_career_readiness_report

router = APIRouter(prefix="/career-readiness", tags=["career-readiness"])


@router.get(
    "",
    response_model=CareerReadinessResponse,
    summary="Get comprehensive Career Readiness Report",
)
def get_career_readiness_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CareerReadinessResponse:
    return generate_career_readiness_report(db, current_user)
