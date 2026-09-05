from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserProfileResponse, UserResponse
from app.services.user import get_user_profile

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/profile", response_model=UserProfileResponse)
def read_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_profile(
        db=db,
        current_user=current_user,
    )


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user