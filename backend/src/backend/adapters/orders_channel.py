from pydantic import RedisDsn
from redis.asyncio import Redis
from redis.asyncio.client import PubSub

from backend.application.common.orders_channel import OrdersChannel
from backend.domain.aggregates import Order
from src.backend.settings import settings


class OrdersChannerGateway(OrdersChannel):
    _ORDERS_CHANNEL_NAME = "orders_updates"

    def __init__(self, redis_dsn: RedisDsn = settings.REDIS_DSN):
        self.redis_client = Redis.from_url(str(redis_dsn))

    async def publish_update(self, updated_order: Order):
        await self.redis_client.publish(
            self._ORDERS_CHANNEL_NAME, updated_order.model_dump_json()
        )
        return updated_order

    async def get_subscription(self) -> PubSub:
        pubsub = self.redis_client.pubsub()
        await pubsub.subscribe(self._ORDERS_CHANNEL_NAME)
        return pubsub
