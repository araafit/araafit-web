import {
  rtw1,
  rtw2,
  // rtw3,
  // recommendedRtw1,
  recommendedRtw2,
  // recommendedRtw3,
} from "../images/image-entry";

/* ------------------------------------------------- */

// ---------------------Cart items--------------------------------
export type CartItem = {
  orderId: string;
  name: string;
  description: string;
  cost: number | string;
  image: string;
  count: number;
};

export const cartItems: CartItem[] = [
  {
    orderId: "192353",
    name: "Araafit Orange & Cream Jumpsuit",
    description:
      "This all blue jumpsuit is perfect for making a statement, brunches.",
    cost: 40_000.0,
    image: rtw2,
    count: 1,
  },
  {
    orderId: "192354",
    name: "Araafit Golden Ankara",
    description:
      "This all handmade fabric is perfect for making a statement, brunches.",
    cost: 80_000.0,
    image: recommendedRtw2,
    count: 2,
  },
  {
    orderId: "192355",
    name: "Araafit Yellow & Black Jumpsuit",
    description:
      "This all handmade fabric is perfect for making a statement, brunches.",
    cost: 70_000.0,
    image: rtw1,
    count: 3,
  },
];
