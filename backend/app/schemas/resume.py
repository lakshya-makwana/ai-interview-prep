from datetime import datetime

from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    has_analysis: bool = False

    model_config = {
        "from_attributes": True
    }