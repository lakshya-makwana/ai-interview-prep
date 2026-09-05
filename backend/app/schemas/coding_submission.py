from datetime import datetime

from pydantic import BaseModel


class CodingSubmissionListItemResponse(BaseModel):

    id: int

    question_id: int

    question_title: str

    language: str

    status: str

    runtime_ms: int | None = None

    score: int

    submitted_at: datetime


class CodingSubmissionListResponse(BaseModel):

    submissions: list[CodingSubmissionListItemResponse]


class CodingSubmissionDetailResponse(BaseModel):

    id: int

    question_id: int

    question_title: str

    question_slug: str

    question_difficulty: str

    question_category: str

    language: str

    status: str

    source_code: str

    runtime_ms: int | None = None

    memory_kb: int | None = None

    passed_test_cases: int

    total_test_cases: int

    score: int

    compiler_output: str | None = None

    submitted_at: datetime
