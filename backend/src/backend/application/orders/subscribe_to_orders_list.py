from collections.abc import AsyncGenerator

from src.backend.application.common.authorization import AccessTokenI
from src.backend.application.common.interactor import InteractorGenerator
from src.backend.application.common.orders_channel import OrdersChannel
from src.backend.application.common.uow import UoW
from src.backend.domain.aggregates import Order
from src.backend.domain.common import Base as DomainModelBase


class SubscribeOrdersListResultDTO(DomainModelBase):
    items: list[Order]


class SubscribeToOrdersList(InteractorGenerator[None, SubscribeOrdersListResultDTO]):
    def __init__(self, uow: UoW, orders_channel: OrdersChannel, token: AccessTokenI):
        self.uow = uow
        self.orders_channel = orders_channel
        self.token = token

    async def __call__(
        self, data: None = None
    ) -> AsyncGenerator[SubscribeOrdersListResultDTO]:
        yield await self.__get_first_orders_batch()
        subscription = await self.orders_channel.get_subscription()
        while True:
            message = await subscription.get_message(
                ignore_subscribe_messages=True, timeout=1
            )
            if message is None:
                continue
            order = Order.model_validate_json(message["data"])
            if order.user_id.hex != self.token.user_id:
                continue
            yield SubscribeOrdersListResultDTO(items=[order])

    async def __get_first_orders_batch(self) -> SubscribeOrdersListResultDTO:
        async with self.uow:
            by_filter = {"user_id": self.token.user_id}
            orders_list = await self.uow.order.find_many(by_filter=by_filter)
            return SubscribeOrdersListResultDTO(items=list(orders_list))
