from pydantic import BaseModel
from pydantic import Field


class CodeExecutionRequest(BaseModel):
    language: str
    source_code: str
    stdin: str = ""


class CodeExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int


class CodeSubmitRequest(BaseModel):
    question_id: int = Field(gt=0)
    language: str
    source_code: str = Field(min_length=1)


class CodeSubmitResponse(BaseModel):
    status: str
    passed: int
    total: int
    score: int
    runtime_ms: int
    stderr: str = ""
