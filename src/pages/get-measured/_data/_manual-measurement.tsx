/* --------------- Manual --------------- */
export type SelectedMeasurementName =
  | "bust"
  | "waist"
  | "hip"
  | "height"
  | "dressSize"
  | "skinTone";

export interface MeasurementsData {
  bust: (string | number)[];
  waist: (string | number)[];
  hip: (string | number)[];
  height: string[];
  dressSize: number[];
  skinTone: string[];
}

export const measurementsData: MeasurementsData = {
  bust: [30, 36, 38, 40, 42, 44, 46, 48],
  waist: [26, 28, 30, 32, "33/34", "35/36", "37/38", 40],
  hip: [36, 38, 40, 42, 44, 46, 48, 50],
  height: ["4'10", "5'1", "5'3", "5'4", "5'5", "5'7", "5'9", "6'0"],
  dressSize: [6, 8, 10, 12, 14, 16, 18, 20],
  skinTone: ["#33251c", "#55322e", "#8c5a47", "#b0522d", "#c4976c", "#deb588"],
};

export type SelectedMeasurement = Record<
  SelectedMeasurementName,
  string | number
>;
