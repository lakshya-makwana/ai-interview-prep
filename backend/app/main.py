from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy registers them
import app.models.user
import app.models.resume
import app.models.resume_analysis
import app.models.coding_question
import app.models.coding_example
import app.models.coding_progress
import app.models.coding_submission
import app.models.coding_starter_code
import app.models.coding_test_case
import app.models.coding_tag
import app.models.coding_question_tag

# Create tables
Base.metadata.create_all(bind=engine)

# API Routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.resume import router as resume_router
from app.api.analysis import router as analysis_router

from app.routers.coding_question_router import (
    router as coding_question_router,
)
from app.routers.coding_progress_router import (
    router as coding_progress_router,
)
from app.routers.coding_statistics_router import (
    router as coding_statistics_router,
)
from app.routers.coding_submission_router import (
    router as coding_submission_router,
)
from app.routers.code_execution_router import (
    router as code_execution_router,
)

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

app.include_router(coding_question_router)
app.include_router(coding_progress_router)
app.include_router(coding_statistics_router)
app.include_router(coding_submission_router)

app.include_router(code_execution_router)

@app.get("/")
def root():
    return {
        "message": "Backend is running 🚀",
    }
