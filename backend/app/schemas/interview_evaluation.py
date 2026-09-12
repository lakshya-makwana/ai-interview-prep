from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class EvaluationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    interview_question_id: int
    technical_correctness: float
    completeness: float
    relevance: float
    communication: float
    overall_score: float
    summary: Optional[str] = None
    strengths: List[str]
    missing_concepts: List[str]
    feedback: str
    created_at: datetime


class QuestionWithEvaluationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question_id: str
    question_text: str
    topic: str
    difficulty: str
    display_order: int
    candidate_answer: Optional[str] = None
    answered_at: Optional[datetime] = None
    evaluation: Optional[EvaluationResponse] = None


class InterviewEvaluationReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    interview_id: int
    status: str
    total_questions: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    questions: List[QuestionWithEvaluationResponse]
