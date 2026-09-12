from typing import List
from pydantic import BaseModel, ConfigDict


class QuestionFeedbackItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    question_text: str
    topic: str
    difficulty: str
    overall_score: float
    summary: str
    feedback: str
    strengths: List[str]
    missing_concepts: List[str]


class CareerReadinessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    career_readiness_score: float
    resume_match_score: float
    average_interview_score: float
    strengths: List[str]
    weaknesses: List[str]
    missing_required_skills: List[str]
    missing_preferred_skills: List[str]
    priority_skills: List[str]
    interview_feedback: List[QuestionFeedbackItem]
