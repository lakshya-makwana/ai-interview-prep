import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.models.coding_question import CodingQuestion
from app.models.coding_example import CodingExample
from app.models.coding_starter_code import CodingStarterCode
from app.models.coding_test_case import CodingTestCase

from app.models.enums import (
    DifficultyLevel,
    ProgrammingLanguage,
    QuestionCategory,
)

BASE_DIR = Path(__file__).parent / "questions"

LANGUAGE_MAP = {
    "python": ProgrammingLanguage.PYTHON,
    "java": ProgrammingLanguage.JAVA,
    "c": ProgrammingLanguage.C,
    "cpp": ProgrammingLanguage.CPP,
}


def seed_question(
    db: Session,
    filepath: Path,
):

    with open(
        filepath,
        "r",
        encoding="utf-8",
    ) as file:
        data = json.load(file)

    existing = (
        db.query(CodingQuestion)
        .filter(
            CodingQuestion.slug == data["slug"]
        )
        .first()
    )

    if existing:
        return

    question = CodingQuestion(
        title=data["title"],
        slug=data["slug"],
        description=data["description"],
        constraints="\n".join(data["constraints"]),
        input_format=data["input_format"],
        output_format=data["output_format"],
        estimated_time=data["estimated_time"],
        acceptance_rate=data["acceptance_rate"],
        is_premium=data["is_premium"],
        difficulty=DifficultyLevel(data["difficulty"]),
        category=QuestionCategory(data["category"]),
    )

    db.add(question)

    db.flush()

    for index, example in enumerate(data["examples"], start=1):

        db.add(
            CodingExample(
                question_id=question.id,
                input_data=example["input"],
                expected_output=example["output"],
                explanation=example.get("explanation"),
                display_order=index,
            )
        )

    for language, starter_code in data["starter_code"].items():

        db.add(
            CodingStarterCode(
                question_id=question.id,
                language=LANGUAGE_MAP[language],
                starter_code=starter_code,
            )
        )

    for testcase in data["test_cases"]:

        db.add(
            CodingTestCase(
                question_id=question.id,
                input_data=testcase["input"],
                expected_output=testcase["output"],
                explanation=testcase.get("explanation"),
                is_sample=testcase["sample"],
                is_hidden=not testcase["sample"],
                points=10,
            )
        )

    db.commit()


def main():

    db = SessionLocal()

    try:

        for file in BASE_DIR.rglob("*.json"):

            seed_question(
                db,
                file,
            )

        print("Questions seeded successfully.")

    finally:

        db.close()


if __name__ == "__main__":
    main()