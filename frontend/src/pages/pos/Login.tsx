import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

function ChefLogin() {
  const auth = useAuthStore();
  const navigate = useNavigate();

  const onTokenInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const token = e.target.value;
    auth.loginByToken(token);
    navigate("/pos/chef");
  };

  const onScan = (code: IDetectedBarcode[]) => {
    const token = code[0].rawValue;
    auth.loginByToken(token);
    navigate("/pos/chef");
  };

  return (
    <div className="p-8 text-center">
      <h1 className="mb-4">Отсканируйте свой QR код</h1>
      <div className="w-full flex justify-center mb-4">
        <Scanner
          onScan={onScan}
          onError={console.error}
          styles={{
            container: {
              width: 500,
            },
            finderBorder: 0,
          }}
          components={{
            finder: false,
          }}
          constraints={{
            facingMode: {
              ideal: "user",
            },
          }}
        />
      </div>
      <div>
        <label htmlFor="token">или введите токен</label>
        <input
          type="text"
          id="token"
          autoFocus
          className="border rounded ml-1"
          onChange={onTokenInput}
        ></input>
      </div>
    </div>
  );
}

export default ChefLogin;
