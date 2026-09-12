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


class UserProfileResponse(BaseModel):
    user: ProfileUser
    resume: ProfileResume

