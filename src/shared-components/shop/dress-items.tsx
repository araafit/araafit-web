import { useShopStore, useCartStore } from "../../shared-hooks/state-store";
import Card from "../card";
/* ------------------------------------------------------------------ */

/**
 * Dress  component to render dress shop items
 *
 * @returns ReactElement
 */
export default function DressItems({
  userPage,
}: {
  userPage: "shop" | "dashboard";
}) {
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
          link={userPage === "shop"
              ? `/${userPage}/${item.category}/${item.name.toLowerCase().replace(" ","-")}`
              : `/${userPage}/shop/${item.category}/${item.name.toLowerCase().replace(" ","-")}`}
        />
      ))}
    </div>
  );
}
