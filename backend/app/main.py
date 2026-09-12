from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy registers them
import app.models.user
import app.models.resume
import app.models.resume_analysis

# Create tables
Base.metadata.create_all(bind=engine)

# API Routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.resume import router as resume_router
from app.api.analysis import router as analysis_router

app = FastAPI(
    title="AI Interview Preparation API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(resume_router)
app.include_router(analysis_router)


@app.get("/")
def root():
    return {
        "message": "Backend is running 🚀",
    }
