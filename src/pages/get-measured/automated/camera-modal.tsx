import { useState, useRef, useCallback, useEffect } from "react";
import { XIcon, CameraIcon } from "@phosphor-icons/react";

interface CameraModalProps {
  isOpen: boolean;
  photoType: "front" | "side";
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraModal({
  isOpen,
  photoType,
  onCapture,
  onClose,
}: CameraModalProps) {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const startCamera = async () => {
      setCameraError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        setCameraStream(stream);

        // Wait for video element to be available
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        console.error("Camera access error:", err);
        if (err instanceof Error) {
          if (err.name === "NotAllowedError") {
            setCameraError(
              "Camera permission denied. Please allow camera access in your browser settings."
            );
          } else if (err.name === "NotFoundError") {
            setCameraError(
              "No camera found. Please connect a camera and try again."
            );
          } else {
            setCameraError("Could not access camera. Please try again.");
          }
        }
      }
    };

    startCamera();
  }, [isOpen]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  // Handle close
  const handleClose = useCallback(() => {
    stopCamera();
    setCameraError(null);
    onClose();
  }, [stopCamera, onClose]);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const file = new File(
            [blob],
            `${photoType}-photo-${timestamp}.jpg`,
            { type: "image/jpeg" }
          );
          onCapture(file);
          handleClose();
        }
      },
      "image/jpeg",
      0.9
    );
  }, [photoType, onCapture, handleClose]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-full max-w-2xl mx-4 bg-neutral-900 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h3 className="text-white font-medium">
            Take {photoType === "front" ? "Front" : "Side"} Photo
          </h3>
          <button
            onClick={handleClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title="Close camera"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Camera view */}
        <div className="relative aspect-[4/3] bg-black">
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <CameraIcon size={48} className="text-neutral-500 mb-4" />
              <p className="text-red-400 mb-4">{cameraError}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!cameraStream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Capture button */}
        {!cameraError && (
          <div className="flex items-center justify-center p-6">
            <button
              onClick={capturePhoto}
              disabled={!cameraStream}
              className="w-16 h-16 rounded-full bg-white hover:bg-neutral-200 disabled:bg-neutral-600 transition-colors flex items-center justify-center shadow-lg"
              title="Capture photo"
            >
              <div className="w-12 h-12 rounded-full border-4 border-neutral-900" />
            </button>
          </div>
        )}

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default CameraModal;

