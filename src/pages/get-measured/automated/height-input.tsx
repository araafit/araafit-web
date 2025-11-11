import { useState } from "react";
import { InfoIcon } from "@phosphor-icons/react";
import Button from "../../../shared-components/button";
import { useGetMeasured } from "../context/get-measured-context";
import { MeasurementStepperLines } from "../stepper-lines";

/* ----------------------------------------------------------- */

const heights = [
  { feet: "5'0", cm: 152 },
  { feet: "5'2", cm: 157 },
  { feet: "5'4", cm: 163 },
  { feet: "5'6", cm: 168 },
  { feet: "5'8", cm: 173 },
  { feet: "6'0", cm: 183 },
];

export function HeightInput() {
  const {
    currentStep,
    stepTo,
    setHeight,
    height: storedHeight,
  } = useGetMeasured();
  const [height, setHeightLocal] = useState<string>(
    storedHeight?.toString() || ""
  );
  const [unit, setUnit] = useState<"cm" | "ft">("cm");
  const [feet, setFeet] = useState<string>("");
  const [inches, setInches] = useState<string>("");

  const handleContinue = () => {
    let heightInCm: number;

    if (unit === "cm") {
      heightInCm = parseFloat(height);
    } else {
      const feetNum = parseFloat(feet) || 0;
      const inchesNum = parseFloat(inches) || 0;
      heightInCm = (feetNum * 12 + inchesNum) * 2.54; // Convert to cm
    }

    if (heightInCm > 0 && heightInCm <= 300) {
      setHeight(heightInCm);
      stepTo(currentStep + 1);
    }
  };

  const goBack = () => {
    stepTo(currentStep - 1);
  };

  const isValidHeight = () => {
    if (unit === "cm") {
      const heightNum = parseFloat(height);
      return heightNum > 0 && heightNum <= 300;
    } else {
      const feetNum = parseFloat(feet) || 0;
      const inchesNum = parseFloat(inches) || 0;
      const totalInches = feetNum * 12 + inchesNum;
      return totalInches > 0 && totalInches <= 118; // ~300cm in inches
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col gap-5">
        <MeasurementStepperLines stepIndex={currentStep} className="mb-5" />

        <div className="w-full max-w-[51rem] flex flex-col gap-6">
          <div className="my-0 mx-auto text-center">
            <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-2">
              Enter Your Height
            </h2>
            <p className="text-neutral-500 font-inter text-sm md:text-base">
              We need your height to calculate accurate measurements from your
              photos
            </p>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-2 bg-[#EBF8FF] rounded-md border border-[#0EA5E9] py-3 px-4">
            <InfoIcon
              className="text-[#0EA5E9] mt-0.5 flex-shrink-0"
              size={20}
            />
            <div className="flex flex-col gap-1">
              <span className="text-[#0EA5E9] font-medium text-sm md:text-base">
                Accuracy Tip
              </span>
              <p className="text-[#0369A1] text-xs md:text-sm">
                Measure your height without shoes
              </p>
              <p className="text-[#0369A1] text-xs md:text-sm">
                Stand against a wall
              </p>
              <p className="text-[#0369A1] text-xs md:text-sm">
                Use a measuring tape
              </p>
            </div>
          </div>

          {/* Height input section */}
          <div className="flex flex-col gap-4">
            {/* Unit selector */}
            <div className="flex flex-col items-start gap-[10px] md:gap-4">
              <div className="text-neutral-700 font-medium text-sm md:text-base">
                Select unit:
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <div
                  onClick={() => setUnit("cm")}
                  className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base flex items-center justify-end gap-[10px] cursor-pointer ${
                    unit === "cm"
                      ? "border border-primary-200 text-primary-700"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                  }`}
                >
                  <div
                    className={`size-[1rem] flex items-center justify-center rounded-full border ${
                      unit !== "cm" ? "border-primary-50" : "border-primary-500"
                    }`}
                  >
                    {unit === "cm" && (
                      <span className="size-[6px] bg-primary-500 rounded-full border border-primary-500" />
                    )}
                  </div>
                  <span>Centimeters (cm)</span>
                </div>

                <div
                  onClick={() => setUnit("ft")}
                  className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base flex items-center justify-end gap-[10px] cursor-pointer ${
                    unit === "ft"
                      ? "border border-primary-200 text-primary-700"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                  }`}
                >
                  <div
                    className={`size-[1rem] flex items-center justify-center rounded-full border ${
                      unit !== "ft" ? "border-primary-50" : "border-primary-500"
                    }`}
                  >
                    {unit === "ft" && (
                      <span className="size-[6px] bg-primary-500 rounded-full border border-primary-500" />
                    )}
                  </div>
                  Feet & Inches
                </div>
              </div>
            </div>

            {/* Height input */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              {unit === "cm" ? (
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeightLocal(e.target.value)}
                  placeholder="CM e.g 150"
                  min="1"
                  max="300"
                  className="w-full max-w-[383px] px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none text-base md:text-lg placeholder:text-[14px] placeholder:font-light"
                />
              ) : (
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="FT e.g 4"
                    min="1"
                    max="9"
                    className="w-[183px] md:w-[183px] px-3 md:px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none text-base md:text-lg placeholder:text-[14px] placeholder:font-light"
                  />

                  <input
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    placeholder="IN e.g 6"
                    min="0"
                    max="11"
                    className="w-[183px] md:w-[183px] px-3 md:px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none text-base md:text-lg placeholder:text-[14px] placeholder:font-light"
                  />
                </div>
              )}
            </div>

            {/* Height preview */}
            {isValidHeight() && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                <span>Your height:</span>
                <span className="font-medium">
                  {unit === "cm"
                    ? `${height} cm`
                    : `${feet}' ${inches}" (${
                        ((parseFloat(feet) || 0) * 12 +
                          (parseFloat(inches) || 0)) *
                        2.54
                      } cm)`}
                </span>
              </div>
            )}

            {/* Validation message */}
            {((unit === "cm" && height && !isValidHeight()) ||
              (unit === "ft" && (feet || inches) && !isValidHeight())) && (
              <div className="text-red-500 text-xs md:text-sm">
                Please enter a valid height between 1-300 cm (or 1-9 feet)
              </div>
            )}
          </div>

          {/* Common heights reference */}
          <div className="bg-neutral-50 p-3 md:p-4 rounded-lg">
            <h4 className="text-xs md:text-sm font-medium text-neutral-700 mb-2 font-inter px-6">
              Common Heights Reference:
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Feet
                    </th>
                    {heights.map((height, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                      >
                        {height.feet}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      Centimeters
                    </td>
                    {heights.map((height, index) => (
                      <td
                        key={index}
                        className="px-6 py-4 text-sm text-gray-900"
                      >
                        {height.cm}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-4 md:gap-6 mt-8">
        <Button
          text="Back"
          variant="outline"
          className="w-full md:w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-neutral-950"
          onClick={goBack}
        />

        <Button
          text="Continue"
          variant="solid"
          disabled={!isValidHeight()}
          className="w-full md:w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}

export default HeightInput;
