import { load } from "@/api/posOrders";
import Button from "@/components/Button";
import LoadingIcon from "@/components/LoadingIcon";
import PosOrder from "@/components/PosOrder";
import { useAuthStore } from "@/store/auth";
import LoadingState from "@/types/LoadingState";
import Order from "@/types/Order";
import OrderStatus from "@/types/OrderStatus";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";

const REFRESH_TIMEOUT = parseInt(
  import.meta.env.VITE_ORDER_REFRESH_TIMEOUT ?? "1000"
);

function ChefKanban() {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const [state, setState] = useState(LoadingState.loading);

  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [cookingOrders, setCookingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setState(LoadingState.loading);
      Promise.all([
        load(OrderStatus.pending),
        load(OrderStatus.accepted),
        load(OrderStatus.cooking),
        load(OrderStatus.ready),
      ])
        .then(([pending, accepted, cooking, ready]) => {
          setPendingOrders(pending ?? []);
          setAcceptedOrders(accepted ?? []);
          setCookingOrders(cooking ?? []);
          setReadyOrders(ready ?? []);
          setState(LoadingState.ok);
        })
        .catch(() => setState(LoadingState.error));
    }, REFRESH_TIMEOUT);

    return () => clearInterval(intervalId);
  }, []);

  const checkLogout = () => {
    if (confirm("Вы точно хотите выйти?")) {
      auth.logout();
      navigate("/pos/login");
    }
  };

  if (auth.user?.role !== "staff") {
    return <Navigate to="/pos/login" />;
  }

  return (
    <>
      <header className="flex justify-between p-4">
        <div>
          {state === LoadingState.loading && <LoadingIcon />}
          {state === LoadingState.error && <span>Ошибка!</span>}
        </div>
        <div>
          <Button color="primary" onClick={checkLogout}>
            Выйти
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-3 m-4 gap-8">
        <div>
          <h1>Ожидают готовки</h1>
          {pendingOrders.map((order) => (
            <PosOrder order={order} key={order.id} />
          ))}
          {acceptedOrders.map((order) => (
            <PosOrder order={order} key={order.id} />
          ))}
        </div>
        <div>
          <h1>Готовятся</h1>
          {cookingOrders.map((order) => (
            <PosOrder order={order} key={order.id} />
          ))}
        </div>
        <div>
          <h1>Ожидают выдачи</h1>
          {readyOrders.map((order) => (
            <PosOrder order={order} key={order.id} />
          ))}
        </div>
      </div>
    </>
  );
}
export default ChefKanban;
