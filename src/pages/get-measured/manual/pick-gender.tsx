import { useState } from "react";
import Button from "../../../shared-components/button";
import { maleImage, femaleImage } from "../image-export";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetMeasured } from "../context/get-measured-context";
/* ------------------------------------------------------------ */

export function PickGender() {
  const navigate = useNavigate();
  const { stepTo } = useGetMeasured();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGenderParam = searchParams.get("gender");
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(
    initialGenderParam === "male" || initialGenderParam === "female"
      ? (initialGenderParam as "male" | "female")
      : null
  );

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll relative">
      <div className="w-full min-h-[809px] bg-white border rounded-md p-4 md:p-14 space-y-20">
        <div className="w-full flex items-center justify-center">
          <div>
            <h1 className="text-lg sm:text-[2rem] text-[#1C1C1C] font-semibold">
              Select Gender
            </h1>

            <p className="text-neutral-500 text-[1rem] text-center">
              I am a...
            </p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-[3.375rem]">
          <div
            className={`h-auto w-full max-w-[25.25rem] bg-[#0C506E] rounded-3xl ${
              selectedGender === "male"
                ? "border-8 border-primary-950"
                : "border-2 border-transparent hover:border-primary-800"
            } cursor-pointer`}
            onClick={() => setSelectedGender("male")}
          >
            <img src={maleImage} alt="" className="size-full object-contain" />
          </div>

          <div
            className={`h-auto w-full max-w-[25.25rem] bg-[#9A6C50] rounded-3xl ${
              selectedGender === "female"
                ? "border-8 border-primary-950"
                : "border-2 border-transparent hover:border-primary-800"
            } cursor-pointer`}
            onClick={() => setSelectedGender("female")}
          >
            <img
              src={femaleImage}
              alt=""
              className="size-full object-contain"
            />
          </div>
        </div>

        <div className="w-full block sm:flex items-center justify-end gap-5 md:mr-40">
          <Button
            text="Back"
            variant="outline"
            className="w-full sm:w-[175px] text-neutral-950 border-neutral-100 mb-5 sm:mb-0"
            onClick={() => navigate(-1)}
          />

          <Button
            text="Continue"
            variant="solid"
            disabled={selectedGender === null}
            className={`w-full sm:w-[175px] disabled:opacity-10 disabled:cursor-not-allowed`}
            onClick={() => {
              if (!selectedGender) return;
              const params = new URLSearchParams(searchParams);
              params.set("gender", selectedGender);
              setSearchParams(params, { replace: true });
              stepTo(1);
            }}
          />
        </div>
      </div>
    </section>
  );
}
