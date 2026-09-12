from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class TopicDistribution(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    topic: str
    count: int
    percentage: float


class DifficultyDistribution(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    difficulty: str
    count: int
    percentage: float


class ScoreDistribution(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    average_score: float
    min_score: float
    max_score: float


class LabelQuality(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    complete_records: int
    missing_records: int
    completeness_percentage: float


class ReadinessCriterion(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    description: str
    passed: bool
    current_value: str
    target_value: str
    detail: Optional[str] = None


class MLReadinessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_dataset_records: int
    completed_interviews: int
    answered_questions: int
    average_score: float
    score_distribution: ScoreDistribution
    label_quality: LabelQuality
    topic_distribution: List[TopicDistribution]
    difficulty_distribution: List[DifficultyDistribution]
    criteria: List[ReadinessCriterion]
    is_ready: bool
    readiness_status: str
    summary: str
    recommendations: List[str]
