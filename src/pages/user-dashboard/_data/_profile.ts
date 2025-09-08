// --------------- Profile ---------------
export interface CardData {
  id: number | string;
  cardType: "Mastercard" | "Visa" | "Other";
  cardNumber: number | string;
  expiry: string;
  cvv?: number | string;
}

export interface MeasurementInProfile {
  bust: string | number;
  waist: string | number;
  hip: string | number;
  height: string | number;
  dressSize: string | number;
  skinTone: string | number;
}

export const measurementInProfile: MeasurementInProfile = {
  bust: 40,
  waist: 40,
  hip: 38,
  height: "5'4",
  dressSize: 14,
  skinTone: "caramel",
};
