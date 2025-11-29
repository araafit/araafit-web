import { useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "../../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Input } from "../../ui/input";
import Button from "../../../shared-components/button";
import {
  useChartsByGender,
  useChartById,
  useCreateChart,
  useCreateChartEntry,
  useUpdateChartEntry,
  useDeleteChartEntry,
} from "../../../hooks/admin-settings.hooks";
import Spinner from "../../../shared-components/spinner";

/* --------------------------------------------------------------------------- */

type Gender = "male" | "female";

type EntryPayload = {
  label: string;
  chestMin?: number;
  chestMax?: number;
  waistMin?: number;
  waistMax?: number;
  hipsMin?: number;
  hipsMax?: number;
  neckMin?: number;
  neckMax?: number;
  shoulderMin?: number;
  shoulderMax?: number;
  heightMin?: number;
  heightMax?: number;
};

export default function SizeTabs() {
  const [gender, setGender] = useState<Gender>("female");
  const [selectedChartId, setSelectedChartId] = useState<string>("");
  const [openEntryIds, setOpenEntryIds] = useState<Set<string>>(new Set());

  // Dialogs
  const [isCreateChartOpen, setIsCreateChartOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);

  // Form state - create chart
  const [newChartGender, setNewChartGender] = useState<Gender>("female");
  const [newChartName, setNewChartName] = useState("");

  // Form state - add/edit entry
  const emptyEntry: EntryPayload = { label: "" };
  const [newEntry, setNewEntry] = useState<EntryPayload>(emptyEntry);
  const [editingEntryId, setEditingEntryId] = useState<string>("");
  const [editingEntry, setEditingEntry] = useState<EntryPayload>(emptyEntry);

  // Queries
  const chartsList = useChartsByGender(gender);
  const selectedChart = useChartById(selectedChartId);

  // Mutations
  const createChart = useCreateChart();
  const createEntry = useCreateChartEntry();
  const updateEntry = useUpdateChartEntry();
  const deleteEntry = useDeleteChartEntry();

  // Initialize selection when gender or list changes
  useEffect(() => {
    if (chartsList.data && chartsList.data.length > 0) {
      if (!selectedChartId || !chartsList.data.some((c) => c.id === selectedChartId)) {
        setSelectedChartId(chartsList.data[0].id);
      }
    } else {
      setSelectedChartId("");
    }
  }, [chartsList.data, selectedChartId]);

  // Helpers
  const measurementFields: Array<{
    keyMin: keyof EntryPayload;
    keyMax: keyof EntryPayload;
    label: string;
  }> = useMemo(
    () => [
      { keyMin: "chestMin", keyMax: "chestMax", label: "Chest" },
      { keyMin: "waistMin", keyMax: "waistMax", label: "Waist" },
      { keyMin: "hipsMin", keyMax: "hipsMax", label: "Hips" },
      { keyMin: "neckMin", keyMax: "neckMax", label: "Neck" },
      { keyMin: "shoulderMin", keyMax: "shoulderMax", label: "Shoulder" },
      { keyMin: "heightMin", keyMax: "heightMax", label: "Height" },
    ],
    []
  );

  const toggleOpen = (id: string) => {
    setOpenEntryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onCreateChart = async () => {
    if (!newChartName || !newChartGender) return;
    try {
      const res = await createChart.mutateAsync({
        gender: newChartGender,
        name: newChartName,
      });
      setIsCreateChartOpen(false);
      setNewChartName("");
      setNewChartGender("female");
      setGender(res.gender);
      setSelectedChartId(res.id);
    } catch {
      // handled in hook
    }
  };

  const onAddEntry = async () => {
    if (!selectedChartId || !newEntry.label) return;
    try {
      await createEntry.mutateAsync({
        chartId: selectedChartId,
        payload: newEntry,
      });
      setIsAddEntryOpen(false);
      setNewEntry(emptyEntry);
    } catch {
      // handled in hook
    }
  };

  const onStartEdit = (entry: any) => {
    setEditingEntryId(entry.id);
    const payload: EntryPayload = {
      label: entry.label ?? "",
      chestMin: entry.chestMin,
      chestMax: entry.chestMax,
      waistMin: entry.waistMin,
      waistMax: entry.waistMax,
      hipsMin: entry.hipsMin,
      hipsMax: entry.hipsMax,
      neckMin: entry.neckMin,
      neckMax: entry.neckMax,
      shoulderMin: entry.shoulderMin,
      shoulderMax: entry.shoulderMax,
      heightMin: entry.heightMin,
      heightMax: entry.heightMax,
    };
    setEditingEntry(payload);
  };

  const onSaveEdit = async () => {
    if (!editingEntryId || !selectedChartId) return;
    try {
      await updateEntry.mutateAsync({
        entryId: editingEntryId,
        chartId: selectedChartId,
        payload: editingEntry,
      });
      setEditingEntryId("");
      setEditingEntry(emptyEntry);
    } catch {
      // handled in hook
    }
  };

  const onDeleteEntry = async (entryId: string) => {
    if (!selectedChartId) return;
    try {
      await deleteEntry.mutateAsync({ entryId, chartId: selectedChartId });
    } catch {
      // handled in hook
    }
  };

  const isLoading =
    chartsList.isLoading || (selectedChartId ? selectedChart.isLoading : false);
  const hasError = chartsList.isError || selectedChart.isError;

  return (
    <div className="bg-white w-full h-full px-4 py-6 pb-44">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-[28px] capitalize">
          Size Chart Management
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#676767]">Gender</span>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateChartOpen} onOpenChange={setIsCreateChartOpen}>
            <DialogTrigger asChild>
              <div className="flex gap-1 items-center cursor-pointer">
                <PlusIcon className="text-[#9A6C50]" />
                <p className="font-light text-[#9A6C50]">New chart</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle className="text-[#1C1C1C] text-lg">
                  Create Size Chart
                </DialogTitle>
                <DialogDescription className="text-[#4F4F4F]">
                  Provide the chart name and gender.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Name</label>
                  <Input
                    type="text"
                    value={newChartName}
                    onChange={(e) => setNewChartName(e.target.value)}
                    placeholder="e.g. Male Shirt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-[#676767]">Gender</label>
                  <Select
                    value={newChartGender}
                    onValueChange={(v) => setNewChartGender(v as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
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
                  text={createChart.isPending ? "Creating..." : "Create"}
                  type="submit"
                  variant="solid"
                  className="bg-[#9A6C50] text-white flex-1"
                  disabled={!newChartName || createChart.isPending}
                  onClick={onCreateChart}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] my-4 bg-[#F0F2F5]" />

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" speed="fast" />
        </div>
      ) : hasError ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <p className="text-red-600">Failed to load size charts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Charts list */}
          <div className="lg:col-span-1 border border-[#F0F2F5] rounded-lg p-4">
            <h3 className="font-medium text-[#1C1C1C] mb-3">
              {gender === "female" ? "Female Charts" : "Male Charts"}
            </h3>
            <div className="flex flex-col gap-2 max-h-[540px] overflow-auto">
              {chartsList.data && chartsList.data.length > 0 ? (
                chartsList.data.map((chart) => (
                  <button
                    key={chart.id}
                    className={`w-full text-left px-3 py-2 rounded-md border ${
                      selectedChartId === chart.id
                        ? "border-[#9A6C50] bg-[#FFF7F2]"
                        : "border-[#E7E7E7] hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedChartId(chart.id)}
                  >
                    <div className="font-medium text-sm text-[#1C1C1C]">
                      {chart.name}
                    </div>
                    <div className="text-xs text-[#676767]">
                      {chart.entries?.length ?? 0} entries
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-[#676767]">
                  No charts for this gender yet. Create one.
                </div>
              )}
            </div>
          </div>

          {/* Right: Selected chart detail */}
          <div className="lg:col-span-2 border border-[#F0F2F5] rounded-lg p-4">
            {!selectedChartId ? (
              <div className="text-sm text-[#676767]">
                Select a chart to manage entries.
              </div>
            ) : selectedChart.isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="md" speed="fast" />
              </div>
            ) : !selectedChart.data ? (
              <div className="text-sm text-[#676767]">
                Chart not found or failed to load.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-lg text-[#1C1C1C]">
                    {selectedChart.data.name}
                  </div>
                  <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
                    <DialogTrigger asChild>
                      <div className="flex gap-1 items-center cursor-pointer">
                        <PlusIcon className="text-[#9A6C50]" />
                        <p className="font-light text-[#9A6C50]">Add entry</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[560px]">
                      <DialogHeader>
                        <DialogTitle className="text-[#1C1C1C] text-lg">
                          Add Entry
                        </DialogTitle>
                        <DialogDescription className="text-[#4F4F4F]">
                          Provide label and measurement ranges.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-1">
                          <label className="text-sm text-[#676767]">Label</label>
                          <Input
                            type="text"
                            value={newEntry.label}
                            onChange={(e) =>
                              setNewEntry((s) => ({ ...s, label: e.target.value }))
                            }
                            placeholder="e.g. M"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {measurementFields.map((f) => (
                            <div key={f.label} className="space-y-1">
                              <label className="text-sm text-[#676767]">
                                {f.label} (min-max)
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  type="number"
                                  value={newEntry[f.keyMin] ?? ""}
                                  onChange={(e) =>
                                    setNewEntry((s) => ({
                                      ...s,
                                      [f.keyMin]:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    }))
                                  }
                                  placeholder="Min"
                                />
                                <Input
                                  type="number"
                                  value={newEntry[f.keyMax] ?? ""}
                                  onChange={(e) =>
                                    setNewEntry((s) => ({
                                      ...s,
                                      [f.keyMax]:
                                        e.target.value === ""
                                          ? undefined
                                          : Number(e.target.value),
                                    }))
                                  }
                                  placeholder="Max"
                                />
                              </div>
                            </div>
                          ))}
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
                          text={createEntry.isPending ? "Adding..." : "Add entry"}
                          type="submit"
                          variant="solid"
                          className="bg-[#9A6C50] text-white flex-1"
                          disabled={!newEntry.label || createEntry.isPending}
                          onClick={onAddEntry}
                        />
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Entries list */}
                {selectedChart.data.entries && selectedChart.data.entries.length > 0 ? (
                  <div className="divide-y divide-[#F0F2F5]">
                    {selectedChart.data.entries.map((entry) => {
                      const isOpen = openEntryIds.has(entry.id);
                      const isEditing = editingEntryId === entry.id;
                      return (
                        <div key={entry.id} className="py-2">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between text-left"
                            onClick={() => toggleOpen(entry.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#676767]">Label</span>
                              <span className="font-medium text-[#1C1C1C]">
                                {entry.label}
                              </span>
                            </div>
                            <CaretDownIcon
                              className={`transition-transform ${
                                isOpen ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="mt-3">
                              {/* Action row */}
                              <div className="flex items-center gap-2 mb-3">
                                {!isEditing ? (
                                  <>
                                    <Button
                                      text="Edit"
                                      variant="outline"
                                      className="border border-[#E7E7E7] text-[#3D3D3D]"
                                      onClick={() => onStartEdit(entry)}
                                    />
                                    <Button
                                      text={deleteEntry.isPending ? "Deleting..." : "Delete"}
                                      variant="solid"
                                      className="bg-[#DC2626] text-white"
                                      onClick={() => onDeleteEntry(entry.id)}
                                      disabled={deleteEntry.isPending}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      text={updateEntry.isPending ? "Saving..." : "Save"}
                                      variant="solid"
                                      className="bg-[#9A6C50] text-white"
                                      onClick={onSaveEdit}
                                      disabled={updateEntry.isPending}
                                    />
                                    <Button
                                      text="Cancel"
                                      variant="outline"
                                      className="border border-[#E7E7E7] text-[#3D3D3D]"
                                      onClick={() => {
                                        setEditingEntryId("");
                                        setEditingEntry(emptyEntry);
                                      }}
                                    />
                                  </>
                                )}
                              </div>
                              {/* Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-sm text-[#676767]">
                                    Label
                                  </label>
                                  <Input
                                    type="text"
                                    value={isEditing ? editingEntry.label : entry.label}
                                    onChange={(e) =>
                                      isEditing &&
                                      setEditingEntry((s) => ({
                                        ...s,
                                        label: e.target.value,
                                      }))
                                    }
                                    disabled={!isEditing}
                                  />
                                </div>
                                {measurementFields.map((f) => (
                                  <div key={f.label} className="space-y-1">
                                    <label className="text-sm text-[#676767]">
                                      {f.label} (min-max)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Input
                                        type="number"
                                        value={
                                          (isEditing
                                            ? editingEntry[f.keyMin]
                                            : (entry as any)[f.keyMin]) ?? ""
                                        }
                                        onChange={(e) =>
                                          isEditing &&
                                          setEditingEntry((s) => ({
                                            ...s,
                                            [f.keyMin]:
                                              e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                          }))
                                        }
                                        placeholder="Min"
                                        disabled={!isEditing}
                                      />
                                      <Input
                                        type="number"
                                        value={
                                          (isEditing
                                            ? editingEntry[f.keyMax]
                                            : (entry as any)[f.keyMax]) ?? ""
                                        }
                                        onChange={(e) =>
                                          isEditing &&
                                          setEditingEntry((s) => ({
                                            ...s,
                                            [f.keyMax]:
                                              e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                          }))
                                        }
                                        placeholder="Max"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-[#676767]">
                    No entries yet. Add a new one.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


