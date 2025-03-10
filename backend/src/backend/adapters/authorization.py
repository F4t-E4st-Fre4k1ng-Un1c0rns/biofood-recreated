from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from typing import Self

import jwt
from jwt.exceptions import DecodeError, ExpiredSignatureError

from src.backend.application.common.authorization import AccessTokenI
from src.backend.domain.exceptions import AuthorizationError
from src.backend.domain.models import UserID, UserRole
from src.backend.settings import settings


@dataclass
class AccessToken(AccessTokenI):
    exp: datetime
    user_id: UserID
    user_role: UserRole

    @classmethod
    def decode(cls, encoded_token: str) -> Self:
        try:
            payload = jwt.decode(
                jwt=encoded_token,
                key=settings.JWT_SECRET,
                algorithms=["HS256"],
            )
        except DecodeError:
            raise AuthorizationError("JWT token invalid")
        except ExpiredSignatureError:
            raise AuthorizationError("JWT token expired")

        payload["exp"] = cls._serialize_expiration_date(payload["exp"])
        return cls(**payload)

    @staticmethod
    def _serialize_expiration_date(timestamp):
        expiration_date = datetime.fromtimestamp(timestamp, tz=timezone.utc)
        return expiration_date

    def encode(self) -> str:
        payload = {k: v for k, v in asdict(self).items() if v is not None}
        payload["user_id"] = payload["user_id"].hex
        return jwt.encode(
            payload=payload,
            key=settings.JWT_SECRET,
            algorithm="HS256",
        )
