import React, { useState, useEffect } from "react";
import AuthLayout from "../../../layouts/auth/auth-layout";
import {
  CreateAccount,
  VerifyEmail,
  KYC,
  SetPassword,
} from "./steps/import-entry";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { formSteps } from "./form-steps-data";
import Modal from "../../../shared-components/modal";
import { useSwitch } from "../../../shared-hooks/switch";
import checkmark from "../checkmark.png";
import Spinner from "../../../shared-components/spinner";
import Button from "../../../shared-components/button";
import {
  useVerifyEmail,
  useVerifyEmailWithMeasurements,
  useVerifyOtp,
  useRegister,
} from "../../../hooks/auth.hooks";
import { useAuth } from "../../../hooks/use-auth";
import { useMeasurementsStore } from "../../../shared-hooks/state-store";

/* ------------------------------------------------------------------------------------- */

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  verificationCode: string[];
  deliveryAddress: string;
  password: string;
  confirmPassword: string;
};

/**
 *
 *
 * @param step number
 *
 * @returns ReactElement | Null
 */
const StepContent = ({ step }: { step: number }) => {
  switch (step) {
    case 0:
      return <CreateAccount />;
    case 1:
      return <VerifyEmail />;
    case 2:
      return <KYC />;
    case 3:
      return <SetPassword />;
    default:
      return null;
  }
};

/**
 * Araafit account registration page
 *
 * @returns ReactElement
 */
