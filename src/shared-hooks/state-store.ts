import { create } from "zustand";
import {
  orderItems,
  readyToWear,
  recommendedFabrics,
  type OrderItem,
  type ReadyToWear,
  type RecommendedFabric,
} from "../pages/user-dashboard/_data/_home";
import { type SelectedMeasurement } from "../pages/get-measured/_data/_manual-measurement";
import {
  cartItems,
  type CartItem,
  type PaymentInfo,
  type DeliveryInfo,
} from "../pages/user-dashboard/_data/_cart";
import {
  measurementInProfile,
  type MeasurementInProfile,
} from "../pages/user-dashboard/_data/_profile";
import {
  billingCards,
  type BillingCard,
} from "../pages/user-dashboard/_data/_card";

/* --------------------------------------------------------------------------------------- */

// ------------------- Auth ---------------------
export const useAuthStore = create((set) => ({
  user: null,
  login: (user: any) => set({ user }),
}));

// ------------------- Measurements ---------------------
interface MeasurementState {
  data: SelectedMeasurement;
  updateMeasurement: (name: string, value: string | number) => void;
}

const measurementStoreState = {
  bust: "36",
  waist: "33/34",
  hip: "44",
  height: "5'3",
  dressSize: "14",
  skinTone: "#deb588",
};

export const useMeasurementsStore = create<MeasurementState>((set) => ({
  data: measurementStoreState,
  updateMeasurement: (name: string, value: string | number) =>
    set((state) => ({
      data: {
        ...state.data,
        [name]: value,
      },
    })),
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
  paymentInfo?: PaymentInfo[];
  deliveryInfo?: DeliveryInfo[];
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
  increaseItemCount: (orderIdx: number) => void;
  decreaseItemCount: (orderIdx: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: cartItems,
  addItem: (item: CartItem) => {
    return set((state: any) => ({ items: [...state.items, item] }));
  },
  removeItem: (orderId: string | number) => {
    return set((state) => {
      const newOrders = state.items.filter((item) => item.orderId !== orderId);

      return { items: newOrders };
    });
  },
  increaseItemCount: (orderIdx: number) => {
    return set((state) => {
      const items = [...state.items];
      let count = Number(items[orderIdx].count);
      items[orderIdx].count = ++count;

      return {
        items,
      };
    });
  },
  decreaseItemCount: (orderIdx: number) => {
    return set((state) => {
      const items = [...state.items];
      let count = Number(items[orderIdx].count);
      items[orderIdx].count = --count;

      if (items[orderIdx].count <= 0) items[orderIdx].count = 0;

      return {
        items,
      };
    });
  },
}));

// --------- Profile ----------------

export interface ProfileState {
  myProfile: any[];
  measurement?: MeasurementInProfile;
  card?: any[];
  notification?: any[];
}

// @ts-ignore
export const useProfileState = create<ProfileState>((set) => ({
  myProfile: [],
  measurement: measurementInProfile,
  card: [],
  notification: [],
}));

// ----------- Card --------------------
export interface CardState {
  cards: BillingCard[];
  selectedCardId?: number | string;
  addCard: (card: BillingCard) => void;
  removeCard: (CardId: number | string) => void;
  selectCard: (cardId: number | string) => void;
}

export const useCardState = create<CardState>((set) => ({
  cards: billingCards,
  selectedCardId: 0,
  addCard: (card: BillingCard) =>
    set((state) => {
      const cards = [...state.cards, card];

      return { cards };
    }),
  removeCard: (cardId: number | string) =>
    set((state) => {
      const cards = state.cards.filter((card) => card.id !== cardId);

      return { cards };
    }),
  selectCard: (cardId: number | string) =>
    set(() => ({ selectedCardId: cardId })),
}));
