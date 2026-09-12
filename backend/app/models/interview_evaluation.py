from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class InterviewEvaluation(Base):
    __tablename__ = "interview_evaluations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    interview_question_id = Column(
        Integer,
        ForeignKey("interview_questions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
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

    summary = Column(
        Text,
        nullable=True,
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

    question = relationship(
        "InterviewQuestion",
        back_populates="evaluation",
    )
