import LoadingIcon from "@/components/LoadingIcon";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function LoginDone() {
  const navigate = useNavigate();
  const cart = useCartStore();

  const params = new URLSearchParams(window.location.hash.slice(1));
  const auth = useAuthStore();

  useEffect(() => {
    if (!params.get("access_token")) {
      console.error("No code");
      return;
    }
    auth.auth(params.get("access_token")!).then(() => {
      cart.restoreCart();
      navigate("/cart", {
        replace: true,
      });
    });
  }, []);

  return (
    <>
      <h2 className="text-center">Выясняем, кто вы...</h2>
      <LoadingIcon />
    </>
  );
}

export default LoginDone;
