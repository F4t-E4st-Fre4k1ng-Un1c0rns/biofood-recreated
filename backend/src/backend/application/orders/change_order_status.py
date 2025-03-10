from pydantic import RootModel

from backend.application.common.orders_channel import OrdersChannel
from backend.domain.value_objects import OrderStatus, UserRole
from src.backend.application.common.authorization import AccessTokenI
from src.backend.application.common.interactor import Interactor
from src.backend.application.common.uow import UoW
from src.backend.domain.aggregates import Order, OrderID
from src.backend.domain.common import Base as DomainModelBase
from src.backend.domain.exceptions import AuthorizationError


class ChangeOrderStatusDTO(DomainModelBase):
    id: OrderID
    new_status: OrderStatus


class ChangeOrderStatusResultDTO(RootModel):
    root: Order


class ChangeOrderStatus(Interactor[ChangeOrderStatusDTO, ChangeOrderStatusResultDTO]):
    def __init__(self, uow: UoW, orders_channel: OrdersChannel, token: AccessTokenI):
        self.uow = uow
        self.token = token
        self.orders_channel = orders_channel

    async def __call__(self, data: ChangeOrderStatusDTO) -> ChangeOrderStatusResultDTO:
        if self.token.user_role == UserRole.client:
            raise AuthorizationError("You have no right to access all orders list")

        async with self.uow:
            order = await self.uow.order.update_one(
                data.id, {"status": data.new_status}
            )
            await self.orders_channel.publish_update(order)
            await self.uow.commit()

        return ChangeOrderStatusResultDTO(order)
