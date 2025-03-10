from abc import ABC, abstractmethod
from typing import ContextManager

from backend.application.orders.change_order_status import ChangeOrderStatus
from src.backend.application.authenticate import Authenticate
from src.backend.application.common.authorization import AccessTokenI
from src.backend.application.get_categories_list import GetCategoriesList
from src.backend.application.get_dishes_list import GetDishshesList
from src.backend.application.orders.create_order import CreateOrder
from src.backend.application.orders.get_orders_by_id import GetOrderByID
from src.backend.application.orders.subscribe_to_all_orders import SubscribeToAllOrders
from src.backend.application.orders.subscribe_to_orders_list import (
    SubscribeToOrdersList,
)
from src.backend.application.shopping_cart.add_to_shopping_cart_items import (
    AddToShoppingCartItemsList,
)
from src.backend.application.shopping_cart.delete_from_shopping_cart_items import (
    DeleteFromShoppingCartItemsList,
)
from src.backend.application.shopping_cart.get_shopping_cart_items_list import (
    GetShoppingCartItemsList,
)


class InteractorFactory(ABC):
    @abstractmethod
    def authenticate(self) -> ContextManager[Authenticate]:
        raise NotImplementedError

    @abstractmethod
    def get_categories_list(self) -> ContextManager[GetCategoriesList]:
        raise NotImplementedError

    @abstractmethod
    def get_dishes_list(self) -> ContextManager[GetDishshesList]:
        raise NotImplementedError

    @abstractmethod
    def get_shopping_cart_items_list(
        self, token: AccessTokenI
    ) -> ContextManager[GetShoppingCartItemsList]:
        raise NotImplementedError

    @abstractmethod
    def add_to_shopping_cart_items_list(
        self, token: AccessTokenI
    ) -> ContextManager[AddToShoppingCartItemsList]:
        raise NotImplementedError

    @abstractmethod
    def delete_from_shopping_cart_items_list(
        self, token: AccessTokenI
    ) -> ContextManager[DeleteFromShoppingCartItemsList]:
        raise NotImplementedError

    @abstractmethod
    def subscribe_to_orders_list(
        self, token: AccessTokenI
    ) -> ContextManager[SubscribeToOrdersList]:
        raise NotImplementedError

    @abstractmethod
    def get_order_by_id(self, token: AccessTokenI) -> ContextManager[GetOrderByID]:
        raise NotImplementedError

    @abstractmethod
    def subscribe_to_all_orders(
        self, token: AccessTokenI
    ) -> ContextManager[SubscribeToAllOrders]:
        raise NotImplementedError

    @abstractmethod
    def change_order_status(
        self, token: AccessTokenI
    ) -> ContextManager[ChangeOrderStatus]:
        raise NotImplementedError

    @abstractmethod
    def create_order(self, token: AccessTokenI) -> ContextManager[CreateOrder]:
        raise NotImplementedError
