// ------------- Billing cards ---------------
export interface BillingCard {
  id: number | string;
  cardHolder?: string;
  cardType: "mastercard" | "visa" | "other";
  cardNumber: number | string;
  expiry: string;
  cvv: number | string;
}

export const billingCards: BillingCard[] = [
  {
    id: 0,
    cardType: "mastercard",
    cardNumber: "2464",
    expiry: "09/27",
    cvv: "745",
  },
];
