from sqlalchemy.orm import Session

from app.models.user import User

from app.repositories.base_repository import BaseRepository


class UserRepository(
    BaseRepository[User]
):

    def __init__(self):
        super().__init__(User)

    def get_by_email(
        self,
        db: Session,
        email: str,
    ) -> User | None:

        return (
            db.query(User)
            .filter(
                User.email == email,
            )
            .first()
        )

    def email_exists(
        self,
        db: Session,
        email: str,
    ) -> bool:

        return (
            self.get_by_email(
                db,
                email,
            )
            is not None
        )


user_repository = UserRepository()