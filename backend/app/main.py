from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.users import router as users_router

from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy knows about them
from app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Interview Preparation API",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}