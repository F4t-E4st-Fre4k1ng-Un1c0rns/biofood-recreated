import Order from "@/types/Order";
import { uuidToOrderNumber } from "@/utils/uuidToOrderNumber";
import DishInCart from "../DishInCart";
import NextButton from "./NextButton";
import { patch } from "@/api/posOrders";
import OrderStatus from "@/types/OrderStatus";

interface Props {
  order: Order;
}
function PosOrder({ order }: Props) {
  const setStatus = (status: OrderStatus) => {
    patch(order.id, status);
  };

  return (
    <div className="my-4 after:w-full after:block after:h-px after:bg-accent">
      <div>
        <h2 className="inline">№{uuidToOrderNumber(order.id)}</h2>
        {order.takeoutTime && (
          <p className="inline">
            {" "}
            к {order.takeoutTime.toLocaleString("ru-RU")}
          </p>
        )}
      </div>

      {order.items.map(({ dish, amount }) => (
        <DishInCart dish={dish} count={amount} key={dish.id} />
      ))}
      <NextButton status={order.status} setStatus={setStatus} />
    </div>
  );
}

export default PosOrder;
