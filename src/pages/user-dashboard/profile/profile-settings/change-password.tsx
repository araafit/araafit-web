import React from "react";
import Button from "../../../../shared-components/button";
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react";
import { useForm, type SubmitHandler } from "react-hook-form";

/* ------------------------------------------------------------------------------------------ */

interface ChangePassword {
  currentPassword: string | boolean;
  newPassword: string | boolean;
  retypePassword: string | boolean;
}

/**
 * Change password on profile page
 *
 *
 * @returns ReactElement
 */
export default function ChangePassword() {
  const [passwordReveal, setPasswordReveal] = React.useState<ChangePassword>({
    currentPassword: false,
    newPassword: false,
    retypePassword: false,
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ChangePassword>();

  const onSubmit: SubmitHandler<ChangePassword> = (data: any) => {
    console.log(data);
  };

  const revealPassword = (name: string) => {
    if (name.toLowerCase() === "currentpassword") {
      setPasswordReveal({
        ...passwordReveal,
        currentPassword: !passwordReveal.currentPassword,
      });
    }
  };

  return (
    <div className="bg-white py-5 px-8 rounded-md">
      <form
        className="w-[54.9375rem] flex justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-[300px]">
          <div className="flex flex-col gap-2 mb-5">
            <h4 className="font-semibold text-[28px] text-neutral-900">
              Change Password
            </h4>
            <p>Keep your account secure by updating your password.</p>
          </div>

          <Button
            type="submit"
            text="Update Password"
            variant="solid"
            disabled={!isValid}
            className="disabled:bg-neutral-100 disabled:text-neutral-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="w-[24rem] flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="currentPassword"
              className="text-[0.875rem] text-[#1C1C1C]"
            >
              Current Password
            </label>
            <div className="border border-neutral-100 rounded-md p-4 flex items-center justify-between gap-3">
              <input
                type={passwordReveal.currentPassword ? "text" : "password"}
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
                id="currentPassword"
                placeholder="Enter password"
                className="grow outline-none placeholder:text-neutral-100"
              />
              {passwordReveal.currentPassword ? (
                <EyeIcon
                  className="cursor-pointer"
                  onClick={() => revealPassword("currentPassword")}
                />
              ) : (
                <EyeClosedIcon
                  className="cursor-pointer"
                  onClick={() => revealPassword("currentPassword")}
                />
              )}
            </div>
            {errors.currentPassword && (
              <small className="text-red-400">
                {errors.currentPassword.message}
              </small>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="newPassword"
              className="text-[0.875rem] text-[#1C1C1C]"
            >
              New Password
            </label>
            <div className="border border-neutral-100 rounded-md p-4 flex items-center justify-between gap-3">
              <input
                type={passwordReveal.newPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                })}
                id="newPassword"
                placeholder="Enter password"
                className="grow outline-none placeholder:text-neutral-100"
              />
              {passwordReveal.newPassword ? (
                <EyeIcon
                  className="cursor-pointer"
                  onClick={() => revealPassword("newPassword")}
                />
              ) : (
                <EyeClosedIcon
                  className="cursor-pointer"
                  onClick={() => revealPassword("newPassword")}
                />
              )}
            </div>
            {errors.newPassword && (
              <small className="text-red-400">
                {errors.newPassword.message}
              </small>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="retypePassword"
              className="text-[0.875rem] text-[#1C1C1C]"
            >
              Retype Password
            </label>
            <div className="border border-neutral-100 rounded-md p-4 flex items-center justify-between gap-3">
              <input
                type={passwordReveal.retypePassword ? "text" : "password"}
                {...register("retypePassword", {
                  required: "Please retype new password",
                })}
                id="retypePassword"
                placeholder="Enter password"
                className="grow outline-none placeholder:text-neutral-100"
              />
              {passwordReveal.retypePassword ? (
                <EyeIcon
                  className="cursor-pointer"
                  onClick={() => revealPassword("retypePassword")}
                />
              ) : (
                <EyeClosedIcon
                  className="cursor-pointer"
                  onClick={() => revealPassword("retypePassword")}
                />
              )}
            </div>
            {errors.retypePassword && (
              <small className="text-red-400">
                {errors.retypePassword.message}
              </small>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