export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toggleSwitch, switchValue: isOpen } = useSwitch(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Auth mutations
  const verifyEmailMutation = useVerifyEmail();
  const verifyEmailWithMeasurements = useVerifyEmailWithMeasurements();
  const verifyOtpMutation = useVerifyOtp();
  const registerMutation = useRegister();
  const measurements = useMeasurementsStore((s) => s.data);

  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      verificationCode: ["", "", "", "", "", ""],
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const currentFormStep = formSteps.findIndex((_, idx) => idx === currentStep);

  const onNext = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // Step 1: Verify email
    if (currentStep === 0) {
      const emailValid = await methods.trigger("email");

      if (emailValid) {
        const email = methods.getValues("email");

        try {
          // If we have measurements in store, include them in verification request
          const parseNumber = (val: string | number | undefined): number => {
            if (val === undefined || val === null) return 0;
            if (typeof val === "number") return val;
            // handle values like "33/34"
            const part = val.split("/")[0];
            const n = Number(part.replace(/[^0-9.]/g, ""));
            return Number.isFinite(n) ? n : 0;
          };

          const parseHeightInches = (
            val: string | number | undefined
          ): number => {
            if (val === undefined || val === null) return 0;
            if (typeof val === "number") return val;
            // Expect formats like 5'3 or 5' 3"
            const match = val.match(/(\d+)\s*'?[\s]?(?:\s*(\d+)\s*"?)*?/);
            if (!match) return 0;
            const feet = Number(match[1] || 0);
            const inches = Number(match[2] || 0);
            return feet * 12 + inches;
          };

          const hasMeasurements =
            measurements &&
            (measurements.bust ||
              measurements.waist ||
              measurements.hip ||
              measurements.height ||
              measurements.dressSize ||
              measurements.skinTone);

          if (hasMeasurements) {
            await verifyEmailWithMeasurements.mutateAsync({
              email,
              measurement: {
                bust: parseNumber(measurements.bust),
                waist: parseNumber(measurements.waist),
                hips: parseNumber(measurements.hip),
                height: parseHeightInches(measurements.height),
                dressSize: parseNumber(measurements.dressSize),
                skinTone: String(measurements.skinTone || ""),
              },
            });
          } else {
            await verifyEmailMutation.mutateAsync({ email });
          }
          setCurrentStep(1);
        } catch (error) {
          console.error("Email verification failed:", error);
        }
      }
    }

    // Step 2: Verify OTP
    if (currentStep === 1) {
      const otpValid = await methods.trigger("verificationCode");

      if (otpValid) {
        const email = methods.getValues("email");
        const otpArray = methods.getValues("verificationCode");
        const otp = otpArray.join("");

        try {
          const response = await verifyOtpMutation.mutateAsync({ email, otp });

          // Invalid or expired OTP
          if (response && !response.isSuccess) {
            setCurrentStep(1);
            return;
          }

          setEmailVerified(true);
          setCurrentStep(2);
        } catch (error) {
          console.error("OTP verification failed:", error);
        }
      }
    }

    // Step 3: Personal details (KYC)
    if (currentStep === 2) {
      const detailsValid = await methods.trigger([
        "firstName",
        "lastName",
        "dateOfBirth",
        "deliveryAddress",
      ]);
      if (detailsValid) {
        setCurrentStep(3);
      }
    }

    // Step 4: Final registration
    if (currentStep === 3) {
      const passwordValid = await methods.trigger([
        "password",
        "confirmPassword",
      ]);

      if (passwordValid) {
        methods.handleSubmit(onSubmit)();
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!emailVerified) {
      console.error("Email not verified");
      return;
    }

    try {
      // For now, we'll use dummy measurement data since this is user registration
      // In a real app, you'd collect measurements separately or have defaults
      await registerMutation.mutateAsync({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        deliveryAddress: data.deliveryAddress,
        password: data.password,
        measurement: {
          bust: 36, // Default values - should be collected elsewhere
          waist: 28,
          hips: 38,
          skinTone: "medium",
        },
      });
      toggleSwitch();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <AuthLayout
        title={formSteps[currentFormStep].title}
        description={formSteps[currentFormStep].caption}
        googleAutBtnText={formSteps[currentFormStep].googleAutBtnText}
        // googleAuthTrigger={googleLogin}
      >
        <>
          <form className="w-full flex flex-col gap-6">
            <StepContent step={currentStep} />

            <button
              type="submit"
              onClick={onNext}
              className={`w-full text-white px-5 py-3 rounded-md ${
                !methods.formState.isValid ||
                verifyEmailMutation.isPending ||
                verifyOtpMutation.isPending ||
                registerMutation.isPending
                  ? "disabled:opacity-50 disabled:cursor-not-allowed"
                  : "opacity-100"
              } capitalize bg-primary-500`}
              disabled={
                verifyEmailMutation.isPending ||
                verifyOtpMutation.isPending ||
                registerMutation.isPending ||
                verifyEmailWithMeasurements.isPending
              }
            >
              {currentStep === formSteps.length - 1 ? (
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`${
                      registerMutation.isPending ? "hidden" : "block"
                    }`}
                  >
                    Submit
                  </span>

                  <Spinner
                    size="md"
                    speed="fast"
                    isLoading={registerMutation.isPending}
                    className="ml-1"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`${
                      verifyEmailMutation.isPending ||
                      verifyOtpMutation.isPending
                        ? "hidden"
                        : "block"
                    }`}
                  >
                    Continue
                  </span>

                  <Spinner
                    size="md"
                    speed="fast"
                    isLoading={
                      verifyEmailMutation.isPending ||
                      verifyOtpMutation.isPending ||
                      registerMutation.isPending ||
                      verifyEmailWithMeasurements.isPending
                    }
                    arcColor="#ffff"
                    className="ml-1"
                  />
                </div>
              )}
            </button>

            <Link to="/auth/login" className="text-center">
              Existing User? <span className="text-primary-500">Login</span>
            </Link>
          </form>

          <Modal isOpen={isOpen} containerClassName="w-[25rem]">
            <div className="w-full max-w-[] flex flex-col items-center justify-center gap-3">
              <img src={checkmark} alt="" className="w-[5.25rem] h-auto" />

              <strong className="font-lora font-medium text-[2rem]">
                Welcome Aboard!
              </strong>

              <p className="text-neutral-700 leading-araafit text-center font-light">
                Your account has been successfully created.
              </p>

              <Button
                text="Go to dashboard"
                variant="solid"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              />
            </div>
          </Modal>
        </>
      </AuthLayout>
    </FormProvider>
  );
}
