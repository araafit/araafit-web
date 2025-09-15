import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { useAdminRecentActivities } from "../../../../hooks/admin-dashboard.hooks";
import { formatCurrency, formatDate } from "../../../../utils/admin-dashboard-utils";
import Spinner from "../../../../shared-components/spinner";

export function OverviewTable() {
  const { data: recentActivities, isLoading, error } = useAdminRecentActivities();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="lg" speed="fast" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Failed to load recent activities. Please try again.</p>
      </div>
    );
  }

  const activities = recentActivities?.recentActivities || [];

  return (
    <div>
      {activities.length === 0 ? (
        <span className="block text-center text-[#5D5D5D]">
          No recent activity yet.
        </span>
      ) : (
        <div className="overflow-hidden border border-[#EAECF0]   bg-white shadow-[0px_2px_4px_-2px_#1018280F,0px_4px_8px_-2px_#1018281A] rounded-lg">
          <Table>
            <TableHeader className="!border-b-0">
              <TableRow className="!border-0 h-11 text-[#3D3D3D]">
                <TableHead className="text-[#3D3D3D] border-0 pl-6 !border-b-0">
                  Customer Name
                </TableHead>
                <TableHead className="text-[#3D3D3D] border-0 !border-b-0">
                  Activity Type
                </TableHead>
                <TableHead className="text-[#3D3D3D] border-0 !border-b-0">
                  Amount Spent (₦)
                </TableHead>
                <TableHead className=" text-[#3D3D3D] border-0 !border-b-0">
                  Date & Time
                </TableHead>
                <TableHead className=" text-[#3D3D3D] border-0 !border-b-0">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, idx) => (
                <TableRow
                  key={activity.id}
                  className={`border-0  h-20 text-sm font-inter text-[#4F4F4F] font-light  ${
                    idx % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"
                  }`}
                >
                  <TableCell className="pl-6">
                    {activity.customerName}
                  </TableCell>
                  <TableCell>{activity.activityType}</TableCell>
                  <TableCell>{formatCurrency(activity.amountSpent)}</TableCell>
                  <TableCell className="">{formatDate(activity.dateTime)}</TableCell>
                  <TableCell className="tt">
                    <button
                      onClick={() => window.open(activity.detailsUrl, '_blank')}
                      className="text-[#9A6C50] hover:text-[#7A5C40] transition-colors"
                    >
                      View Details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
