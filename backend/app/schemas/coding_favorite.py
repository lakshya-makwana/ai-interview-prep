from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict

from app.schemas.coding_question import CodingQuestionResponse


class CodingFavoriteResponse(BaseModel):

    id: int

    question_id: int

    created_at: datetime

    question: CodingQuestionResponse

    model_config = ConfigDict(
        from_attributes=True,
    )


class CodingFavoriteListResponse(BaseModel):

    favorites: list[CodingFavoriteResponse]

    total: int
