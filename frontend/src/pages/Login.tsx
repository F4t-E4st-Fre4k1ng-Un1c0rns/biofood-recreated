import Button from "@/components/Button";
import { useCartStore } from "@/store/cart";

function Login() {
  const cart = useCartStore();
  const redirectUri = `${window.location.protocol}//${window.location.host}/login-done`;
  const urlParams = new URLSearchParams({
    response_type: "token",
    client_id: import.meta.env.VITE_YANDEX_CLIENT_ID,
    redirect_uri: redirectUri,
  } as Record<string, string>);
  const yandexLink = `https://oauth.yandex.ru/authorize?${urlParams}`;
  const openYandex = () => {
    localStorage.setItem("cart", JSON.stringify(cart.cart));
    window.location.href = yandexLink;
  };
  return (
    <>
      <h1 className="text-center pb-8">Для продолжения войдите</h1>
      <Button color="primary" onClick={openYandex} className="w-full">
        Войти через Яндекс
      </Button>
    </>
  );
}

export default Login;
