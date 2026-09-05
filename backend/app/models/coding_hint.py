from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy.orm import relationship

from app.database.base import Base


class CodingHint(Base):

    __tablename__ = "coding_hints"

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

    display_order = Column(
        Integer,
        nullable=False,
        default=1,
    )

    hint_text = Column(
        Text,
        nullable=False,
    )

    question = relationship(
        "CodingQuestion",
        back_populates="hints",
    )
