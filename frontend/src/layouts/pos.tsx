import { Outlet } from "react-router";

function PosLayout() {
  document
    .querySelector("meta[name=viewport]")
    ?.setAttribute(
      "view",
      "width=device-width, initial-scale=1, user-scalable=0"
    );
  return (
    <>
      <div className="select-none">
        <Outlet />
      </div>
    </>
  );
}

export default PosLayout;
