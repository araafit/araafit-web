import {
  rtw1,
  rtw2,
  rtw3,
  recommendedRtw1,
  recommendedRtw2,
  recommendedRtw3,
} from "../images/image-entry";
/* ---------------------------------------------- */
interface Item {
  name: string;
  image: string;
  cost: number | string;
}
export interface Dresses extends Item {}
export interface Fabrics extends Item {}
export interface AllItems extends Item {}

export const allItems: AllItems[] = [
  { name: "Araafit Orange & Cream Jumpsuit", cost: 40_000, image: rtw1 },
  { name: "Araafit All Blue Jumpsuit", cost: 40_000, image: rtw2 },
  { name: "Araafit Yellow & Black Jumpsuit", cost: 70_000, image: rtw3 },
  { name: "Araafit Red/Black Lace", cost: 55_000, image: recommendedRtw1 },
  { name: "Araafit Golden Ankara", cost: 25_000, image: recommendedRtw3 },
  { name: "Araafit Golden Ankara", cost: 30_000, image: recommendedRtw2 },
];
export const fabrics: Fabrics[] = [
  { name: "Araafit Red/Black Lace", cost: 55_000, image: recommendedRtw1 },
  { name: "Araafit Golden Ankara", cost: 25_000, image: recommendedRtw3 },
  { name: "Araafit Golden Ankara", cost: 30_000, image: recommendedRtw2 },
];
export const dresses: Dresses[] = [
  { name: "Araafit Orange & Cream Jumpsuit", cost: 40_000, image: rtw1 },
  { name: "Araafit All Blue Jumpsuit", cost: 40_000, image: rtw2 },
  { name: "Araafit Yellow & Black Jumpsuit", cost: 70_000, image: rtw3 },
];
