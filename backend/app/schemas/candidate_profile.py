from datetime import datetime
from pydantic import BaseModel


class CandidateProfileResponse(BaseModel):
    id: int
    resume_id: int
    extracted_skills: list[str] = []
    verified_skills: list[str] = []
    skills_verified: bool = False
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class UpdateVerifiedSkillsRequest(BaseModel):
    verified_skills: list[str]


class ConfirmSkillsRequest(BaseModel):
    confirm: bool = True
