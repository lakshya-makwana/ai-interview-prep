import json
from pathlib import Path

from generator.schema import GeneratedQuestionContent
from generator.utils import (
    category_folder,
    difficulty_value,
    slugify,
)




class QuestionWriter:

    def __init__(
        self,
        output_dir: Path,
    ):
        self.output_dir = output_dir

    def write(
        self,
        metadata: dict,
        content: GeneratedQuestionContent,
    ):

        category = category_folder(
            metadata["pattern"],
        )

        slug = slugify(
            metadata["problem"],
        )

        question_dir = (
            self.output_dir
            / category
            / slug
        )

        question_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        ACCEPTANCE_RATE = {
            "easy": 78.0,
            "medium": 56.0,
            "hard": 34.0,
        }

        question = {
            "title": content.title,
            "slug": slug,
            "difficulty": difficulty_value(
                metadata["difficulty"]
            ),
            "category": category,
            "description": content.description,
            "constraints": content.constraints,
            "input_format": content.input_format,
            "output_format": content.output_format,
            "estimated_time": content.estimated_time,


            "acceptance_rate": ACCEPTANCE_RATE[
                difficulty_value(metadata["difficulty"])
            ],

            "is_premium": False,
            "examples": [
                example.model_dump()
                for example in content.examples
            ],
        }

        with open(
            question_dir / "question.json",
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                question,
                file,
                indent=4,
                ensure_ascii=False,
            )