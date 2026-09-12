from typing import List
from pydantic import BaseModel


class MatchSkill(BaseModel):
    skill: str
    requirement_type: str  # "Required" or "Preferred"
    candidate_evidence: str  # "Strong", "Partial", "Missing"
    weight: float
    contribution: float


class MatchReport(BaseModel):
    match_score: float
    matched_skills: List[str]
    missing_required_skills: List[str]
    missing_preferred_skills: List[str]
    comparison: List[MatchSkill]
    total_required_skills: int = 0
    total_preferred_skills: int = 0
    matched_required_count: int = 0
    matched_preferred_count: int = 0
