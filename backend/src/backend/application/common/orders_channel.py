from abc import ABC, abstractmethod

from redis.asyncio.client import PubSub

from src.backend.domain.aggregates import Order


class OrdersChannel(ABC):
    """
    Reidis channel with orders updates
    """

    @abstractmethod
    async def publish_update(self, updated_order: Order) -> Order:
        raise NotImplementedError

    @abstractmethod
    async def get_subscription(self) -> PubSub:
        raise NotImplementedError
