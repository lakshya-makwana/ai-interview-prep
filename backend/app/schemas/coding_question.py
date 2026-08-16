from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field

from app.schemas.enums import DifficultyLevel
from app.schemas.enums import QuestionCategory


class CodingQuestionBase(BaseModel):

    title: str = Field(
        min_length=1,
        max_length=200,
    )

    slug: str = Field(
        min_length=1,
        max_length=200,
    )

    description: str

    difficulty: DifficultyLevel

    category: QuestionCategory

    constraints: str | None = None

    input_format: str | None = None

    output_format: str | None = None

    explanation: str | None = None

    estimated_time: int | None = Field(
        default=None,
        ge=1,
    )

    acceptance_rate: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    is_premium: bool = False


class CodingQuestionCreate(CodingQuestionBase):
    pass


class CodingQuestionUpdate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    slug: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    description: str | None = None

    difficulty: DifficultyLevel | None = None

    category: QuestionCategory | None = None

    constraints: str | None = None

    input_format: str | None = None

    output_format: str | None = None

    explanation: str | None = None

    estimated_time: int | None = Field(
        default=None,
        ge=1,
    )

    acceptance_rate: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    is_premium: bool | None = None


class CodingQuestionResponse(CodingQuestionBase):

    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class CodingQuestionListResponse(BaseModel):

    questions: list[CodingQuestionResponse]

    total: int