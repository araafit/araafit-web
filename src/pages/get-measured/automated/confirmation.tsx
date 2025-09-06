import { MeasurementStepperLines } from "../stepper-lines";
import { useGetMeasured } from "../context/get-measured-context";
import Button from "../../../shared-components/button";
import { measurementData } from "../../user-dashboard/_data/_profile";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import showToast from "../../../utils/notification";
import Spinner from "../../../shared-components/spinner";
/* ---------------------------------------------------------------------------------- */

const waterMarkStyle: React.CSSProperties = {
  backgroundImage: `url(/araafit-watermark.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  objectFit: "fill",
};

const notificationStyle: React.CSSProperties = {
  backgroundColor: "#F6FEF9",
  border: "1px solid #16A34A",
  color: "#16A34A",
  fontSize: "14px",
};

export function Confirmation() {
  const [isLoading, setLoading] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const { currentStep, stepTo } = useGetMeasured();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSaved) {
      showToast.success("Your measurements have been saved", {
        position: "top-right",
        style: notificationStyle,
        icon: null,
      });
    }
  }, [isSaved]);

  const retake = () => {
    stepTo(0);
    window.location.reload();
  };

  const saveMeasurement = async () => {
    console.log("Are you walking?");
    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(() => {
        setSaved(true);
        //@ts-ignore
        resolve();
      }, 500)
    );
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col gap-5">
        <MeasurementStepperLines stepIndex={currentStep} />

        <div className="w-[51rem] flex flex-col gap-6">
          <h2 className="text-[2rem] text-[#1C1C1C] font-semibold mb-2">
            Smart Capture
          </h2>

          <div className="size-full bg-white py-5 px-8 rounded-md flex flex-col items-center justify-center gap-6">
            <div className="w-[30.125rem]">
              <div className="flex flex-col items-center gap-4">
                <h5 className="text-[2rem] font-semibold">
                  Measurement Summary
                </h5>
                <p className="text-neutral-500 font-light text-center">
                  We’ve successfully captured your measurements and detected
                  your skin tone.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items justify-between">
                  <span className="font-medium text-[18px] text-neutral-950">
                    Measurement
                  </span>

                  <div
                    className="flex items-center gap-2 font-light cursor-pointer"
                    onClick={() => navigate("/dashboard/profile/get-measured")}
                  >
                    <PencilSimpleIcon />
                    <span>Edit</span>
                  </div>
                </div>

                <div
                  className="w-full flex flex-col gap-6"
                  style={waterMarkStyle}
                >
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">Bust</span>
                    <span className="font-semibold text-neutral-950">
                      {measurementData.bust}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">Waist</span>
                    <span className="font-semibold text-neutral-950">
                      {measurementData.waist}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">
                      Hip (inches)
                    </span>
                    <span className="font-semibold text-neutral-950">
                      {measurementData.hip}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">Height</span>
                    <span className="font-semibold text-neutral-950">
                      {measurementData.height}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">
                      Dress size
                    </span>
                    <span className="font-semibold text-neutral-950">
                      {measurementData.dressSize}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">
                      Skin Tone
                    </span>
                    <span className="text-neutral-950">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-[58px] h-[44px] rounded-md"
                          style={{ backgroundColor: "#c89a6d" }}
                        />
                        <span className="font-light">
                          {measurementData.skinTone}
                        </span>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isSaved ? (
        <div className="flex items-center justify-end gap-6">
          <Button
            text="Share"
            variant="outline"
            className="w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-neutral-950"
          />

          <Button
            variant="solid"
            className="w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
            onClick={saveMeasurement}
          >
            <div className="flex items-center justify-center gap-1">
              <span>Save</span>
              {isLoading && <Spinner size="sm" />}
            </div>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-6">
          <Button
            text="Continue as a guest"
            variant="clear"
            className="w-[15rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-primary-500"
            onClick={retake}
          />

          <Button
            text="Create a free account"
            variant="solid"
            className="w-[15rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
            onClick={() => navigate("/auth/register")}
          />
        </div>
      )}
    </div>
  );
}
