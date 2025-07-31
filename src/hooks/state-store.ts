import { create } from "zustand";

/* --------------------------------------- */

// Auth store
export const useAuthStore = create((set) => ({
  user: null,
  login: (user: any) => set({ user }),
}));

// Cart store
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item: any) =>
    set((state: any) => ({ items: [...state.items, item] })),
}));
