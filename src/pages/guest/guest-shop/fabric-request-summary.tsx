import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import Spinner from "../../../shared-components/spinner";
import Button from "../../../shared-components/button";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useMeasurements } from "../../../hooks/measurements.hooks";
import { useMakeSewingRequest } from "../../../hooks/requests.hooks";
import type { SewingRequest } from "../../../services/request.service";

/* --------------------------------------------------------------------------------------- */

const waterMarkStyle: React.CSSProperties = {
  backgroundImage: `url(/araafit-watermark.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "bottom",
  objectFit: "fill",
};

const skinToneObj = {
  deep: "#33251c",
  dark: "#55322e",
  medium: "#8c5a47",
  tab: "#b0522d",
  light: "#c4976c",
  fair: "#deb588",
};

/**
 * Fabric request summary page
 */
export function FabricRequestSummary() {
  const navigate = useNavigate();
  const params = useParams();
  const [tailorNote, setTailorNote] = useState<string>("");

  const {
    data: measurementData,
    isLoading: measurementLoading,
    // isSuccess: measurementSuccess,
    isError: measurementError,
  } = useMeasurements();

  const sewingRequest = useMakeSewingRequest();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams] = useSearchParams();
  const selectedStyle = searchParams.get("style");
  const selectedSize = searchParams.get("size");
  const selectedYards = searchParams.get("yards");

  // Function to create guest user with measurements
  const handleRequest = async () => {
    try {
      const payload: SewingRequest = {
        bust: measurementData?.bust || 0,
        waist: measurementData?.waist || 0,
        hips: measurementData?.hips || 0,
        height: measurementData?.height || 0,
        dressSize: measurementData?.dressSize || 0,
        skinTone: measurementData?.skinTone || "",
        size: selectedSize || "",
        dressStyle: selectedStyle || "",
        yardEstimate: selectedYards ? Number(selectedYards) : 0,
        noteForTailor: tailorNote,
        gender: measurementData?.gender || "",
        fabricId: params.fabricId || "",
      };

      await sewingRequest.mutateAsync(payload);
    } catch (error) {
      console.error("Failed to create sewing request:", error);
    }
  };

  if (measurementError) {
    return (
      <div className="w-full h-screen bg-[#F5F5F5] p-2 md:py-2 md:px-16 overflow-y-scroll flex items-center justify-center">
        <div className="w-full h-[30rem] bg-white flex items-center justify-start md:justify-center border rounded-md p-4 sm:p-14 relative">
          <div className="w-full flex items-center mb-2 absolute left-5 top-5">
            <div
              className="size-[2.12rem] flex items-center justify-center rounded-md border border-neutral-100 cursor-pointer mr-4"
              onClick={() => navigate(`/dashboard/shop/fabric/${params.fabricId}`)}
            >
              <ArrowLeftIcon />
            </div>
          </div>

          <p className="w-auto h-[4rem] bg-[#FFF8EB] border border-[#B47409] text-[#B47409] p-4 flex items-center justify-center rounded-lg">
            Unable to load measurements.{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Reload
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (measurementLoading) {
    return (
      <div className="w-full h-screen bg-[#F5F5F5] p-2 md:py-2 md:px-16 overflow-y-scroll flex items-center justify-center">
        <Spinner
          size="lg"
          isLoading={measurementLoading}
          arcColor="#9A6C50"
          speed="fast"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full bg-white flex justify-center border rounded-md p-4 sm:p-14">
        <div className="w-full  flex flex-col items-center justify-center gap-2">
          <div className="w-full max-w-[40.125rem] flex flex-col items-center gap-2">
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full flex items-center mb-2">
                <div
                  className="size-[2.12rem] flex items-center justify-center rounded-md border border-neutral-100 cursor-pointer mr-4"
                  onClick={() => navigate(`/dashboard/shop/fabric/${params.fabricId}`)}
                >
                  <ArrowLeftIcon />
                </div>
                <h5 className="w-full text-xl sm:text-[2rem] font-semibold text-center">
                  Measurement Summary
                </h5>
              </div>

              <p className="text-neutral-500 font-light">
                We’ve successfully captured your measurements and detected your
                skin tone.
              </p>
            </div>

            <div className="w-full flex flex-col gap-5 mb-6">
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
                     {measurementData?.bust? measurementData.bust : 'N/A'}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                  <span className="text-neutral-800 font-medium">Waist</span>

                  <span className="font-semibold text-neutral-950">
                    {measurementData?.waist? measurementData.waist : 'N/A'}
                  </span>
                </div>

                <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                  <span className="text-neutral-800 font-medium">
                    Hip (inches)
                  </span>

                  <span className="font-semibold text-neutral-950">
                   {measurementData?.hips ? measurementData.hips : 'N/A'}
                  </span>
                </div>

                <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                  <span className="text-neutral-800 font-medium">Height</span>
                  <span className="font-semibold text-neutral-950">
                    {measurementData?.height? measurementData.height : 'N/A'}
                  </span>
                </div>

                <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                  <span className="text-neutral-800 font-medium">
                    Dress size
                  </span>

                  <span className="font-semibold text-neutral-950">
                    {measurementData?.dressSize ? measurementData.dressSize : 'N/A'}
                  </span>
                </div>

                <div className="w-full flex items-center justify-between border-b-2 border-neutral-100 pb-2">
                  <span className="text-neutral-800 font-medium">
                    Skin Tone
                  </span>


                  {measurementData?.skinTone ? ( <div className="flex items-center gap-1">
                    <div
                      className="w-[58px] h-[44px] rounded-md"
                      style={{
                        backgroundColor:
                          skinToneObj[measurementData?.skinTone as string],
                      }}
                    />
                  </div>):(<span className="font-semibold text-neutral-950">N/A</span>)}
                </div>
              </div>
            </div>

            <div className="w-full max-w-[40rem] flex flex-col items-start justify-center">
              <p className="mb-4">Note for Tailor (optional)</p>

              <textarea
                name="tailor-note"
                title="tailor-note"
                placeholder="Add a note for tailor’s consideration."
                className="w-full max-w-[45rem] h-[8rem] border border-[#D0D5DD] rounded-md p-[1rem] appearance-none outline-none"
                onChange={(e) => setTailorNote(e.currentTarget.value)}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="w-full max-w-[] flex items-center justify-center py-[40px] px-[24px]">
            <Button
              variant="solid"
              className="w-full max-w-[23rem] self-end disabled:cursor-not-allowed"
              onClick={handleRequest}
              disabled={sewingRequest.isPending}
            >
              <div className="flex items-center justify-center gap-1">
                <span>Make request</span>

                <Spinner
                  size="sm"
                  speed="fast"
                  isLoading={sewingRequest.isPending}
                  arcColor="#ffff"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FabricRequestSummary;
