import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { customerActivityArray } from "../../_data/_overview";
export function CustomerActivitiesTable() {
  return (
    <div>
      {customerActivityArray.length === 0 ? (
        <span className="block text-center text-[#5D5D5D]">
          No recent activity yet.
        </span>
      ) : (
        <>
          <div className="overflow-hidden border border-[#EAECF0]   bg-white shadow-[0px_2px_4px_-2px_#1018280F,0px_4px_8px_-2px_#1018281A] rounded-lg">
            <Table>
              <TableHeader className="!border-b-0 ">
                <TableRow className="!border-0 h-11 text-[#3D3D3D]">
                  <TableHead className="text-[#3D3D3D] border-0 !border-b-0 px-6">
                    Activity Type
                  </TableHead>
                  <TableHead className="text-[#3D3D3D] border-0 !border-b-0">
                    Amount Spent (₦)
                  </TableHead>
                  <TableHead className=" text-[#3D3D3D] border-0 !border-b-0">
                    Date & Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerActivityArray.map((activity, idx) => (
                  <TableRow
                    key={idx}
                    className={`border-0  h-20 text-sm font-inter text-[#4F4F4F] font-light  ${
                      idx % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                    }`}
                  >
                    <TableCell className="px-6">{activity.activity}</TableCell>
                    <TableCell>{activity.amountSpent}</TableCell>
                    <TableCell className="">{activity.dateTime}</TableCell>
                    <TableCell className="tt">
                      <button className="text-[#9A6C50]">View Details</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
