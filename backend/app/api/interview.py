from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.interview import (
    AnswerQuestionRequest,
    AnswerQuestionResponse,
    InterviewCurrentResponse,
    InterviewDetailResponse,
    StartInterviewResponse,
)
from app.services.interview_service import (
    get_current_interview,
    get_interview_by_id,
    start_interview,
    submit_answer,
)

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.post(
    "/start",
    response_model=StartInterviewResponse,
    summary="Start a new interview or resume active interview",
)
def start_interview_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StartInterviewResponse:
    return start_interview(db, current_user)


@router.get(
    "/current",
    response_model=InterviewCurrentResponse,
    summary="Get active in-progress interview and current question",
)
def get_current_interview_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InterviewCurrentResponse:
    return get_current_interview(db, current_user)


@router.post(
    "/answer",
    response_model=AnswerQuestionResponse,
    summary="Submit candidate answer and advance to next question",
)
def submit_answer_endpoint(
    payload: AnswerQuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnswerQuestionResponse:
    return submit_answer(
        db,
        current_user,
        payload.interview_question_id,
        payload.answer,
    )


@router.get(
    "/{id}",
    response_model=InterviewDetailResponse,
    summary="Retrieve completed interview details and answers",
)
def get_interview_by_id_endpoint(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InterviewDetailResponse:
    return get_interview_by_id(db, current_user, id)
