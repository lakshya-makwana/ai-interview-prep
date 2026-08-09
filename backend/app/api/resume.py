import os

from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.services.resume_service import save_resume

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


# ---------------- Upload Resume ---------------- #

@router.post(
    "/upload",
    response_model=ResumeResponse,
    summary="Upload Resume",
)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return save_resume(
        db=db,
        file=file,
        current_user=current_user,
    )


# ---------------- Get My Resume ---------------- #

@router.get(
    "/me",
    response_model=ResumeResponse,
    summary="Get My Resume",
)
def get_my_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return ResumeResponse(
        id=resume.id,
        filename=resume.filename,
        uploaded_at=resume.uploaded_at,
        has_analysis=False,
    )


# ---------------- Delete Resume ---------------- #

@router.delete(
    "/{resume_id}",
    summary="Delete Resume",
)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    if os.path.exists(resume.filepath):
        os.remove(resume.filepath)

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }


# ---------------- Download Resume ---------------- #

@router.get(
    "/download/{resume_id}",
    summary="Download Resume",
)
def download_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return FileResponse(
        path=resume.filepath,
        filename=resume.filename,
        media_type="application/pdf",
    )