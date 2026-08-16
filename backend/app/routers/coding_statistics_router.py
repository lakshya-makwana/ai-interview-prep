from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.coding_progress import (
    CodingDashboardResponse,
)

from app.services.coding_statistics_service import (
    coding_statistics_service,
)


router = APIRouter(
    prefix="/coding/statistics",
    tags=["Coding Statistics"],
)


@router.get(
    "/{user_id}",
    response_model=CodingDashboardResponse,
)
def get_dashboard(
    user_id: int,
    db: Session = Depends(get_db),
):

    return coding_statistics_service.get_dashboard(
        db,
        user_id,
    )