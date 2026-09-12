from datetime import datetime
from pydantic import BaseModel

from app.schemas.job_requirement import JobRequirementResponse


class JobAnalyzeRequest(BaseModel):
    job_description: str


class JobResponse(BaseModel):
    id: int
    user_id: int
    title: str | None = None
    company_name: str | None = None
    job_description: str
    created_at: datetime
    requirement: JobRequirementResponse | None = None

    model_config = {
        "from_attributes": True,
    }
