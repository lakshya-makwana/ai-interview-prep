import os
import shutil
import uuid

from fastapi import HTTPException
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.user import User

UPLOAD_FOLDER = "app/uploads/resumes"

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def save_resume(
    db: Session,
    file: UploadFile,
    current_user: User,
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be under 5 MB.",
        )

    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True,
    )

    extension = os.path.splitext(file.filename)[1]

    unique_filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    resume = Resume(
        filename=file.filename,
        filepath=file_path,
        user_id=current_user.id,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume