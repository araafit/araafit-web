import { memo, useEffect, useState } from "react";
import Button from "../../../../shared-components/button";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { rtw1 } from "../../images/image-entry";
import { useUser } from "../../../../stores/auth-store";
import { useUpdateProfile } from "../../../../hooks/users.hooks";

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
  const [imageUpload] = useState(rtw1);
  const user = useUser();
  const updateProfile = useUpdateProfile();
  const [editInfo, setEditInfo] = useState(false);

  const {
    register,
    formState: { errors, isValid },
    setValue,
    handleSubmit,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      zipCode: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      // Prefill with user info
      const values: FormValues = {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        city: user.city ?? "",
        zipCode: user.zipCode ?? "",
        address: user.deliveryAddress ?? "",
      };
      Object.entries(values).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value, { shouldValidate: true });
      });

      setEditInfo(true);
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // console.log("Form submitted with data:", data);
    updateProfile.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      deliveryAddress: data.address,
      city: data.city,
      zipCode: data.zipCode,
    });
  };

  return (
    <div className="bg-white py-3 lg:py-5 px-4 lg:px-8 rounded-md flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0">
        <h5 className="font-semibold text-neutral-900 mb-3 text-lg lg:text-[1.75rem]">
          Profile Information
        </h5>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditInfo(!editInfo)}>
          <PencilSimpleIcon />

          <span className="text-sm lg:text-base">Edit Info</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-7 max-xl:grid-cols-1 gap-4">
          <div className="w-full lg:w-[34rem] flex flex-col gap-2">
            <label htmlFor="" className="w-full text-sm lg:text-[1rem] text-[#676767]">
              First Name
            </label>

            <input
              type="text"
              className="w-full p-3 lg:p-4 border border-gray-300 outline-none rounded-[6px] text-sm lg:text-base"
              {...register("firstName", {
                required: "First name is required",
              })}
              disabled={editInfo}
            />

            {errors.firstName && (
              <small className="text-red-400">{errors.firstName.message}</small>
            )}
          </div>

          <div className="grow flex flex-col gap-2">
            <label htmlFor="" className="w-full text-sm lg:text-[1rem] text-[#676767]">
              Last Name
            </label>

            <input
              type="text"
              className="w-full p-3 lg:p-4 border border-gray-300 outline-none rounded-[6px] text-sm lg:text-base"
              {...register("lastName", {
                required: "Last name is required",
              })}
              disabled={editInfo}
            />

            {errors.lastName && (
              <small className="text-red-400">{errors.lastName.message}</small>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-7 max-xl:grid-cols-1 gap-4">
          <div className="w-full lg:w-[34rem] flex flex-col gap-2">
            <label
              htmlFor="email"
              className="w-full text-[1rem] text-[#676767]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              className="w-full p-3 lg:p-4 border border-gray-300 outline-none rounded-[6px] text-sm lg:text-base disabled:cursor-not-allowed"
              {...register("email")}
              disabled
            />

            {/* {errors.email && (
              <small className="text-red-400">{errors.email.message}</small>
            )} */}
            <small className="text-xs text-primary-500">Email can't be edited</small>
          </div>

          <div className="grow flex flex-col gap-2">
            <label htmlFor="" className="w-full text-sm lg:text-[1rem] text-[#676767]">
              Phone Number
            </label>

            <input
              type="tel"
              className="w-full p-3 lg:p-4 border border-gray-300 outline-none rounded-[6px] text-sm lg:text-base"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
              disabled={editInfo}
            />

            {errors.phoneNumber && (
              <small className="text-red-400">
                {errors.phoneNumber.message}
              </small>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-7 max-xl:grid-cols-1 gap-4">
          <div className="w-full lg:w-[34rem] flex flex-col gap-2">
            <label htmlFor="city" className="w-full text-[1rem] text-[#676767]">
              City/Town
            </label>

            <input
              type="text"
              className="w-full p-3 lg:p-4 border border-gray-300 outline-none rounded-[6px] text-sm lg:text-base"
              {...register("city", {
                required: "City/Town is required",
              })}
              disabled={editInfo}
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
              className="w-full p-3 lg:p-4 border border-gray-300 outline-none rounded-[6px] text-sm lg:text-base"
              {...register("zipCode")}
              disabled={editInfo}
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
            disabled={editInfo}
          />

          {errors.address && (
            <small className="text-red-400">{errors.address.message}</small>
          )}
        </div>

        <Button
          type="submit"
          text="Save"
          className="w-full max-w-[13rem] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          variant="solid"
          disabled={!isValid || editInfo || updateProfile.isPending}
        />
      </form>
    </div>
  );
}

export default memo(ProfileInfo);
