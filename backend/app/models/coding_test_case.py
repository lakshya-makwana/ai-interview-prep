from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy.orm import relationship

from app.database.base import Base

class CodingTestCase(Base):

    __tablename__ = "coding_test_cases"

    id = Column(
        Integer,
        primary_key=True,
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

    input_data = Column(
        Text,
        nullable=False,
    )

    expected_output = Column(
        Text,
        nullable=False,
    )

    explanation = Column(
        Text,
        nullable=True,
    )

    is_sample = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_hidden = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    points = Column(
        Integer,
        default=1,
        nullable=False,
    )

    question = relationship(
        "CodingQuestion",
        back_populates="test_cases",
    )