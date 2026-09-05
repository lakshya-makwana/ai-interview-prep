from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.coding_starter_code_service import (
    coding_starter_code_service,
)

router = APIRouter(
    prefix="/coding/starter-code",
    tags=["Starter Code"],
)


@router.get("/{question_id}/{language}")
def get_starter_code(
    question_id: int,
    language: str,
    db: Session = Depends(get_db),
):
    starter = coding_starter_code_service.get_starter_code(
        db,
        question_id,
        language,
    )

    if starter is None:
        raise HTTPException(
            status_code=404,
            detail="Starter code not found",
        )

    return starter