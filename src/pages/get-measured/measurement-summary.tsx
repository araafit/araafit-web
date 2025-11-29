import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import showToast from "../../utils/notification";
import Spinner from "../../shared-components/spinner";
import { useMeasurementsStore } from "../../shared-hooks/state-store";
import Button from "../../shared-components/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useCreateGuestUser } from "../../hooks/auth.hooks";
import { useAuth } from "../../hooks/use-auth";
import { useUpdateMeasurements } from "../../hooks/measurements.hooks";

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
  const [searchParams] = useSearchParams();
  const gender = (searchParams.get("gender") || "").toLowerCase() as
    | "male"
    | "female"
    | "";
  const [savedState, setSavedState] = useState({
    isLoading: false,
    isSaved: false,
  });
  const selectedMeasurements = useMeasurementsStore((state) => state.data);
  const { isAuthenticated } = useAuth();
  const createGuestUserMutation = useCreateGuestUser();
  const updateMeasurements = useUpdateMeasurements();

  // Function to create guest user with measurements
  const handleContinueAsGuest = async () => {
    setSavedState({ isLoading: true, isSaved: false });

    try {
      await createGuestUserMutation.mutateAsync({
        // Shared
        waist: Number(selectedMeasurements.waist || 28),
        height: Number(selectedMeasurements.height || 165),
        skinTone: String(selectedMeasurements.skinTone || ""),
        gender: gender || undefined,
        // Female
        bust: gender === "male" ? undefined : Number(selectedMeasurements.bust || 36),
        hips: gender === "male" ? undefined : Number(selectedMeasurements.hip || 38),
        // Male
        chest: gender === "male" ? Number(selectedMeasurements.bust || 38) : undefined,
        inseam: undefined,
        shoulder: undefined,
      });

      navigate("/shop");
    } catch (error) {
      console.error("Failed to create guest user:", error);
      setSavedState({ isLoading: false, isSaved: false });
    }
  };

  // Function to save measurements for authenticated users
  const handleSaveMeasurements = async () => {
    setSavedState({ isLoading: true, isSaved: false });
    const parseNumber = (val: string | number | undefined): number => {
      if (val === undefined || val === null) return 0;
      if (typeof val === "number") return val;
      const part = val.split("/")[0];
      const n = Number(part.replace(/[^0-9.]/g, ""));
      return Number.isFinite(n) ? n : 0;
    };
    const parseHeightInches = (val: string | number | undefined): number => {
      if (val === undefined || val === null) return 0;
      if (typeof val === "number") return val;
      const match = val.match(/(\d+)\s*'?[\s]?(?:\s*(\d+)\s*"?)*?/);
      if (!match) return 0;
      const feet = Number(match[1] || 0);
      const inches = Number(match[2] || 0);
      return feet * 12 + inches;
    };

    try {
      await updateMeasurements.mutateAsync({
        bust: parseNumber(selectedMeasurements.bust),
        waist: parseNumber(selectedMeasurements.waist),
        hips: parseNumber(selectedMeasurements.hip),
        height: parseHeightInches(selectedMeasurements.height),
        skinTone: String(selectedMeasurements.skinTone || ""),
      });
      setSavedState({ isLoading: false, isSaved: true });
    } catch (error) {
      console.error("Failed to update measurements:", error);
      setSavedState({ isLoading: false, isSaved: false });
    }
  };

  const handleCreateFreeAccount = async () => {
    navigate("/auth/register");
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
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-[30.125rem]">
        <div className="flex flex-col items-center gap-4">
          <h5 className="text-[2rem] font-semibold">Measurement Summary</h5>
          <p className="text-neutral-500 font-light text-center">
            We’ve successfully captured your measurements and detected your skin tone.
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

          <div className="w-full flex flex-col gap-6" style={waterMarkStyle}>
            {/* Bust/Chest by gender */}
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">
                {gender === "male" ? "Chest" : "Bust"}
              </span>
              <span className="font-semibold text-neutral-950">
                {selectedMeasurements.bust}
              </span>
            </div>

            {/* Waist */}
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Waist</span>
              <span className="font-semibold text-neutral-950">
                {selectedMeasurements.waist}
              </span>
            </div>

            {/* Hips: hide for male */}
            {gender !== "male" && (
              <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                <span className="text-neutral-800 font-medium">Hip (inches)</span>
                <span className="font-semibold text-neutral-950">
                  {selectedMeasurements.hip}
                </span>
              </div>
            )}

            {/* Height */}
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Height</span>
              <span className="font-semibold text-neutral-950">
                {selectedMeasurements.height}
              </span>
            </div>

            {/* Skin Tone */}
            <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
              <span className="text-neutral-800 font-medium">Skin Tone</span>
              <span className="text-neutral-950 font-light">
                {String(selectedMeasurements.skinTone || "")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex items-center justify-end gap-6 w-full max-w-[30.125rem]">
        {!isAuthenticated && (
          <Button
            text="Continue as guest"
            variant="outline"
            className="min-w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-neutral-950"
            onClick={handleContinueAsGuest}
            disabled={createGuestUserMutation.isPending}
          >
            <div className="flex items-center justify-center gap-1">
              <span>{isAuthenticated ? "Save" : "Continue as guest"}</span>
              <Spinner size="sm" isLoading={createGuestUserMutation.isPending} />
            </div>
          </Button>
        )}

        <Button
          variant="solid"
          className="min-w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
          onClick={isAuthenticated ? handleSaveMeasurements : handleCreateFreeAccount}
          disabled={
            (isAuthenticated && (savedState.isLoading || updateMeasurements.isPending)) ||
            (!isAuthenticated && createGuestUserMutation.isPending)
          }
        >
          <div className="flex items-center justify-center gap-1">
            <span>{isAuthenticated ? "Save measurements" : "Create a free account"}</span>
            <Spinner
              size="sm"
              isLoading={
                (isAuthenticated && (savedState.isLoading || updateMeasurements.isPending)) ||
                (!isAuthenticated && createGuestUserMutation.isPending)
              }
            />
          </div>
        </Button>
      </div>
    </div>
  );
}

export default MeasurementSummary;
