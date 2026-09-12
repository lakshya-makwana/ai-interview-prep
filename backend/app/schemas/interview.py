from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class InterviewQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question_id: str
    question_text: str
    topic: str
    difficulty: str
    display_order: int
    candidate_answer: Optional[str] = None
    answered_at: Optional[datetime] = None


class StartInterviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    interview_id: int
    status: str
    total_questions: int
    current_question_number: int
    current_question: InterviewQuestionResponse


class InterviewCurrentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    interview_id: int
    status: str
    total_questions: int
    current_question_number: int
    current_question: Optional[InterviewQuestionResponse] = None


class AnswerQuestionRequest(BaseModel):
    interview_question_id: int
    answer: str


class AnswerQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    interview_id: int
    status: str
    is_completed: bool
    current_question_number: int
    total_questions: int
    next_question: Optional[InterviewQuestionResponse] = None


class InterviewDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    job_id: Optional[int] = None
    interview_type: str
    status: str
    total_questions: int
    current_question: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    questions: List[InterviewQuestionResponse]
