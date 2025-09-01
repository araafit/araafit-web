import { useFormContext } from "react-hook-form";
import { type FormValues } from "../register";
/* ----------------------------------------------------- */

/**
 * Know your customer
 *
 *
 * @returns ReactElement
 */
export default function KYC() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex flex-col">
        <label htmlFor="" className="text-neutral-950 capitalize mb-2">
          First Name
        </label>

        <input
          type="text"
          {...register("firstName", {
            required: "First name is required",
          })}
          className="w-full border border-grey-300 rounded-md p-4 focus:outline-none mb-1"
          placeholder="First name"
        />

        {errors.firstName && <p className="text-[0.875rem] text-red-500">{errors.firstName.message}</p>}
      </div>

      <div className="w-full flex flex-col">
        <label htmlFor="" className="text-neutral-950 capitalize mb-2">
          Last Name
        </label>

        <input
          type="text"
          {...register("lastName", {
            required: "Last name is required",
          })}
          className="w-full border border-grey-300 rounded-md p-4 focus:outline-none mb-1"
          placeholder="Last name"
        />

        {errors.lastName && <p className="text-[0.875rem] text-red-500">{errors.lastName.message}</p>}
      </div>

      <div className="w-full flex flex-col">
        <label htmlFor="" className="text-neutral-950 capitalize mb-2">
          Date of Birth
        </label>

        <input
          type="date"
          {...register("dateOfBirth", {
            required: "Date is required",
          })}
          className="w-full border border-grey-300 rounded-md p-4 focus:outline-none mb-1"
          placeholder="Pick date of birth"
        />

        {errors.dateOfBirth && <p className="text-[0.875rem] text-red-500">{errors.dateOfBirth.message}</p>}
      </div>

      <div className="w-full flex flex-col">
        <label htmlFor="" className="text-neutral-950 capitalize mb-2">
          Delivery Address
        </label>

        <textarea
          {...register("deliveryAddress", {
            required: "Delivery Address is required",
          })}
          className="w-full border border-grey-300 rounded-md p-4 focus:outline-none mb-1"
          placeholder="Enter your address"
        />

        {errors.deliveryAddress && <p className="text-[0.875rem] text-red-500">{errors.deliveryAddress.message}</p>}
      </div>
    </div>
  );
}
