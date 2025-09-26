import React from "react";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../button";
import Spinner from "../spinner";
import { useUpdateProfile } from "../../hooks/users.hooks";
import { useUser } from "../../stores/auth-store";

/* ----------------------------------------------------------------- */

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  zipCode: string;
  address: string;
}

/**
 * Checkout delivery information component
 *
 * @returns ReactElement
 */
export default function CheckoutDeliveryInfo({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const [editInfo, setEditInfo] = React.useState(false);
  const updateProfile = useUpdateProfile();
  const user = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onTouched" });

  if (user) {
    setValue("firstName", (user.firstName as string) || "");
    setValue("lastName", (user.lastName as string) || "");
    setValue("email", (user.email as string) || "");
    setValue("city", (user.city as string) || "");
    setValue("address", (user.deliveryAddress as string) || "");
    setValue("phoneNumber", (user.phoneNumber as string) || "");
    setValue("zipCode", (user.zipCode as string) || "");
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // setLoading(true);

    updateProfile.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      deliveryAddress: data.address,
      city: data.city,
      zipCode: data.zipCode,
    });
  };

  // Switch to payment info on success
  if (updateProfile.isSuccess) {
    onContinue();
  }

  return (
    <div className="w-full bg-white mt-5 rounded-md p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[1.75rem] capitalize">
          Delivery information
        </h2>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setEditInfo((prev) => !prev)}
        >
          <PencilSimpleIcon />
          <span>{!editInfo ? "Edit Info" : "Cancel"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-[1.8125rem]">
          <div className="grid grid-cols-2 gap-7">
            <div className="w-[34rem] flex flex-col gap-2">
              <label htmlFor="" className="w-full text-[1rem] text-[#676767]">
                First Name
              </label>

              <input
                type="text"
                className="w-full p-4 border border-gray-300 outline-none rounded-[6px] disabled:cursor-not-allowed"
                {...register("firstName", {
                  required: "First name is required",
                })}
                disabled={!editInfo}
              />

              {errors.firstName && (
                <small className="text-red-400">
                  {errors.firstName.message}
                </small>
              )}
            </div>

            <div className="grow flex flex-col gap-2">
              <label htmlFor="" className="w-full text-[1rem] text-[#676767]">
                Last Name
              </label>

              <input
                type="text"
                className="w-full p-4 border border-gray-300 outline-none rounded-[6px] disabled:cursor-not-allowed"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                disabled={!editInfo}
              />

              {errors.lastName && (
                <small className="text-red-400">
                  {errors.lastName.message}
                </small>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-7">
            <div className="w-[34rem] flex flex-col gap-2">
              <label
                htmlFor="email"
                className="w-full text-[1rem] text-[#676767]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                className="w-full p-4 border border-gray-300 outline-none rounded-[6px] disabled:cursor-not-allowed"
                disabled={!editInfo}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
              />

              {errors.email && (
                <small className="text-red-400">{errors.email.message}</small>
              )}
            </div>

            <div className="grow flex flex-col gap-2">
              <label htmlFor="" className="w-full text-[1rem] text-[#676767]">
                Phone Number
              </label>

              <input
                type="tel"
                className="w-full p-4 border border-gray-300 outline-none rounded-[6px] disabled:cursor-not-allowed"
                disabled={!editInfo}
                {...register("phoneNumber", {
                  required: "Phone Number",
                })}
              />

              {errors.phoneNumber && (
                <small className="text-red-400">
                  {errors.phoneNumber.message}
                </small>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-7">
            <div className="w-[34rem] flex flex-col gap-2">
              <label
                htmlFor="city"
                className="w-full text-[1rem] text-[#676767]"
              >
                City/Town
              </label>

              <input
                type="text"
                className="w-full p-4 border border-gray-300 outline-none rounded-[6px] disabled:cursor-not-allowed"
                disabled={!editInfo}
                {...register("city", {
                  required: "City/Town is required",
                })}
              />

              {errors.city && (
                <small className="text-red-400">{errors.city.message}</small>
              )}
            </div>

            <div className="grow flex flex-col gap-2">
              <label
                htmlFor="zipCode"
                className="w-full text-[1rem] text-[#676767]"
              >
                Zip Code (optional)
              </label>

              <input
                type="text"
                className="w-full p-4 border border-gray-300 outline-none rounded-[6px] disabled:cursor-not-allowed"
                disabled={!editInfo}
                {...register("zipCode")}
              />

              {errors.zipCode && (
                <small className="text-red-400">{errors.zipCode.message}</small>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="address"
              className="w-full text-[1rem] text-[#676767]"
            >
              Address
            </label>

            <input
              type="text"
              className="w-full p-4 border border-gray-300 outline-none rounded-[6px] disabled:cursor-not-allowed"
              disabled={!editInfo}
              {...register("address", {
                required: "City/Town is required",
              })}
            />

            {errors.address && (
              <small className="text-red-400">{errors.address.message}</small>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center py-[2.5rem] px-[1.5rem]">
          <Button
            type="submit"
            variant="solid"
            className={`w-full max-w-[23.4375rem] disabled:bg-neutral-100 disabled:cursor-not-allowed`}
            disabled={!isValid}
          >
            <div className="flex items-center justify-center gap-1">
              <span>Continue</span>
              <Spinner
                size="sm"
                speed="fast"
                isLoading={updateProfile.isPending}
                circleColor="#9A6C50"
              />
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}
