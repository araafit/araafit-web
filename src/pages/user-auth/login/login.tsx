import AuthLayout from "../../../layouts/auth/auth-layout";
import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../../../shared-components/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../../../shared-components/spinner";
import { useLogin } from "../../../hooks/auth.hooks";
import { useAuth } from "../../../hooks/use-auth";

/* ------------------------------------------------------ */

type FormValues = { email: string; password: string };
type LoginProps = {
  userType: "guest" | "admin";
};

/**
 * Araafit Login page
 *
 * @returns ReactElement
 */
export default function Login({ userType }: LoginProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const loginMutation = useLogin();

  const googleAuth = () => console.log("Google auth");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "all" });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      if (userType === "admin") {
        navigate("/admin-dashboard/overview");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, authLoading, navigate, userType]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthLayout
      title="Login"
      description={
        userType === "guest"
          ? "Log in to access your profile, saved styles, and past orders."
          : "Admin login"
      }
      {...(userType === "guest"
        ? {
            googleAutBtnText: "Continue with Google",
            googleAuthTrigger: googleAuth,
          }
        : {})}
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
          {loginMutation.isError && (
            <div className="w-full border border-red-500 bg-red-200 rounded-sm text-red-500 text-sm p-1">
              login failed. Please check credentials and try again.
            </div>
          )}

          <p className="self-start text-neutral-900">
            Forgot Password?{" "}
            <Link to="/auth/reset" className="text-primary-500">
              Reset
            </Link>
          </p>

          <Button
            type="submit"
            variant="clear"
            disabled={!isValid || loginMutation.isPending}
            className={`w-full max-w-[23.4375rem] ${
              !isValid || loginMutation.isPending
                ? "bg-neutral-50 text-white"
                : "bg-primary-500 text-white"
            }`}
          >
            <div className="w-full flex items-center justify-center">
              {!loginMutation.isPending && <span>Login</span>}
              <Spinner
                size="md"
                speed="fast"
                className="ml-1"
                isLoading={loginMutation.isPending && !loginMutation.isError}
                circleColor="#9a6c50"
              />
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
