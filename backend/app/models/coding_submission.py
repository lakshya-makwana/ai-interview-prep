from sqlalchemy import Boolean, String
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import func
from sqlalchemy.orm import relationship

from app.database.base import Base

class CodingSubmission(Base):

    __tablename__ = "coding_submissions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    question_id = Column(
        Integer,
        ForeignKey(
            "coding_questions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    language = Column(
        String(20),
        nullable=False,
        index=True,
    )

    status = Column(
        String(30),
        nullable=False,
        index=True,
    )

    source_code = Column(
        Text,
        nullable=False,
    )


    runtime_ms = Column(
        Integer,
        nullable=True,
    )

    memory_kb = Column(
        Integer,
        nullable=True,
    )

    passed_test_cases = Column(
        Integer,
        default=0,
        nullable=False,
    )

    total_test_cases = Column(
        Integer,
        default=0,
        nullable=False,
    )

    score = Column(
        Integer,
        default=0,
        nullable=False,
    )

    compiler_output = Column(
        Text,
        nullable=True,
    )

    is_submission = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    submitted_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="coding_submissions",
    )

    question = relationship(
        "CodingQuestion",
        back_populates="submissions",
    )