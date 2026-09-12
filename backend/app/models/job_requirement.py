from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class JobRequirement(Base):
    __tablename__ = "job_requirements"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False,
        unique=True,
    )

    required_skills = Column(
        Text,
        nullable=True,
    )

    preferred_skills = Column(
        Text,
        nullable=True,
    )

    responsibilities = Column(
        Text,
        nullable=True,
    )

    qualifications = Column(
        Text,
        nullable=True,
    )

    experience_requirements = Column(
        Text,
        nullable=True,
    )

    technologies = Column(
        Text,
        nullable=True,
    )

    domain_knowledge = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    job = relationship(
        "Job",
        back_populates="requirement",
    )
