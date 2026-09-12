from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class InterviewDataset(Base):
    __tablename__ = "interview_dataset"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    interview_id = Column(
        Integer,
        ForeignKey("interviews.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    interview_question_id = Column(
        Integer,
        ForeignKey("interview_questions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id", ondelete="SET NULL"),
        nullable=True,
    )

    topic = Column(
        String,
        nullable=False,
    )

    difficulty = Column(
        String,
        nullable=False,
    )

    question_text = Column(
        Text,
        nullable=False,
    )

    candidate_answer = Column(
        Text,
        nullable=False,
    )

    technical_correctness = Column(
        Float,
        nullable=False,
    )

    completeness = Column(
        Float,
        nullable=False,
    )

    relevance = Column(
        Float,
        nullable=False,
    )

    communication = Column(
        Float,
        nullable=False,
    )

    overall_score = Column(
        Float,
        nullable=False,
    )

    strengths = Column(
        JSON,
        nullable=False,
        default=list,
    )

    missing_concepts = Column(
        JSON,
        nullable=False,
        default=list,
    )

    feedback = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="dataset_records",
    )

    interview = relationship(
        "Interview",
    )

    question = relationship(
        "InterviewQuestion",
    )

    job = relationship(
        "Job",
    )
