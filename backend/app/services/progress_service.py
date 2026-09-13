"""
Progress Intelligence Service for Phase 8.
Aggregates historical interview sessions, measures longitudinal score improvement,
tracks topic-level trajectories, and computes deterministic performance insights.
"""

import math
from typing import Dict, List
from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.user import User
from app.schemas.progress import (
    InterviewTrendItem,
    ProgressReport,
    ProgressSummary,
    TopicTrendItem,
)


def generate_progress_report(db: Session, current_user: User) -> ProgressReport:
    """Generate longitudinal candidate progress report based on completed interview sessions."""
    # 1. Fetch completed interviews in chronological order
    interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "Completed",
        )
        .order_by(Interview.id.asc())
        .all()
    )

    # 2. Extract evaluated session data
    interview_history: List[InterviewTrendItem] = []
    topic_scores: Dict[str, List[float]] = {}
    total_evaluations_count = 0

    for idx, interview in enumerate(interviews, start=1):
        evaluations = [
            q.evaluation
            for q in interview.questions
            if q.evaluation and q.evaluation.overall_score is not None
        ]

        if not evaluations:
            continue

        session_avg = round(
            sum(e.overall_score for e in evaluations) / len(evaluations), 1
        )
        session_tech = round(
            sum(e.technical_correctness for e in evaluations) / len(evaluations), 1
        )
        session_comm = round(
            sum(e.communication for e in evaluations) / len(evaluations), 1
        )

        date_val = interview.completed_at or interview.started_at
        focus_title = (
            interview.job.title
            if interview.job and interview.job.title
            else "Technical Interview"
        )

        interview_history.append(
            InterviewTrendItem(
                interview_id=interview.id,
                interview_number=idx,
                date=date_val,
                average_score=session_avg,
                technical_score=session_tech,
                communication_score=session_comm,
                total_questions=len(evaluations),
                focus=focus_title,
            )
        )

        total_evaluations_count += len(evaluations)

        # Track topic trajectories
        for q in sorted(interview.questions, key=lambda x: x.display_order):
            if q.evaluation and q.evaluation.overall_score is not None and q.topic:
                topic_scores.setdefault(q.topic, []).append(q.evaluation.overall_score)

    total_valid_interviews = len(interview_history)

    # 3. Handle Empty and Single-Session states (< 2 interviews)
    if total_valid_interviews == 0:
        return ProgressReport(
            summary=ProgressSummary(
                total_interviews=0,
                total_questions_answered=0,
                average_score=0.0,
                highest_score=0.0,
                lowest_score=0.0,
                latest_score=0.0,
                improvement_percentage=0.0,
                net_improvement=0.0,
                consistency_rating="Pending Data",
            ),
            interview_history=[],
            topic_trends=[],
            strongest_topics=[],
            weakest_topics=[],
            insights=[
                "Complete at least two interview sessions to begin tracking performance trajectories over time."
            ],
            has_sufficient_data=False,
        )

    if total_valid_interviews == 1:
        single_item = interview_history[0]
        single_topics = [
            TopicTrendItem(
                topic=t,
                average_score=round(sum(scores) / len(scores), 1),
                evaluations_count=len(scores),
                first_score=scores[0],
                latest_score=scores[-1],
                delta=0.0,
                status="Stable",
            )
            for t, scores in topic_scores.items()
        ]
        single_topics.sort(key=lambda x: -x.average_score)

        return ProgressReport(
            summary=ProgressSummary(
                total_interviews=1,
                total_questions_answered=total_evaluations_count,
                average_score=single_item.average_score,
                highest_score=single_item.average_score,
                lowest_score=single_item.average_score,
                latest_score=single_item.average_score,
                improvement_percentage=0.0,
                net_improvement=0.0,
                consistency_rating="Pending Data",
            ),
            interview_history=interview_history,
            topic_trends=single_topics,
            strongest_topics=[t.topic for t in single_topics[:3]],
            weakest_topics=[t.topic for t in single_topics[-3:] if t.average_score < 7.5],
            insights=[
                f"Completed 1 interview session with an overall average of {single_item.average_score}/10.",
                "Complete at least one more interview to unlock longitudinal progress tracking and score trajectory insights.",
            ],
            has_sufficient_data=False,
        )

    # 4. Multi-Session Longitudinal Analytics (>= 2 interviews)
    session_scores = [item.average_score for item in interview_history]
    average_score = round(sum(session_scores) / len(session_scores), 1)
    highest_score = max(session_scores)
    lowest_score = min(session_scores)
    latest_score = session_scores[-1]
    first_score = session_scores[0]

    net_improvement = round(latest_score - first_score, 1)
    if first_score > 0:
        improvement_percentage = round(
            ((latest_score - first_score) / first_score) * 100, 1
        )
    else:
        improvement_percentage = 0.0

    # Score Variance and Consistency Rating
    variance = sum((s - average_score) ** 2 for s in session_scores) / len(
        session_scores
    )
    std_dev = math.sqrt(variance)

    if std_dev < 0.6:
        consistency_rating = "Highly Consistent"
    elif std_dev < 1.5:
        consistency_rating = "Moderately Consistent"
    else:
        consistency_rating = "Needs Consistency"

    # 5. Topic Trends Calculation
    topic_trends: List[TopicTrendItem] = []
    for topic, scores in topic_scores.items():
        topic_avg = round(sum(scores) / len(scores), 1)
        first_t_score = scores[0]
        latest_t_score = scores[-1]
        delta = round(latest_t_score - first_t_score, 1)

        if len(scores) == 1:
            status = "Stable"
        elif delta >= 0.5:
            status = "Improving"
        elif delta <= -0.5:
            status = "Declining"
        else:
            status = "Stable"

        topic_trends.append(
            TopicTrendItem(
                topic=topic,
                average_score=topic_avg,
                evaluations_count=len(scores),
                first_score=first_t_score,
                latest_score=latest_t_score,
                delta=delta,
                status=status,
            )
        )

    # Sort topic trends descending by average score
    topic_trends.sort(key=lambda x: (-x.average_score, -x.evaluations_count))

    # Strongest Topics (top scoring)
    strongest_topics = [t.topic for t in topic_trends if t.average_score >= 7.0][:3]
    if not strongest_topics and topic_trends:
        strongest_topics = [topic_trends[0].topic]

    # Weakest Topics (lowest scoring / declining)
    weakest_candidates = sorted(
        topic_trends, key=lambda x: (x.average_score, x.delta)
    )
    weakest_topics = [t.topic for t in weakest_candidates if t.average_score < 7.5][:3]
    if not weakest_topics and topic_trends:
        weakest_topics = [weakest_candidates[0].topic]

    # 6. Deterministic Insights Generation
    insights: List[str] = []

    # Overall improvement insight
    if improvement_percentage > 0:
        insights.append(
            f"Interview scores improved by {improvement_percentage:+.1f}% (+{net_improvement} pts) across {total_valid_interviews} completed interviews."
        )
    elif improvement_percentage < 0:
        insights.append(
            f"Average interview scores dipped by {abs(improvement_percentage):.1f}% ({net_improvement} pts) between initial and latest interviews."
        )
    else:
        insights.append(
            f"Interview scores have maintained a steady {average_score}/10 average across {total_valid_interviews} interviews."
        )

    # Topic-specific insights
    improving_topics = [t.topic for t in topic_trends if t.status == "Improving"]
    if improving_topics:
        best_improved = max(
            [t for t in topic_trends if t.status == "Improving"],
            key=lambda x: x.delta,
        )
        insights.append(
            f"{best_improved.topic} has shown notable improvement (+{best_improved.delta} pts from initial evaluation)."
        )

    if weakest_topics:
        worst_topic = next((t for t in topic_trends if t.topic == weakest_topics[0]), None)
        worst_score_text = f" (average {worst_topic.average_score}/10)" if worst_topic else ""
        insights.append(
            f"{weakest_topics[0]} remains an area requiring deeper preparation{worst_score_text}."
        )

    if strongest_topics:
        insights.append(
            f"Strongest technical mastery demonstrated in {', '.join(strongest_topics[:2])}."
        )

    # Consistency insight
    insights.append(
        f"Session score consistency is rated as {consistency_rating.lower()}."
    )

    return ProgressReport(
        summary=ProgressSummary(
            total_interviews=total_valid_interviews,
            total_questions_answered=total_evaluations_count,
            average_score=average_score,
            highest_score=highest_score,
            lowest_score=lowest_score,
            latest_score=latest_score,
            improvement_percentage=improvement_percentage,
            net_improvement=net_improvement,
            consistency_rating=consistency_rating,
        ),
        interview_history=interview_history,
        topic_trends=topic_trends,
        strongest_topics=strongest_topics,
        weakest_topics=weakest_topics,
        insights=insights,
        has_sufficient_data=True,
    )
