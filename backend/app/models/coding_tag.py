from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.database.base import Base

class CodingTag(Base):

    __tablename__ = "coding_tags"

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
        "CodingQuestionTag",
        back_populates="tag",
        cascade="all, delete-orphan",
    )