import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import showToast from "../../utils/notification";
import Spinner from "../../shared-components/spinner";
import { useMeasurementsStore } from "../../shared-hooks/state-store";
import Button from "../../shared-components/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useCreateGuestUser } from "../../hooks/auth.hooks";
import { useAuth } from "../../hooks/use-auth";
// import { useMeasurements } from "../../hooks/measurements.hooks";

/* -------------------------------------------------------------------------- */

const notificationStyle: React.CSSProperties = {
  backgroundColor: "#F6FEF9",
  border: "1px solid #16A34A",
  color: "#16A34A",
  fontSize: "14px",
};

const waterMarkStyle: React.CSSProperties = {
  backgroundImage: `url(/araafit-watermark.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  objectFit: "fill",
};

export function MeasurementSummary() {
  const navigate = useNavigate();
  const [savedState, setSavedState] = useState({
    isLoading: false,
    isSaved: false,
  });
  const selectedMeasurements = useMeasurementsStore((state) => state.data);
  const { isAuthenticated } = useAuth();
  const createGuestUserMutation = useCreateGuestUser();
  // const { data: existingMeasurements } = useMeasurements();

  // Function to create guest user with measurements
  const handleContinueAsGuest = async () => {
    setSavedState({ isLoading: true, isSaved: false });
    
    try {
      await createGuestUserMutation.mutateAsync({
        bust: Number(selectedMeasurements.bust || 36),
        waist: Number(selectedMeasurements.waist || 28),
        hips: Number(selectedMeasurements.hip || 38),
        height: Number(selectedMeasurements.height || 165),
        dressSize: Number(selectedMeasurements.dressSize || 10),
        skinTone: String(selectedMeasurements.skinTone), // You might want to get this from the measurements store
      });
      
      setSavedState({ isLoading: false, isSaved: true });
      
      // Navigate to shop after successful guest user creation
      setTimeout(() => {
        navigate("/shop");
      }, 1500);
    } catch (error) {
      console.error("Failed to create guest user:", error);
      setSavedState({ isLoading: false, isSaved: false });
    }
  };

  // Function to save measurements for authenticated users
  const handleSaveMeasurements = async () => {
    setSavedState({ isLoading: true, isSaved: false });
    
    // Here you would typically save measurements to the user's profile
    // For now, we'll just simulate a save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSavedState({ isLoading: false, isSaved: true });
  };

  useEffect(() => {
    if (savedState.isSaved) {
      showToast.success("Your measurements have been saved.", {
        position: "top-right",
        style: notificationStyle,
        icon: null,
      });
    }
  }, [savedState.isSaved]);

  return (
    <div className="h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full h-[809px] bg-white flex justify-center border rounded-md p-14">
        <div className="flex flex-col">
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
                      {selectedMeasurements.bust}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">Waist</span>
                    <span className="font-semibold text-neutral-950">
                      {selectedMeasurements.waist}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">
                      Hip (inches)
                    </span>
                    <span className="font-semibold text-neutral-950">
                      {selectedMeasurements.hip}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">Height</span>
                    <span className="font-semibold text-neutral-950">
                      {selectedMeasurements.height}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                    <span className="text-neutral-800 font-medium">
                      Dress size
                    </span>
                    <span className="font-semibold text-neutral-950">
                      {selectedMeasurements.dressSize}
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
                        {/* <span className="font-light">
                          {selectedMeasurements.skinTone}
                        </span> */}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  */}
          {!savedState.isSaved ? (
            <div className="flex items-center justify-end gap-6">
              <Button
                text="Share"
                variant="outline"
                className="w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-neutral-950"
              />

              <Button
                variant="solid"
                className="w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
                onClick={isAuthenticated ? handleSaveMeasurements : handleContinueAsGuest}
                disabled={savedState.isLoading || createGuestUserMutation.isPending}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{isAuthenticated ? "Save" : "Continue"}</span>
                  <Spinner size="sm" isLoading={savedState.isLoading || createGuestUserMutation.isPending} />
                </div>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-6">
              <Button
                text="Continue shopping"
                variant="clear"
                className="w-[15rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-primary-500"
                onClick={() => navigate("/shop")}
              />

              <Button
                text={isAuthenticated ? "Go to Dashboard" : "Create a free account"}
                variant="solid"
                className="w-[15rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth/register")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeasurementSummary;
