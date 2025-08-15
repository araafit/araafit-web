import { CheckIcon } from "@phosphor-icons/react";

/* ----------------------------------------------------------------- */
type TrackingSteps = {
  point: string;
  dateTime?: string;
  status?: "done" | "in-progress" | "not-done";
};

const trackingSteps: TrackingSteps[] = [
  {
    point: "Awaiting approval",
    dateTime: "15 May 2025 8:30 am",
    status: "done",
  },
  {
    point: "Order approval",
    dateTime: "15 May 2025 8:32 am",
    status: "done",
  },
  {
    point: "Your order being packaged",
    dateTime: "17 May 2025 9:30 am",
    status: "done",
  },
  {
    point: "Your order is on its way",
    dateTime: "18 May 2025 9:00 am",
    status: "in-progress",
  },
  { point: "Your order has been delivered", status: "not-done" },
  { point: "Your order has been completed", status: "not-done" },
];

/**
 * Track order history
 *
 * @returns ReactElement
 */
export default function OrderHistory() {
  const notDone = `text-neutral-200 bg-gray-200 border border-gray-200`;

  return (
    <div className="flex flex-col gap-[0.35rem]">
      {trackingSteps.map((item, idx) => (
        <div key={idx} className={`flex gap-8`}>
          <div
            className={`w-[30px] flex flex-col items-center gap-1 outline-8`}
          >
            <div
              className={`size-[24px] rounded-full flex items-center justify-center ${
                item.status === "in-progress"
                  ? "border border-primary-500"
                  : item.status === "not-done"
                  ? "border border-neutral-200"
                  : "border border-[#667A91]"
              }`}
              style={{
                boxShadow:
                  item.status === "in-progress"
                    ? "0px 0px 1px 4px #9A6C501A"
                    : "",
              }}
            >
              {item.status === "done" ? (
                <CheckIcon weight="bold" className="text-[#667A91]" />
              ) : (
                <div
                  className={`size-2 ${
                    item.status === "in-progress"
                      ? "bg-primary-500 border border-primary-500"
                      : item.status === "not-done"
                      ? notDone
                      : undefined
                  } rounded`}
                />
              )}
            </div>

            <div
              className={`bg-[#667A91] w-[2px] h-[26px] rounded-full ${
                item.status === "not-done" && notDone
              }`}
            />
          </div>

          <div className="flex flex-col">
            <span
              className={`${
                item.status === "in-progress"
                  ? "text-primary-500"
                  : item.status === "not-done"
                  ? "text-neutral-200"
                  : "text-neutral-950"
              }`}
            >
              {item.point}
            </span>
            <span
              className={`font-light text-[0.875rem] ${
                item.status === "in-progress"
                  ? "text-primary-300"
                  : item.status === "not-done"
                  ? "text-neutral-200"
                  : "text-[#979797]"
              }`}
            >
              {item.dateTime}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
