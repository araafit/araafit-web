import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../ui/dialog";
import Button from "../../../../shared-components/button";
export function RiderDialogContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-inter text-lg font-semibold text-[#1C1C1C]">
          Add Rider Details for Delivery
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Add the rider’s name, phone, and delivery time to complete the
          dispatch.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Rider's Name */}
        <div className="space-y-1">
          <label className="block font-inter text-[16px] font-light text-[#1C1C1C]">
            Rider’s Name
          </label>
          <input
            type="text"
            placeholder="Joseph"
            className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
          />
        </div>

        {/* Rider’s Phone Number */}
        <div className="space-y-1">
          <label className="block font-inter text-[16px] font-light text-[#1C1C1C]">
            Rider’s Phone Number
          </label>
          <input
            type="tel"
            placeholder="09100022234"
            className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
          />
        </div>

        {/* Delivery Date */}
        <div className="space-y-1">
          <label className="block font-inter text-[16px] font-light text-[#1C1C1C]">
            Delivery Date
          </label>
          <input
            type="date"
            className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm"
          />
        </div>
      </div>
      <DialogFooter className="flex">
        <DialogClose asChild className="flex-1">
          <Button
            text="Cancel"
            variant="outline"
            className="border border-[#E7E7E7] text-[#3D3D3D]"
          />
        </DialogClose>
        <Button
          text="Save"
          type="submit"
          variant="solid"
          //  onClick={() => {
          //   onDelete();
          // }}
          className={` text-white flex-1  bg-[#9A6C50]
              }`}
        />
      </DialogFooter>

      {/* <DialogFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button variant="solid" className="text-white">
          Save
        </Button>
      </DialogFooter> */}
    </>
  );
}
