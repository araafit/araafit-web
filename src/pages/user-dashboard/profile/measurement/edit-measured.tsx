import UserDashboardLayout from "../../../../layouts/user-dashboard/dashboard-layout";
import Button from "../../../../shared-components/button";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------------------------------------- */

const measurements = {
  bust: [30, 36, 38, 40, 42, 44, 46, 48],
  wait: [26, 28, 30, 32, "33/34", "35/36", "37/38", 40],
  hip: [36, 38, 40, 42, 44, 46, 48, 50],
  height: ["4'10", "5'1", "5'3", "5'4", "5'5", "5'7", "5'9", "6'0"],
  dressSize: [6, 8, 10, 12, 14, 16, 18, 20],
  skinTone: ["#33251c", "#55322e", "#8c5a47", "#b0522d", "#c4976c", "#deb588"],
};

const measurementNames = [
  "bust",
  "wait",
  "hip (inches)",
  "height",
  "dress size",
  "skin tone",
];
const measurementValues = Object.values(measurements);

/**
 * Edit measurements
 *
 * @returns ReactElement
 */
export function DashboardEditMeasurementPage() {
  const navigate = useNavigate();

  return (
    <UserDashboardLayout>
      <div className="h-screen bg-white py-5 px-8 rounded-md flex flex-col items-center justify-center gap-6 relative">
        <Button
          type="button"
          variant="clear"
          className="absolute top-[32px] left-[200px] w-[40px] h-[40px] rounded-md border border-[#E8E8E8] flex flex-col items-center justify-center bg-white text-neutral-800"
          onClick={() => navigate("/dashboard/profile")}
        >
          <ArrowLeftIcon size={50} className=" text-neutral-800" />
        </Button>

        <div className="w-[32.5rem] flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <h5 className="text-[2rem] font-semibold">Edit Measurement</h5>
            <p className="text-neutral-500 font-light text-center">
              Edit your saved measurements to keep your fit just right.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            {measurementNames.map((name, idx) => (
              <div key={idx} className="w-full flex flex-col gap-3">
                <span className="font-medium capitalize text-[#1C1C1C]">
                  {name}:
                </span>

                <div
                  key={idx}
                  className="flex items-center justify-between gap-4"
                >
                  {idx === 5
                    ? measurementValues[idx].map((tone, idx) => (
                        <Button
                          key={idx}
                          style={{ backgroundColor: String(tone) }}
                          id={`skin-tone-${idx}`}
                          className="w-[58px] h-[44px] rounded-md border hover:border-neutral-700 focus:border-neutral-700 cursor-pointer"
                          onClick={() => console.log(tone)}
                        />
                      ))
                    : measurementValues[idx].map((item, idx) => (
                        <Button
                          key={idx}
                          type="button"
                          text={String(item)}
                          variant="outline"
                          className="w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-neutral-700 focus:border-neutral-700"
                          onClick={() => console.log(item)}
                        />
                      ))}
                </div>
              </div>
            ))}

            <Button
              text="Update"
              className="w-[175px] self-end mt-2"
              variant="solid"
            />
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
