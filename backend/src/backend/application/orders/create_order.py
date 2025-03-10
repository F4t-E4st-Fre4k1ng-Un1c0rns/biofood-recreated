from datetime import datetime
from typing import Optional

from pydantic import AwareDatetime, RootModel

from backend.adapters import orders_channel
from backend.application.common.orders_channel import OrdersChannel
from backend.domain.exceptions import IntegrityCompromised
from src.backend.application.common.authorization import AccessTokenI
from src.backend.application.common.interactor import Interactor
from src.backend.application.common.uow import UoW
from src.backend.domain.aggregates import Order, OrderID
from src.backend.domain.common import Base as DomainModelBase
from src.backend.domain.models import ShoppingCartItem, UserID
from src.backend.domain.value_objects import OrderStatus


class CreateOrderDTO(DomainModelBase):
    takeout_time: Optional[AwareDatetime]


class CreateOrderResultDTO(RootModel):
    root: Order


class CreateOrder(Interactor[CreateOrderDTO, CreateOrderResultDTO]):
    def __init__(self, uow: UoW, orders_channel: OrdersChannel, token: AccessTokenI):
        self.uow = uow
        self.orders_channel = orders_channel
        self.token = token

    async def __call__(self, data: CreateOrderDTO) -> CreateOrderResultDTO:
        async with self.uow:
            await self.__get_users_shopping_cart_items()
            order = await self.__create_order(data.takeout_time)
            await self.__add_items_from_shopping_cart_to_order(order.id)
            await self.__clear_shopping_cart()
            order = await self.uow.order.find_one(by_filter={"id": order.id})
            await self.orders_channel.publish_update(order)
            await self.uow.commit()

            return CreateOrderResultDTO(root=order)

    async def __get_users_shopping_cart_items(self) -> list[ShoppingCartItem]:
        by_filter = {"user_id": self.token.user_id}
        async with self.uow:
            shopping_cart_items = await self.uow.shopping_cart.find_many(
                by_filter=by_filter
            )
        return list(shopping_cart_items)

    async def __create_order(self, takeout_time: datetime | None):
        data = {
            "user_id": self.token.user_id,
            "status": OrderStatus.pending,
            "takeout_time": takeout_time,
        }
        return await self.uow.order.create_one(data)

    async def __add_items_from_shopping_cart_to_order(self, order_id: OrderID):
        items = await self.uow.shopping_cart.find_many(
            by_filter={"user_id": self.token.user_id}
        )
        if len(items) == 0:
            raise IntegrityCompromised(
                "You can not create order with empty shopping cart"
            )

        for item in items:
            data = {
                "order_id": order_id,
                "dish_id": item.dish.id,
                "amount": item.amount,
            }
            await self.uow.order_item.create_one(data=data)

    async def __clear_shopping_cart(self):
        by_filter = {"user_id": self.token.user_id}
        items = await self.uow.shopping_cart.find_many(by_filter=by_filter)
        await self.uow.shopping_cart.delete_many((i.id for i in items))
