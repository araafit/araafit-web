import {
  rtw1,
  rtw2,
  rtw3,
  recommendedRtw1,
  recommendedRtw2,
  recommendedRtw3,
} from "../images/image-entry";

/* ------------------------------------------------- */

// ---------------------Cart items--------------------------------
export type CartItem = {
  orderId: string;
  name: string;
  cost: number | string;
  image: string;
  count: number;
};

export const cartItems: CartItem[] = [];
