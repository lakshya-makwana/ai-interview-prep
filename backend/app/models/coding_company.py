from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.database.base import Base


class CodingCompany(Base):

    __tablename__ = "coding_companies"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    questions = relationship(
        "CodingQuestionCompany",
        back_populates="company",
        cascade="all, delete-orphan",
    )
