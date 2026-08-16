from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
)

from app.models.user import User
from app.repositories.user_repository import (
    user_repository,
)
from app.schemas.user import UserCreate


class AuthService:

    def get_user_by_email(
        self,
        db: Session,
        email: str,
    ) -> User | None:

        return user_repository.get_by_email(
            db,
            email,
        )

    def create_user(
        self,
        db: Session,
        user: UserCreate,
    ) -> User:

        db_user = User(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(
                user.password,
            ),
        )

        db.add(db_user)

        db.commit()

        db.refresh(db_user)

        return db_user

    def authenticate_user(
        self,
        db: Session,
        email: str,
        password: str,
    ) -> User | None:

        user = user_repository.get_by_email(
            db,
            email,
        )

        if user is None:
            return None

        if not verify_password(
            password,
            user.hashed_password,
        ):
            return None

        return user


auth_service = AuthService()