import { useState } from "react";
import AuthLayout from "../../../layouts/auth/auth-layout";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../../shared-components/button";
import Modal from "../../../shared-components/modal";
import { useSwitch } from "../../../shared-hooks/switch";
import checkmark from "../../user-auth/checkmark.png";
import Spinner from "../../../shared-components/spinner";
import { useAdminForgotPassword } from "../../../hooks/admin-auth.hooks";

/* ------------------------------------------------------------- */

/**
 * Admin confirm email for password reset page.
 *
 * @returns React Element
 */
export default function AdminConfirmEmail() {
  const { toggleSwitch, switchValue: isOpen } = useSwitch(false);
  const adminForgotPasswordMutation = useAdminForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ email: string }>({ mode: "all" });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    try {
      await adminForgotPasswordMutation.mutateAsync(data);
      toggleSwitch();
    } catch (error) {
      console.error("Admin forgot password failed:", error);
    }
  };

  return (
    <AuthLayout
      title="Admin - Reset Password"
      description="Enter your admin email to receive a password reset link."
    >
      <>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mb-6"
        >
          <div className="flex flex-col justify-center gap-2">
            <label>Admin Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              className="p-4 border border-gray-300 rounded-[6px] focus:outline-none"
              placeholder="Enter admin email"
            />
            {errors.email && (
              <small className="text-red-400">{errors.email.message}</small>
            )}
          </div>

          <Button
            type="submit"
            variant="clear"
            disabled={!isValid || adminForgotPasswordMutation.isPending}
            className={`w-full mb-6 ${
              !isValid || adminForgotPasswordMutation.isPending
                ? "bg-neutral-50 text-white"
                : "bg-primary-500 text-white"
            }`}
          >
            <div className="w-full flex items-center justify-center">
              <span>Send Reset Link</span>
              {adminForgotPasswordMutation.isPending && (
                <Spinner size="sm" speed="fast" className="ml-1" />
              )}
            </div>
          </Button>

          <p className="text-neutral-900 text-center">
            Back to{" "}
            <Link to="/auth/admin-login" className="text-primary-500">
              Admin Login
            </Link>
          </p>
        </form>

        <Modal isOpen={isOpen} containerClassName="w-[25rem]">
          <div className="w-full max-w-[] flex flex-col items-center justify-center gap-3">
            <img src={checkmark} alt="" className="w-[5.25rem] h-auto" />

            <strong className="font-lora font-medium text-[2rem]">
              Reset Link Sent
            </strong>

            <p className="text-neutral-700 leading-araafit text-center font-light">
              A password reset link has been sent to your admin email address.
            </p>
          </div>
        </Modal>
      </>
    </AuthLayout>
  );
}
