from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Interview(Base):
    __tablename__ = "interviews"

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

    job_id = Column(
        Integer,
        ForeignKey("jobs.id", ondelete="SET NULL"),
        nullable=True,
    )

    interview_type = Column(
        String,
        default="Technical",
        nullable=False,
    )

    status = Column(
        String,
        default="In Progress",
        nullable=False,
        index=True,
    )

    total_questions = Column(
        Integer,
        default=5,
        nullable=False,
    )

    current_question = Column(
        Integer,
        default=1,
        nullable=False,
    )

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    user = relationship(
        "User",
        backref="interviews",
    )

    job = relationship(
        "Job",
    )

    questions = relationship(
        "InterviewQuestion",
        back_populates="interview",
        cascade="all, delete-orphan",
        order_by="InterviewQuestion.display_order",
    )


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    interview_id = Column(
        Integer,
        ForeignKey("interviews.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    question_id = Column(
        String,
        nullable=False,
    )

    question_text = Column(
        Text,
        nullable=False,
    )

    topic = Column(
        String,
        nullable=False,
    )

    difficulty = Column(
        String,
        nullable=False,
    )

    display_order = Column(
        Integer,
        nullable=False,
    )

    candidate_answer = Column(
        Text,
        nullable=True,
    )

    answered_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    interview = relationship(
        "Interview",
        back_populates="questions",
    )
