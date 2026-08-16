from typing import List

from pydantic import BaseModel


class Example(BaseModel):
    input: str
    output: str
    explanation: str


class GeneratedQuestionContent(BaseModel):
    title: str
    description: str
    constraints: List[str]
    input_format: str
    output_format: str
    estimated_time: int
    examples: List[Example]


class GeneratedQuestionBatch(BaseModel):
    questions: List[GeneratedQuestionContent]