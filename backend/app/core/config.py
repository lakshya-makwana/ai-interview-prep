from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.5-flash"

    UPLOAD_DIR: str = "uploads/resumes"

    # Code execution Docker sandbox
    CODE_EXECUTION_TIMEOUT_SECONDS: int = 5
    CODE_EXECUTION_MEMORY_LIMIT: str = "256m"
    CODE_EXECUTION_CPU_LIMIT: str = "1"
    CODE_EXECUTION_PYTHON_IMAGE: str = "python:3.12-slim"
    CODE_EXECUTION_JAVA_IMAGE: str = "openjdk:21"
    CODE_EXECUTION_GCC_IMAGE: str = "gcc:latest"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
