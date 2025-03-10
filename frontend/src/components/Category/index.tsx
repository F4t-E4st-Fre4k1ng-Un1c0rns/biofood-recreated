import LocalCategory from "@/types/LocalCategory";
import LoadingIcon from "../LoadingIcon";
import { useCacheStore } from "@/store/cache";
import DishPreview from "../DishPreview";
import { useCartStore } from "@/store/cart";

interface Props {
  category: LocalCategory;
  id: string;
}

function Category({ category, id }: Props) {
  const catalogue = useCacheStore();
  const cart = useCartStore();
  return (
    <>
      <h1 id={id} className="not-first:pt-8">
        {category.name}
      </h1>
      {!category.loaded && <LoadingIcon />}
      <div className="grid grid-cols-[repeat(auto-fill,min(25rem,100%))] gap-4 justify-around">
        {category.loaded &&
          category.dishes.map((dishId) => {
            const add = () => {
              cart.addToCart(dishId);
            };
            const remove = () => {
              cart.removeFromCart(dishId);
            };
            return (
              <DishPreview
                dish={catalogue.dishes[dishId]}
                count={cart.cart[dishId]}
                add={add}
                remove={remove}
                key={dishId}
              />
            );
          })}
      </div>
    </>
  );
}

export default Category;
