from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import relationship

from app.database.base import Base

class CodingQuestionTag(Base):

    __tablename__ = "coding_question_tags"

    question_id = Column(
        Integer,
        ForeignKey(
            "coding_questions.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    tag_id = Column(
        Integer,
        ForeignKey(
            "coding_tags.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    question = relationship(
        "CodingQuestion",
        back_populates="tags",
    )

    tag = relationship(
        "CodingTag",
        back_populates="questions",
    )