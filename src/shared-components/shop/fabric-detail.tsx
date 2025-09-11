import { Link } from "react-router-dom";
import { rtw2 } from "../../shared-images/image-entry";
import Button from "../button";
import { WarningIcon, ArrowRightIcon } from "@phosphor-icons/react";

/* --------------------------------------------------------- */

export function FabricDetail() {
  const measurement = [6, 8, 10, 12, 14, 16, 18, 20];

  const dressStyle = [
    "Corset",
    "Peplum top",
    "A-gown",
    "Puffy sleeves",
    "Off-shoulder",
    "Flay dresses",
    "Boubou",
    "Jumpsuits",
    "Long gown",
  ];

  return (
    <div className="w-[72rem] flex flex-col gap-4 p-4">
      <div className="flex items-start gap-2 bg-[#FFF8EB] rounded-md border border-[#B47409] py-2 px-4">
        <WarningIcon className="text-[#F59E0B]" />

        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 text-[#F59E0B]">
            <span>Important Notice</span>
          </div>

          <p className="text-[#B47409]">
            Your measurements have been saved securely. You're all set to get
            personalized dress and fabric recommendations!
          </p>

          <Link
            to="/dashboard/profile/get-measured"
            className="flex items-center gap-2 font-light text-[#F59E0B]"
          >
            <p>Enter measurement manually</p>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      <div className="h-auto bg-white rounded-md p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Item preview */}
            <div className="rounded-md flex flex-col gap-5 w-[35.75rem]">
              <img
                src={rtw2}
                alt=""
                className="size-full rounded-md object-cover h-[33rem]"
              />

              <div className="w-full flex gap-[1rem]">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <img
                    key={idx}
                    src={rtw2}
                    alt=""
                    className="w-[101px] h-[67px] rounded-md object-cover border border-white cursor-pointer"
                  />
                ))}
              </div>
            </div>

            <div className="w-[35.4375rem] grow rounded-md flex flex-col items-center gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-neutral-700 font-semibold text-[1.5rem]">
                  Araafit All Blue Jumpsuit
                </h3>
                <p className="text-neutral-700 font-light">
                  This all blue jumpsuit is perfect for making a statement,
                  brunches, events, or nights out.
                </p>
                <span className="font-semibold text-neutral-900">
                  ₦80,000.00
                </span>
              </div>

              {/* Dress size */}
              <div className="flex flex-col gap-3 border-b border-gray-100 pb-3">
                <div>
                  <div className="w-full flex items-center justify-between text-[12px]">
                    <span className="text-neutral-900">Dress size</span>
                    <span className="text-neutral-400">Size Guide</span>
                  </div>
                </div>

                <div className="bg-[#FFF8EB] rounded-md p-2">
                  <h5 className="mb-4 font-inter text-[#F59E0B]">
                    We’ve Got Your Size Covered
                  </h5>

                  <p className="w-full text-[#B47409] font-light">
                    No need to choose a size—our AI has already selected the
                    perfect fit for you based on your measurements.
                  </p>
                </div>

                <div className="w-full flex items-center justify-between">
                  {measurement.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-[3.625rem] h-[2.75rem] p-2 text-[14px] border border-[#E8E8E8] rounded-md flex items-center justify-center cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Dress style */}
              <div className="w-full flex flex-col gap-3">
                <span className="text-[14px]">Select Dress Style</span>

                <div className="grid grid-cols-3 gap-4">
                  {dressStyle.map((style, idx) => (
                    <div
                      key={idx}
                      className="w-[10rem] border border-[#E8E8E8] py-2 px-3 rounded-md text-center text-[#494949]"
                    >
                      {style}
                    </div>
                  ))}
                </div>
              </div>

              {/* Yard estimate */}
              <div className="w-full flex flex-col gap-3">
                <span className="text-[14px]">
                  Yard Estimate (based on measurement & style)
                </span>

                <textarea
                  id=""
                  name=""
                  placeholder="Number of yards based on your measurement and preferred choice of style."
                  className="w-full h-[76px] p-4 border border-gray-300 rounded placeholder:text-[#B9B9B9] text-[14px] outline-none appearance-none"
                />
              </div>
            </div>
          </div>

          {/* TC */}
          <div className="flex items-center justify-center gap-[1.5rem] py-[40px] px-[24px]">
            <div className="w-full bg-[#F6F7F9] flex flex-col gap-2 p-3">
              <span className="text-[#667A91]">No Refund Policy</span>

              <p className="text-[#333B47] font-light">
                Each piece is custom-made using your unique body measurements.
                Because of this personalised process, we are unable to offer
                refunds. Please double-check your entries before placing your
                order.
              </p>

              <div className="w-full flex gap-4 text-[#516278]">
                <input type="checkbox" />
                <span className="font-normal">
                  I understand and accept the no refund policy.
                </span>
              </div>
            </div>
          </div>

          {/* Proceed */}
          <div className="flex items-center justify-center">
            <Button text="Proceed" variant="solid" />
          </div>
        </div>
      </div>
    </div>
  );
}