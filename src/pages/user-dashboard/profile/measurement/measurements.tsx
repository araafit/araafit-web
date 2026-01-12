import React from "react";
import Button from "../../../../shared-components/button";
import { CheckCircleIcon } from "@phosphor-icons/react";
import araafitWatermark from "./araafit-watermark.png";
import { useNavigate } from "react-router-dom";
import { useMeasurements } from "../../../../hooks/measurements.hooks";
import Spinner from "../../../../shared-components/spinner";
import type { MeasurementMe, MeasurementSet } from "../../../../services/measurements.service";
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

  // Format height helper
  const formatHeight = (heightInches: number | null | undefined): string => {
    if (!heightInches) return "--";
    const feet = Math.floor(heightInches / 12);
    const inches = heightInches % 12;
    return `${feet}'${inches}"`;
  };

  // Get skintone from measurement set (if available) or base measurements
  const getSetSkinTone = (set: MeasurementSet): string | null => {
    return (set as any).skinTone || base.skinTone || null;
  };

  return (
    <div className="w-full bg-white py-6 px-6 lg:px-10 rounded-md">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h5 className="text-[1.75rem] lg:text-[2rem] font-semibold">
            Measurement Sets
          </h5>
          <NewMeasurementSetDrawer
            trigger={
              <Button
                text="Add new set"
                variant="solid"
                className="text-sm bg-[#9A6C50] text-white hover:bg-[#7B523F]"
              />
            }
          />
        </div>

        {sets.length === 0 ? (
          <div className="text-center py-12 border border-neutral-200 rounded-lg">
            <p className="text-sm text-neutral-500 mb-4">
              You don&apos;t have any saved measurement sets yet.
            </p>
            <NewMeasurementSetDrawer
              trigger={
                <Button
                  text="Create your first set"
                  variant="solid"
                  className="bg-[#9A6C50] text-white hover:bg-[#7B523F]"
                />
              }
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Vertical Tabs List */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="space-y-2">
                {sets.map((set) => {
                  const isSelected = selectedSet?.id === set.id;
                  
                  return (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() => setSelectedSetId(set.id)}
                      className={`w-full text-left border-2 rounded-lg px-4 py-3 transition-all ${
                        isSelected
                          ? "border-[#9A6C50] bg-[#9A6C50]/10 shadow-sm"
                          : "border-neutral-200 hover:border-[#9A6C50]/50 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${
                          isSelected ? "text-[#9A6C50]" : "text-neutral-900"
                        }`}>
                          {set.name || "Unnamed set"}
                        </span>
                        {isSelected && (
                          <CheckCircleIcon
                            size={16}
                            weight="fill"
                            className="text-[#9A6C50]"
                          />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">
                        {set.gender?.toLowerCase() === "male" ? "Male" : "Female"}
                        {" • "}
                        {new Date(set.updatedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Set Details */}
            <div className="flex-1">
              {selectedSet ? (
                <div
                  className="border border-neutral-200 rounded-lg p-6"
                  style={waterMarkStyle}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h6 className="font-semibold text-xl text-neutral-900 mb-1">
                        {selectedSet.name || "Unnamed set"}
                      </h6>
                      <p className="text-sm text-neutral-500">
                        {selectedSet.gender?.toLowerCase() === "male"
                          ? "Male"
                          : "Female"}{" "}
                        • Updated{" "}
                        {new Date(selectedSet.updatedAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
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
                          className="text-sm h-9 px-4"
                        />
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-neutral-600">Chest / Bust</span>
                      <span className="font-semibold text-neutral-950 text-lg">
                        {selectedSet.chest ?? "--"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-neutral-600">Waist</span>
                      <span className="font-semibold text-neutral-950 text-lg">
                        {selectedSet.waist ?? "--"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-neutral-600">Hips</span>
                      <span className="font-semibold text-neutral-950 text-lg">
                        {selectedSet.hips ?? "--"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-neutral-600">Height</span>
                      <span className="font-semibold text-neutral-950 text-lg">
                        {formatHeight(selectedSet.height)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-neutral-600">Shoulder</span>
                      <span className="font-semibold text-neutral-950 text-lg">
                        {selectedSet.shoulder ?? "--"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-neutral-600">Neck</span>
                      <span className="font-semibold text-neutral-950 text-lg">
                        {selectedSet.neck ?? "--"}
                      </span>
                    </div>
                    {getSetSkinTone(selectedSet) && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-neutral-600">Skin Tone</span>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-10 h-10 rounded-md border border-neutral-300"
                            style={{
                              backgroundColor:
                                MANUAL_SKIN_TONES[getSetSkinTone(selectedSet) || "deep"] ||
                                "#33251c",
                            }}
                            title={getSetSkinTone(selectedSet) || ""}
                          />
                          <span className="text-sm font-medium text-neutral-700 capitalize">
                            {getSetSkinTone(selectedSet)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedSet.sizeAssignments &&
                    selectedSet.sizeAssignments.length > 0 && (
                      <div className="pt-6 border-t border-neutral-200">
                        <p className="text-sm font-medium text-neutral-700 mb-3">
                          Size Assignments
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSet.sizeAssignments.map((assignment) => (
                            <span
                              key={assignment.id}
                              className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 bg-neutral-50"
                            >
                              {assignment.chartName}: {assignment.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="border border-neutral-200 rounded-lg p-12 text-center">
                  <p className="text-sm text-neutral-500">
                    Select a measurement set to view its details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
