import { useState } from "react";
import { OrderStatusContext, type OrderItem } from "./order-table-context";


/* ------------------------------------------------------------ */

export const OrderStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedTableRow, setSelectedTableRow] = useState<{
    orders: OrderItem[];
    requests: OrderItem[];
    shouldClearSelection?: boolean;
  }>({ orders: [], requests: [], shouldClearSelection: false});

  return (
    <OrderStatusContext.Provider
      value={{ selectedTableRow, setSelectedTableRow }}
    >
      {children}
    </OrderStatusContext.Provider>
  );
};
