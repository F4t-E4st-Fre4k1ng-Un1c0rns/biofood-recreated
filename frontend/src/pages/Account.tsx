import { load } from "@/api/orders";
import Button from "@/components/Button";
import DishInCart from "@/components/DishInCart";
import Error from "@/components/Error";
import LoadingIcon from "@/components/LoadingIcon";
import OrderStatus from "@/components/OrderStatus";
import { useAuthStore } from "@/store/auth";
import LoadingState from "@/types/LoadingState";
import Order from "@/types/Order";
import { uuidToOrderNumber } from "@/utils/uuidToOrderNumber";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

function Account() {
  const navigate = useNavigate();
  const auth = useAuthStore();

  const [orders, setOrders] = useState<Order[] | undefined>();
  const [ordersState, setOrdersState] = useState(LoadingState.loading);

  useEffect(() => {
    if (!auth.loggedIn) {
      return;
    }

    load()
      .then((orders) => {
        setOrders(orders);
        setOrdersState(LoadingState.ok);
      })
      .catch(() => setOrdersState(LoadingState.error));
  }, []);

  if (!auth.loggedIn) {
    navigate("/login", { replace: true });
  }
  return (
    <div className="flex flex-col gap-8">
      <h1>Аккаунт</h1>
      <p>{auth.user?.email}</p>
      <Button color="primary" onClick={auth.logout} className="w-full">
        Выйти
      </Button>

      {auth.user?.role === "staff" && (
        <>
          <Link to="/pos/chef" className="block w-full">
            <Button color="accent" className="w-full">
              Панель повара
            </Button>
          </Link>
          <Link to="/account/qr/" className="block w-full">
            <Button color="accent" className="w-full">
              QR для входа в панель повора
            </Button>
          </Link>
        </>
      )}

      <h1>История заказов</h1>
      {ordersState == LoadingState.loading && <LoadingIcon />}
      {ordersState == LoadingState.error && <Error code={500} />}
      {ordersState == LoadingState.ok &&
        orders?.map((order) => {
          return (
            <div key={order.id}>
              <h2 className="mb-4">
                Заказ №{uuidToOrderNumber(order.id)}
                {order.takeoutTime && (
                  <> к {order.takeoutTime.toLocaleString("ru-RU")}</>
                )}{" "}
                <OrderStatus status={order.status} />
              </h2>

              {order?.items?.map((item) => {
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
            </div>
          );
        })}
    </div>
  );
}

export default Account;
