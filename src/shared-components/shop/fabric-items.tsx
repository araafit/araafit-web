import { useShopStore, useCartStore } from "../../shared-hooks/state-store";
import Card from "../card";
/* ------------------------------------------------------------------ */

/**
 * Fabric  component to render fabric shop items
 *
 * @returns ReactElement
 */
export default function FabricItems({
  userPage,
}: {
  userPage: "shop" | "dashboard";
}) {
  const fabricItems = useShopStore((state) => state.fabrics);
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
          link={
            userPage === "shop"
              ? `/${userPage}/${item.category}/${item.name
                  .toLowerCase()
                  .replace(" ", "-")}`
              : `/${userPage}/shop/${item.category}/${item.name
                  .toLowerCase()
                  .replace(" ", "-")}`
          }
        />
      ))}
    </div>
  );
}
