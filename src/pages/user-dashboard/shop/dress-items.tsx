import Card from "../../../shared-components/card";
import { useCartStore, useShopStore } from "../../../shared-hooks/state-store";
/* ------------------------------------------------------------------ */

/**
 * Dress catalogue items
 *
 * @returns ReactElement
 */
export default function DressItems() {
  const dressItems = useShopStore((state) => state.dresses);
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="grid grid-cols-3 gap-4">
      {dressItems.map((item, idx) => (
        <Card
          key={idx}
          itemName={item.name}
          itemCost={item.cost}
          itemImage={item.image}
          addToCart={() => addToCart(item)}
          link={`/dashboard/shop/dress-items/${item.name
            .toLocaleLowerCase()
            .replaceAll(" ", "-")}`}
        />
      ))}
    </div>
  );
}
