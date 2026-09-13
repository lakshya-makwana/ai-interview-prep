from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy registers them
import app.models.user
import app.models.resume
import app.models.resume_analysis
import app.models.job
import app.models.job_requirement
import app.models.candidate_profile
import app.models.interview
import app.models.interview_evaluation

# Create tables
Base.metadata.create_all(bind=engine)

# API Routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.resume import router as resume_router
from app.api.analysis import router as analysis_router
from app.api.job import router as job_router
from app.api.candidate_profile import router as candidate_profile_router
from app.api.matching import router as matching_router
from app.api.interview import router as interview_router
from app.api.career_readiness import router as career_readiness_router
from app.api.dataset import router as dataset_router
from app.api.progress import router as progress_router

app = FastAPI(
    title="AI Interview Preparation API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
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
app.include_router(job_router)
app.include_router(candidate_profile_router)
app.include_router(matching_router)
app.include_router(interview_router)
app.include_router(career_readiness_router)
app.include_router(dataset_router)
app.include_router(progress_router)


@app.get("/")
def root():
    return {
        "message": "Backend is running 🚀",
    }
