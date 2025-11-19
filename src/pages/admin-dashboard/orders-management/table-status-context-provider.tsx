import { useState } from "react";
import { OrderStatusContext, type OrderStatus } from "./order-table-context";


/* ------------------------------------------------------------ */

export const OrderStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedTableRow, setSelectedTableRow] = useState<{
    orders: OrderStatus[];
    request: OrderStatus[];
    shouldClearSelection?: boolean;
  }>({ orders: [], request: [], shouldClearSelection: false});

  return (
    <OrderStatusContext.Provider
      value={{ selectedTableRow, setSelectedTableRow }}
    >
      {children}
    </OrderStatusContext.Provider>
  );
};
