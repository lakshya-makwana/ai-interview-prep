from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ProfileUser(BaseModel):
    name: str
    email: EmailStr
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileResume(BaseModel):
    uploaded: bool
    filename: str | None = None
    ats_score: int | None = None


class ProfileRecentActivityItem(BaseModel):
    id: int
    problem_name: str
    question_title: str | None = None
    question_id: int | None = None
    status: str
    language: str
    runtime_ms: int | None = None
    submitted_at: datetime


class ProfileCodingStats(BaseModel):
    total_solved: int
    easy: int
    medium: int
    hard: int
    total_submissions: int
    acceptance_rate: float
    favorite_language: str
    recent_activity: list[ProfileRecentActivityItem]


class UserProfileResponse(BaseModel):
    user: ProfileUser
    resume: ProfileResume
    coding: ProfileCodingStats
