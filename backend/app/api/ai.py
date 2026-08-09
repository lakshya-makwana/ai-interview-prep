from fastapi import APIRouter

from app.services.ai_service import test_connection

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.get("/test")
def test_ai():
    return {
        "response": test_connection()
    }