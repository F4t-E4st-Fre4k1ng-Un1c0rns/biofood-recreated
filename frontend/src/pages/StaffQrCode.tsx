import Button from "@/components/Button";
import { useAuthStore } from "@/store/auth";
import QRCode from "react-qr-code";

function StaffQrCode() {
  const auth = useAuthStore();

  const copy = () => {
    navigator.clipboard.writeText(auth.user?.token || "");
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <h1>QR для входа в POS</h1>
      <p>Вы входите как {auth.user?.email}</p>
      <QRCode value={auth.user?.token || ""} />
      <Button onClick={copy} color="primary">
        Скопировать токен
      </Button>
    </div>
  );
}

export default StaffQrCode;
