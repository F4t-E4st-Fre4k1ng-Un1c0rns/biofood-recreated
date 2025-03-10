import DishInCart from "@/components/DishInCart";
import Error from "@/components/Error";
import LoadingIcon from "@/components/LoadingIcon";
import OrderStatusComponent from "@/components/OrderStatus";
import { useCacheStore } from "@/store/cache";
import LoadingState from "@/types/LoadingState";
import Order from "@/types/Order";
import OrderStatus from "@/types/OrderStatus";
import { uuidToOrderNumber } from "@/utils/uuidToOrderNumber";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

const REFRESH_TIMEOUT = parseInt(
  import.meta.env.VITE_ORDER_REFRESH_TIMEOUT ?? "1000"
);

function OrderDone() {
  const cache = useCacheStore();
  const [state, setState] = useState(LoadingState.loading);
  const [params] = useSearchParams();
  const { id } = useParams() as { id: Order["id"] };
  const [order, setOrder] = useState<Order | undefined>();

  useEffect(() => {
    if (id === "500") {
      setState(LoadingState.error);
      return;
    }

    if (cache.orders[id]) {
      setOrder(cache.orders[id]);
      setState(LoadingState.ok);
    } else {
      cache.fetchOrder(id).catch(() => setState(LoadingState.error));
    }
  }, [cache.orders[id]]);

  useEffect(() => {
    if (state == LoadingState.ok) {
      const intervalId = setInterval(() => {
        if (cache.orders[id].status === OrderStatus.taken) {
          return;
        }
        cache.fetchOrder(id);
      }, REFRESH_TIMEOUT);

      return () => clearInterval(intervalId);
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-2">
      <h1>{params.get("new") ? "Спасибо за заказ!" : "Заказ"}</h1>
      {state == LoadingState.loading && <LoadingIcon />}
      {state == LoadingState.ok && order && (
        <>
          <h2>Ваш заказ №{uuidToOrderNumber(order.id)}:</h2>
          <p>
            Будет готов{" "}
            {order.takeoutTime ? (
              <>к {order.takeoutTime.toLocaleString("ru-RU")}</>
            ) : (
              "скоро"
            )}
          </p>
          <OrderStatusComponent status={order.status} />
          {order.items.map((item) => {
            return (
              <DishInCart
                dish={item.dish}
                count={item.amount}
                showChangeButton={false}
                showPrice={true}
                showImage={true}
                key={item.dish.id}
              />
            );
          })}
        </>
      )}
      {state == LoadingState.error && <Error code={500} />}
    </div>
  );
}

export default OrderDone;
