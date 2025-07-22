import AuthLayout from "../../../layouts/auth/auth-layout";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../../shared-components/button";

/* ------------------------------------------------------------- */

/**
 * Araafit confirm email for password reset page.
 *
 * @returns React Element
 */
export default function ConfirmEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ email: string }>({ mode: "all" });

  const onSubmit: SubmitHandler<{ email: string }> = (data) => {
    console.log("form data", data);

    console.log(data); // Send data
  };

  return (
    <AuthLayout
      title="Confirm Email"
      description="Set a secure password to protect your personal details and saved measurements."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4 mb-6"
      >
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

        <Button
          type="submit"
          text="Login"
          variant="clear"
          className={`w-full mb-6 ${
            !isValid ? "bg-neutral-50 text-white" : "bg-primary-500 text-white"
          }`}
        />

        <p className="text-neutral-900 text-center">
          Back to{" "}
          <Link to="/auth/login" className="text-primary-500">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
