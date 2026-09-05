from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User

from app.schemas.code_execution import (
    CodeExecutionRequest,
    CodeExecutionResponse,
    CodeSubmitRequest,
    CodeSubmitResponse,
)

from app.services.code_execution_service import execute_code
from app.services.coding_submission_service import (
    coding_submission_service,
)

router = APIRouter(
    prefix="/coding",
    tags=["Code Execution"],
)


@router.post(
    "/run",
    response_model=CodeExecutionResponse,
)
def run_code(
    request: CodeExecutionRequest,
):
    return execute_code(request)


@router.post(
    "/submit",
    response_model=CodeSubmitResponse,
)
def submit_code(
    request: CodeSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return coding_submission_service.submit_solution(
        db,
        request,
        current_user,
    )
