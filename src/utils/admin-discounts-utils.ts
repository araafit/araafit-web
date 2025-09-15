import type { ApiDiscount } from "../services/admin-discounts.service";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const mapEligibility = (e: string) => {
  switch (e) {
    case 'all_customers': return 'All Customers';
    case 'guest_customers': return 'Guest Customers';
    case 'first_time_buyers': return 'First-time buyers';
    default: return e;
  }
};

export const convertApiDiscountToTable = (d: ApiDiscount) => ({
  id: d.id,
  name: d.name,
  type: d.type === 'percentage' ? 'Percentage' : 'Flat',
  value: d.type === 'percentage' ? `${d.value}%` : formatCurrency(d.value),
  eligible: mapEligibility(d.eligibility),
  startDate: new Date(d.startDate).toLocaleString(),
  endDate: new Date(d.endDate).toLocaleString(),
  status: d.isActive ? 'Active' : 'Inactive',
});

export const convertApiDiscountsToTable = (arr: ApiDiscount[]) => arr.map(convertApiDiscountToTable);


