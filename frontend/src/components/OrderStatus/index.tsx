import Order from "@/types/Order";
import { colorClasses, names } from "./consts";

interface Props {
  status: Order["status"];
}

function OrderStatus({ status }: Props) {
  return (
    <span className={`${colorClasses[status]} w-fit py-1 px-2 rounded-2xl`}>
      {names[status]}
    </span>
  );
}

export default OrderStatus;
