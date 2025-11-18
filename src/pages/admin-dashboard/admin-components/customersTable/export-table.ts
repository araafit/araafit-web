import * as XLSX from "xlsx";

// -------------------- Export to Excel --------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToExcel(table: any) {
  const worksheet = XLSX.utils.json_to_sheet(
    table.getFilteredRowModel().rows.map((r) => r.original)
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  XLSX.writeFile(workbook, "orders.xlsx");
}
