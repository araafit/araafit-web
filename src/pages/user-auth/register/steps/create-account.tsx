import { useFormContext } from "react-hook-form";
import { type FormValues } from "../register";
/* -------------------------------------------------- */

/**
 * Create account
 *
 * @returns ReactElement
 */
export default function CreateAccount() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="" className="text-neutral-950 capitalize mb-2">
        Email
      </label>

      <div className="w-full">
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
          })}
          className="w-full border border-grey-300 rounded-md p-4 focus:outline-none mb-1"
          placeholder="Enter email"
        />

        {errors.firstName && <p className="text-[0.875rem] text-red-500">{errors.firstName.message}</p>}
      </div>
    </div>
  );
}
