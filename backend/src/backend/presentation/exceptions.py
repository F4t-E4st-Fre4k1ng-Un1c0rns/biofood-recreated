from fastapi import Request
from fastapi.responses import JSONResponse

from src.backend.domain.exceptions import (
    AuthenticationError,
    AuthorizationError,
    IntegrityCompromised,
    NotFound,
)


async def not_found_handler(_: Request, exc: NotFound) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"detail": type(exc).__name__, "body": exc},
    )


async def integrity_compromised_handler(
    _: Request, exc: IntegrityCompromised
) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={"detail": str(type(exc).__name__), "body": str(exc)},
    )


async def authentication_error_handler(
    _: Request, exc: AuthenticationError
) -> JSONResponse:
    return JSONResponse(
        status_code=401,
        content={"detail": str(type(exc).__name__), "body": str(exc)},
    )


async def authorization_error_handler(
    _: Request, exc: AuthorizationError
) -> JSONResponse:
    return JSONResponse(
        status_code=403,
        content={"detail": str(type(exc).__name__), "body": str(exc)},
    )
