import AuthLayout from "../../../layouts/auth/auth-layout";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import Button from "../../../shared-components/button";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import Modal from "../../../shared-components/modal";
import { useSwitch } from "../../../shared-hooks/switch";
import { useNavigate } from "react-router-dom";
import checkmark from "../checkmark.png";
import Spinner from "../../../shared-components/spinner";

/* ------------------------------------------------------------------------------ */

/**
 * Araafit password reset page.
 *
 * @returns ReactElement
 */
export default function PasswordResetPage() {
  type FormValues = { newPassword: string; confirmPassword: string };

  const { toggleSwitch, switchValue: isOpen } = useSwitch(false);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "all" });
  const password = useWatch({ control, name: "newPassword" });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const toggleNewPassword = () =>
    setShowPassword((prev) => ({ ...prev, newPassword: !prev.newPassword }));
  const toggleConfirmPassword = () =>
    setShowPassword((prev) => ({
      ...prev,
      confirmPassword: !prev.confirmPassword,
    }));

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("form data", data);
    setLoading(!isLoading);

    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    toggleSwitch();
  };

  return (
    <AuthLayout
      title="Set a Password"
      description="Set a secure password to protect your personal details and saved measurements."
    >
      <>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-4 mb-6">
            <div className="flex flex-col justify-center gap-2">
              <label>New Password</label>
              <div className="p-4 border border-gray-300 rounded-[6px] flex items-center justify-between">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                      message:
                        "Password must include letters, numbers, and special characters",
                    },
                  })}
                  className="w-full focus:outline-none"
                  placeholder="Enter password"
                />
                <span className="cursor-pointer ml-1" onClick={toggleNewPassword}>
                  {showPassword.newPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </span>
              </div>
              {errors.newPassword && (
                <small className="text-red-400">
                  {errors.newPassword.message}
                </small>
              )}
            </div>

            {/*  */}

            <div className="flex flex-col justify-center gap-2">
              <label>Retype password</label>
              <div className="p-4 border border-gray-300 rounded-[6px] flex items-center justify-between">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                      message:
                        "Password must include letters, numbers, and special characters",
                    },
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full focus:outline-none"
                  placeholder="Enter password"
                />
                <span
                  className="cursor-pointer ml-1"
                  onClick={toggleConfirmPassword}
                >
                  {showPassword.confirmPassword ? (
                    <EyeSlashIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <small className="text-red-400">
                  {errors.confirmPassword.message}
                </small>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="clear"
            className={`w-full ${
              !isValid
                ? "bg-neutral-50 text-white"
                : "bg-primary-500 text-white"
            }`}
          >
            <div className="w-full flex items-center justify-center">
              <span>Reset password</span>
              {isLoading && <Spinner size="sm" speed="fast" className="ml-1" />}
            </div>
          </Button>
        </form>

        <Modal
          isOpen={isOpen}
          // onClose={toggleSwitch}
          containerClassName="w-[25rem]"
        >
          <div className="w-full max-w-[] flex flex-col items-center justify-center gap-3">
            <img src={checkmark} alt="" className="w-[6.25rem] h-auto" />

            <strong className="font-lora font-medium text-[2rem]">
              Reset Password
            </strong>

            <p className="text-neutral-700 leading-araafit text-center font-light">
              You have successfully reset your password. Click below to login.
            </p>

            <Button
              text="Login"
              variant="solid"
              className="w-full"
              onClick={() => navigate("/auth/login")}
            />
          </div>
        </Modal>
      </>
    </AuthLayout>
  );
}
