import React from "react";
import { useShop } from "./context/shop-context";
import Card from "../../../shared-components/card";
import { useCartStore } from "../../../shared-hooks/state-store";

export default function AllItems() {
  const { allItems } = useShop();
  const addToCart = useCartStore(state => state.addItem);

  return (
    <div className="grid grid-cols-3 gap-4">
      {allItems.map((item, idx) => (
        <Card
          key={idx}
          itemName={item.name}
          itemCost={item.cost}
          itemImage={item.image}
          addToCart={() => addToCart(item)}
        />
      ))}
    </div>
  );
}
