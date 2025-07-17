import React from "react";
import LandingLayout from "../../../layouts/landing/landing-layout";
import { ceoImage, customFitCTA } from "./images/images";
import { companyOfferings, companyValues } from "./data";
import Button from "../../../shared-components/button";

/* ----------------------------------------- */

/**
 * About page
 *
 * @returns ReactElement
 */
export default function About() {
  const bgImage = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center ",
  };

  return (
    <LandingLayout>
      <>
        <div className="bg-white px-5 py-8 lg:px-28 lg:py-16 flex flex-col gap-16 pt-16">
          <section className="w-full flex flex-col md:flex-row items-center justify-between gap-10 bg-white">
            <h1 className="w-full sm:ax-w-[31.6875] font-medium text-[2rem] leading-[125%]">
              Araafit is a tech-powered tailoring platform designed to make
              custom clothing more accessible, accurate, and enjoyable.
            </h1>

            <p className="w-full sm:max-w-[35.3125rem] font-light leading-[140%] text-neutral-800">
              We bridge the gap between traditional tailoring and modern
              convenience by using smart measurement tools, AI-driven
              recommendations, and seamless order management. Whether you're
              looking to get measured for the perfect fit, choose a fabric that
              complements your skin tone, or visualize your style before it's
              made, Araafit puts the power of fashion personalization in your
              hands.
            </p>
          </section>

          {/* CEO's word */}
          <section className="w-full">
            <figure className="bg-primary-800 flex flex-col lg:flex-row items-center justify-center gap-[2rem] rounded-md p-[2rem] lg:px-[7.5rem] lg:py-[2.5rem]">
              <img
                src={ceoImage}
                alt="Araafit CEO"
                className="w-full max-w-[300px] h-full scale-x-[-1]"
              />

              <figcaption>
                <div className="flex flex-col lg:flex-row lg:items-center gap-[22px] lg:gap-[66px] mb-[24px]">
                  <h3 className="w-full text-[1.5rem] lg:text-[2rem] text-left text-white lg:text-center font-semibold">
                    From the CEO’s Desk
                  </h3>

                  <hr className="w-full max-w-[13.3125rem] border-[2px] sm:border border-white" />
                </div>

                <div className="flex flex-col gap-4 text-white font-light">
                  <p>
                    At Araafit, we believe that clothing is more than fabric —
                    it’s identity, culture, and confidence woven together. When
                    we started this journey, our mission was simple: to make
                    fashion fit you, not the other way around.
                  </p>
                  <p>
                    Too often, people struggle to find tailored outfits that
                    reflect their style and truly fit their body. We wanted to
                    change that. By blending technology with traditional
                    tailoring, we’ve created a solution that’s personal,
                    efficient, and empowering.
                  </p>
                  <p>
                    Every stitch, every style recommendation, and every
                    measurement taken is centered around making your experience
                    seamless and special. As we continue to grow, our focus
                    remains on helping you feel seen, valued, and stylish — no
                    matter your shape, size, or story.
                  </p>
                  <p>Thank you for trusting Araafit.</p>

                  <p>
                    Feyisayo Faloye,
                    <br /> Founder & CEO, Araafit
                  </p>
                </div>
              </figcaption>
            </figure>
          </section>

          {/* Mission */}
          <section className="flex flex-col lg:flex-row justify-between gap-[1.5rem]">
            <h3
              className="text-[1.75rem] font-medium text-left sm:text-center text-neutral-950 capitalize"
              title="Araafit's mission"
            >
              Our mission
            </h3>

            <p className="w-full max-w-[35.3125rem] font-light">
              We’re on a mission to simplify the custom clothing experience. We
              believe that every individual deserves outfits tailored to their
              unique body and taste — without the hassle. With Araafit, we aim
              to empower tailors and customers alike by streamlining the
              measurement, styling, and ordering process through intelligent
              technology.
            </p>
          </section>

          {/* Offering */}
          <section>
            <div className="flex flex-col lg:flex-row items-center gap-[22px] lg:gap-[66px] mb-[24px]">
              <h3 className="w-full lg:w-fit text-[2rem] text-left font-semibold">
                What We Offer
              </h3>

              <hr className="w-full max-w-[57.1875rem] border-[2px] sm:border border-[#D1D1D1]" />
            </div>

            <div className="flex flex-col gap-6">
              {companyOfferings.map((item, idx) =>
                idx % 2 === 0 ? (
                  <div
                    key={idx}
                    className="flex flex-col lg:flex-row items-center gap-8"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-fit max-w-[38.25rem] sm:h-[28.6875rem]"
                    />

                    <div className="flex flex-col justify-center">
                      <h4 className="text-[1.75rem] font-medium mb-4 capitalize">
                        {item.title}
                      </h4>

                      <p className="text-neutral-800 font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="flex flex-col-reverse lg:flex-row items-center gap-8"
                  >
                    <div className="flex flex-col justify-center">
                      <h4 className="text-[1.75rem] font-medium mb-4 capitalize">
                        {item.title}
                      </h4>

                      <p className="text-neutral-800 font-light">
                        {item.description}
                      </p>
                    </div>

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-fit max-w-[38.25rem] sm:h-[28.6875rem]"
                    />
                  </div>
                )
              )}
            </div>
          </section>

          {/* Our value */}
          <section title="Araafit company value">
            <div className="flex flex-col lg:flex-row items-center gap-[22px] lg:gap-[66px] mb-[24px]">
              <h3 className="w-full lg:w-fit text-[2rem] text-left font-semibold">
                Our Values
              </h3>

              <hr className="w-full max-w-[57.1875rem] border-[2px] sm:border border-[#D1D1D1]" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {companyValues.map((item, idx) => (
                <div
                  key={idx}
                  className="w-full max-w-[22.3125rem] h-[12rem] flex flex-col items-start gap-4"
                >
                  <strong className="text-[1.125rem] text-primary-500 font-medium capitalize">
                    {item.value}
                  </strong>

                  <p className="font-light text-neutral-900 leading-[140%]">
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 'custom fit journey' CTA */}
        <section className="w-full bg-white h-auto flex items-center justify-center py-8 md:px-28 md:py-16">
          <div
            className="relative w-full max-w-[1200px] h-[500px] md:rounded-md flex items-center justify-center px-2"
            style={{ backgroundImage: `url(${customFitCTA})`, ...bgImage }}
          >
            <div className="size-full bg-[#1C1C1CBF] absolute left-0 top-0 md:rounded-md" />

            <div className="w-full max-w-[500px] z-50 flex flex-col items-center justify-center gap-[1rem]">
              <h2 className="text-white text-[32px] font-bold text-center leading-[125%]">
                Start Your Custom Fit Journey
              </h2>

              <p className="font-light text-center text-white">
                Get measured in minutes and unlock dresses and fabrics tailored
                perfectly to you. Quick, simple, and made for your unique style.
              </p>

              <Button
                type="button"
                variant="solid"
                className="w-full bg-primary-950 max-w-[185px]"
                text="Start your custom fit"
              />
            </div>
          </div>
        </section>
      </>
    </LandingLayout>
  );
}
