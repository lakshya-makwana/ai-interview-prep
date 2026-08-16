from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base

class CodingProgress(Base):

    __tablename__ = "coding_progress"

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
        index=True,
    )

    easy_solved = Column(
        Integer,
        default=0,
        nullable=False,
    )

    medium_solved = Column(
        Integer,
        default=0,
        nullable=False,
    )

    hard_solved = Column(
        Integer,
        default=0,
        nullable=False,
    )

    total_solved = Column(
        Integer,
        default=0,
        nullable=False,
    )

    total_attempted = Column(
        Integer,
        default=0,
        nullable=False,
    )

    total_submissions = Column(
        Integer,
        default=0,
        nullable=False,
    )

    accepted_submissions = Column(
        Integer,
        default=0,
        nullable=False,
    )

    acceptance_rate = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    current_streak = Column(
        Integer,
        default=0,
        nullable=False,
    )

    longest_streak = Column(
        Integer,
        default=0,
        nullable=False,
    )

    last_solved_date = Column(
        Date,
        nullable=True,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship(
        "User",
        back_populates="coding_progress",
    )