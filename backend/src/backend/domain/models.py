from decimal import Decimal
from typing import NewType, Optional
from uuid import UUID

from pydantic import EmailStr, field_validator

from src.backend.domain.common import Base
from src.backend.domain.value_objects import UserRole
from src.backend.settings import settings

UserID = NewType("UserID", UUID)
CategoryID = NewType("CategoryID", UUID)
DishID = NewType("DishID", UUID)
ShoppingCartItemID = NewType("ShoppingCartItemID", UUID)
OrderItemID = NewType("OrderItemID", UUID)


class User(Base):
    id: UserID
    role: UserRole
    email: EmailStr


class Category(Base):
    id: CategoryID
    name: str


class Dish(Base):
    id: DishID
    name: str
    banner_path: Optional[str]
    price: Decimal
    description: Optional[str]
    weight: Optional[int]

    @field_validator("banner_path")
    @classmethod
    def make_url(cls, banner_path: str) -> str:
        return settings.MINIO_BUCKET_URL + banner_path


class ShoppingCartItem(Base):
    id: ShoppingCartItemID
    dish: Dish
    amount: int


class OrderItem(Base):
    dish: Dish
    amount: int
