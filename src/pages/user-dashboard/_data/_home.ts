import {
  rtw1,
  rtw2,
  rtw3,
  recommendedRtw1,
  recommendedRtw2,
  recommendedRtw3,
} from "../images/image-entry";

/* ------------------------------------------- */

// ---------------------Order items--------------------------------
export type OrderItem = {
  orderId: string;
  name: string;
  cost: number | string;
  status: string;
  image: string;
};

export const orderItems: OrderItem[] = [
  {
    orderId: "192353",
    name: "Araafit All Blue Jumpsuit",
    cost: 80_000.0,
    status: "Out for delivery",
    image: rtw2,
  },
  {
    orderId: "192354",
    name: "Araafit Golden Ankara",
    cost: 30_000.0,
    status: "sewing",
    image: recommendedRtw2,
  },
];

// ------------------Ready To Wear Dresses and Recommended Fabrics----------------------------
export type ReadyToWear = {
  orderId: string;
  name: string;
  cost: number | string;
  image: string;
};

export type RecommendedFabric = {
  orderId: string;
  name: string;
  cost: number | string;
  image: string;
};

export const readyToWear: ReadyToWear[] = [
  {
    orderId: "192353",
    name: "Araafit Orange & Cream Jumpsuit",
    cost: 40_000.0,
    image: rtw1,
  },
  {
    orderId: "192354",
    name: "Araafit All Blue Jumpsuit",
    cost: 80_000.0,
    image: rtw2,
  },
  {
    orderId: "192355",
    name: "Araafit Yellow & Black Jumpsuit",
    cost: 70_000.0,
    image: rtw3,
  },
  {
    orderId: "192354",
    name: "Araafit All Blue Jumpsuit",
    cost: 80_000.0,
    image: rtw2,
  },
  {
    orderId: "192355",
    name: "Araafit Yellow & Black Jumpsuit",
    cost: 70_000.0,
    image: rtw3,
  },
  {
    orderId: "192353",
    name: "Araafit Orange & Cream Jumpsuit",
    cost: 40_000.0,
    image: rtw1,
  },
];

export const recommendedFabrics: RecommendedFabric[] = [
  {
    orderId: "192356",
    name: "Araafit Golden Ankara",
    cost: 25_000.0,
    image: recommendedRtw1,
  },
  {
    orderId: "192357",
    name: "Araafit Golden Ankara",
    cost: 30_000.0,
    image: recommendedRtw2,
  },
  {
    orderId: "192358",
    name: "Araafit Red/Black Lace",
    cost: 55_000.0,
    image: recommendedRtw3,
  },
  {
    orderId: "192358",
    name: "Araafit Red/Black Lace",
    cost: 55_000.0,
    image: recommendedRtw3,
  },
  {
    orderId: "192357",
    name: "Araafit Golden Ankara",
    cost: 30_000.0,
    image: recommendedRtw2,
  },
  {
    orderId: "192356",
    name: "Araafit Golden Ankara",
    cost: 25_000.0,
    image: recommendedRtw1,
  },
];
