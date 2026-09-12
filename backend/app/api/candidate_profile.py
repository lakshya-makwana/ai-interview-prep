from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.candidate_profile import (
    CandidateProfileResponse,
    ConfirmSkillsRequest,
    UpdateVerifiedSkillsRequest,
)
from app.services.candidate_profile_service import (
    confirm_verified_skills,
    get_or_create_candidate_profile,
    profile_to_response_dict,
    update_verified_skills,
)

router = APIRouter(
    prefix="/candidate-profile",
    tags=["Candidate Profile"],
)


@router.get(
    "",
    response_model=CandidateProfileResponse,
)
def get_my_candidate_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_or_create_candidate_profile(db, current_user)

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume found. Please upload a resume first.",
        )

    return profile_to_response_dict(profile)


@router.put(
    "/skills",
    response_model=CandidateProfileResponse,
)
def update_skills(
    request: UpdateVerifiedSkillsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = update_verified_skills(
        db=db,
        current_user=current_user,
        verified_skills=request.verified_skills,
    )

    return profile_to_response_dict(profile)


@router.post(
    "/confirm",
    response_model=CandidateProfileResponse,
)
def confirm_skills(
    request: ConfirmSkillsRequest = ConfirmSkillsRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = confirm_verified_skills(
        db=db,
        current_user=current_user,
    )

    return profile_to_response_dict(profile)
