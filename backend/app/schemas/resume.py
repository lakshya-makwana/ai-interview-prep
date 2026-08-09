from pydantic import BaseModel
from datetime import datetime


class ResumeResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime

    model_config = {
        "from_attributes": True
    }