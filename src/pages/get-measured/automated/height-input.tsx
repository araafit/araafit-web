import { useState } from 'react';
import { Ruler, Info } from "@phosphor-icons/react";
import Button from "../../../shared-components/button";
import { useGetMeasured } from "../context/get-measured-context";
import { MeasurementStepperLines } from "../stepper-lines";

/* ----------------------------------------------------------- */

export function HeightInput() {
  const { currentStep, stepTo, setHeight, height: storedHeight } = useGetMeasured();
  const [height, setHeightLocal] = useState<string>(storedHeight?.toString() || '');
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');

  const handleContinue = () => {
    let heightInCm: number;
    
    if (unit === 'cm') {
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
    if (unit === 'cm') {
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
        <MeasurementStepperLines stepIndex={currentStep} />

        <div className="w-full max-w-[51rem] flex flex-col gap-6">
          <div>
            <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-2">
              Enter Your Height
            </h2>
            <p className="text-neutral-500 font-inter text-sm md:text-base">
              We need your height to calculate accurate measurements from your photos
            </p>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-2 bg-[#EBF8FF] rounded-md border border-[#0EA5E9] py-3 px-4">
            <Info className="text-[#0EA5E9] mt-0.5 flex-shrink-0" size={20} />
            <div className="flex flex-col gap-1">
              <span className="text-[#0EA5E9] font-medium text-sm md:text-base">Accuracy Tip</span>
              <p className="text-[#0369A1] text-xs md:text-sm">
                For the most accurate measurements, measure your height without shoes using a wall and measuring tape.
              </p>
            </div>
          </div>

          {/* Height input section */}
          <div className="flex flex-col gap-4">
            {/* Unit selector */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <span className="text-neutral-700 font-medium text-sm md:text-base">Unit:</span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
                    unit === 'cm'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary-300'
                  }`}
                >
                  Centimeters (cm)
                </button>
                <button
                  onClick={() => setUnit('ft')}
                  className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
                    unit === 'ft'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary-300'
                  }`}
                >
                  Feet & Inches
                </button>
              </div>
            </div>

            {/* Height input */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <Ruler className="text-neutral-400 flex-shrink-0" size={24} />
              
              {unit === 'cm' ? (
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeightLocal(e.target.value)}
                    placeholder="170"
                    min="1"
                    max="300"
                    className="w-full md:w-32 px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none text-base md:text-lg"
                  />
                  <span className="text-neutral-600 font-medium text-sm md:text-base">cm</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <input
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="5"
                    min="1"
                    max="9"
                    className="w-20 md:w-20 px-3 md:px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none text-base md:text-lg"
                  />
                  <span className="text-neutral-600 font-medium text-sm md:text-base">ft</span>
                  <input
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    placeholder="8"
                    min="0"
                    max="11"
                    className="w-20 md:w-20 px-3 md:px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none text-base md:text-lg"
                  />
                  <span className="text-neutral-600 font-medium text-sm md:text-base">in</span>
                </div>
              )}
            </div>

            {/* Height preview */}
            {isValidHeight() && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                <span>Your height:</span>
                <span className="font-medium">
                  {unit === 'cm' 
                    ? `${height} cm` 
                    : `${feet}' ${inches}" (${((parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0)) * 2.54} cm)`
                  }
                </span>
              </div>
            )}

            {/* Validation message */}
            {((unit === 'cm' && height && !isValidHeight()) || 
              (unit === 'ft' && (feet || inches) && !isValidHeight())) && (
              <div className="text-red-500 text-xs md:text-sm">
                Please enter a valid height between 1-300 cm (or 1-9 feet)
              </div>
            )}
          </div>

          {/* Common heights reference */}
          <div className="bg-neutral-50 p-3 md:p-4 rounded-lg">
            <h4 className="text-xs md:text-sm font-medium text-neutral-700 mb-2">Common Heights Reference:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-neutral-600">
              <div>5'0" = 152 cm</div>
              <div>5'6" = 168 cm</div>
              <div>5'2" = 157 cm</div>
              <div>5'8" = 173 cm</div>
              <div>5'4" = 163 cm</div>
              <div>6'0" = 183 cm</div>
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
