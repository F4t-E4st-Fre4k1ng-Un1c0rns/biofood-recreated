from pydantic import AnyHttpUrl, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    POSTGRES_DSN: PostgresDsn

    REDIS_DSN: RedisDsn

    MINIO_USER_URL: AnyHttpUrl
    MINIO_BUCKET_NAME: str

    JWT_SECRET: str
    JWT_ALGORITHMS: list[str] = ["HS256"]

    CORS_ALLOW_ORIGINS: list[str] = ["*"]
    CORS_ALLOW_METHODS: list[str] = ["*"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]

    @property
    def MINIO_BUCKET_URL(self) -> str:
        return f"{self.MINIO_USER_URL}{self.MINIO_BUCKET_NAME}/"


settings = Settings()  # type: ignore
