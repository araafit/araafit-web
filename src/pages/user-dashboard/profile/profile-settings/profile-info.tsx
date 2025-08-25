import { memo, useState } from "react";
import Button from "../../../../shared-components/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { rtw1 } from "../../images/image-entry";

/* --------------------------------------------------------------------------- */

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
 * General profile info
 *
 * @returns ReactElement
 */
function ProfileInfo() {
  //@ts-ignore
  const [imageUpload, setImageUpload] = useState(rtw1);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data: any) => {
    console.log(data);
  };

  return (
    <div className="bg-white py-5 px-8 rounded-md flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h5 className="font-semibold text-neutral-900 mb-3 text-[1.75rem]">
          Profile Information
        </h5>

        <div className="flex items-center gap-2">
          <PencilSimpleIcon />

          <span>Edit Info</span>
        </div>
      </div>

      <div>
        <div>
          <label
            htmlFor="profile-dp"
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="size-[48px] border-2 border-[#E8E8E8] rounded-full relative flex items-center justify-center">
              {imageUpload && (
                <img
                  src={imageUpload}
                  alt=""
                  className="size-full object-cover object-top rounded-full"
                />
              )}
              {!imageUpload && (
                <span className="text-neutral-900 font-medium">EN</span>
              )}
              <div className="absolute size-[12px] rounded-full bg-green-500 right-0 bottom-0" />
            </div>
            <span className="text-[0.875rem] text-neutral-500">
              Click to change image
            </span>
            <input
              type="file"
              name="profile-dp"
              id="profile-dp"
              className="hidden"
            />
          </label>
        </div>
      </div>

      <hr />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[1.8125rem]"
      >
        <div className="grid grid-cols-2 gap-7">
          <div className="w-[34rem] flex flex-col gap-2">
            <label htmlFor="" className="w-full text-[1rem] text-[#676767]">
              First Name
            </label>

            <input
              type="text"
              className="w-full p-4 border border-gray-300 outline-none rounded-[6px]"
              {...register("firstName", {
                required: "First name is required",
              })}
            />

            {errors.firstName && (
              <small className="text-red-400">{errors.firstName.message}</small>
            )}
          </div>

          <div className="grow flex flex-col gap-2">
            <label htmlFor="" className="w-full text-[1rem] text-[#676767]">
              Last Name
            </label>

            <input
              type="text"
              className="w-full p-4 border border-gray-300 outline-none rounded-[6px]"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />

            {errors.lastName && (
              <small className="text-red-400">{errors.lastName.message}</small>
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
              className="w-full p-4 border border-gray-300 outline-none rounded-[6px]"
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
              className="w-full p-4 border border-gray-300 outline-none rounded-[6px]"
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
            <label htmlFor="city" className="w-full text-[1rem] text-[#676767]">
              City/Town
            </label>

            <input
              type="text"
              className="w-full p-4 border border-gray-300 outline-none rounded-[6px]"
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
              className="w-full p-4 border border-gray-300 outline-none rounded-[6px]"
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
            className="w-full p-4 border border-gray-300 outline-none rounded-[6px]"
            {...register("address", {
              required: "City/Town is required",
            })}
            placeholder="Enter your address"
          />

          {errors.address && (
            <small className="text-red-400">{errors.address.message}</small>
          )}
        </div>

        <Button
          text="Save"
          className="w-[222px] disabled:bg-neutral-100 text-neutral-300 disabled:cursor-not-allowed"
          variant="solid"
          disabled={!isValid}
        />
      </form>
    </div>
  );
}

export default memo(ProfileInfo);
