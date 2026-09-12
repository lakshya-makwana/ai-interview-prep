from typing import Dict, List, Optional, Set
from collections import Counter
from sqlalchemy.orm import Session

from app.models.interview_dataset import InterviewDataset
from app.models.user import User
from app.schemas.ml_readiness import (
    DifficultyDistribution,
    LabelQuality,
    MLReadinessResponse,
    ReadinessCriterion,
    ScoreDistribution,
    TopicDistribution,
)

# ---------------------------------------------------------------------------
# Threshold Constants (Deterministic Rules)
# ---------------------------------------------------------------------------
MINIMUM_DATASET_SIZE: int = 100
MINIMUM_EVALUATION_COMPLETENESS: float = 95.0  # Percentage
REQUIRED_DIFFICULTIES: List[str] = ["Easy", "Medium", "Hard"]
CORE_TOPICS: List[str] = ["OOP", "DBMS", "OS", "Computer Networks", "DSA", "Backend"]

# Canonical topic normalization for flexible classification
TOPIC_CANONICAL_MAP: Dict[str, str] = {
    "oop": "OOP",
    "object-oriented programming": "OOP",
    "dbms": "DBMS",
    "database": "DBMS",
    "database management systems": "DBMS",
    "os": "OS",
    "operating systems": "OS",
    "operating system": "OS",
    "computer networks": "Computer Networks",
    "networks": "Computer Networks",
    "networking": "Computer Networks",
    "dsa": "DSA",
    "dsa fundamentals": "DSA",
    "data structures": "DSA",
    "algorithms": "DSA",
    "data structures and algorithms": "DSA",
    "backend": "Backend",
    "backend engineering": "Backend",
}


def normalize_topic(topic: Optional[str]) -> str:
    """Normalize topic string to canonical presentation."""
    if not topic:
        return "General"
    cleaned = topic.strip().lower()
    return TOPIC_CANONICAL_MAP.get(cleaned, topic.strip())


def normalize_difficulty(difficulty: Optional[str]) -> str:
    """Normalize difficulty to title case."""
    if not difficulty:
        return "Unknown"
    cleaned = difficulty.strip().lower()
    if cleaned == "easy":
        return "Easy"
    if cleaned == "medium":
        return "Medium"
    if cleaned == "hard":
        return "Hard"
    return difficulty.strip().title()


