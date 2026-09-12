from datetime import datetime
from pydantic import BaseModel


class JobRequirementResponse(BaseModel):
    id: int
    job_id: int
    required_skills: str | None = None
    preferred_skills: str | None = None
    responsibilities: str | None = None
    qualifications: str | None = None
    experience_requirements: str | None = None
    technologies: str | None = None
    domain_knowledge: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }
