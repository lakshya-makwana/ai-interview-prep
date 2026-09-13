from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class InterviewTrendItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    interview_id: int
    interview_number: int
    date: datetime
    average_score: float
    technical_score: float
    communication_score: float
    total_questions: int
    focus: Optional[str] = None


class TopicTrendItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    topic: str
    average_score: float
    evaluations_count: int
    first_score: float
    latest_score: float
    delta: float
    status: str  # "Improving", "Stable", "Declining"


class ProgressSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_interviews: int
    total_questions_answered: int
    average_score: float
    highest_score: float
    lowest_score: float
    latest_score: float
    improvement_percentage: float
    net_improvement: float
    consistency_rating: str  # "Highly Consistent", "Moderately Consistent", "Needs Consistency", "Pending Data"


class ProgressReport(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    summary: ProgressSummary
    interview_history: List[InterviewTrendItem]
    topic_trends: List[TopicTrendItem]
    strongest_topics: List[str]
    weakest_topics: List[str]
    insights: List[str]
    has_sufficient_data: bool
