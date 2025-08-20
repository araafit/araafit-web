import { create } from "zustand";
import {
  orderItems,
  readyToWear,
  recommendedFabrics,
  type OrderItem,
  type ReadyToWear,
  type RecommendedFabric,
} from "../pages/dashboard/_data/_home";
import {
  cartItems,
  paymentInfo,
  deliveryInfo,
  type CartItem,
  type PaymentInfo,
  type DeliveryInfo,
} from "../pages/dashboard/_data/_cart";
import {
  measurementData,
  type MeasurementData,
} from "../pages/dashboard/_data/_profile";
import { billingCards, type BillingCard } from "../pages/dashboard/_data/_card";

/* --------------------------------------------------------------------------------------- */

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
  paymentInfo?: PaymentInfo[];
  deliveryInfo?: DeliveryInfo[];
  addItem: (item: CartItem) => void;
  removeItem: (orderId: string | number) => void;
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
}));

// --------- Profile ----------------

export interface ProfileState {
  myProfile: any[];
  measurement?: MeasurementData;
  card?: any[];
  notification?: any[];
}

export const useProfileState = create<ProfileState>((set) => ({
  myProfile: [],
  measurement: measurementData,
  card: [],
  notification: [],
}));

// ----------- Card --------------------
export interface CardState {
  cards: BillingCard[];
  selectedCard: number;
  addCard?: (card: BillingCard) => void;
  removeCard?: (CardId: number) => void;
  selectCard?: (cardId: number) => void;
}

export const useCardState = create<CardState>((set) => ({
  cards: billingCards,
  selectedCard: 0,
  addCard: (card: BillingCard) =>
    set((state) => {
      const cards = [...state.cards, card];

      return { cards };
    }),
  removeCard: (cardId: number) =>
    set((state) => {
      const cards = state.cards.filter((card) => card.id !== cardId);

      return { cards };
    }),
  selectCard: (cardId: number) => set(() => ({ selectedCard: cardId })),
}));
