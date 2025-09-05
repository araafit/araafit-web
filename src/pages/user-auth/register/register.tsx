import React, { useState } from "react";
import AuthLayout from "../../../layouts/auth/auth-layout";
import {
  CreateAccount,
  VerifyEmail,
  KYC,
  SetPassword,
} from "./steps/import-entry";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { formSteps } from "./form-steps-data";
import Modal from "../../../shared-components/modal";
import { useSwitch } from "../../../shared-hooks/switch";
import checkmark from "../checkmark.png";
import Spinner from "../../../shared-components/spinner";
import Button from "../../../shared-components/button";
// import { useNavigate } from "react-router-dom";
/* ------------------------------------------------------------------------- */

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
  const [isLoading, setLoading] = useState(false);

  // const navigate = useNavigate();

  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      verificationCode: ["", "", "", "", "", ""],
    },
  });

  const currentFormStep = formSteps.findIndex((_, idx) => idx === currentStep);

  const onNext = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const valid = await methods.trigger();

    if (valid) {
      if (currentStep < formSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        methods.handleSubmit(onSubmit)();
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    console.log("form data", data);
    setLoading(!isLoading);

    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    toggleSwitch();
  };

  return (
    <FormProvider {...methods}>
      <AuthLayout
        title={formSteps[currentFormStep].title}
        description={formSteps[currentFormStep].caption}
        googleAutBtnText={formSteps[currentFormStep].googleAutBtnText}
        googleAuthTrigger={formSteps[currentFormStep].googleAuthTrigger}
      >
        <>
          <form className="w-full flex flex-col gap-6">
            <StepContent step={currentStep} />

            <button
              type="submit"
              onClick={onNext}
              className={`w-full text-white px-5 py-3 rounded-md ${
                !methods.formState.isValid ? "bg-neutral-50" : "bg-primary-500"
              } capitalize`}
              disabled={methods.formState.isValid ? false : true}
            >
              {currentStep === formSteps.length - 1 ? (
                <div className="flex items-center justify-center">
                  <span>Submit</span>
                  {isLoading && (
                    <Spinner size="sm" speed="fast" className="ml-1" />
                  )}
                </div>
              ) : (
                "Continue"
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
                onClick={() => console.log("Should navigate to dashboard")}
              />
            </div>
          </Modal>
        </>
      </AuthLayout>
    </FormProvider>
  );
}
