import React from "react";
import Button from "../../../../shared-components/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import araafitWatermark from "./araafit-watermark.png";
import { useNavigate } from "react-router-dom";
import { useMeasurements } from "../../../../hooks/measurements.hooks";
import Spinner from "../../../../shared-components/spinner";
import type { MeasurementMe } from "../../../../services/measurements.service";
import { NewMeasurementSetDrawer } from "./new-measurement-set.drawer";
import { EditMeasurementSetDrawer } from "./edit-measurement-set.drawer";
/* -------------------------------------------------------------- */

const waterMarkStyle: React.CSSProperties = {
  backgroundImage: `url(${araafitWatermark})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  objectFit: "fill",
};

const MANUAL_SKIN_TONES: Record<string, string> = {
  deep: "#33251c",
  dark: "#55322e",
  medium: "#8c5a47",
  tan: "#b0522d",
  light: "#c4976c",
  fair: "#deb588",
} as const;

/**
 * All measurement
 *
 * @returns ReactElement
 */
export default function Measurements() {
  const navigate = useNavigate();
  const { data: measurementsData, isLoading, error } = useMeasurements();

  const me: MeasurementMe | undefined = measurementsData;
  const base = me?.measurements || {};
  const sets = React.useMemo(
    () => me?.measurementSets || [],
    [me]
  );

  const [selectedSetId, setSelectedSetId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedSetId && sets.length > 0) {
      setSelectedSetId(sets[0].id);
    }
  }, [sets, selectedSetId]);

  if (isLoading) {
    return (
      <div className="w-full bg-white py-5 px-8 rounded-md flex flex-col items-center gap-6">
        <div className="flex items-center justify-center py-20">
          <Spinner
            isLoading={isLoading}
            size="md"
            speed="fast"
            arcColor="#9a6c50"
          />
        </div>
      </div>
    );
  }

  if (error || !measurementsData) {
    return (
      <div className="w-full bg-white py-5 px-8 rounded-md flex flex-col items-center gap-6">
        <div className="text-center py-20">
          <h5 className="text-[2rem] font-semibold mb-4">
            No Measurements Found
          </h5>
          <p className="text-neutral-500 font-light mb-6">
            Get started by taking your measurements for a perfect fit.
          </p>
          <Button
            text="Take Measurements"
            variant="solid"
            onClick={() => navigate("/get-measured")}
          />
        </div>
      </div>
    );
  }

  const selectedSet =
    sets.find((set) => set.id === selectedSetId) || sets[0] || null;

  const hasCompleteMeasurements =
    !!base.bust &&
    !!base.waist &&
    !!base.hips &&
    !!base.height &&
    !!base.dressSize &&
    !!base.skinTone;

  // Format height from inches to feet and inches using the aggregated measurements
  const feet = base.height ? Math.floor(base.height / 12) : 0;
  const inches = base.height ? base.height % 12 : 0;
  const formattedHeight = `${feet}'${inches}`;

  return (
    <div className="w-full bg-white py-6 px-6 lg:px-10 rounded-md flex flex-col items-center lg:items-start gap-6">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center lg:items-start gap-2 lg:gap-3 mb-6">
          <h5 className="text-[1.75rem] lg:text-[2rem] font-semibold">
            Measurement Summary
          </h5>
          {hasCompleteMeasurements ? (
            <div className="w-full max-w-[30.125rem] flex justify-end bg-[#F6FEF9] text-[#15803c] text-[14px] border border-[#15803C] p-2 rounded-md mb-3">
              <p>
                We've successfully capture your measurement and detected your
                skin tone.
              </p>
            </div>
          ) : null}
        </div>

        {/* Aggregated (current) measurements summary */}
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="flex items justify-between">
            <span className="font-medium text-[18px] text-neutral-950">
              Current Measurements
            </span>

            <NewMeasurementSetDrawer
              trigger={
                <div className="flex items-center gap-2 font-light cursor-pointer">
                  <PencilSimpleIcon />
                  <span>Edit / Add set</span>
                </div>
              }
            />
          </div>

          <div className="w-full flex flex-col gap-6" style={waterMarkStyle}>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Bust</span>
              <span className="font-semibold text-neutral-950">
                {base.bust ?? "--"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Waist</span>
              <span className="font-semibold text-neutral-950">
                {base.waist ?? "--"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Hips</span>
              <span className="font-semibold text-neutral-950">
                {base.hips ?? "--"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Height</span>
              <span className="font-semibold text-neutral-950">
                {base.height ? formattedHeight : "--"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Dress size</span>
              <span className="font-semibold text-neutral-950">
                {base.dressSize ?? "--"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Skin Tone</span>
              <span
                className="font-semibold text-neutral-950 capitalize size-[44px] rounded-md"
                style={{
                  backgroundColor:
                    MANUAL_SKIN_TONES[base.skinTone || "deep"] || "#33251c",
                }}
              />
            </div>
          </div>
        </div>

        {/* Measurement sets list + selected set details */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[18px] text-neutral-950">
              Measurement Sets
            </span>
            <NewMeasurementSetDrawer
              trigger={
                <Button
                  text="Add new set"
                  variant="outline"
                  className="text-sm"
                />
              }
            />
          </div>

          {sets.length === 0 ? (
            <p className="text-sm text-neutral-500">
              You don&apos;t have any saved measurement sets yet. Create one by
              taking your measurements.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Selected set details - LEFT on desktop */}
              <div className="lg:col-span-2 border border-neutral-100 rounded-md p-4 flex flex-col gap-4">
                {!selectedSet ? (
                  <p className="text-sm text-neutral-500">
                    Select a measurement set to view its details.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h6 className="font-semibold text-neutral-900">
                          {selectedSet.name || "Unnamed set"}
                        </h6>
                        <p className="text-xs text-neutral-500">
                          {selectedSet.gender?.toLowerCase() === "male"
                            ? "Male"
                            : "Female"}{" "}
                          • Updated{" "}
                          {new Date(selectedSet.updatedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <EditMeasurementSetDrawer
                        measurementSet={selectedSet}
                        trigger={
                          <Button
                            text="Edit set"
                            variant="outline"
                            className="text-xs h-8 px-3"
                          />
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                        <span className="text-neutral-700">Chest / Bust</span>
                        <span className="font-semibold text-neutral-950">
                          {selectedSet.chest ?? "--"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                        <span className="text-neutral-700">Waist</span>
                        <span className="font-semibold text-neutral-950">
                          {selectedSet.waist ?? "--"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                        <span className="text-neutral-700">Hips</span>
                        <span className="font-semibold text-neutral-950">
                          {selectedSet.hips ?? "--"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                        <span className="text-neutral-700">Height</span>
                        <span className="font-semibold text-neutral-950">
                          {selectedSet.height ?? "--"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                        <span className="text-neutral-700">Shoulder</span>
                        <span className="font-semibold text-neutral-950">
                          {selectedSet.shoulder ?? "--"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                        <span className="text-neutral-700">Neck</span>
                        <span className="font-semibold text-neutral-950">
                          {selectedSet.neck ?? "--"}
                        </span>
                      </div>
                    </div>

                    {selectedSet.sizeAssignments &&
                      selectedSet.sizeAssignments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-neutral-700 mb-1">
                            Size assignments
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSet.sizeAssignments.map((assignment) => (
                              <span
                                key={assignment.id}
                                className="inline-flex items-center rounded-full border border-neutral-200 px-2 py-1 text-[11px] text-neutral-700 bg-neutral-50"
                              >
                                {assignment.chartName}: {assignment.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>

              {/* Sets list - RIGHT on desktop (vertical tabs) */}
              <div className="space-y-2 lg:pl-2 lg:border-l lg:border-neutral-100">
                {sets.map((set) => (
                  <button
                    key={set.id}
                    type="button"
                    onClick={() => setSelectedSetId(set.id)}
                    className={`w-full text-left border rounded-md px-3 py-2 text-sm flex flex-col gap-1 ${
                      selectedSet && selectedSet.id === set.id
                        ? "border-primary-900 bg-primary-50"
                        : "border-[#E8E8E8] hover:border-neutral-400"
                    }`}
                  >
                    <span className="font-medium text-neutral-900">
                      {set.name || "Unnamed set"}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {set.gender?.toLowerCase() === "male" ? "Male" : "Female"}
                      {" • "}
                      Updated{" "}
                      {new Date(set.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {set.assignedSize && (
                      <span className="text-xs text-neutral-600">
                        Primary size: {set.assignedSize.label} (
                        {set.assignedSize.chartName})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
