import LandingLayout from "../../../layouts/landing/landing-layout";
import ContactForm from "./contact-form";
import locationMap from "./images/map-image.png";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

/* ------------------------------------------------- */

/**
 * Contact page
 *
 * @returns ReactElement
 */
export default function Contact() {
  return (
    <LandingLayout>
      <section className="flex flex-col items-start justify-center lg:flex-row gap-6 px-5 py-8 lg:px-28 lg:py-16">
        <div className="w-full lg:max-w-[27.8125rem] border border-gray-300 py-[1.5rem] px-4 rounded-md">
          <h1 className="font-medium mb-9 text-neutral-950 text-[2rem]">Contact Us</h1>
          <ContactForm />
        </div>

        <div className="w-full h-auto">
          <img
            src={locationMap}
            alt="Araafit location"
            className="w-full max-w-[45.6875rem] h-[21.5625rem] mb-[1rem] object-cover rounded-md"
          />

          <div className="mb-[1rem]">
            <h4 className="font-medium text-[1.5rem] mb-[0.75rem]">
              Contact Us
            </h4>

            <p className="font-normal text-neutral-800 leading-araafit">
              Address: 10B Adeola Odeku Street, Apartment 3C, Victoria Island,
              Lagos State.
            </p>
          </div>

          <div className="inline-block">
            <h4 className="font-medium text-[1.5rem] mb-[0.75rem]">
              Contact Us
            </h4>

            <div className="flex items-center justify-between gap-3 text-primary-500">
              <a
                href=""
                className="size-auto"
                target="_blank"
                rel="no-referrer"
                title="Araafit Instagram link"
              >
                <InstagramLogoIcon size={20} />
              </a>
              <a
                href=""
                className="size-auto"
                target="_blank"
                rel="no-referrer"
                title="Araafit Facebook link"
              >
                <FacebookLogoIcon size={20} />
              </a>
              <a
                href=""
                className="size-auto"
                target="_blank"
                rel="no-referrer"
                title="Araafit Twitter/X link"
              >
                <XLogoIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
