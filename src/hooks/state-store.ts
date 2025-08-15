import { create } from "zustand";
import {
  orderItems,
  readyToWear,
  recommendedFabrics,
  type OrderItem,
  type ReadyToWear,
  type RecommendedFabric,
} from "../pages/dashboard/_data/_home";
import { cartItems, type CartItem } from "../pages/dashboard/_data/_cart";
/* --------------------------------------- */

// ------------------- Auth ---------------------
export const useAuthStore = create((set) => ({
  user: null,
  login: (user: any) => set({ user }),
}));

// ------------------- Shop ----------------------
interface ShopState {
  readyToWearDresses: ReadyToWear[];
  recommendedFabrics: RecommendedFabric[];
  all: any[];
}
export const useShopStore = create<ShopState>(() => ({
  readyToWearDresses: readyToWear || [],
  recommendedFabrics: recommendedFabrics || [],
  all: [],
}));

// ------------------- Orders ---------------------
interface OrderState {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
}
export const useOrdersStore = create<OrderState>((set) => ({
  items: orderItems,
  addItem: (item: OrderItem) =>
    set((state: any) => ({ items: [...state.items, item] })),
}));

// ------------------- Cart ---------------------
export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (orderId: string | number) => void;
}
export const useCartStore = create<CartState>((set) => ({
  items: cartItems,
  addItem: (item: CartItem) =>
    set((state: any) => ({ items: [...state.items, item] })),
  removeItem: (orderId: string | number) =>
    set((state) => {
      const newOrders = state.items.filter((item) => item.orderId !== orderId);

      return { items: newOrders };
    }),
}));
