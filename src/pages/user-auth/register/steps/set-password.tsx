import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { type FormValues } from "../register";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";

/* --------------------------------- */

/**
 * Set password
 *
 *
 * @returns ReactElement
 */
export default function SetPassword() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  const password = useWatch({ control, name: "password" });

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

  return (
    <div className="w-full flex flex-col gap-4 mb-6">
      <div className="flex flex-col justify-center gap-2">
        <label>New Password</label>
        <div className="p-4 border border-gray-300 rounded-[6px] flex items-center justify-between">
          <input
            type={showPassword.newPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
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
          <span className="cursor-pointer" onClick={toggleNewPassword}>
            {showPassword.newPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </span>
        </div>
        {errors.password && (
          <small className="text-red-400">{errors.password.message}</small>
        )}
      </div>

      {/*  */}

      <div className="flex flex-col justify-center gap-2">
        <label>Retype password</label>
        <div className="p-4 border border-gray-300 rounded-[6px] flex items-center justify-between">
          <input
            type={showPassword.confirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Confirm password is required",
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
            placeholder="Confirm password"
          />
          <span className="cursor-pointer" onClick={toggleConfirmPassword}>
            {showPassword.confirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </span>
        </div>
        {errors.confirmPassword && (
          <small className="text-red-400">
            {errors.confirmPassword.message}
          </small>
        )}
      </div>
    </div>
  );
}
