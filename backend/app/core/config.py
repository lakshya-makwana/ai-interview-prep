from typing import Optional
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

    # Judge0
    JUDGE0_API_URL: Optional[str] = None
    JUDGE0_API_KEY: Optional[str] = None
    JUDGE0_API_HOST: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()