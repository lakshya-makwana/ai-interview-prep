from pydantic import BaseModel
from datetime import datetime


class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    ats_score: int
    strengths: str
    weaknesses: str
    missing_keywords: str
    suggestions: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }