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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import Button from "../../../../shared-components/button";
import emptyFolder from "../../images/empty 1.png";
import {
  useDeleteDressStyle,
  useDressStyle,
  useUpdateStyle,
} from "../../../../hooks/admin-settings.hooks";

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

  const handleDelete = async (id: number | string) => {
    try {
      await deleteDressStyleMutation.mutateAsync(String(id));
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

      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="my-2">Delete {data.name}?</DialogTitle>
          <DialogDescription className="text-[#4F4F4F] ">
            Are you sure you want to delete this style and its information? This
            action cannot be undone.
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

  const QuickViewContent: React.FC<{ styleId: number }> = ({ styleId }) => {
    const {
      data: fullStyle,
      isLoading,
      isError,
    } = useDressStyle(String(styleId));

    return (
      <DrawerContent className="bg-white rounded-t-xl w-[500px] h-screen max-h-screen flex flex-col">
        {/* Header */}
        <DrawerHeader className="flex items-center gap-3 pb-3">
          <DrawerClose>
            <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
              <ArrowLeftIcon />
            </div>
          </DrawerClose>
          <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
            Quick View
          </DrawerTitle>
        </DrawerHeader>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {isLoading && !fullStyle && (
            <div className="flex justify-center items-center py-12">
              <Spinner size="md" speed="fast" isLoading arcColor="#9A6C50" />
            </div>
          )}

          {isError && !fullStyle && (
            <p className="text-sm text-red-600">
              Failed to load style details. Please try again.
            </p>
          )}

          {fullStyle && (
            <>
              {/* Style Images */}
              <div className="space-y-3">
                <label className="text-sm text-[#676767] font-medium">
                  Style Images
                </label>
          <div className="grid grid-cols-2 gap-4">
                  {fullStyle.images.map((image, idx) => (
                    <div key={image.id ?? idx} className="relative">
              <img
                src={image.url || emptyFolder}
                        alt={`${fullStyle.name} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#D0D5DD]"
              />
                    </div>
            ))}
                  {fullStyle.images.length === 0 && (
                    <div className="w-full h-32 flex items-center justify-center border border-dashed border-[#D0D5DD] rounded-lg text-xs text-[#676767]">
                      No images uploaded for this style.
                    </div>
                  )}
                </div>
          </div>

          {/* Style Name */}
              <div className="space-y-1">
            <label className="text-sm text-[#676767]">Style Name</label>
            <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#1C1C1C]">
                  {fullStyle.name}
            </div>
          </div>

              {/* Size Configurations (read-only) */}
              <div className="space-y-1">
            <label className="text-sm text-[#676767]">
              Size Configurations
            </label>
                {fullStyle.sizeChartEntries &&
                fullStyle.sizeChartEntries.length > 0 ? (
              <div className="border border-[#E7E7E7] rounded-lg p-3 space-y-2 text-sm">
                    {fullStyle.sizeChartEntries.map((entry) => (
                  <div
                    key={entry.id}
                        className="flex items-center justify-between gap-3"
                  >
                        <div className="flex flex-col">
                    <span className="text-[#1C1C1C]">
                            {entry.sizeChartEntry?.label}
                          </span>
                          <span className="text-[11px] text-[#676767]">
                            {entry.sizeChartEntry?.chart?.name} (
                            {entry.sizeChartEntry?.chart?.gender})
                    </span>
                        </div>
                        <span className="text-xs text-[#676767]">
                      {entry.fabricYards} yards
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#676767]">
                No size configurations linked to this style yet.
              </p>
            )}
          </div>

              {/* Style ID */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Style ID</label>
                <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#888888]">
                  {fullStyle.id}
                </div>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    );
  };

  const StyleDetailsDrawer: React.FC<{ styleId: number }> = ({ styleId }) => {
    const {
      data: fullStyle,
      isLoading,
      isError,
    } = useDressStyle(String(styleId));

    const updateStyleMutation = useUpdateStyle();
    const [editName, setEditName] = React.useState("");
    const [editSizeConfigs, setEditSizeConfigs] = React.useState<
      Record<string, string>
    >({});

    React.useEffect(() => {
      if (fullStyle) {
        setEditName(fullStyle.name);
        const initialConfigs: Record<string, string> = {};
        fullStyle.sizeChartEntries?.forEach((entry) => {
          if (entry.sizeChartEntry?.id) {
            initialConfigs[entry.sizeChartEntry.id] = entry.fabricYards;
          }
        });
        setEditSizeConfigs(initialConfigs);
      }
    }, [fullStyle]);

    const handleSave = async () => {
      if (!fullStyle) return;

      const sizeConfigsPayload = Object.entries(editSizeConfigs)
        .map(([entryId, yardsStr]) => ({
          sizeChartEntryId: entryId,
          fabricYards: Number(yardsStr),
        }))
        .filter((cfg) => !Number.isNaN(cfg.fabricYards) && cfg.fabricYards > 0);

      const payload: import("../../../../services/admin-settings.service").UpdateStyleRequest =
        {};

      if (editName.trim() && editName.trim() !== fullStyle.name) {
        payload.name = editName.trim();
      }

      if (sizeConfigsPayload.length > 0) {
        payload.sizeConfigs = sizeConfigsPayload;
      }

      if (!payload.name && !payload.sizeConfigs) {
        return;
      }

      try {
        await updateStyleMutation.mutateAsync({
          id: fullStyle.id,
          data: payload,
        });
      } catch {
        // errors handled in hook
      }
    };

    return (
      <DrawerContent className="bg-white rounded-t-xl w-[500px] h-screen max-h-screen flex flex-col">
        {/* Header */}
        <DrawerHeader className="flex items-center gap-3 pb-3">
          <DrawerClose>
            <div className="border h-10 w-10 rounded cursor-pointer border-[#E8E8E8] flex items-center justify-center">
              <ArrowLeftIcon />
            </div>
          </DrawerClose>
          <DrawerTitle className="text-lg font-semibold text-[#1C1C1C]">
            {fullStyle ? `Style Details: ${fullStyle.name}` : "Style Details"}
          </DrawerTitle>
        </DrawerHeader>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto pb-20 space-y-6">
          {isLoading && !fullStyle && (
            <div className="flex justify-center items-center py-12">
              <Spinner size="md" speed="fast" isLoading arcColor="#9A6C50" />
            </div>
          )}

          {isError && !fullStyle && (
            <p className="text-sm text-red-600">
              Failed to load style details. Please try again.
            </p>
          )}

          {fullStyle && (
            <>
              {/* Style Images */}
              <div className="space-y-3">
                <label className="text-sm text-[#676767] font-medium">
                  Style Images
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {fullStyle.images.map((image, idx) => (
                    <div key={image.id ?? idx} className="relative">
                      <img
                        src={image.url || emptyFolder}
                        alt={`${fullStyle.name} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#D0D5DD]"
                      />
                    </div>
                  ))}
                  {fullStyle.images.length === 0 && (
                    <div className="w-full h-32 flex items-center justify-center border border-dashed border-[#D0D5DD] rounded-lg text-xs text-[#676767]">
                      No images uploaded for this style.
                    </div>
                  )}
                </div>
              </div>

              {/* Style Name (editable) */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Style Name</label>
                <input
                  type="text"
                  className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={updateStyleMutation.isPending}
                  title="Style name"
                />
              </div>

              {/* Size Configurations (editable yards) */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">
                  Size Configurations
                </label>
                {fullStyle.sizeChartEntries &&
                fullStyle.sizeChartEntries.length > 0 ? (
                  <div className="border border-[#E7E7E7] rounded-lg p-3 space-y-2 text-sm">
                    {fullStyle.sizeChartEntries.map((entry) => {
                      console.log("entry", entry);
                      return (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex flex-col">
                            <span className="text-[#1C1C1C]">
                              {entry.sizeChartEntry?.label}
                            </span>
                            <span className="text-[11px] text-[#676767]">
                              {entry.sizeChartEntry?.chart?.name} (
                              {entry.sizeChartEntry?.chart?.gender})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-[#676767]">
                              Yards
                            </span>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              className="w-20 h-9 border border-[#D0D5DD] rounded-lg px-2 text-xs"
                              value={
                                editSizeConfigs[entry.sizeChartEntry?.id] ?? ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setEditSizeConfigs((prev) => {
                                  const next = { ...prev };
                                  if (!value) {
                                    delete next[entry.sizeChartEntry.id];
                                  } else {
                                    next[entry.sizeChartEntry.id] = value;
                                  }
                                  return next;
                                });
                              }}
                              disabled={updateStyleMutation.isPending}
                              title="yards required"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#676767]">
                    No size configurations linked to this style yet.
                  </p>
                )}
              </div>

              {/* Style ID */}
              <div className="space-y-1">
                <label className="text-sm text-[#676767]">Style ID</label>
                <div className="w-full h-12 border border-[#D0D5DD] rounded-lg px-3 text-sm bg-gray-50 flex items-center text-[#888888]">
                  {fullStyle.id}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E8E8E8] bg-gray-50 p-4 h-16 flex items-center justify-end gap-3">
          <DrawerClose asChild>
            <Button
              text="Close"
              variant="outline"
              className="border border-[#E7E7E7] text-[#3D3D3D]"
              disabled={updateStyleMutation.isPending}
            />
          </DrawerClose>
          <Button
            text={updateStyleMutation.isPending ? "Saving..." : "Save changes"}
            type="button"
            variant="solid"
            className="bg-[#9A6C50] text-white"
            onClick={handleSave}
            disabled={updateStyleMutation.isPending}
          />
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
              alt={style.name}
              className="w-full h-40 object-cover"
            />

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-[#1C1C1C]">{style.name}</h3>
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

                    <StyleDetailsDrawer styleId={style.id} />
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
                <QuickViewContent styleId={style.id} />
              </Drawer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
