from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class InterviewDatasetResponse(BaseModel):
    id: int
    user_id: int
    interview_id: int
    interview_question_id: int
    job_id: Optional[int] = None
    topic: str
    difficulty: str
    question_text: str
    candidate_answer: str
    technical_correctness: float
    completeness: float
    relevance: float
    communication: float
    overall_score: float
    strengths: List[str]
    missing_concepts: List[str]
    feedback: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DatasetStatisticsResponse(BaseModel):
    total_interviews: int
    total_answered_questions: int
    total_dataset_records: int
    average_overall_score: float
    topics_encountered: List[str]
    difficulty_distribution: Dict[str, int]

    model_config = ConfigDict(from_attributes=True)
