from datetime import date
from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


class CodingProgressResponse(BaseModel):

    easy_solved: int = Field(
        ge=0,
    )

    medium_solved: int = Field(
        ge=0,
    )

    hard_solved: int = Field(
        ge=0,
    )

    total_solved: int = Field(
        ge=0,
    )

    total_attempted: int = Field(
        ge=0,
    )

    total_submissions: int = Field(
        ge=0,
    )

    accepted_submissions: int = Field(
        ge=0,
    )

    acceptance_rate: float = Field(
        ge=0,
        le=100,
    )

    current_streak: int = Field(
        ge=0,
    )

    longest_streak: int = Field(
        ge=0,
    )

    last_solved_date: date | None = None

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class CodingDashboardResponse(BaseModel):

    progress: CodingProgressResponse

    recent_submissions: int

    solved_today: int

    solved_this_week: int

    solved_this_month: int

    acceptance_rate: float = Field(
        ge=0,
        le=100,
    )