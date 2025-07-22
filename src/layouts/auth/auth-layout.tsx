import React from "react";
import googleIcon from "./google-icon-image.png";

/* -------------------------------------- */

type AuthLayoutType = {
  title: string;
  description: string;
  googleAutBtnText?: string;
  googleAuthTrigger?: () => void;
  children: React.ReactElement;
};

/**
 * Authentication layout
 *
 *
 * @returns ReactElement
 */
export default function AuthLayout({
  title,
  description,
  googleAutBtnText,
  googleAuthTrigger,
  children,
}: AuthLayoutType) {

  return (
    <section className="h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16">
      <div
        className="w-full h-screen bg-white flex items-center justify-center border rounded-md"
        // title="Araafit login page"
      >
        <div className="w-full max-w-[27.8125rem] border border-neutral-100 rounded-sm flex flex-col items-center justify-center gap-9 py-6 px-4">
          <div className="flex flex-col items-center justify-center gap-3">
            <strong className="font-lora font-medium text-[32px] text-neutral-950">
              {title}
            </strong>
            <p className="font-light text-neutral-700 text-center mb-6">
              {description}
            </p>

            {googleAutBtnText && (
              <button
                type="button"
                className="w-full border-[1.5px] border-neutral-100 flex items-center justify-center gap-4 p-4 rounded-md"
                title="Google authentication button"
                onClick={googleAuthTrigger}
              >
                <img
                  src={googleIcon}
                  alt="Google login for Araafit"
                  className="size-[20px]"
                />
                <span className="font-semibold text-neutral-900">
                  {googleAutBtnText}
                </span>
              </button>
            )}
          </div>

          {googleAutBtnText && (
            <div className="w-full mb-6 relative">
              <hr className="border border-neutral-100" />
              <div className="size-[40px] font-light text-[0.875rem] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white flex items-center justify-center">
                OR
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
