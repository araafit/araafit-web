import { useShopStore, useCartStore } from "../../shared-hooks/state-store";
import Card from "../card";

/**
 * AllItems component to render all shop items
 *
 * @returns ReactElement
 */
export default function AllItems({
  userPage,
}: {
  userPage: "shop" | "dashboard";
}) {
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
