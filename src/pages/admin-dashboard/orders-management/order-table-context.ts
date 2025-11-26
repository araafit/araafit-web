import { createContext, useContext } from "react";

export interface OrderItem {
  orderId: string;
  dress: string;
  cost: string | number;
  status: string;
  image: string;
  size: string | number;
  PreferredStyle: string;
  YardEstimate: string | number;
  PricePerYard: string | number;
  TotalAmount: string | number;
  paymentMethod: string;
  customerMeasurements: {
    Bust: number;
    Waist: number;
    Hips: number;
    Shoulder: number;
    Height: string | number;
    SkinTone: string;
  };
  deliveryInformation: {
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  riderInformation?:
    | {
        name: string;
        phone: string;
        vehicleNumber: string;
        trackingId?: string | undefined;
      }
    | undefined;
  additionalInfo?: string | undefined;
  createdAt?: string | undefined;
  deliveryDate?: string | undefined;
}

export interface OrderStatusContextType {
  selectedTableRow: {
    orders: OrderItem[];
    requests: OrderItem[];
    shouldClearSelection?: boolean;
  };
  setSelectedTableRow: (value: {
    orders: OrderItem[];
    requests: OrderItem[];
    shouldClearSelection?: boolean;
  }) => void;
}

export const OrderStatusContext = createContext<null | OrderStatusContextType>(
  null
);

export const useOrderStatusContext = () => {
  const context = useContext(OrderStatusContext);

  if (!context) {
    throw new Error("Cant not use hook outside of <OrderStatus.Provider />");
  }

  return context;
};
