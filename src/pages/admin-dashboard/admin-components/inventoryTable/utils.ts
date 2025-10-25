import type z from "zod";
import type { inventoryItemSchema } from "./schema";
import type { FilterFn } from "@tanstack/react-table";
import * as XLSX from "xlsx";

/* --------------------------------------------------------------- */

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const equalsIgnoreCase: FilterFn<InventoryItem> = (
  row,
  columnId,
  filterValue
) => {
  const v = String(row.getValue<string>(columnId) ?? "");
  const f = String(filterValue ?? "");
  return v.localeCompare(f, undefined, { sensitivity: "accent" }) === 0;
};

// -------------------- Export to Excel --------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToExcel(table: Record<string, any>) {
  const worksheet = XLSX.utils.json_to_sheet(
    table.getFilteredRowModel().rows.map((r) => r.original)
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  XLSX.writeFile(workbook, "orders.xlsx");
}
