from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field

from app.schemas.enums import ProgrammingLanguage
from app.schemas.enums import SubmissionStatus


class CodeExecutionRequest(BaseModel):

    question_id: int = Field(gt=0)

    language: ProgrammingLanguage

    source_code: str = Field(
        min_length=1,
    )


class CodeRunRequest(CodeExecutionRequest):
    pass


class CodeSubmitRequest(CodeExecutionRequest):
    pass


class CodingSubmissionResponse(BaseModel):

    id: int

    question_id: int

    language: ProgrammingLanguage

    source_code: str

    status: SubmissionStatus

    runtime_ms: int | None = None

    memory_kb: int | None = None

    passed_test_cases: int

    total_test_cases: int

    score: int = Field(
        ge=0,
        le=100,
    )

    compiler_output: str | None = None

    is_submission: bool

    submitted_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class SubmissionHistoryResponse(BaseModel):

    submissions: list[CodingSubmissionResponse]

    total: int


class CodeExecutionResponse(BaseModel):

    status: SubmissionStatus

    runtime_ms: int | None = None

    memory_kb: int | None = None

    passed_test_cases: int

    total_test_cases: int

    score: int = Field(
        ge=0,
        le=100,
    )

    compiler_output: str | None = None

    stdout: str | None = None

    stderr: str | None = None

    execution_time: float | None = None