// --------------- Profile ---------------
export interface MeasurementData {
  bust: string | number;
  waist: string | number;
  hip: string | number;
  height: string | number;
  dressSize: string | number;
  skinTone: string | number;
}

export const measurementData: MeasurementData = {
  bust: 40,
  waist: 40,
  hip: 38,
  height: "5'4",
  dressSize: 14,
  skinTone: "caramel",
};
