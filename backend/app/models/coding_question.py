from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import String
from sqlalchemy import func
from sqlalchemy.orm import relationship
from sqlalchemy import Boolean
from sqlalchemy import Float

from app.database.base import Base

class CodingQuestion(Base):

    __tablename__ = "coding_questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(200),
        nullable=False,
        unique=True,
    )

    slug = Column(
        String(200),
        nullable=False,
        unique=True,
        index=True,
    )

    description = Column(
        Text,
        nullable=False,
    )

    constraints = Column(
        Text,
        nullable=True,
    )

    input_format = Column(
        Text,
        nullable=True,
    )

    output_format = Column(
        Text,
        nullable=True,
    )

    explanation = Column(
        Text,
        nullable=True,
    )

    from sqlalchemy import Enum as SQLEnum

    difficulty = Column(
    String(20),
    nullable=False,
    index=True,
    )

    category = Column(
        String(50),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    test_cases = relationship(
        "CodingTestCase",
        back_populates="question",
        cascade="all, delete-orphan",
    )

    starter_codes = relationship(
        "CodingStarterCode",
        back_populates="question",
        cascade="all, delete-orphan",
    )

    tags = relationship(
    "CodingQuestionTag",
    back_populates="question",
    cascade="all, delete-orphan",
    )

    submissions = relationship(
        "CodingSubmission",
        back_populates="question",
    )

    examples = relationship(
    "CodingExample",
    back_populates="question",
    cascade="all, delete-orphan",
    order_by="CodingExample.display_order",
    )

    estimated_time = Column(
    Integer,
    nullable=True,
    )

    acceptance_rate = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    is_premium = Column(
        Boolean,
        default=False,
        nullable=False,
    )