def assess_ml_readiness(
    db: Session,
    current_user: Optional[User] = None,
) -> MLReadinessResponse:
    """Analyze the InterviewDataset table and evaluate readiness for machine learning.
    
    Strictly read-only and deterministic calculation.
    If current_user is provided, filters for that user's dataset records.
    If current_user is None, analyzes the global InterviewDataset table.
    """
    query = db.query(InterviewDataset)
    if current_user is not None:
        query = query.filter(InterviewDataset.user_id == current_user.id)

    records: List[InterviewDataset] = query.all()
    total_records = len(records)

    # 1. Dataset Size Metrics
    distinct_interviews = set(r.interview_id for r in records if r.interview_id is not None)
    completed_interviews = len(distinct_interviews)
    answered_questions = sum(1 for r in records if r.candidate_answer and r.candidate_answer.strip())

    # 2. Label Quality Assessment
    complete_count = 0
    missing_count = 0
    scores: List[float] = []

    for r in records:
        has_all_scores = (
            r.technical_correctness is not None
            and r.completeness is not None
            and r.relevance is not None
            and r.communication is not None
            and r.overall_score is not None
        )
        if has_all_scores:
            complete_count += 1
            scores.append(float(r.overall_score))
        else:
            missing_count += 1

    completeness_percentage = (
        round((complete_count / total_records) * 100.0, 1)
        if total_records > 0
        else 0.0
    )

    label_quality = LabelQuality(
        complete_records=complete_count,
        missing_records=missing_count,
        completeness_percentage=completeness_percentage,
    )

    # 3. Score Distribution
    if scores:
        avg_score = round(sum(scores) / len(scores), 2)
        min_score = round(min(scores), 2)
        max_score = round(max(scores), 2)
    else:
        avg_score = 0.0
        min_score = 0.0
        max_score = 0.0

    score_distribution = ScoreDistribution(
        average_score=avg_score,
        min_score=min_score,
        max_score=max_score,
    )

    # 4. Topic Distribution
    topic_counts: Counter = Counter()
    for r in records:
        topic_counts[normalize_topic(r.topic)] += 1

    topic_distribution: List[TopicDistribution] = []
    for topic, count in sorted(topic_counts.items(), key=lambda x: (-x[1], x[0])):
        pct = round((count / total_records) * 100.0, 1) if total_records > 0 else 0.0
        topic_distribution.append(
            TopicDistribution(
                topic=topic,
                count=count,
                percentage=pct,
            )
        )

    # 5. Difficulty Distribution
    diff_counts: Counter = Counter()
    for r in records:
        diff_counts[normalize_difficulty(r.difficulty)] += 1

    difficulty_distribution: List[DifficultyDistribution] = []
    for diff in REQUIRED_DIFFICULTIES:
        cnt = diff_counts.get(diff, 0)
        pct = round((cnt / total_records) * 100.0, 1) if total_records > 0 else 0.0
        difficulty_distribution.append(
            DifficultyDistribution(
                difficulty=diff,
                count=cnt,
                percentage=pct,
            )
        )
    # Include any non-standard difficulties if present
    for diff, cnt in diff_counts.items():
        if diff not in REQUIRED_DIFFICULTIES:
            pct = round((cnt / total_records) * 100.0, 1) if total_records > 0 else 0.0
            difficulty_distribution.append(
                DifficultyDistribution(
                    difficulty=diff,
                    count=cnt,
                    percentage=pct,
                )
            )

    # 6. Readiness Criteria Checks
    criteria: List[ReadinessCriterion] = []

    # Criterion A: Minimum Dataset Size
    size_passed = total_records >= MINIMUM_DATASET_SIZE
    size_detail = None
    if not size_passed:
        shortfall = MINIMUM_DATASET_SIZE - total_records
        size_detail = f"Shortfall of {shortfall} records needed to reach target"

    criteria.append(
        ReadinessCriterion(
            name="Minimum Dataset Size",
            description=f"Requires at least {MINIMUM_DATASET_SIZE} structured interview dataset records",
            passed=size_passed,
            current_value=f"{total_records} records",
            target_value=f">={MINIMUM_DATASET_SIZE} records",
            detail=size_detail,
        )
    )

    # Criterion B: Evaluation Completeness
    completeness_passed = total_records > 0 and completeness_percentage >= MINIMUM_EVALUATION_COMPLETENESS
    completeness_detail = None
    if not completeness_passed:
        if total_records == 0:
            completeness_detail = "No records collected to evaluate completeness"
        else:
            completeness_detail = f"Missing evaluation fields in {missing_count} record(s)"

    criteria.append(
        ReadinessCriterion(
            name="Evaluation Completeness",
            description=f"At least {MINIMUM_EVALUATION_COMPLETENESS}% of records must contain all dimension scores",
            passed=completeness_passed,
            current_value=f"{completeness_percentage}% complete",
            target_value=f">={MINIMUM_EVALUATION_COMPLETENESS}%",
            detail=completeness_detail,
        )
    )

    # Criterion C: Minimum Topic Coverage
    represented_topics: Set[str] = set(topic_counts.keys())
    missing_core_topics = [t for t in CORE_TOPICS if t not in represented_topics]
    topic_passed = total_records > 0 and len(missing_core_topics) == 0
    topic_detail = None
    if missing_core_topics:
        topic_detail = f"Missing core topics: {', '.join(missing_core_topics)}"

    criteria.append(
        ReadinessCriterion(
            name="Minimum Topic Coverage",
            description=f"All {len(CORE_TOPICS)} foundational topics must be represented in the dataset",
            passed=topic_passed,
            current_value=f"{len(CORE_TOPICS) - len(missing_core_topics)}/{len(CORE_TOPICS)} core topics represented",
            target_value=f"All {len(CORE_TOPICS)} core topics",
            detail=topic_detail,
        )
    )

    # Criterion D: Difficulty Coverage
    missing_difficulties = [d for d in REQUIRED_DIFFICULTIES if diff_counts.get(d, 0) == 0]
    difficulty_passed = total_records > 0 and len(missing_difficulties) == 0
    difficulty_detail = None
    if missing_difficulties:
        difficulty_detail = f"Missing difficulty levels: {', '.join(missing_difficulties)}"

    criteria.append(
        ReadinessCriterion(
            name="Difficulty Coverage",
            description="Easy, Medium, and Hard difficulty levels must all be represented",
            passed=difficulty_passed,
            current_value=f"{len(REQUIRED_DIFFICULTIES) - len(missing_difficulties)}/{len(REQUIRED_DIFFICULTIES)} levels present",
            target_value="Easy, Medium, Hard present",
            detail=difficulty_detail,
        )
    )

    # 7. Final Decision & Summary
    is_ready = all(c.passed for c in criteria)
    readiness_status = "Ready for ML" if is_ready else "Continue Collecting Data"

    reasons: List[str] = []
    recommendations: List[str] = []

    if is_ready:
        summary = (
            f"Dataset meets all quality and quantity thresholds with {total_records} records, "
            f"{completeness_percentage}% evaluation completeness, full core topic representation, "
            f"and balanced difficulty distribution. Ready to begin Phase 8 machine learning development."
        )
        recommendations.append("The dataset is ready for Phase 8 feature extraction and model development.")
    else:
        if total_records == 0:
            reasons.append("No dataset records have been collected yet.")
            recommendations.append("Complete initial technical interview sessions to begin gathering evaluation records.")
            summary = "Not Ready. No structured interview records exist in the dataset."
        else:
            if not size_passed:
                shortfall = MINIMUM_DATASET_SIZE - total_records
                reasons.append(f"Only {total_records} dataset records collected (Target: {MINIMUM_DATASET_SIZE}, Shortfall: {shortfall}).")
                recommendations.append(f"Complete more interview sessions to reach at least {MINIMUM_DATASET_SIZE} total dataset records.")

            if not completeness_passed:
                reasons.append(f"Evaluation completeness is {completeness_percentage}% (Target: >={MINIMUM_EVALUATION_COMPLETENESS}%).")
                recommendations.append("Ensure automated evaluation pipelines record all 4 dimension scores and overall score.")

            if missing_core_topics:
                reasons.append(f"Underrepresented or missing core topics: {', '.join(missing_core_topics)}.")
                recommendations.append(f"Generate and complete interviews covering: {', '.join(missing_core_topics)}.")

            if missing_difficulties:
                reasons.append(f"Missing question difficulties: {', '.join(missing_difficulties)}.")
                recommendations.append(f"Increase coverage for {', '.join(missing_difficulties)} difficulty questions.")

            summary = "Not Ready. Reasons: " + " ".join(reasons)

    return MLReadinessResponse(
        total_dataset_records=total_records,
        completed_interviews=completed_interviews,
        answered_questions=answered_questions,
        average_score=avg_score,
        score_distribution=score_distribution,
        label_quality=label_quality,
        topic_distribution=topic_distribution,
        difficulty_distribution=difficulty_distribution,
        criteria=criteria,
        is_ready=is_ready,
        readiness_status=readiness_status,
        summary=summary,
        recommendations=recommendations,
    )
