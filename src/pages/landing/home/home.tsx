import {
  CaretDownIcon,
  CaretRightIcon,
  CaretUpIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useWindowSize } from "@react-hook/window-size";
import { useState } from "react";
import LandingLayout from "../../../layouts/landing/landing-layout";
import Accordion, {
  type AccordionItemType,
} from "../../../shared-components/accordion";
import Button from "../../../shared-components/button";
import VideoPlayer from "./ video-player";
import { FAQ, features, testimonials } from "./_data";
import {
  hookSectionImage1,
  hookSectionImage2,
  hookSectionImage3,
} from "./images/images";
import Testimonials from "./testimonials";
import { useNavigate } from "react-router-dom";

/* --------------------------------------------------------------------- */

const bgImage = {
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

/**
 * Araafit home page
 *
 * @returns ReactElement
 */
export function HomePage() {
  const [feature, setFeature] = useState<Record<string, undefined | any>>(
    features[0]
  );
  const [windowWidth, _] = useWindowSize();
  const navigate = useNavigate();

  return (
    <LandingLayout>
      <>
        <section className="w-full flex flex-col justify-center items-center px-5 py-8 lg:pt-20 lg:px-28 bg-primary-50">
          <div className="w-full max-w-[41.75rem] flex flex-col justify-center items-center gap-5 mb-24">
            <h1 className="font-lora font-semibold text-[2.5rem] text-center lg:text-5xl leading-araafit">
              Take{" "}
              <span className="font-lora text-primary-500">
                body measurement
              </span>{" "}
              and <span className="font-lora text-primary-500">skin tone</span>,
              no tape required.
            </h1>

            <p className="max-w-[506px] leading-[140%] font-light text-center">
              Take a photo, and Araafit delivers your exact measurements and
              skin tone, making fabric selection and tailoring truly
              personalised.
            </p>

            <div className="w-full flex flex-col items-center justify-center md:flex-row gap-3">
              <Button
                type="button"
                text="Get measured"
                variant="solid"
                className="w-full md:max-w-[9.375rem]"
                onClick={() => navigate("/get-measured")}
              />

              <Button
                type="button"
                variant="clear"
                className="w-full md:max-w-[14.8125rem] text-primary-500"
                onClick={() => navigate("/auth/register")}
              >
                <div className="w-full flex items-center justify-center gap-2">
                  <span>Create an account</span>
                  <CaretRightIcon size={20} className="text-primary-500" />
                </div>
              </Button>
            </div>
          </div>

          <VideoPlayer
            src="https://www.youtube.com/watch?v=KwKpn3WVPhs"
            allowPlayToggle
            showControls
            shouldMute
            ContainerClassName="w-full lg:max-w-[75rem] h-[25rem] lg:h-[33rem] bg-primary-950 rounded-md"
          />
        </section>

        <div className="flex flex-col justify-center gap-16 px-5 py-8 lg:py-[6.25rem] lg:px-[7rem]">
          {/* Feature */}
          <section className="w-full bg-white flex flex-col items-center justify-center">
            <div className="w-full flex items-center gap-16 mb-10">
              <h2 className="font-semibold text-neutral-950 text-[2rem]">
                Features
              </h2>

              <hr className="w-full max-w-[800px] border-[1.5px] border-neutral-200" />
            </div>

            <div className="w-full lg:max-w-[62.3125rem] flex flex-col justify-start md:flex-row md:justify-between gap-[3.625rem]">
              <div className="w-full max-w-[30.375rem] lg:mr-20">
                <Accordion
                  items={features}
                  containerClassName="w-full lg:max-w-[30.375rem] flex flex-col items-center gap-[2rem] mb-10"
                  itemClassName="flex flex-col gap-[1.5rem]"
                  questionClassName="font-lora font-semibold text-[1.5rem] capitalize"
                  answerClassName="font-light text-[1.125rem] leading-araafit"
                  clickedItem={(item: AccordionItemType) =>
                    setTimeout(() => setFeature(item), 500)
                  }
                  openIcon={<CaretUpIcon size={20} />}
                  closeIcon={<CaretDownIcon size={20} />}
                  shouldAnimate
                />

                <Button
                  type="button"
                  text="Take your measurement"
                  variant="solid"
                />
              </div>

              <img
                src={feature?.image}
                alt=""
                className={`w-full lg:w-[25.72rem] h-[30.580rem] object-cover rounded-md opacity-0 transition-opacity duration-700 ${
                  feature.image && "opacity-100"
                }`}
                style={{
                  boxShadow:
                    windowWidth > 430
                      ? "-30px 40px #C1A083"
                      : "-15px -15px #C1A083",
                  objectPosition: "center -30px",
                }}
              />
            </div>
          </section>

          {/* Hook1: 'shop now' section */}
          <section className="w-full bg-white h-auto flex items-center justify-center">
            <div
              className="relative w-full max-w-[1200px] h-[500px] rounded-md flex items-center justify-center px-2"
              style={{
                backgroundImage: `url(${hookSectionImage1})`,
                ...bgImage,
                backgroundPosition:
                  windowWidth <= 430 ? "center" : "center -200px",
              }}
            >
              <div className="size-full bg-[#1C1C1CBF] absolute left-0 top-0 rounded-md" />

              <div className="w-full max-w-[500px] z-50 flex flex-col items-center justify-center gap-[1rem]">
                <h2 className="text-white text-[32px] font-bold text-center">
                  You Still Spend Too Much Time Picking The Perfect Dress?
                </h2>

                <p className="font-light text-center text-white">
                  Everyone can shop here, but the store personalises
                  ready-to-wear dresses to your body and skin tone, reducing
                  guesswork and making decisions faster than ever.
                </p>
                <Button
                  type="button"
                  variant="solid"
                  className="w-full max-w-[145px]"
                >
                  <div className="flex items-center gap-2">
                    <span>Shop now</span>
                    <CaretRightIcon size={20} className="text-white" />
                  </div>
                </Button>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="w-full bg-white">
            <div className="w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-16 mb-10">
              <h2 className="font-semibold text-neutral-950 text-[2rem]">
                What Our Customers Say
              </h2>

              <hr className="w-full max-w-[681px] border-[1.5px] border-neutral-200" />
            </div>

            <div className="w-full">
              <Testimonials data={testimonials} />
            </div>
          </section>

          {/* Hook2: 'explore fabric' section */}
          <section className="w-full bg-white h-auto flex items-center justify-center">
            <div
              className="relative w-full max-w-[1200px] h-[500px] rounded-md flex items-center justify-center px-2"
              style={{
                backgroundImage: `url(${hookSectionImage2})`,
                ...bgImage,
                backgroundPosition:
                  windowWidth <= 430 ? "center" : "center -500px",
              }}
            >
              <div className="size-full bg-[#1C1C1CBF] absolute left-0 top-0 rounded-md" />

              <div className="w-full max-w-[500px] z-50 flex flex-col items-center justify-center gap-[1rem]">
                <h2 className="text-white text-[32px] font-bold text-center">
                  Tailor Your Perfect Dress Right From Your Phone
                </h2>

                <p className="font-light text-center text-white">
                  Discover fabrics that match your skin tone and body shape,
                  tailored to your measurements and styled from our curated
                  library for perfect custom dresses.
                </p>
                <Button
                  type="button"
                  variant="solid"
                  className="w-full max-w-[185px]"
                >
                  <div className="flex items-center gap-2">
                    <span>Explore fabric</span>
                    <CaretRightIcon size={20} className="text-white" />
                  </div>
                </Button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="w-full bg-white">
            <div className="w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-16 mb-10">
              <h2 className="font-semibold text-neutral-950 text-[2rem]">
                Frequently Asked Questions
              </h2>

              <hr className="w-full max-w-[681px] border-[1.5px] border-neutral-200" />
            </div>

            <div className="w-full flex items-center justify-center">
              <Accordion
                items={FAQ}
                containerClassName="w-full max-w-[744px] sm:w-[744px] flex flex-col items-center gap-[2rem] mb-10 p-2"
                itemClassName="flex flex-col gap-[1.5rem] border border-[#E8E8E8] rounded-[6px] py-[1rem] px-[2rem]"
                questionClassName="font-normal text-[18px]"
                answerClassName="font-light text-[1.125rem] text-neutral-500 leading-araafit"
                openIcon={<MinusIcon size={20} className="text-[#676767]" />}
                closeIcon={<PlusIcon size={20} className="text-[#676767]" />}
                shouldAnimate
              />
            </div>
          </section>

          {/* Hook3: 'custom fit journey' section */}
          <section className="w-full bg-white h-auto flex items-center justify-center">
            <div
              className="relative w-full max-w-[1200px] h-[500px] rounded-md flex items-center justify-center px-2"
              style={{
                backgroundImage: `url(${hookSectionImage3})`,
                ...bgImage,
                backgroundPosition:
                  windowWidth <= 430 ? "center" : "center -50px",
              }}
            >
              <div className="size-full bg-[#1C1C1CBF] absolute left-0 top-0 rounded-md" />

              <div className="w-full max-w-[500px] z-50 flex flex-col items-center justify-center gap-[1rem]">
                <h2 className="text-white text-[32px] font-bold text-center leading-araafit">
                  Start Your Custom Fit Journey
                </h2>
                <p className="font-light text-center text-white">
                  Get measured in minutes and unlock dresses and fabrics
                  tailored perfectly to you. Quick, simple, and made for your
                  unique style.
                </p>
                <Button
                  type="button"
                  variant="solid"
                  className="w-auto bg-primary-950"
                  text="Start your custom fit journey"
                />
              </div>
            </div>
          </section>
        </div>
      </>
    </LandingLayout>
  );
}
