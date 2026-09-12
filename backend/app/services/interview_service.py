import random
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.data.question_bank import QUESTION_BANK
from app.models.interview import Interview, InterviewQuestion
from app.models.user import User
from app.repositories.job_repository import job_repository
from app.schemas.interview import (
    AnswerQuestionResponse,
    InterviewCurrentResponse,
    InterviewDetailResponse,
    InterviewQuestionResponse,
    StartInterviewResponse,
)


def start_interview(db: Session, current_user: User) -> StartInterviewResponse:
    # 1. Refinement: Check if an interview is already "In Progress" for this user
    existing_interview = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "In Progress",
        )
        .order_by(Interview.id.desc())
        .first()
    )

    if existing_interview:
        current_q = (
            db.query(InterviewQuestion)
            .filter(
                InterviewQuestion.interview_id == existing_interview.id,
                InterviewQuestion.display_order == existing_interview.current_question,
            )
            .first()
        )
        if current_q is None and existing_interview.questions:
            current_q = existing_interview.questions[0]

        return StartInterviewResponse(
            interview_id=existing_interview.id,
            status=existing_interview.status,
            total_questions=existing_interview.total_questions,
            current_question_number=existing_interview.current_question,
            current_question=InterviewQuestionResponse.model_validate(current_q),
        )

    # 2. Check if the user has an active analyzed job
    active_job = job_repository.get_by_user_id(db, current_user.id)
    job_id = active_job.id if active_job else None

    # 3. Randomly select 5 unique questions from the modular question bank
    sampled_questions = random.sample(QUESTION_BANK, 5)

    # 4. Create new Interview
    interview = Interview(
        user_id=current_user.id,
        job_id=job_id,
        interview_type="Technical",
        status="In Progress",
        total_questions=5,
        current_question=1,
    )
    db.add(interview)
    db.flush()

    # 5. Insert 5 InterviewQuestion rows with display_order 1 to 5
    created_questions = []
    for order, q_data in enumerate(sampled_questions, start=1):
        q = InterviewQuestion(
            interview_id=interview.id,
            question_id=q_data["question_id"],
            question_text=q_data["question_text"],
            topic=q_data["topic"],
            difficulty=q_data["difficulty"],
            display_order=order,
        )
        db.add(q)
        created_questions.append(q)

    db.commit()
    db.refresh(interview)

    first_question = created_questions[0]
    db.refresh(first_question)

    return StartInterviewResponse(
        interview_id=interview.id,
        status=interview.status,
        total_questions=interview.total_questions,
        current_question_number=1,
        current_question=InterviewQuestionResponse.model_validate(first_question),
    )


def get_current_interview(db: Session, current_user: User) -> InterviewCurrentResponse:
    interview = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "In Progress",
        )
        .order_by(Interview.id.desc())
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No interview currently in progress.",
        )

    current_q = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id,
            InterviewQuestion.display_order == interview.current_question,
        )
        .first()
    )

    current_question_response = (
        InterviewQuestionResponse.model_validate(current_q) if current_q else None
    )

    return InterviewCurrentResponse(
        interview_id=interview.id,
        status=interview.status,
        total_questions=interview.total_questions,
        current_question_number=interview.current_question,
        current_question=current_question_response,
    )


def submit_answer(
    db: Session,
    current_user: User,
    interview_question_id: int,
    answer: str,
) -> AnswerQuestionResponse:
    question = (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.id == interview_question_id)
        .first()
    )

    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question not found.",
        )

    interview = question.interview
    if interview.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to answer this question.",
        )

    if interview.status != "In Progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This interview has already been completed.",
        )

    # Save candidate answer
    question.candidate_answer = answer.strip()
    question.answered_at = func.now()

    next_order = question.display_order + 1
    if next_order > interview.total_questions:
        # All questions answered - complete the interview
        interview.current_question = interview.total_questions
        interview.status = "Completed"
        interview.completed_at = func.now()
        is_completed = True
        next_question_response = None
    else:
        interview.current_question = next_order
        is_completed = False

        next_q = (
            db.query(InterviewQuestion)
            .filter(
                InterviewQuestion.interview_id == interview.id,
                InterviewQuestion.display_order == next_order,
            )
            .first()
        )
        next_question_response = (
            InterviewQuestionResponse.model_validate(next_q) if next_q else None
        )

    db.commit()
    db.refresh(interview)

    return AnswerQuestionResponse(
        interview_id=interview.id,
        status=interview.status,
        is_completed=is_completed,
        current_question_number=interview.current_question,
        total_questions=interview.total_questions,
        next_question=next_question_response,
    )


def get_interview_by_id(
    db: Session,
    current_user: User,
    interview_id: int,
) -> InterviewDetailResponse:
    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found.",
        )

    return InterviewDetailResponse.model_validate(interview)
