from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.coding_question import (
    CodingQuestionListResponse,
    CodingQuestionResponse,
)

from app.schemas.enums import (
    DifficultyLevel,
    QuestionCategory,
)

from app.services.coding_question_service import (
    coding_question_service,
)

router = APIRouter(
    prefix="/coding/questions",
    tags=["Coding Questions"],
)


@router.get(
    "/",
    response_model=CodingQuestionListResponse,
)
def get_questions(
    db: Session = Depends(get_db),
):

    return coding_question_service.get_all_questions(db)


@router.get(
    "/search",
    response_model=CodingQuestionListResponse,
)
def search_questions(
    keyword: str,
    db: Session = Depends(get_db),
):

    return coding_question_service.search_questions(
        db,
        keyword,
    )


@router.get(
    "/difficulty/{difficulty}",
    response_model=CodingQuestionListResponse,
)
def get_by_difficulty(
    difficulty: DifficultyLevel,
    db: Session = Depends(get_db),
):

    return coding_question_service.get_by_difficulty(
        db,
        difficulty,
    )


@router.get(
    "/category/{category}",
    response_model=CodingQuestionListResponse,
)
def get_by_category(
    category: QuestionCategory,
    db: Session = Depends(get_db),
):

    return coding_question_service.get_by_category(
        db,
        category,
    )


@router.get(
    "/slug/{slug}",
    response_model=CodingQuestionResponse,
)
def get_question_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):

    question = coding_question_service.get_question_by_slug(
        db,
        slug,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    return question


@router.get(
    "/{question_id}",
    response_model=CodingQuestionResponse,
)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
):

    question = coding_question_service.get_question_by_id(
        db,
        question_id,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    return question