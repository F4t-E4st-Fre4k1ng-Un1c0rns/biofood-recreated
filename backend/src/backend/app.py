from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.backend.domain.exceptions import (
    AuthenticationError,
    AuthorizationError,
    IntegrityCompromised,
    NotFound,
)
from src.backend.presentation.endpoints.auth import auth_router
from src.backend.presentation.endpoints.categories import categories_router
from src.backend.presentation.endpoints.dishes import dishes_router
from src.backend.presentation.endpoints.orders import orders_router
from src.backend.presentation.endpoints.shopping_cart import shopping_cart_router
from src.backend.presentation.exceptions import (
    authentication_error_handler,
    authorization_error_handler,
    integrity_compromised_handler,
    not_found_handler,
)

from .settings import settings


def create_fastapi_app(settings=settings):
    app = FastAPI(title="Biofood API")
    api_router = APIRouter(prefix="/api")

    add_endpoints(api_router)
    add_exception_handler(app)

    app.include_router(api_router)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ALLOW_ORIGINS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )
    return app


def add_endpoints(api_router: APIRouter):
    api_router.include_router(auth_router)
    api_router.include_router(categories_router)
    api_router.include_router(dishes_router)
    api_router.include_router(orders_router)
    api_router.include_router(shopping_cart_router)


def add_exception_handler(app: FastAPI):
    app.add_exception_handler(NotFound, not_found_handler)  # type: ignore
    app.add_exception_handler(IntegrityCompromised, integrity_compromised_handler)  # type: ignore
    app.add_exception_handler(AuthenticationError, authentication_error_handler)  # type: ignore
    app.add_exception_handler(AuthorizationError, authorization_error_handler)  # type: ignore


app = create_fastapi_app()
