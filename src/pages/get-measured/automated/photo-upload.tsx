import React, { useState, useRef } from "react";
import {
  CloudArrowUpIcon,
  XIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import Button from "../../../shared-components/button";
import { useGetMeasured } from "../context/get-measured-context";
import { MeasurementStepperLines } from "../stepper-lines";
import { measurementsService } from "../../../services/measurements.service";
import showToast from "../../../utils/notification";

/* ----------------------------------------------------------- */

interface PhotoUploadProps {
  onPhotosUploaded?: (frontPhoto: File, sidePhoto: File) => void;
}

export function PhotoUpload({ onPhotosUploaded }: PhotoUploadProps) {
  const { currentStep, stepTo, setPhotos, setUploaded } = useGetMeasured();
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<'front' | 'side' | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File, type: "front" | "side") => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (type === "front") {
        setFrontPhoto(file);
        setFrontPreview(preview);
      } else {
        setSidePhoto(file);
        setSidePreview(preview);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: "front" | "side") => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: "front" | "side") => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const removePhoto = (type: "front" | "side") => {
    if (type === "front") {
      setFrontPhoto(null);
      setFrontPreview(null);
      if (frontInputRef.current) frontInputRef.current.value = "";
    } else {
      setSidePhoto(null);
      setSidePreview(null);
      if (sideInputRef.current) sideInputRef.current.value = "";
    }
  };

  const handleContinue = async () => {
    if (!frontPhoto || !sidePhoto) return;

    try {
      setIsUploading(true);
      const toastId = showToast.loading("Processing...");

      //const res = await measurementsService.uploadMeasurementImages(frontPhoto, sidePhoto);

      //setUploaded({ front: res.front, side: res.side });
      setPhotos(frontPhoto, sidePhoto);
      onPhotosUploaded?.(frontPhoto, sidePhoto);

      showToast.dismiss(toastId as unknown as string);
      //showToast.success("Photos processed successfully");
      stepTo(currentStep + 1);
    } catch (error: unknown) {
      let message = "Failed to upload photos. Please try again.";
      if (typeof error === "object" && error !== null) {
        const maybeResp = error as { response?: { data?: { message?: string } } };
        message = maybeResp.response?.data?.message || message;
      }
      showToast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const retake = () => {
    stepTo(0);
    window.location.reload();
  };

  const UploadArea = ({
    type,
    photo,
    preview,
    title,
  }: {
    type: "front" | "side";
    photo: File | null;
    preview: string | null;
    title: string;
    description?: string;
  }) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-normal text-[#1C1C1C] font-inter">
          {title}
        </h3>
      </div>

      <div
        className={`relative w-full h-[200px] md:h-[300px] border-2 border-dashed rounded-lg transition-all duration-200 ${
          dragOver === type
            ? "border-primary-500 bg-primary-50"
            : photo
            ? "border-green-500 bg-green-50"
            : "border-neutral-300 bg-white"
        }`}
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt={`${type} photo preview`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => removePhoto(type)}
              className="absolute top-2 right-2 p-1 text-red-500 rounded-full transition-colors"
              title="remove photo"
            >
              <XIcon size={16} />
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs md:text-sm">
              {photo?.name}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full gap-3 md:gap-4 cursor-pointer p-4"
            onClick={() =>
              type === "front"
                ? frontInputRef.current?.click()
                : sideInputRef.current?.click()
            }
          >
            <div className="flex items-center justify-center md:hidden size-[56px] bg-gray-100 rounded-full">
              <CloudArrowUpIcon size={25} className="text-gray-600" />
            </div>

            <div className="hidden size-[56px] bg-gray-100 rounded-full md:flex items-center justify-center">
              <CloudArrowUpIcon size={25} className="text-gray-600" />
            </div>

            <div className="text-center">
              <p className="text-neutral-700 font-medium text-sm md:text-base">
                Click to upload{" "}
                <span className="text-[14px] font-light font-gray-600">
                  or drag drop
                </span>
              </p>

              {/* <p className="text-xs md:text-sm text-neutral-500 mt-1">
                {description}
              </p> */}

              <p className="text-xs text-gray-400">PNG, JPG (max. 800x400px)</p>
            </div>
          </div>
        )}

        <input
          ref={type === "front" ? frontInputRef : sideInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file, type);
          }}
          className="hidden"
          title="image"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col gap-5">
        <MeasurementStepperLines stepIndex={currentStep} className="mb-10" />

        <div className="w-full max-w-[51rem] flex flex-col gap-6">
          <div className="w-full max-w-[500px] my-0 mx-auto">
            <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-2 text-center">
              Upload Your Photos
            </h2>
            <p className="text-neutral-500 font-inter text-sm md:text-base text-center">
              Upload clear front and side photos.
            </p>
          </div>

          {/* Instructions */}
          <div className="flex items-start gap-2 bg-[#FFF8EB] rounded-md border border-[#FCBB4D] py-3 px-4">
            <WarningIcon
              className="text-[#F59E0B] mt-0.5 flex-shrink-0"
              size={20}
            />

            <div className="flex flex-col gap-2">
              <span className="text-[#F59E0B] font-medium text-sm md:text-base">
                Instructions
              </span>

              <p className="text-[#B47409] text-xs md:text-sm font-light">
                Upload two clear full-body photos: one facing the camera (front
                view) with arms slightly away from your sides, and one from the
                side (side view) standing upright and looking straight ahead.
              </p>
            </div>
          </div>

          {/* Upload Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <UploadArea
              type="front"
              photo={frontPhoto}
              preview={frontPreview}
              title="Front Photo"
              description="Face the camera directly"
            />

            <UploadArea
              type="side"
              photo={sidePhoto}
              preview={sidePreview}
              title="Side Photo"
              description="Turn 90° to show your profile"
            />
          </div>

          {/* Progress indicator */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  frontPhoto ? "text-green-500" : "text-neutral-600"
                }`}
              >
                Front Photo
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs md:text-sm ${
                  sidePhoto ? "text-green-500" : "text-neutral-600"
                }`}
              >
                Side Photo
              </span>
            </div>

            <span className="text-xs md:text-sm text-neutral-500 md:ml-auto">
              {[frontPhoto, sidePhoto].filter(Boolean).length}/2 photos uploaded
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-4 md:gap-6 mt-8">
        <Button
          text="Back"
          variant="outline"
          className="w-full md:w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed border-neutral-100 text-neutral-950"
          onClick={retake}
        />

        <Button
          text={isUploading ? "Processing..." : "Continue"}
          variant="solid"
          disabled={!frontPhoto || !sidePhoto || isUploading}
          className="w-full md:w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}

export default PhotoUpload;
