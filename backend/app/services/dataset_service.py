from typing import Dict, List
from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.interview_dataset import InterviewDataset
from app.models.user import User
from app.schemas.interview_dataset import DatasetStatisticsResponse


def save_interview_dataset(db: Session, interview: Interview) -> List[InterviewDataset]:
    """Export completed interview questions and evaluations to the interview dataset.
    
    Creates one dataset record per evaluated question.
    Skips duplicate records if the question has already been exported.
    """
    saved_records: List[InterviewDataset] = []

    # Sort questions by display order
    questions = sorted(interview.questions, key=lambda q: q.display_order)

    for q in questions:
        # Only export questions that have an evaluation and candidate answer
        if not q.evaluation or not q.candidate_answer:
            continue

        # Check for existing export to guarantee idempotency
        existing_record = (
            db.query(InterviewDataset)
            .filter(InterviewDataset.interview_question_id == q.id)
            .first()
        )

        if existing_record:
            saved_records.append(existing_record)
            continue

        eval_rec = q.evaluation
        dataset_entry = InterviewDataset(
            user_id=interview.user_id,
            interview_id=interview.id,
            interview_question_id=q.id,
            job_id=interview.job_id,
            topic=q.topic,
            difficulty=q.difficulty,
            question_text=q.question_text,
            candidate_answer=q.candidate_answer,
            technical_correctness=eval_rec.technical_correctness,
            completeness=eval_rec.completeness,
            relevance=eval_rec.relevance,
            communication=eval_rec.communication,
            overall_score=eval_rec.overall_score,
            strengths=eval_rec.strengths if isinstance(eval_rec.strengths, list) else [],
            missing_concepts=eval_rec.missing_concepts if isinstance(eval_rec.missing_concepts, list) else [],
            feedback=eval_rec.feedback,
        )

        db.add(dataset_entry)
        saved_records.append(dataset_entry)

    db.commit()
    return saved_records


def get_user_dataset(db: Session, current_user: User) -> List[InterviewDataset]:
    """Retrieve all interview dataset records for the current user.
    
    Strictly read-only query.
    """
    return (
        db.query(InterviewDataset)
        .filter(InterviewDataset.user_id == current_user.id)
        .order_by(InterviewDataset.created_at.desc(), InterviewDataset.id.desc())
        .all()
    )


def get_dataset_statistics(db: Session, current_user: User) -> DatasetStatisticsResponse:
    """Calculate aggregate summary statistics from the user's interview dataset records."""
    records = (
        db.query(InterviewDataset)
        .filter(InterviewDataset.user_id == current_user.id)
        .all()
    )

    total_records = len(records)
    distinct_interviews = set(r.interview_id for r in records)
    total_interviews = len(distinct_interviews)
    total_answered_questions = total_records

    if total_records > 0:
        avg_score = round(sum(r.overall_score for r in records) / total_records, 1)
    else:
        avg_score = 0.0

    topics = sorted(list(set(r.topic for r in records if r.topic)))

    difficulty_counts: Dict[str, int] = {"Easy": 0, "Medium": 0, "Hard": 0}
    for r in records:
        diff = r.difficulty or "Medium"
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1

    return DatasetStatisticsResponse(
        total_interviews=total_interviews,
        total_answered_questions=total_answered_questions,
        total_dataset_records=total_records,
        average_overall_score=avg_score,
        topics_encountered=topics,
        difficulty_distribution=difficulty_counts,
    )
