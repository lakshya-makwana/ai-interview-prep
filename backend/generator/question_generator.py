import json
import os

from google import genai
from pydantic import ValidationError

from generator.prompt import (
    SYSTEM_PROMPT,
    build_prompt,
)
from generator.schema import (
    GeneratedQuestionBatch,
)


class QuestionGenerator:

    def __init__(self):

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY"),
        )

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-2.5-flash",
        )

    def generate_batch(
        self,
        batch,
    ):

        prompt = build_prompt(batch)

        response = self.client.models.generate_content(

            model=self.model,

            config={
                "system_instruction": SYSTEM_PROMPT,
                "response_mime_type": "application/json",
                "temperature": 0.3,
            },

            contents=prompt,
        )

        text = response.text.strip()

        try:

            data = json.loads(text)

        except Exception as e:

            raise Exception(
                f"Gemini returned invalid JSON\n\n{text}"
            ) from e

        try:

            parsed = GeneratedQuestionBatch.model_validate(
                data
            )

        except ValidationError as e:

            raise Exception(
                f"Schema validation failed\n\n{e}"
            ) from e

        if len(parsed.questions) != len(batch):

            raise Exception(
                f"Expected {len(batch)} questions but "
                f"Gemini returned {len(parsed.questions)}."
            )

        return parsed.questions