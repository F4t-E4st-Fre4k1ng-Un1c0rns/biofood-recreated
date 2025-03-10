import Button from "@/components/Button";

interface Props {
  count: number;
  add: () => void;
  remove: () => void;
  className?: string;
}

export function AddToCart({ count, add, remove, className }: Props) {
  if (!count) {
    return (
      <Button onClick={add} color="primary" className={className}>
        В корзину!
      </Button>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className ?? ""}`}>
      <Button onClick={remove} color="secondary">
        -
      </Button>
      <p className="h-fit">{count}</p>
      <Button onClick={add} color="secondary">
        +
      </Button>
    </div>
  );
}
