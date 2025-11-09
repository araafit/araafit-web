import React, { useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
// import authService from "../../services/auth.service";
import { useGoogleAuth } from "../../hooks/auth.hooks";
import googleIcon from "./google-icon-image.png"

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
  children,
}: AuthLayoutType) {
  const googleAuthMutation = useGoogleAuth();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const googleAuthSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    // Send to your backend
    try {
      const response = await googleAuthMutation.mutateAsync({ idToken });

      console.log("Backend response:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const googleAuthError = () => {
    console.log("Login Failed");
  };

  const customClick = () => {
    const googleButton = googleButtonRef.current?.querySelector<HTMLDivElement>("div[role=button]");

    
    if (googleButton) googleButton.click();
  }

  return (
    <section className="h-screen bg-[#F5F5F5] px-0 py-0 md:py-2 md:px-16 overflow-y-scroll">
      <div className="w-full h-[809px] bg-white flex items-center justify-center border rounded-md">
        <div className="w-full max-w-[27.8125rem] h-[42.5remh] border border-neutral-100 rounded-sm flex flex-col items-center justify-center gap-5 py-6 px-4 overflow-y-auto">
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
                className="w-full border-[1.5px] border-danger-500 flex items-center justify-center gap-4 p-4 rounded-md"
                title="Google authentication button"
                onClick={customClick}
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

            <div ref={(ref) => { googleButtonRef.current = ref; }} style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
              <GoogleLogin
                onSuccess={googleAuthSuccess}
                onError={googleAuthError}
                useOneTap
                width="300"
                text="signup_with"
              />
            </div>
          </div>

          {googleAutBtnText && (
            <div className="w-full mb-4 relative">
              <hr className="border border-neutral-100" />
              <div className="size-[30px] font-light text-[0.775rem] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white flex items-center justify-center">
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
