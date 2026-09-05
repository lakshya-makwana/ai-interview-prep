from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User

from app.schemas.coding_question import (
    CodingQuestionListResponse,
    CodingQuestionResponse,
    CodingTagResponse,
)

from app.schemas.coding_test_case import (
    CodingSampleTestCaseListResponse,
)

from app.schemas.enums import (
    DifficultyLevel,
    QuestionCategory,
)

from app.services.coding_question_service import (
    coding_question_service,
)

from app.services.coding_test_case_service import (
    coding_test_case_service,
)

router = APIRouter(
    prefix="/coding/questions",
    tags=["Coding Questions"],
)


@router.get(
    "/tags",
    response_model=list[CodingTagResponse],
)
def get_all_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return coding_question_service.get_all_tags(db)


@router.get(
    "/search",
    response_model=CodingQuestionListResponse,
)
def search_questions(
    keyword: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return coding_question_service.search_questions(
        db,
        keyword,
        current_user.id,
    )


@router.get(
    "/",
    response_model=CodingQuestionListResponse,
)
def get_questions(
    page: int = 1,
    limit: int = 20,
    page_size: int | None = None,
    search: str | None = None,
    difficulty: str | None = None,
    category: str | None = None,
    tag: str | None = None,
    solved: bool | None = None,
    favorite: bool | None = None,
    sort_by: str | None = None,
    sort_order: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    effective_limit = page_size if page_size is not None else limit

    return coding_question_service.get_questions(
        db=db,
        page=page,
        limit=effective_limit,
        search=search,
        difficulty=difficulty,
        category=category,
        tag=tag,
        solved=solved,
        favorite=favorite,
        sort_by=sort_by,
        sort_order=sort_order,
        user_id=current_user.id,
    )


@router.get(
    "/category/{category}",
    response_model=CodingQuestionListResponse,
)
def get_by_category(
    category: QuestionCategory,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return coding_question_service.get_by_category(
        db,
        category,
        current_user.id,
    )


@router.get(
    "/slug/{slug}",
    response_model=CodingQuestionResponse,
)
def get_question_by_slug(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    question = coding_question_service.get_question_by_slug(
        db,
        slug,
        current_user.id,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    return question


@router.get(
    "/{question_id}/test-cases",
    response_model=CodingSampleTestCaseListResponse,
)
def get_sample_test_cases(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    question = coding_question_service.get_question_by_id(
        db,
        question_id,
        current_user.id,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    return coding_test_case_service.get_sample_test_cases(
        db,
        question_id,
    )


@router.get(
    "/{question_id}",
    response_model=CodingQuestionResponse,
)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    question = coding_question_service.get_question_by_id(
        db,
        question_id,
        current_user.id,
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found",
        )

    return question
