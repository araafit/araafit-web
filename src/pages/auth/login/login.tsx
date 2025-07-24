import AuthLayout from "../../../layouts/auth/auth-layout";
import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../../../shared-components/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSwitch } from "../../../hooks/switch";
import Spinner from "../../../shared-components/spinner";

/* ------------------------------------------------------ */

type FormValues = { email: string; password: string };

/**
 * Araafit Login page
 *
 * @returns ReactElement
 */
export default function Login() {
  const { toggleSwitch, switchValue: isOpen } = useSwitch(false);
  const [isLoading, setLoading] = useState(false);
  const googleAuth = () => console.log("Google auth");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "all" });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("form data", data);
    setLoading(!isLoading);

    await new Promise((res) => setTimeout(res, 9000));
    setLoading(false);
    toggleSwitch();
  };

  return (
    <AuthLayout
      title="Login"
      description="Log in to access your profile, saved styles, and past orders."
      googleAutBtnText="Continue with Google"
      googleAuthTrigger={googleAuth}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="w-full flex flex-col gap-4 mb-6">
          <div className="flex flex-col justify-center gap-2">
            <label>Email</label>
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
              placeholder="Enter email"
            />
            {errors.email && (
              <small className="text-red-400">{errors.email.message}</small>
            )}
          </div>

          <div className="flex flex-col justify-center gap-2">
            <label>Password</label>
            <input
              {...register("password", {
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
              type="password"
              className="p-4 border border-gray-300 rounded-[6px] focus:outline-none"
              placeholder="Enter password"
            />
            {errors.password && (
              <small className="text-red-400">{errors.password.message}</small>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <p className="self-start text-neutral-900">
            Forgot Password?{" "}
            <Link to="/auth/reset" className="text-primary-500">
              Reset
            </Link>
          </p>

          <Button
            type="submit"
            variant="clear"
            className={`w-full max-w-[23.4375rem] ${
              !isValid
                ? "bg-neutral-50 text-white"
                : "bg-primary-500 text-white"
            }`}
          >
            <div className="w-full flex items-center justify-center">
              <span>Login</span>
              {isLoading && <Spinner size="sm" speed="fast" className="ml-1" />}
            </div>
          </Button>

          <p className="text-neutral-900">
            New User?{" "}
            <Link to="/auth/register" className="text-primary-500">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
