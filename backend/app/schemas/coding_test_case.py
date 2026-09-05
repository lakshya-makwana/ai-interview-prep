from pydantic import BaseModel


class CodingSampleTestCaseResponse(BaseModel):

    id: int

    input: str

    expected_output: str


class CodingSampleTestCaseListResponse(BaseModel):

    test_cases: list[CodingSampleTestCaseResponse]
