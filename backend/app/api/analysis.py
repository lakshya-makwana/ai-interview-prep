from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db

from app.models.resume import Resume
from app.models.user import User

from app.schemas.analysis import AnalysisResponse

from app.services.resume_analysis_service import (
    analyze_user_resume,
    get_saved_analysis,
)

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.post("/analyze")
def analyze_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Upload a resume first."
        )

    return analyze_user_resume(
        db,
        resume,
    )

@router.get(
    "/me",
    response_model=AnalysisResponse,
)
def get_my_analysis(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    analysis = get_saved_analysis(
        db,
        current_user,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="No analysis found.",
        )

    return analysis