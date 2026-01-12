import React, { createContext, useContext, useState, useEffect } from "react";
import { useMeasurements } from "../../../../hooks/measurements.hooks";
import type { MeasurementSet } from "../../../../services/measurements.service";

interface ShopFiltersContextValue {
  selectedMeasurementSetId: string | null;
  setSelectedMeasurementSetId: (id: string | null) => void;
  selectedSkinTone: string | null;
  setSelectedSkinTone: (tone: string | null) => void;
  measurementSets: MeasurementSet[];
  baseMeasurements: { skinTone?: string | null } | null;
}

const ShopFiltersContext = createContext<ShopFiltersContextValue | undefined>(
  undefined
);

export function ShopFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: measurementsData } = useMeasurements();
  const [selectedMeasurementSetId, setSelectedMeasurementSetId] = useState<
    string | null
  >(null);
  const [selectedSkinTone, setSelectedSkinTone] = useState<string | null>(null);

  const measurementSets = measurementsData?.measurementSets || [];
  const baseMeasurements = measurementsData?.measurements || null;

  // Initialize with first measurement set if available
  useEffect(() => {
    if (measurementSets.length > 0 && !selectedMeasurementSetId) {
      setSelectedMeasurementSetId(measurementSets[0].id);
    }
  }, [measurementSets, selectedMeasurementSetId]);

  // Get skin tone from selected measurement set or base measurements
  useEffect(() => {
    if (selectedMeasurementSetId) {
      const selectedSet = measurementSets.find(
        (set) => set.id === selectedMeasurementSetId
      );
      const skinTone =
        (selectedSet as any)?.skinTone || baseMeasurements?.skinTone || null;
      setSelectedSkinTone(skinTone);
    } else {
      // Use base measurements skin tone if no set selected
      setSelectedSkinTone(baseMeasurements?.skinTone || null);
    }
  }, [selectedMeasurementSetId, measurementSets, baseMeasurements]);

  return (
    <ShopFiltersContext.Provider
      value={{
        selectedMeasurementSetId,
        setSelectedMeasurementSetId,
        selectedSkinTone,
        setSelectedSkinTone,
        measurementSets,
        baseMeasurements,
      }}
    >
      {children}
    </ShopFiltersContext.Provider>
  );
}

export function useShopFilters() {
  const context = useContext(ShopFiltersContext);
  if (context === undefined) {
    throw new Error("useShopFilters must be used within ShopFiltersProvider");
  }
  return context;
}

// Safe version that returns defaults when provider is not available
export function useShopFiltersSafe() {
  const context = useContext(ShopFiltersContext);
  if (context === undefined) {
    // Return safe defaults when provider is not available
    return {
      selectedMeasurementSetId: null,
      setSelectedMeasurementSetId: () => {},
      selectedSkinTone: null,
      setSelectedSkinTone: () => {},
      measurementSets: [],
      baseMeasurements: null,
    };
  }
  return context;
}

