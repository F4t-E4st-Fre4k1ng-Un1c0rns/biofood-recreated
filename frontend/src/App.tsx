import { Route, Routes } from "react-router";
import "./index.css";
import Catalogue from "./pages/Catalogue";
import Cart from "./pages/Cart";
import { useCacheStore } from "./store/cache";
import { lazy, Suspense, useEffect } from "react";
import { useCartStore } from "./store/cart";
import OrderDone from "./pages/OrderDone";
import Main from "./layouts/main";

const Login = lazy(() => import("@/pages/Login"));
const LoginDone = lazy(() => import("@/pages/LoginDone"));
const Account = lazy(() => import("@/pages/Account"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Pos = lazy(() => import("@/layouts/pos"));
const StaffQrCode = lazy(() => import("@/pages/StaffQrCode"));
const ChefKanban = lazy(() => import("@/pages/pos/ChefKanban"));
const PosLogin = lazy(() => import("@/pages/pos/Login"));

export function App() {
  const cache = useCacheStore();
  const cart = useCartStore();

  useEffect(() => {
    cache.fetchCatalogue();
    cart.fetch();
  }, []);

  return (
    <>
      <Suspense>
        <Routes>
          <Route path="/pos/" element={<Pos />}>
            <Route path="chef/" element={<ChefKanban />} />
            <Route path="login/" element={<PosLogin />} />
          </Route>

          <Route path="/" element={<Main />}>
            <Route path="/" element={<Catalogue />} />
            <Route path="/cart/" element={<Cart />} />
            <Route path="/order/:id/" element={<OrderDone />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/login-done/" element={<LoginDone />} />
            <Route path="/account/" element={<Account />} />
            <Route path="/account/qr/" element={<StaffQrCode />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
