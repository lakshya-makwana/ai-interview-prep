from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import relationship

from app.database.base import Base


class CodingQuestionCompany(Base):

    __tablename__ = "coding_question_companies"

    question_id = Column(
        Integer,
        ForeignKey(
            "coding_questions.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    company_id = Column(
        Integer,
        ForeignKey(
            "coding_companies.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    question = relationship(
        "CodingQuestion",
        back_populates="companies",
    )

    company = relationship(
        "CodingCompany",
        back_populates="questions",
    )
