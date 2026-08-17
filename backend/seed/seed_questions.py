import json
from pathlib import Path

from app.database.database import SessionLocal

from app.models.coding_question import CodingQuestion
from app.models.coding_example import CodingExample


QUESTIONS_DIR = Path("generated_questions")


def import_questions():

    db = SessionLocal()

    question_files = sorted(
        QUESTIONS_DIR.rglob("question.json")
    )

    print(
        f"\nFound {len(question_files)} questions\n"
    )

    try:

        for index, path in enumerate(
            question_files,
            start=1,
        ):

            with open(
                path,
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

                print(
                    f"[{index}/{len(question_files)}] "
                    f"Skipping {data['title']}"
                )

                continue

            question = CodingQuestion(
                title=data["title"],
                slug=data["slug"],
                description=data["description"],
                constraints=json.dumps(data.get("constraints", [])),
                input_format=data.get("input_format"),
                output_format=data.get("output_format"),
                explanation=data.get("explanation"),
                difficulty=data["difficulty"],
                category=data["category"],
                estimated_time=data.get("estimated_time"),
                acceptance_rate=data.get("acceptance_rate", 0.0),
                is_premium=data.get("is_premium", False),
            )

            db.add(question)

            db.flush()

            for order, example in enumerate(
                data["examples"],
                start=1,
            ):

                coding_example = CodingExample(

                    question_id=question.id,

                    input_data=example["input"],

                    expected_output=example["output"],

                    explanation=example.get(
                        "explanation",
                    ),

                    display_order=order,
                )

                db.add(coding_example)

            db.commit()

            print(
                f"[{index}/{len(question_files)}] "
                f"Imported: {question.title}"
            )

        print(
            "\n✅ All questions imported successfully!"
        )

    except Exception as e:

        db.rollback()

        print(
            f"\n❌ Import failed:\n{e}"
        )

        raise

    finally:

        db.close()


if __name__ == "__main__":

    import_questions()