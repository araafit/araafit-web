import React, { useState } from "react";
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
import Select from "../../../../shared-components/select";

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
  const [isOpen, setIsOpen] = useState(false);
  const deleteDressStyleMutation = useDeleteDressStyle();

  const handleDelete = async (id: string) => {
    try {
      await deleteDressStyleMutation.mutateAsync(id);
      setIsOpen(!isOpen);
    } catch (err) {
      // Error handled in hook
      console.error("Failed to delete dress style:", err);
    }
  };

  const DeleteModal: React.FC<{ data: DressStyle }> = ({ data }) => {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
            title="Delete style"
          >
            <TrashSimpleIcon size={18} />
          </button>
        </DialogTrigger>

        <DialogContent
          className="max-w-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="my-2">
              Delete {data.dressStyle}?
            </DialogTitle>
            <DialogDescription className="text-[#4F4F4F] ">
              Are you sure you want to delete this style and its information?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex" onClick={(e) => e.stopPropagation()}>
            <Button
              text="Cancel"
              variant="outline"
              className="border border-[#E7E7E7] text-[#3D3D3D] flex-1"
              onClick={() => setIsOpen(false)}
            />

            <Button
              type="button"
              variant="solid"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(data.id);
              }}
              disabled={deleteDressStyleMutation.isPending}
              className="text-white flex-1 bg-[#DC2626]"
            >
              <div className="flex items-center justify-center gap-1">
                <span>Delete</span>
                <Spinner
                  isLoading={deleteDressStyleMutation.isPending}
                  arcColor="#ffff"
                  speed="fast"
                  size="sm"
                />
              </div>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const QuickViewContent: React.FC<{ style: DressStyle }> = ({ style }) => {
    const [selectedDressStyle, setSelectedDressStyle] = React.useState(
      style.dressStyle
    );
    const [selectedDressSize, setSelectedDressSize] = React.useState(
      String(style.dressSize ?? "")
    );
    const [yardEstimate, setYardEstimate] = React.useState(
      String(style.yardEstimate ?? "")
    );

    const sizeOptions = [6, 8, 10, 12, 14, 16, 18, 20].map((n) => ({
      label: String(n),
      value: String(n),
    }));

    return (
      <DrawerContent className="bg-white rounded-t-xl w-[500px] h-[52.75rem] flex flex-col">
        {/* Header */}
        <DrawerHeader className="flex items-center gap-3 pb-3">
          <DrawerClose>
            <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
              <ArrowLeftIcon />
            </div>
          </DrawerClose>
          <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
            View Style
          </DrawerTitle>
        </DrawerHeader>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Top images (quick preview) */}
          <div className="grid grid-cols-2 gap-4">
            {(style.images?.slice(0, 2) || []).map((image, idx) => (
              <img
                key={image.id ?? idx}
                src={image.url || emptyFolder}
                alt={`${style.dressStyle} ${idx + 1}`}
                className="w-full h-40 object-cover rounded-lg border border-[#D0D5DD]"
              />
            ))}
          </div>

          {/* Dress Style */}
          <div className="space-y-2">
            <label className="text-sm text-[#676767]">Dress Style</label>
            <Select
              options={[
                { label: selectedDressStyle, value: selectedDressStyle },
              ]}
              value={selectedDressStyle}
              onChange={setSelectedDressStyle}
              selectClassName="h-12 px-3"
              selectedOptionClassName="text-[#1C1C1C]"
            />
          </div>

          {/* Dress Size */}
          <div className="space-y-2">
            <label className="text-sm text-[#676767]">Dress Size</label>
            <Select
              options={sizeOptions}
              value={selectedDressSize}
              onChange={setSelectedDressSize}
              selectClassName="h-12 px-3"
              selectedOptionClassName="text-[#1C1C1C]"
            />
          </div>

          {/* Yard Estimate */}
          <div className="space-y-2">
            <label className="text-sm text-[#676767]">
              Yard Estimate (based on measurement & style)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={yardEstimate}
              onChange={(e) => setYardEstimate(e.target.value)}
              className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm"
            />
          </div>
        </div>
      </DrawerContent>
    );
  };

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

                    <DrawerContent className="w-[500px] h-screen bg-white rounded-t-xl flex flex-col overflow-y-scroll">
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
                  <DeleteModal data={style} />
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
                <QuickViewContent style={style} />
              </Drawer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
