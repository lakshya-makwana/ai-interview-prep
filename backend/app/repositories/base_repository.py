from typing import Any
from typing import Generic
from typing import Optional
from typing import Type
from typing import TypeVar

from sqlalchemy.orm import Session

from app.database.base import Base


ModelType = TypeVar(
    "ModelType",
    bound=Base,
)


class BaseRepository(Generic[ModelType]):

    def __init__(
        self,
        model: Type[ModelType],
    ):
        self.model = model

    def get_by_id(
        self,
        db: Session,
        object_id: int,
    ) -> Optional[ModelType]:

        return (
            db.query(self.model)
            .filter(self.model.id == object_id)
            .first()
        )

    def get_all(
        self,
        db: Session,
    ) -> list[ModelType]:

        return (
            db.query(self.model)
            .all()
        )

    def create(
        self,
        db: Session,
        **kwargs: Any,
    ) -> ModelType:

        obj = self.model(**kwargs)

        db.add(obj)

        return obj

    def update(
        self,
        db: Session,
        obj: ModelType,
        **kwargs: Any,
    ) -> ModelType:

        for key, value in kwargs.items():
            setattr(obj, key, value)

        db.add(obj)

        return obj

    def delete(
        self,
        db: Session,
        obj: ModelType,
    ) -> None:

        db.delete(obj)

    def flush(
        self,
        db: Session,
    ) -> None:

        db.flush()