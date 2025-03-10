from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Numeric, SmallInteger, String, Text, UniqueConstraint
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.orm.properties import ForeignKey
from sqlalchemy.types import DateTime

from src.backend.adapters.database.orm.mixins import TimestampMixin, UUIDMixin
from src.backend.domain.value_objects import OrderStatus, UserRole


class Base(AsyncAttrs, DeclarativeBase): ...


class UserORM(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"
    role: Mapped[UserRole]
    email: Mapped[str] = mapped_column(String(320), unique=True)
    password: Mapped[str] = mapped_column(String(68), nullable=True)


class CategoryORM(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "categories"
    name: Mapped[str] = mapped_column(unique=True)


class DishORM(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "dishes"
    name: Mapped[str] = mapped_column(unique=True)
    banner_path: Mapped[str] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(8, 2))
    description: Mapped[str] = mapped_column(nullable=True)
    weight: Mapped[int] = mapped_column(SmallInteger, nullable=True)

    category_id: Mapped[UUID] = mapped_column(ForeignKey(CategoryORM.id))


class ShoppingCartItemORM(Base, UUIDMixin):
    __tablename__ = "shopping_cart_items"
    __table_args__ = (UniqueConstraint("user_id", "dish_id", name="_user_dishes_uc"),)
    user_id: Mapped[UUID] = mapped_column(ForeignKey(UserORM.id))
    dish_id: Mapped[UUID] = mapped_column(ForeignKey(DishORM.id))
    dish: Mapped[DishORM] = relationship(lazy="selectin")
    amount: Mapped[int] = mapped_column(SmallInteger)


class OrderORM(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "orders"
    user_id: Mapped[UUID] = mapped_column(ForeignKey(UserORM.id))
    status: Mapped[OrderStatus]
    takeout_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    items: Mapped[list["OrderItemORM"]] = relationship(lazy="selectin")


class OrderItemORM(Base, UUIDMixin):
    __tablename__ = "order_items"
    __table_args__ = (UniqueConstraint("order_id", "dish_id", name="_order_dishes_uc"),)
    order_id: Mapped[UUID] = mapped_column(ForeignKey(OrderORM.id))
    dish_id: Mapped[UUID] = mapped_column(ForeignKey(DishORM.id))
    dish: Mapped[DishORM] = relationship(lazy="selectin")
    amount: Mapped[int] = mapped_column(SmallInteger)
