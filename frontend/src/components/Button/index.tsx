import { MouseEventHandler } from "react";

interface Props {
  children: string;
  color: "primary" | "secondary" | "accent";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const colors = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-black",
  accent: "bg-accent text-white",
};
function Button({ children, onClick, color, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl bg-accent h-fit ${className ?? ""}`}
    >
      <div
        className={`p-4 rounded-xl ${colors[color]} hover:translate-(--button-offset)`}
      >
        {children}
      </div>
    </button>
  );
}

export default Button;
