from sqlalchemy import Column
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy.orm import relationship

from app.database.base import Base
from app.models.enums import ProgrammingLanguage


class CodingStarterCode(Base):

    __tablename__ = "coding_starter_codes"

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

    language = Column(
        Enum(ProgrammingLanguage),
        nullable=False,
        index=True,
    )

    starter_code = Column(
        Text,
        nullable=False,
    )

    reference_solution = Column(
        Text,
        nullable=True,
    )

    question = relationship(
        "CodingQuestion",
        back_populates="starter_codes",
    )