import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSimpleIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { type DressStyle } from "../../../../services/admin-settings.service";
import Spinner from "../../../../shared-components/spinner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "../../../ui/dialog";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import Button from "../../../../shared-components/button";
import emptyFolder from "../../images/empty 1.png";
import { useDeleteDressStyle } from "../../../../hooks/admin-settings.hooks";

/* --------------------------------------------------------------------------- */

interface StylesList {
  isLoading: boolean;
  isError: boolean;
  styles: DressStyle[] | undefined;
}

export default function StylesList({
  isLoading,
  isError,
  styles = [],
}: StylesList) {
  const deleteDressStyleMutation = useDeleteDressStyle();

  const handleDelete = async (id: string) => {
    try {
      await deleteDressStyleMutation.mutateAsync(id);
    } catch (err) {
      // Error handled in hook
      console.error("Failed to delete dress style:", err);
    }
  };

  const DeleteModal: React.FC<{ style: DressStyle }> = ({ style }) => (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
          title="Delete style"
        >
          <TrashSimpleIcon size={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="my-2">Delete {style.dressStyle}?</DialogTitle>
          <DialogDescription className="text-[#4F4F4F] ">
            Are you sure you want to delete this style and its information? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex">
          <DialogClose asChild className="flex-1">
            <Button
              text="Cancel"
              variant="outline"
              className="border border-[#E7E7E7] text-[#3D3D3D]"
            />
          </DialogClose>
          <Button
            text={deleteDressStyleMutation.isPending ? "Deleting..." : "Delete"}
            type="submit"
            variant="solid"
            onClick={() => handleDelete(style.id)}
            disabled={deleteDressStyleMutation.isPending}
            className="text-white flex-1 bg-[#DC2626]"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="flex justify-center items-center py-12">
          <Spinner
            size="md"
            speed="fast"
            isLoading={isLoading}
            arcColor="#9A6C50"
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <p className="text-red-600">Failed to load dress styles</p>
        </div>
      </div>
    );
  }

  if (!styles || styles.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="flex flex-col items-center justify-center py-12">
          <img
            src={emptyFolder}
            alt="Empty folder"
            className="w-32 h-32 mb-4"
          />
          <p className="text-[#4F4F4F] text-sm">No styles found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {styles.map((style) => (
          <div
            key={style.id}
            className="bg-white shadow rounded-xl overflow-hidden flex flex-col"
          >
            {/* Image */}
            <img
              src={style.images?.[0]?.url || emptyFolder}
              alt={style.dressStyle}
              className="w-full h-40 object-cover"
            />

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-[#1C1C1C]">
                  {style.dressStyle}
                </h3>
                <div className="flex gap-2">
                  {/* Edit Button - View Style Details */}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <button
                        className="text-[#4F4F4F] hover:text-[#7B523F] p-1 rounded hover:bg-gray-100 transition-colors"
                        title="View style details"
                      >
                        <PencilSimpleIcon size={18} />
                      </button>
                    </DrawerTrigger>

                    <DrawerContent className="bg-white rounded-t-xl w-[500px] h-[52.75rem] flex flex-col">
                      {/* Header */}
                      <DrawerHeader className="flex items-center gap-3 pb-3">
                        <DrawerClose>
                          <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
                            <ArrowLeftIcon />
                          </div>
                        </DrawerClose>
                        <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
                          Style Details: {style.dressStyle}
                        </DrawerTitle>
                      </DrawerHeader>

                      {/* Body */}
                      <div className="p-6 flex-1 overflow-y-auto pb-20 space-y-6">
                        {/* Style Images */}
                        <div className="space-y-3">
                          <label className="text-sm text-[#676767] font-medium">
                            Style Images
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            {style.images.map((image, idx) => (
                              <div key={image.id} className="relative">
                                <img
                                  src={image.url}
                                  alt={`${style.dressStyle} ${idx + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border border-[#D0D5DD]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Dress Style */}
                        <div className="space-y-1">
                          <label className="text-sm text-[#676767]">
                            Dress Style
                          </label>
                          <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#1C1C1C]">
                            {style.dressStyle}
                          </div>
                        </div>

                        {/* Dress Size */}
                        <div className="space-y-1">
                          <label className="text-sm text-[#676767]">
                            Dress Size
                          </label>
                          <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#1C1C1C]">
                            {style.dressSize}
                          </div>
                        </div>

                        {/* Yard Estimate */}
                        <div className="space-y-1">
                          <label className="text-sm text-[#676767]">
                            Yard Estimate
                          </label>
                          <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#1C1C1C]">
                            {style.yardEstimate} yards
                          </div>
                        </div>

                        {/* Style ID */}
                        <div className="space-y-1">
                          <label className="text-sm text-[#676767]">
                            Style ID
                          </label>
                          <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#888888]">
                            {style.id}
                          </div>
                        </div>
                      </div>

                      {/* Footer Note */}
                      <div className="border-t border-[#E8E8E8] bg-gray-50 p-4 h-16 flex items-center justify-center">
                        <p className="text-sm text-[#676767] italic">
                          Style details are read-only. To modify, delete and
                          create a new style.
                        </p>
                      </div>
                    </DrawerContent>
                  </Drawer>

                  {/* Delete Modal */}
                  <DeleteModal style={style} />
                </div>
              </div>

              {/* Quick View Style */}
              <Drawer>
                <DrawerTrigger asChild>
                  <button className="text-sm text-[#9A6C50] mt-auto flex gap-1 items-center self-start hover:text-[#7B523F] transition-colors">
                    Quick View
                    <ArrowRightIcon size={14} />
                  </button>
                </DrawerTrigger>

                <DrawerContent className="p-6 bg-white rounded-t-xl max-h-[80vh]">
                  <DrawerHeader>
                    <DrawerTitle className="text-xl">
                      {style.dressStyle}
                    </DrawerTitle>
                    <DrawerDescription className="text-base">
                      Size:{" "}
                      <span className="font-medium">{style.dressSize}</span> |
                      Yard Estimate:{" "}
                      <span className="font-medium">
                        {style.yardEstimate} yards
                      </span>
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                    {style.images.map((image, idx) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`${style.dressStyle} ${idx + 1}`}
                          className="w-full h-60 object-cover rounded-lg border border-[#D0D5DD] group-hover:shadow-md transition-shadow"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {idx + 1} of {style.images.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
