import { useShopStore } from "../../../shared-hooks/state-store";
import Card from "../../../shared-components/card";
import { useCartStore } from "../../../shared-hooks/state-store";

export default function AllItems() {
  const allItems = useShopStore((state) => state.all);
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="grid grid-cols-3 gap-4">
      {allItems.map((item, idx) => (
        <Card
          key={idx}
          itemName={item.name}
          itemCost={item.cost}
          itemImage={item.image}
          addToCart={() => addToCart(item)}
          link={`/dashboard/shop/${item.category}/${item.name
            .toLocaleLowerCase()
            .replaceAll(" ", "-")}`}
        />
      ))}
    </div>
  );
}
