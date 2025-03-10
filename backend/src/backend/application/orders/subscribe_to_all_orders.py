from collections.abc import AsyncGenerator

from backend.application.common.dto import InFilter
from backend.domain.value_objects import OrderStatus, UserRole
from src.backend.application.common.authorization import AccessTokenI
from src.backend.application.common.interactor import InteractorGenerator
from src.backend.application.common.orders_channel import OrdersChannel
from src.backend.application.common.uow import UoW
from src.backend.domain.aggregates import Order
from src.backend.domain.common import Base as DomainModelBase
from src.backend.domain.exceptions import AuthorizationError


class SubscribeToAllOrdersResultDTO(DomainModelBase):
    items: list[Order]


class SubscribeToAllOrders(InteractorGenerator[None, SubscribeToAllOrdersResultDTO]):
    def __init__(self, uow: UoW, orders_channel: OrdersChannel, token: AccessTokenI):
        self.uow = uow
        self.token = token
        self.orders_channel = orders_channel

    async def __call__(
        self, data: None = None
    ) -> AsyncGenerator[SubscribeToAllOrdersResultDTO]:
        if self.token.user_role == UserRole.client:
            raise AuthorizationError("You have no right to access all orders list")

        yield await self.__get_fist_orders_batch()
        subscription = await self.orders_channel.get_subscription()
        while True:
            message = await subscription.get_message(
                ignore_subscribe_messages=True, timeout=0.3
            )
            if message is None:
                continue
            order = Order.model_validate_json(message["data"])
            yield SubscribeToAllOrdersResultDTO(items=[order])

    async def __get_fist_orders_batch(self) -> SubscribeToAllOrdersResultDTO:
        in_filter: InFilter = {
            "status": [
                OrderStatus.pending,
                OrderStatus.accepted,
                OrderStatus.cooking,
                OrderStatus.ready,
            ]
        }
        async with self.uow:
            orders_list = await self.uow.order.find_many(in_filter=in_filter)
        return SubscribeToAllOrdersResultDTO(items=list(orders_list))
