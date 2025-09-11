import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared-components/button";
import {
  measurementsData,
  type SelectedMeasurementName,
} from "../_data/_manual-measurement";
import { useMeasurementsStore } from "../../../shared-hooks/state-store";
import showToast from "../../../utils/notification";
import Spinner from "../../../shared-components/spinner";
import { useState, useEffect } from "react";

/* ------------------------------------------------------------- */

const measurementNames = [
  "bust",
  "wait",
  "hip (inches)",
  "height",
  "dress size",
  "skin tone",
];

const measurementValues = Object.values(measurementsData);

const notificationStyle: React.CSSProperties = {
  backgroundColor: "#F6FEF9",
  border: "1px solid #16A34A",
  color: "#16A34A",
  fontSize: "14px",
};

const waterMarkStyle: React.CSSProperties = {
  backgroundImage: `url(/araafit-watermark.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  objectFit: "fill",
};

/**
 * Manual measurement
 *
 * @returns ReactElement
 */
export function ManualMeasurement() {
  const navigate = useNavigate();
  
  const selectedMeasurements = useMeasurementsStore((state) => state.data);
  const selectHandler = useMeasurementsStore(
    (state) => state.updateMeasurement
  );

  const [savedState, setSavedState] = useState({
    isLoading: false,
    isSaved: false,
  });

  const selectedMeasurementsObjKeys = Object.keys(
    selectedMeasurements
  ) as SelectedMeasurementName[];

  const measurementNotSelected = Object.values(selectedMeasurements).some(
    (value) => value.toString().trim() === ""
  );

  useEffect(() => {
    if (savedState.isSaved) {
      showToast.success("Your measurements have been saved.", {
        position: "top-right",
        style: notificationStyle,
        icon: null,
      });
    }
  }, [savedState.isSaved]);

  const saveData = async () => {
    setSavedState((state) => ({ ...state, isLoading: true }));
    await new Promise((resolve) =>
      setTimeout(() => {
        console.log("Saving data:", selectedMeasurements);
        setSavedState((state) => ({ ...state, isSaved: true }));
        //@ts-ignore
        resolve();
      }, 500)
    );
    setSavedState((state) => ({ ...state, isLoading: false }));
  };

  return (
    <section className="h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full h-[809px] bg-white flex justify-center border rounded-md p-14">
        <Button
          type="button"
          variant="clear"
          className="absolute top-[32px] left-[200px] w-[40px] h-[40px] rounded-md border border-[#E8E8E8] flex flex-col items-center justify-center bg-white text-neutral-800 cursor-pointer"
          onClick={() => navigate("/get-measured")}
        >
          <ArrowLeftIcon size={50} className="h-full text-neutral-800 block" />
        </Button>

        <div className="w-auto flex flex-col gap-4" style={waterMarkStyle}>
          <div className="flex flex-col items-center gap-4">
            <h5 className="text-[2rem] font-semibold">Manual Measurement</h5>
            <p className="text-neutral-500 font-light text-center">
              Enter your measurements to keep your fit just right.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            {measurementNames.map((name, nameIdx) => (
              <div key={nameIdx} className="w-full flex flex-col gap-3">
                <span className="font-medium capitalize text-[#1C1C1C]">
                  {name}:
                </span>

                <div className="flex items-center justify-between gap-4">
                  {nameIdx === 5
                    ? measurementValues[nameIdx].map(
                        (tone: string | number, idx: number) => (
                          <Button
                            key={idx}
                            style={{ backgroundColor: String(tone) }}
                            id={`skin-tone-${idx}`}
                            className={`w-[58px] h-[44px] rounded-md border-2 border-transparent hover:border-neutral-300 cursor-pointer ${
                              selectedMeasurements["skinTone"] === tone
                                ? "ring !ring-primary-900 border-[#E8E8E8]"
                                : ""
                            }`}
                            onClick={() =>
                              selectHandler(
                                selectedMeasurementsObjKeys[nameIdx],
                                tone
                              )
                            }
                          />
                        )
                      )
                    : measurementValues[nameIdx].map(
                        (item: string | number, idx: number) => (
                          <Button
                            key={idx}
                            type="button"
                            text={String(item)}
                            variant="outline"
                            className={`w-[58px] h-[44px] text-[0.875rem] border-[#E8E8E8] flex items-center justify-center text-neutral-800 hover:border-primary-500 ${
                              selectedMeasurements[
                                selectedMeasurementsObjKeys[nameIdx]
                              ] === item
                                ? "!border-primary-500 bg-primary-50"
                                : ""
                            }`}
                            onClick={() =>
                              selectHandler(
                                selectedMeasurementsObjKeys[nameIdx],
                                item
                              )
                            }
                          />
                        )
                      )}
                </div>
              </div>
            ))}

            <Button
              variant="solid"
              onClick={saveData}
              disabled={measurementNotSelected}
              className="w-[175px] self-end mt-2 disabled:bg-neutral-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-1">
                <span>Save</span>
                <Spinner
                  isLoading={savedState.isLoading}
                  size="sm"
                  speed="fast"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
