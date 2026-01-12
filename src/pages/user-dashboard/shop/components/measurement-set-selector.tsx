import { useShopFiltersSafe } from "../context/shop-filters-context";
import { CaretDownIcon } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

export default function MeasurementSetSelector() {
  const {
    selectedMeasurementSetId,
    setSelectedMeasurementSetId,
    measurementSets,
    baseMeasurements,
  } = useShopFiltersSafe();

  const selectedSet = measurementSets.find(
    (set) => set.id === selectedMeasurementSetId
  );

  const displayName = selectedSet
    ? selectedSet.name || "Unnamed set"
    : "Default measurements";

  // Don't render if no measurement sets and no base measurements (likely not authenticated)
  if (measurementSets.length === 0 && !baseMeasurements) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-600 whitespace-nowrap">
        Measurement Set:
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-between gap-2 px-3 py-2 min-w-[180px] text-sm border border-neutral-300 rounded-md bg-white hover:bg-neutral-50 transition-colors"
          >
            <span className="text-neutral-900 truncate">{displayName}</span>
            <CaretDownIcon size={16} className="text-neutral-500 flex-shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          {/* Default option */}
          <DropdownMenuItem
            onClick={() => setSelectedMeasurementSetId(null)}
            className={`cursor-pointer ${
              !selectedMeasurementSetId ? "bg-neutral-100" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-900">
                Default measurements
              </span>
              {baseMeasurements && (
                <span className="text-xs text-neutral-500">
                  Base measurements
                </span>
              )}
            </div>
          </DropdownMenuItem>

          {/* Measurement sets */}
          {measurementSets.map((set) => (
            <DropdownMenuItem
              key={set.id}
              onClick={() => setSelectedMeasurementSetId(set.id)}
              className={`cursor-pointer ${
                selectedMeasurementSetId === set.id ? "bg-neutral-100" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">
                  {set.name || "Unnamed set"}
                </span>
                <span className="text-xs text-neutral-500">
                  {set.gender?.toLowerCase() === "male" ? "Male" : "Female"}
                  {" • "}
                  Updated{" "}
                  {new Date(set.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </DropdownMenuItem>
          ))}

          {measurementSets.length === 0 && (
            <div className="px-2 py-1.5">
              <p className="text-xs text-neutral-500">
                No measurement sets available
              </p>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

