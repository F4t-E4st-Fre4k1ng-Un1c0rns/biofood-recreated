import Button from "@/components/Button";
import DishInCart from "@/components/DishInCart";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useCacheStore } from "@/store/cache";
import { Fragment, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import LoadingState from "@/types/LoadingState";
import LoadingIcon from "@/components/LoadingIcon";
import { put } from "@/api/orders";

function Cart() {
  const navigate = useNavigate();
  const cache = useCacheStore();
  const cart = useCartStore();
  const auth = useAuthStore();
  const [state, setState] = useState(LoadingState.ok);

  const now = new Date();
  const nowString = `${now.getHours()}:${now.getMinutes()}`;
  const [timeValue, setTimeValue] = useState<string | undefined>();
  const cookBy = useMemo(() => {
    if (!timeValue) {
      return;
    }
    const hours = parseInt(timeValue.slice(0, 2));
    const minutes = parseInt(timeValue.slice(3));
    const to = now;
    to.setHours(hours);
    to.setMinutes(minutes);
    return to;
  }, [timeValue]);

  const sum = useMemo(() => {
    let sum = 0;
    for (const item of Object.entries(cart.cart)) {
      if (item[0] in cache.dishes) {
        sum += cache.dishes[item[0]].price * item[1];
      }
    }

    return sum;
  }, [cache.dishes, cart.cart]);

  const confirmOrder = () => {
    if (!auth.loggedIn) {
      navigate("/login");
      return;
    }
    setState(LoadingState.loading);
    cart.clearCart();
    put(cookBy?.toISOString() ?? null)
      .then((order) => {
        if (!order || !order.id) {
          navigate(`/order/500?new=1`);
        }
        cache.setCachedOrders([order!]);
        navigate(`/order/${order!.id}?new=1`);
      })
      .catch((e) => {
        console.error(e);
        navigate("/order/500?new=1");
      });
  };

  return (
    <>
      <div>
        <h1 className="pb-8">Корзина</h1>
        {Object.entries(cart.cart).map(([dishId, count]) => {
          if (!count) {
            return;
          }
          if (!(dishId in cache.dishes)) {
            return <Fragment key={dishId}></Fragment>;
          }
          const add = () => {
            cart.addToCart(dishId);
          };
          const remove = () => {
            cart.removeFromCart(dishId);
          };
          return (
            <DishInCart
              dish={cache.dishes[dishId]}
              count={count}
              add={add}
              remove={remove}
              showChangeButton={true}
              showPrice={true}
              showImage={true}
              key={dishId}
            />
          );
        })}
      </div>
      <div>
        <div className="flex justify-between py-8">
          <h2>Приготовить к</h2>
          <input
            type="time"
            min={nowString}
            max="18:00"
            onChange={(e) => setTimeValue(e.target.value)}
          />
        </div>
        {Object.keys(cart.cart).length ? (
          <>
            {state === LoadingState.ok && (
              <Button color="primary" onClick={confirmOrder} className="w-full">
                {`Заказать за ${sum.toLocaleString("ru-RU")} ₽`}
              </Button>
            )}
            {state === LoadingState.loading && <LoadingIcon />}
          </>
        ) : (
          <h2>⚠️ Сначала добавьте продукты в корзину</h2>
        )}
      </div>
    </>
  );
}

export default Cart;
