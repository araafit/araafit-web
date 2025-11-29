import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { FabricRequestStepperLines } from "./fabric-request-stepper";
import { useFabricRequestStore } from "../../../shared-hooks/state-store";
import { useMeasurements } from "../../../hooks/measurements.hooks";
import type { MeasurementSet } from "../../../services/measurements.service";
import Spinner from "../../../shared-components/spinner";

/* ---------------------------------------------------------------------- */

export function DashboardFabricMeasurementStepPage() {
  const params = useParams<{ itemName: string }>();
  const rawParam = params.itemName || "";
  const navigate = useNavigate();

  const {
    fabricId,
    selectedStyleId,
    selectedMeasurementSetId: storedSetId,
    setMeasurementSelection,
  } = useFabricRequestStore((state) => state);

  const {
    data: measurementsData,
    isLoading,
    isError,
    error,
  } = useMeasurements();

  const sets: MeasurementSet[] = useMemo(
    () => measurementsData?.measurementSets ?? [],
    [measurementsData]
  );

  const baseOption: MeasurementSet | null = useMemo(() => {
    if (!measurementsData) return null;
    const m = measurementsData.measurements;
    if (!m) return null;

    return {
      id: "__base__",
      name: "Default measurements",
      gender: measurementsData.gender || "female",
      // Prefer chest when present, fall back to bust
      chest:
        (typeof m.chest === "number" ? m.chest : undefined) ??
        (typeof m.bust === "number" ? m.bust : undefined) ??
        null,
      waist:
        typeof m.waist === "number" ? m.waist : null,
      hips:
        typeof m.hips === "number" ? m.hips : null,
      neck:
        typeof m.neck === "number" ? m.neck : null,
      sleeve: null,
      inseam:
        typeof m.inseam === "number" ? m.inseam : null,
      shoulder:
        typeof m.shoulder === "number" ? m.shoulder : null,
      height:
        typeof m.height === "number" ? m.height : null,
      createdAt: measurementsData.lastUpdated,
      updatedAt: measurementsData.lastUpdated,
      assignedSize: null,
      sizeAssignments: [],
    };
  }, [measurementsData]);

  const allOptions: MeasurementSet[] = useMemo(
    () => (baseOption ? [baseOption, ...sets] : [...sets]),
    [baseOption, sets]
  );

  const [selectedSetId, setSelectedSetId] = useState<string | undefined>(
    storedSetId
  );

  useEffect(() => {
    if (!selectedSetId && allOptions.length > 0) {
      const first = allOptions[0];
      setSelectedSetId(first.id);
      setMeasurementSelection({
        id: first.id,
        name: first.name,
        gender: first.gender,
      });
    }
  }, [selectedSetId, allOptions, setMeasurementSelection]);

  const hasAnyChoice = allOptions.length > 0;

  const handleSelectSet = (set: MeasurementSet) => {
    setSelectedSetId(set.id);
    setMeasurementSelection({
      id: set.id,
      name: set.name,
      gender: set.gender,
    });
  };

  const handleContinue = () => {
    if (!selectedSetId) return;
    // Next: review step (to be implemented)
    navigate(`/dashboard/shop/fabric/${rawParam}/review`);
  };

  // Guard: must have fabric & style selected
  if (!fabricId) {
    return (
      <Navigate
        to={`/dashboard/shop/fabric/${rawParam}/request`}
        replace
      />
    );
  }

  if (!selectedStyleId) {
    return (
      <Navigate
        to={`/dashboard/shop/fabric/${rawParam}/style`}
        replace
      />
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F5F5] flex items-start justify-center px-4 py-6 md:px-8">
      <div className="w-full max-w-[72rem] bg-white rounded-md shadow-sm p-4 md:p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(`/dashboard/shop/fabric/${rawParam}/style`)
              }
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
                Choose your measurements
              </h1>
              <span className="text-xs md:text-sm text-neutral-500 mt-0.5">
                Step 3 of 4 · Select the measurement set we should use for this request
              </span>
            </div>
          </div>

          <FabricRequestStepperLines stepIndex={2} />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Spinner size="md" speed="fast" isLoading arcColor="#9A6C50" />
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center max-w-sm">
                <p className="text-red-600 mb-1">Failed to load your measurements</p>
                <p className="text-xs md:text-sm text-neutral-500 mb-4">
                  {error instanceof Error
                    ? error.message
                    : "Please try again later."}
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50"
                  onClick={() => navigate("/get-measured")}
                >
                  Go to measurement flow
                </button>
              </div>
            </div>
          )}

          {!isLoading && !isError && !hasAnyChoice && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center max-w-sm">
                <p className="text-sm md:text-base text-neutral-700 mb-2">
                  You don&apos;t have any saved measurement sets yet.
                </p>
                <p className="text-xs md:text-sm text-neutral-500 mb-4">
                  Take your measurements so we can recommend the right fit for this style.
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-[#9A6C50] text-white text-sm font-medium hover:bg-[#7B523F] transition-colors"
                  onClick={() => navigate("/get-measured")}
                >
                  Take measurements
                </button>
              </div>
            </div>
          )}

          {hasAnyChoice && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Selected set details */}
              <div className="lg:col-span-2 border border-neutral-100 rounded-md p-4 flex flex-col gap-4">
                {selectedSetId ? (
                  <>
                    {(() => {
                      const set =
                        allOptions.find((s) => s.id === selectedSetId) ??
                        allOptions[0];
                      if (!set) return null;
                      const isMale =
                        (set.gender || "").toLowerCase() === "male";
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="font-semibold text-neutral-900">
                                {set.name || "Unnamed set"}
                              </h2>
                              <p className="text-xs text-neutral-500">
                                {isMale ? "Male" : "Female"} • Updated{" "}
                                {new Date(set.updatedAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            {set.assignedSize && (
                              <span className="inline-flex items-center rounded-full border border-neutral-200 px-2 py-1 text-[11px] text-neutral-700 bg-neutral-50">
                                Size: {set.assignedSize.label} (
                                {set.assignedSize.chartName})
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                              <span className="text-neutral-700">
                                {isMale ? "Chest" : "Bust"}
                              </span>
                              <span className="font-semibold text-neutral-950">
                                {isMale ? set.chest ?? "--" : set.chest ?? "--"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                              <span className="text-neutral-700">Waist</span>
                              <span className="font-semibold text-neutral-950">
                                {set.waist ?? "--"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                              <span className="text-neutral-700">Hips</span>
                              <span className="font-semibold text-neutral-950">
                                {set.hips ?? "--"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                              <span className="text-neutral-700">Height</span>
                              <span className="font-semibold text-neutral-950">
                                {set.height ?? "--"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                              <span className="text-neutral-700">Shoulder</span>
                              <span className="font-semibold text-neutral-950">
                                {set.shoulder ?? "--"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                              <span className="text-neutral-700">Neck</span>
                              <span className="font-semibold text-neutral-950">
                                {set.neck ?? "--"}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <p className="text-sm text-neutral-500">
                    Select a measurement set from the right to see its details.
                  </p>
                )}
              </div>

              {/* Sets list */}
              <div className="space-y-2 lg:pl-2 lg:border-l lg:border-neutral-100">
                {allOptions.map((set) => {
                  const isSelected = selectedSetId === set.id;
                  const isMale = (set.gender || "").toLowerCase() === "male";
                  return (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() => handleSelectSet(set)}
                      className={`w-full text-left border rounded-md px-3 py-2 text-sm flex flex-col gap-1 transition-colors ${
                        isSelected
                          ? "border-primary-900 bg-primary-50"
                          : "border-[#E8E8E8] hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-900 line-clamp-1">
                          {set.name || "Unnamed set"}
                        </span>
                        {isSelected && (
                          <CheckCircleIcon
                            size={16}
                            weight="fill"
                            className="text-primary-600"
                          />
                        )}
                      </div>
                      <span className="text-xs text-neutral-500">
                        {isMale ? "Male" : "Female"}
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
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-4 border-t border-neutral-100 mt-2">
          <button
            type="button"
            className="px-5 py-2.5 rounded-md bg-[#9A6C50] text-white text-sm font-medium hover:bg-[#7B523F] transition-colors disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
            onClick={handleContinue}
            disabled={!selectedSetId || isLoading || isError || !hasAnyChoice}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}


