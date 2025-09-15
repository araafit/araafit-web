import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../ui/dialog";
import Button from "../../../../shared-components/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useAddRider,
  useUpdateRider,
} from "../../../../hooks/admin-orders.hooks";
import { useState } from "react";

interface RiderDialogContentProps {
  orderId: string;
  isEdit?: boolean;
  existingRider?: {
    name: string;
    phone: string;
    deliveryDate: string;
  };
}

interface RiderFormData {
  name: string;
  phone: string;
  deliveryDate: string;
}

export function RiderDialogContent({
  orderId,
  isEdit = false,
  existingRider,
}: RiderDialogContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addRiderMutation = useAddRider();
  const updateRiderMutation = useUpdateRider();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RiderFormData>({
    mode: "all",
    defaultValues: existingRider || {
      name: "",
      phone: "",
      deliveryDate: "",
    },
  });

  const onSubmit: SubmitHandler<RiderFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateRiderMutation.mutateAsync({
          orderId,
          data: {
            name: data.name,
            phone: data.phone,
            deliveryDate: data.deliveryDate,
          },
        });
      } else {
        await addRiderMutation.mutateAsync({
          orderId,
          data: {
            name: data.name,
            phone: data.phone,
            deliveryDate: data.deliveryDate,
          },
        });
      }
    } catch (error) {
      console.error("Failed to save rider information:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle className="font-inter text-lg font-semibold text-[#1C1C1C]">
          {isEdit ? "Edit Rider Details" : "Add Rider Details for Delivery"}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          {isEdit
            ? "Update the rider's information for this delivery."
            : "Add the rider's name, phone, and delivery time to complete the dispatch."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Rider's Name */}
        <div className="space-y-1">
          <label className="block font-inter text-[16px] font-light text-[#1C1C1C]">
            Rider's Name
          </label>
          <input
            {...register("name", {
              required: "Rider's name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            type="text"
            placeholder="Joseph"
            className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Rider's Phone Number */}
        <div className="space-y-1">
          <label className="block font-inter text-[16px] font-light text-[#1C1C1C]">
            Rider's Phone Number
          </label>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[+]?[0-9\s\-()]{10,}$/,
                message: "Please enter a valid phone number",
              },
            })}
            type="tel"
            placeholder="09100022234"
            className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Delivery Date */}
        <div className="space-y-1">
          <label className="block font-inter text-[16px] font-light text-[#1C1C1C]">
            Delivery Date
          </label>
          <input
            {...register("deliveryDate", {
              required: "Delivery date is required",
            })}
            type="date"
            className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
          />
          {errors.deliveryDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.deliveryDate.message}
            </p>
          )}
        </div>
      </div>
      <DialogFooter className="flex">
        <DialogClose asChild className="flex-1">
          <Button
            text="Cancel"
            variant="outline"
            className="border border-[#E7E7E7] text-[#3D3D3D]"
            disabled={isSubmitting}
          />
        </DialogClose>
        <Button
          text={isSubmitting ? "Saving..." : "Save"}
          type="submit"
          variant="solid"
          disabled={!isValid || isSubmitting}
          className="text-white flex-1 bg-[#9A6C50]"
        />
      </DialogFooter>
    </form>
  );
}
