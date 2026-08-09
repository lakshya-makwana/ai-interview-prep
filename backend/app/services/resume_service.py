import os
import shutil
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.user import User
from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.text_cleaner import clean_resume_text

UPLOAD_FOLDER = "uploads/resumes"

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def save_resume(
    db: Session,
    file: UploadFile,
    current_user: User,
):
    # ---------- Validate File Type ----------
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    # ---------- Validate File Size ----------
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be under 5 MB.",
        )

    # ---------- One Resume Per User ----------
    existing_resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if existing_resume:

        if os.path.exists(existing_resume.filepath):
            os.remove(existing_resume.filepath)

        db.delete(existing_resume)
        db.commit()

    # ---------- Create Upload Folder ----------
    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True,
    )

    # ---------- Generate Unique Filename ----------
    extension = os.path.splitext(file.filename)[1]

    unique_filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename,
    )

    # ---------- Save PDF ----------
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # ---------- Extract & Clean Text ----------
    resume_text = extract_text_from_pdf(file_path)
    resume_text = clean_resume_text(resume_text)

    # ---------- Save Database Record ----------
    resume = Resume(
        filename=file.filename,
        stored_filename=unique_filename,
        filepath=file_path,
        resume_text=resume_text,
        user_id=current_user.id,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume