import type Dish from "@/types/Dish";
import AddToCart from "@/components/AddToCart";

interface Props {
  dish: Dish;
  count: number;
  add: () => void;
  remove: () => void;
}

function DishPreview({ dish, count, add, remove }: Props) {
  return (
    <div className="w-full gap-2 rounded-xl ring-accent ring-0 hover:ring-2">
      <div
        className="h-40 w-full bg-cover bg-center rounded-t-xl"
        style={{
          backgroundImage: `url("${
            dish.banner ??
            "https://images.unsplash.com/photo-1531234799389-dcb7651eb0a2?q=80&w=600&auto=format"
          }")`,
        }}
      />
      <div className="flex flex-col gap-2 p-2">
        <p className="text-strong h-20">{dish.name}</p>
        <p>
          <span className="text-lg">
            {dish.price.toLocaleString("ru-RU")} ₽
          </span>
          {dish.weight && (
            <>
              <span className="m-1">/</span>
              <span className="text-sm">
                {dish.weight?.toLocaleString("ru-RU")} г
              </span>
            </>
          )}
        </p>
        <AddToCart count={count} add={add} remove={remove} />
      </div>
    </div>
  );
}

export default DishPreview;
