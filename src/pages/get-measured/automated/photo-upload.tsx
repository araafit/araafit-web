import React, { useState, useRef } from 'react';
import { CloudArrowUp, X, CheckCircle, Warning } from "@phosphor-icons/react";
import Button from "../../../shared-components/button";
import { useGetMeasured } from "../context/get-measured-context";
import { MeasurementStepperLines } from "../stepper-lines";

/* ----------------------------------------------------------- */

interface PhotoUploadProps {
  onPhotosUploaded?: (frontPhoto: File, sidePhoto: File) => void;
}

export function PhotoUpload({ onPhotosUploaded }: PhotoUploadProps) {
  const { currentStep, stepTo, setPhotos } = useGetMeasured();
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<'front' | 'side' | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File, type: 'front' | 'side') => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (type === 'front') {
        setFrontPhoto(file);
        setFrontPreview(preview);
      } else {
        setSidePhoto(file);
        setSidePreview(preview);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'front' | 'side') => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: 'front' | 'side') => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const removePhoto = (type: 'front' | 'side') => {
    if (type === 'front') {
      setFrontPhoto(null);
      setFrontPreview(null);
      if (frontInputRef.current) frontInputRef.current.value = '';
    } else {
      setSidePhoto(null);
      setSidePreview(null);
      if (sideInputRef.current) sideInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    if (frontPhoto && sidePhoto) {
      setPhotos(frontPhoto, sidePhoto);
      onPhotosUploaded?.(frontPhoto, sidePhoto);
      stepTo(currentStep + 1);
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
    description 
  }: { 
    type: 'front' | 'side';
    photo: File | null;
    preview: string | null;
    title: string;
    description: string;
  }) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-base md:text-lg font-semibold text-[#1C1C1C]">{title}</h3>
        {photo && <CheckCircle className="text-green-500 flex-shrink-0" size={20} />}
      </div>
      
      <div
        className={`relative w-full h-[200px] md:h-[300px] border-2 border-dashed rounded-lg transition-all duration-200 ${
          dragOver === type
            ? 'border-primary-500 bg-primary-50'
            : photo
            ? 'border-green-500 bg-green-50'
            : 'border-neutral-300 bg-neutral-50 hover:border-primary-500 hover:bg-primary-50'
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
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs md:text-sm">
              {photo?.name}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 md:gap-4 cursor-pointer p-4"
               onClick={() => type === 'front' ? frontInputRef.current?.click() : sideInputRef.current?.click()}>
            <CloudArrowUp size={32} className="text-neutral-400 md:hidden" />
            <CloudArrowUp size={48} className="text-neutral-400 hidden md:block" />
            <div className="text-center">
              <p className="text-neutral-700 font-medium text-sm md:text-base">
                Drop your {type} photo here, or{' '}
                <span className="text-primary-500 underline">browse</span>
              </p>
              <p className="text-xs md:text-sm text-neutral-500 mt-1">{description}</p>
            </div>
            <p className="text-xs text-neutral-400">PNG, JPG up to 10MB</p>
          </div>
        )}
        
        <input
          ref={type === 'front' ? frontInputRef : sideInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file, type);
          }}
          className="hidden"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col gap-5">
        <MeasurementStepperLines stepIndex={currentStep} />

        <div className="w-full max-w-[51rem] flex flex-col gap-6">
          <div>
            <h2 className="text-xl md:text-[2rem] text-[#1C1C1C] font-semibold mb-2">
              Upload Your Photos
            </h2>
            <p className="text-neutral-500 font-inter text-sm md:text-base">
              Upload clear front and side photos instead of using your camera for accurate measurements
            </p>
          </div>

          {/* Instructions */}
          <div className="flex items-start gap-2 bg-[#EBF8FF] rounded-md border border-[#0EA5E9] py-3 px-4">
            <Warning className="text-[#0EA5E9] mt-0.5 flex-shrink-0" size={20} />
            <div className="flex flex-col gap-2">
              <span className="text-[#0EA5E9] font-medium text-sm md:text-base">Photo Guidelines</span>
              <ul className="text-[#0369A1] text-xs md:text-sm space-y-1">
                <li>• Stand straight with arms slightly away from your body</li>
                <li>• Wear form-fitting clothes that show your body shape</li>
                <li>• Use good lighting and a plain background</li>
                <li>• Front photo: Face the camera directly</li>
                <li>• Side photo: Turn 90° to show your profile</li>
              </ul>
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
          {(frontPhoto || sidePhoto) && (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${frontPhoto ? 'bg-green-500' : 'bg-neutral-300'}`} />
                <span className="text-xs md:text-sm text-neutral-600">Front Photo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${sidePhoto ? 'bg-green-500' : 'bg-neutral-300'}`} />
                <span className="text-xs md:text-sm text-neutral-600">Side Photo</span>
              </div>
              <span className="text-xs md:text-sm text-neutral-500 md:ml-auto">
                {[frontPhoto, sidePhoto].filter(Boolean).length}/2 photos uploaded
              </span>
            </div>
          )}
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
          text="Continue"
          variant="solid"
          disabled={!frontPhoto || !sidePhoto}
          className="w-full md:w-[10rem] self-end disabled:bg-neutral-50 disabled:cursor-not-allowed"
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}

export default PhotoUpload;
