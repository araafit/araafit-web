import { useShop } from "./context/shop-context";
import Card from "../../../shared-components/card";
import { useCartStore } from "../../../shared-hooks/state-store";
/* ------------------------------------------------------------------ */

/**
 * Fabric catalogue items
 *
 * @returns ReactElement
 */
export default function FabricItems() {
  const { fabricItems } = useShop();
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="grid grid-cols-3 gap-4">
      {fabricItems.map((item, idx) => (
        <Card
          key={idx}
          itemName={item.name}
          itemCost={item.cost}
          itemImage={item.image}
          addToCart={() => addToCart(item)}
          link={`/dashboard/shop/fabric-items/${item.name
            .toLocaleLowerCase()
            .replaceAll(" ", "-")}`}
        />
      ))}
    </div>
  );
}
