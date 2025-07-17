import {
  InstagramLogoIcon,
  FacebookLogoIcon,
  XLogoIcon,
  ArrowElbowDownRightIcon,
} from "@phosphor-icons/react";

/* --------------------------------------*/

const araafitLinks = ["home", "about us", "privacy policy", "terms of us"];

const araafitContact = [
  "info@araafit.com",
  "araafit@gmail.com",
  "+234 805 7844 312",
  "+234 805 7844 312",
];

/**
 * Landing page footer
 *
 * @returns ReactElement
 */
export default function Footer() {
  const date = new Date();
  
  return (
    <footer className="w-full h-auto bg-primary-950 py-[1.5rem] px-[3rem] lg:py-[3rem] lg:px-[7.5rem]">
      <div className="size-auto text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex flex-col gap-5">
            <img
              src="/logo/logo-white.png"
              alt="Araafit logo"
              className="h-auto w-[100px]"
            />

            <p className="max-w-[20.125rem] font-inter font-normal leading-snug">
              Araafit makes measuring your body and skin tone easy for perfect
              tailoring. Explore ready-to-wear dresses matched to you or design
              custom outfits from selected fabrics and styles.
            </p>

            <div className="flex gap-[1rem]">
              <span className="font-normal">Follow Us On</span>

              <div className="flex items-center justify-between gap-3">
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

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {araafitLinks.map((item, idx) => (
                <a key={idx} className="capitalize group flex cursor-pointer">
                  <ArrowElbowDownRightIcon className="text-primary-950 mr-2 group-hover:text-primary-500 transition-all" />
                  <span className="group-hover:pl-2 group-hover:text-primary-500 transition-all">
                    {item}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-semibold text-white">Reach Us</h3>
            <div className="flex flex-col gap-2">
              {araafitContact.map((item, idx) => (
                <a key={idx} className="underline">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="w-full text-white text-center mt-10">
        &copy; {date.getFullYear()} Araafit. All Rights Reserved.
      </p>
    </footer>
  );
}
