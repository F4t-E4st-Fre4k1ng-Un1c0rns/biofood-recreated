import Category from "@/types/Category";
import { Link } from "react-router";
import { HashLink } from "react-router-hash-link";
import shoppingCart from "./icons/shopping-cart.svg";
import userIcon from "./icons/user.svg";
import unknownUserIcon from "./icons/unknown-user.svg";
import { useAuthStore } from "@/store/auth";

interface Props {
  categories: Category[];
}

function Header({ categories }: Props) {
  const auth = useAuthStore();
  return (
    <header className="w-full flex justify-between gap-6 p-8 sticky top-0 bg-white items-center">
      <HashLink to="/#">Биофуд</HashLink>
      <nav className="w-full flex gap-6 text-nowrap overflow-scroll">
        {categories.map((category) => (
          <HashLink to={`/#${category.id}`} key={category.id}>
            {category.name}
          </HashLink>
        ))}
      </nav>
      <Link to="/cart/">
        <img src={shoppingCart} />
      </Link>
      {auth.loggedIn ? (
        <Link to="/account">
          <img src={userIcon} />
        </Link>
      ) : (
        <Link to="/login">
          <img src={unknownUserIcon} />
        </Link>
      )}
    </header>
  );
}

export default Header;
