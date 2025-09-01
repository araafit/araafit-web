import { useState, createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { allItems as allItemsData, fabrics, dresses } from "../../_data/_shop";
import type { AllItems, Dresses, Fabrics } from "../../_data/_shop";

/* --------------------------------------------------------------------- */

interface ShopContext {
  allItems: AllItems[];
  dressItems: Dresses[];
  fabricItems: Fabrics[];
  setAllItem: Dispatch<SetStateAction<AllItems[]>>;
  setDressItems: Dispatch<SetStateAction<Dresses[]>>;
  setFabricItems: Dispatch<SetStateAction<Fabrics[]>>;
}

const ShopContext = createContext<ShopContext | null>(null);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [allItems, setAllItem] = useState(allItemsData);
  const [dressItems, setDressItems] = useState(dresses);
  const [fabricItems, setFabricItems] = useState(fabrics);

  const value = {
    allItems,
    dressItems,
    fabricItems,
    setAllItem,
    setDressItems,
    setFabricItems,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be within a ShopProvider");
  }

  return context;
};
