from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.interview_dataset import DatasetStatisticsResponse, InterviewDatasetResponse
from app.services.dataset_service import get_dataset_statistics, get_user_dataset

router = APIRouter(prefix="/dataset", tags=["dataset"])


@router.get(
    "",
    response_model=List[InterviewDatasetResponse],
    summary="Retrieve all interview dataset records for current user",
)
def get_dataset_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[InterviewDatasetResponse]:
    return get_user_dataset(db, current_user)


@router.get(
    "/statistics",
    response_model=DatasetStatisticsResponse,
    summary="Retrieve summary statistics for the collected interview dataset",
)
def get_dataset_statistics_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DatasetStatisticsResponse:
    return get_dataset_statistics(db, current_user)
