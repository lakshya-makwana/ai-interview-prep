from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.ml_readiness import MLReadinessResponse
from app.services.ml_readiness_service import assess_ml_readiness

router = APIRouter(prefix="/ml-readiness", tags=["ml-readiness"])


@router.get(
    "",
    response_model=MLReadinessResponse,
    summary="Evaluate structured dataset quality and ML readiness criteria",
)
def get_ml_readiness_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MLReadinessResponse:
    """Assess whether sufficient structured data has been collected to begin machine learning."""
    return assess_ml_readiness(db, current_user=current_user)
