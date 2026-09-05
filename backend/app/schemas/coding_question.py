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


class CodingTagResponse(BaseModel):

    id: int

    name: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class CodingCompanyResponse(BaseModel):

    id: int

    name: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class CodingHintResponse(BaseModel):

    id: int

    display_order: int

    hint_text: str

    model_config = ConfigDict(
        from_attributes=True,
    )


class RelatedCodingQuestionResponse(BaseModel):

    id: int

    title: str

    slug: str

    difficulty: DifficultyLevel

    model_config = ConfigDict(
        from_attributes=True,
    )


class CodingQuestionResponse(CodingQuestionBase):

    id: int

    created_at: datetime

    updated_at: datetime

    tags: list[CodingTagResponse] = Field(
        default_factory=list,
    )

    companies: list[CodingCompanyResponse] = Field(
        default_factory=list,
    )

    hints: list[CodingHintResponse] = Field(
        default_factory=list,
    )

    related_problems: list[RelatedCodingQuestionResponse] = Field(
        default_factory=list,
    )

    is_favorited: bool = False

    model_config = ConfigDict(
        from_attributes=True,
    )


class CodingQuestionListResponse(BaseModel):

    questions: list[CodingQuestionResponse]

    total: int
