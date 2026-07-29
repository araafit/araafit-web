import {
  MoneyIcon,
  UserIcon,
  DressIcon,
  ShoppingBagIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { rtw1, rtw2, rtw3 } from "../../user-dashboard/images/image-entry";
import { schema } from "../admin-components/overViewTable/schema/schema";
import { z } from "zod";
import { inventoryItemSchema } from "../admin-components/inventoryTable/schema";

// ---------------------Overview Cards items--------------------------------
export type OverviewFigures = {
  title: string;
  figures: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: ComponentType<any>;
};

export const OverviewCards: OverviewFigures[] = [
  {
    title: "Revenue",
    figures: "1,500,000",
    icon: MoneyIcon,
  },
  {
    title: "Total Customers",
    figures: "200,000",
    icon: UserIcon,
  },
  {
    title: "Total Orders",
    figures: "300,000",
    icon: DressIcon,
  },
];
export const OverviewCards2: OverviewFigures[] = [
  {
    title: "Revenue",
    figures: "1,500,000",
    icon: MoneyIcon,
  },
  {
    title: "Total Orders",
    figures: "0",
    icon: DressIcon,
  },
  {
    title: "Total Requests",
    figures: "0",
    icon: ShoppingBagIcon,
  },
];
export const OverviewCards3: OverviewFigures[] = [
  {
    title: "Total Customers",
    figures: "3,000",
    icon: UserIcon,
  },
  {
    title: "New Customers",
    figures: "30",
    icon: DressIcon,
  },
  {
    title: "Total Amount Spent",
    figures: "1,500,000",
    icon: ShoppingBagIcon,
  },
];
export const OverviewCards4: OverviewFigures[] = [
  {
    title: "Amount Spent",
    figures: "1,500,000",
    icon: ShoppingBagIcon,
  },
  {
    title: "Total Orders",
    figures: "3,000",
    icon: UserIcon,
  },
  {
    title: "Total Requests",
    figures: "30",
    icon: DressIcon,
  },
];

// ---------------------Order items--------------------------------
export type OrderItem = {
  orderId: string;
  dress: string;
  cost: number | string;
  status: string;
  image: string;

  size: number | string;
  PreferredStyle: string;
  YardEstimate: string | number;
  PricePerYard: number | string;
  TotalAmount: number | string;
  paymentMethod: string;

  customerMeasurements: {
    Bust: number;
    Waist: number;
    Hips: number;
    Shoulder: number;
    Height: number | string;
    SkinTone: string;
  };

  deliveryInformation: {
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };

  riderInformation?: {
    name?: string;
    phone?: string;
    vehicleNumber?: string;
    trackingId?: string;
  };

  additionalInfo?: string;
};
export type Order = z.infer<typeof schema>;

export const orderItems: Order[] = [
  {
    orderId: "192353",
    dress: "Araafit All Blue Jumpsuit",
    cost: 80_000.0,
    status: "Pending",
    image: rtw2,
    size: 12,
    PreferredStyle: "Off Shoulder",
    YardEstimate: "4 yards",
    PricePerYard: 35_000.0,
    TotalAmount: 140_000.0,
    paymentMethod: "Card",
    customerMeasurements: {
      Bust: 34,
      Waist: 28,
      Hips: 40,
      Shoulder: 15,
      Height: "5'5",
      SkinTone: "Caramel",
    },
    deliveryInformation: {
      name: "Desmond Tutu",
      email: "desmiebaby01@gmail.com",
      address: "15, Freedom way, Lekki Phase 1, Lagos",
      city: "Lekki Phase 1",
      phone: "09011890763",
    },
    additionalInfo: "Please make it a bit longer",
  },
  {
    orderId: "192354",
    dress: "Araafit Golden Ankara",
    cost: 30_000.0,
    status: "Packaging",
    image: rtw3,
    size: 10,
    PreferredStyle: "Halter Neck",
    YardEstimate: "3 yards",
    PricePerYard: 25_000.0,
    TotalAmount: 75_000.0,
    paymentMethod: "Cash on Delivery",
    customerMeasurements: {
      Bust: 32,
      Waist: 26,
      Hips: 36,
      Shoulder: 14,
      Height: "5'4",
      SkinTone: "Light",
    },
    deliveryInformation: {
      name: "Jane Doe",
      email: "Janedoe@gmail.com",
      address: "23, Allen Avenue, Ikeja, Lagos",
      city: "Ikeja",
      phone: "08123456789",
    },
    additionalInfo: "Please add a bit allowance for fitting",
  },
  {
    orderId: "192355",
    dress: "Araafit Red Gown",
    cost: 150_000.0,
    status: "Approved",
    image: rtw1,
    size: 14,
    PreferredStyle: "V-Neck",
    YardEstimate: "5 yards",
    PricePerYard: 40_000.0,
    TotalAmount: 200_000.0,
    paymentMethod: "Card",
    customerMeasurements: {
      Bust: 36,
      Waist: 30,
      Hips: 42,
      Shoulder: 16,
      Height: "5'6",
      SkinTone: "Dark",
    },
    deliveryInformation: {
      name: "John Smith",
      email: "johnsmith@gmail.com",
      address: "45, Victoria Island, Lagos",
      city: "Victoria Island",
      phone: "08098765432",
    },
    additionalInfo: "I would like to have a matching headgear",
  },
  {
    orderId: "192356",
    dress: "Araafit Yellow & Black Jumpsuit",
    cost: 70_000.0,
    status: "Out for Delivery",
    image: rtw2,
    size: 12,
    PreferredStyle: "Off Shoulder",
    YardEstimate: "4 yards",
    PricePerYard: 35_000.0,
    TotalAmount: 140_000.0,
    paymentMethod: "Card",
    customerMeasurements: {
      Bust: 34,
      Waist: 28,
      Hips: 40,
      Shoulder: 15,
      Height: "5'5",
      SkinTone: "Caramel",
    },
    deliveryInformation: {
      name: "Desmond Tutu",
      email: "desmondTutu@gmail.com",
      address: "15, Freedom way, Lekki Phase 1, Lagos",
      city: "Lekki Phase 1",
      phone: "09011890763",
    },
    additionalInfo: "Please make the sleeve tighter",
  },
  {
    orderId: "192357",
    dress: "Araafit All Blue Jumpsuit",
    cost: 80_000.0,
    status: "Delivered",
    image: rtw3,
    size: 10,
    PreferredStyle: "Halter Neck",
    YardEstimate: "3 yards",
    PricePerYard: 25_000.0,
    TotalAmount: 75_000.0,
    paymentMethod: "Cash on Delivery",
    customerMeasurements: {
      Bust: 32,
      Waist: 26,
      Hips: 36,
      Shoulder: 14,
      Height: "5'4",
      SkinTone: "Light",
    },
    deliveryInformation: {
      name: "Jane Doe",
      email: "eliDoe@gmail.com",
      address: "23, Allen Avenue, Ikeja, Lagos",
      city: "Ikeja",
      phone: "08123456789",
    },
    additionalInfo: "Please make the waistline a bit snug",
  },
  {
    orderId: "192358",
    dress: "Araafit Golden Ankara",
    cost: 30_000.0,
    status: "complete",
    image: rtw1,
    size: 14,
    PreferredStyle: "V-Neck",
    YardEstimate: "5 yards",
    PricePerYard: 40_000.0,
    TotalAmount: 200_000.0,
    paymentMethod: "Card",
    customerMeasurements: {
      Bust: 36,
      Waist: 30,
      Hips: 42,
      Shoulder: 16,
      Height: "5'6",
      SkinTone: "Dark",
    },
    deliveryInformation: {
      name: "John Smith",
      email: "smithJohn@yahoo.com",
      address: "45, Victoria Island, Lagos",
      city: "Victoria Island",
      phone: "08098765432",
    },
  },
  {
    orderId: "192359",
    dress: "Araafit Red Gown",
    cost: 150_000.0,
    status: "cancelled",
    image: rtw2,
    size: 12,
    PreferredStyle: "Off Shoulder",
    YardEstimate: "4 yards",
    PricePerYard: 35_000.0,
    TotalAmount: 140_000.0,
    paymentMethod: "Card",
    customerMeasurements: {
      Bust: 34,
      Waist: 28,
      Hips: 40,
      Shoulder: 15,
      Height: "5'5",
      SkinTone: "Caramel",
    },
    deliveryInformation: {
      name: "Desmond Tutu",
      email: "tuts@yahoo.com",
      address: "15, Freedom way, Lekki Phase 1, Lagos",
      city: "Lekki Phase 1",
      phone: "09011890763",
    },
  },
];
// ---------------------Customers Activity--------------------------------
type CustomerActivity = {
  customerName: string;
  activity: string;
  status: string;
  amountSpent: number;
  dateTime: string; // ISO string or readable format
};
export const customerActivityArray: CustomerActivity[] = [
  {
    customerName: "Faith Tobi",
    activity: "Purchased subscription",
    amountSpent: 25000,
    dateTime: "15 May 2025 6:00 PM",
    status: "Pending",
  },
  {
    customerName: "John Doe",
    activity: "Upgraded plan",
    amountSpent: 15000,
    dateTime: "16 May 2025 10:30 AM",
    status: "Pending",
  },
  {
    customerName: "Sarah James",
    activity: "One-time purchase",
    amountSpent: 8000,
    dateTime: "17 May 2025 2:15 PM",
    status: "Pending",
  },

  {
    customerName: "Michael Lee",
    activity: "Renewed subscription",
    amountSpent: 25000,
    dateTime: "18 May 2025 9:45 AM",
    status: "Pending",
  },
];
// ---------------------Order Statuses--------------------------------

export const orderStatuses = [
  {
    status: "pending",
    label: "Pending",
    textColor: "text-[#F59E0B]",
    bgColor: "bg-[#FEF3C7]",
  },
  {
    status: "approved",
    label: "Approved",
    textColor: "text-[#16A34A]",
    bgColor: "bg-[#DCFCE7]",
  },
  {
    status: "packaging",
    label: "Packaging",
    textColor: "text-[#0EA5E9]",
    bgColor: "bg-[#E0F2FE]",
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    textColor: "text-[#2563EB]",
    bgColor: "bg-[#EFF4FF]",
  },
  {
    status: "delivered",
    label: "Delivered",
    textColor: "text-[#059669]",
    bgColor: "bg-[#ECFDF8]",
  },
  {
    status: "complete",
    label: "Complete",
    textColor: "text-[#475569]",
    bgColor: "bg-[#F1F5F9]",
  },
  {
    status: "cancelled",
    label: "Cancelled",
    textColor: "text-[#DC2626]",
    bgColor: "bg-[#FEE2E2]",
  },
];
export const sewingRequestStatuses = [
  {
    status: "pending",
    label: "Pending",
    textColor: "text-[#F59E0B]",
    bgColor: "bg-[#FEF3C7]",
  },
  {
    status: "approved",
    label: "Approved",
    textColor: "text-[#16A34A]",
    bgColor: "bg-[#DCFCE7]",
  },
  {
    status: "sewing",
    label: "Sewing",
    textColor: "text-[#0EA5E9]",
    bgColor: "bg-[#E0F2FE]",
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    textColor: "text-[#2563EB]",
    bgColor: "bg-[#EFF4FF]",
  },
  {
    status: "delivered",
    label: "Delivered",
    textColor: "text-[#059669]",
    bgColor: "bg-[#ECFDF8]",
  },
  {
    status: "complete",
    label: "Complete",
    textColor: "text-[#475569]",
    bgColor: "bg-[#F1F5F9]",
  },
  {
    status: "cancelled",
    label: "Cancelled",
    textColor: "text-[#DC2626]",
    bgColor: "bg-[#FEE2E2]",
  },
];
// ---------------------Invententory--------------------------------
export type Inventory = z.infer<typeof inventoryItemSchema>;
export const InventoryItems: Inventory[] = [
  {
    orderId: "192353",
    Price: 35_000.0,
    DiscountsType: "Percentage",
    DiscountValue: 10,
    stock: 70,
    status: "In Stock",
    startDate: "",
    endDate: "",
    generalInformation: {
      name: "Araafit Orange Cream Dress",
      image: rtw1,
      category: "dress",
      ProductDescription:
        "Designed for both elegance and ease, it blends vibrant orange tones with soft cream accents for a standout look.",
    },
    dressInformation: {
      materialType: "Polyester",
      dressSize: 14,
      weight: 170,
      thickness: "0.5",
    },
    skinTone: ["Deep Ebony", "Caramel", "Mocha"],
    quantity: 55,
  },
  {
    orderId: "192354",
    Price: 50_000.0,
    DiscountsType: "Percentage",
    DiscountValue: 10,
    stock: 88,
    status: "In Stock",
    startDate: "",
    endDate: "",
    generalInformation: {
      name: "Araafit Golden Ankara",
      image: rtw2,
      category: "fabric",
      ProductDescription:
        "Classic Ankara fabric with golden patterns, versatile for creating custom styles.",
    },
    fabricInformation: {
      materialType: "Ankara",
      patternType: "Floral",
      style: "Traditional",
      totalSize: 100,
      weight: 200,
      thickness: "0.7",
    },
    skinTone: ["Deep Ebony", "Caramel"],
    quantity: 40,
  },
  {
    orderId: "192355",
    Price: 65_000.0,
    DiscountsType: "Flat",
    DiscountValue: 5000,
    stock: 67,
    status: "In Stock",
    startDate: "",
    endDate: "",
    generalInformation: {
      name: "Araafit Royal Blue Gown",
      image: rtw3,
      category: "dress",
      ProductDescription:
        "A royal blue flowing gown designed for evening elegance with intricate lace details.",
    },
    dressInformation: {
      materialType: "Silk",
      dressSize: 12,
      weight: 160,
      thickness: "0.6",
    },
    skinTone: ["Caramel", "Mocha", "Olive"],
    quantity: 25,
  },
  {
    orderId: "192356",
    Price: 28_000.0,
    DiscountsType: "Percentage",
    DiscountValue: 15,
    stock: 0,
    status: "Out of Stock",
    startDate: "",
    endDate: "",
    generalInformation: {
      name: "Araafit Plain Cotton Ankara",
      image: rtw1,
      category: "fabric",
      ProductDescription:
        "Soft cotton Ankara fabric suitable for everyday wear and custom tailoring.",
    },
    fabricInformation: {
      materialType: "Cotton",
      patternType: "Plain",
      style: "Modern",
      totalSize: 80,
      weight: 150,
      thickness: "0.4",
    },
    skinTone: ["Ivory", "Olive"],
    quantity: 60,
  },
  {
    orderId: "192357",
    Price: 42_000.0,
    DiscountsType: "Percentage",
    DiscountValue: 20,
    stock: 80,
    status: "In Stock",
    startDate: "",
    endDate: "",
    generalInformation: {
      name: "Araafit Burgundy Jumpsuit",
      image: rtw3,
      category: "dress",
      ProductDescription:
        "A bold burgundy jumpsuit with a flattering fit, perfect for modern, confident women.",
    },
    dressInformation: {
      materialType: "Crepe",
      dressSize: 10,
      weight: 180,
      thickness: "0.55",
    },
    skinTone: ["Mocha", "Ivory"],
    quantity: 30,
  },
];
