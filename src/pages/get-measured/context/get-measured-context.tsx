import { useState, createContext, useContext } from "react";
import { useLocalStorage } from "../../../shared-hooks/loca-storage";

/* --------------------------------------------------------------------- */

interface GetMeasuredContext {
  currentStep: number;
  stepTo: (to: number | undefined) => void;
  frontPhoto: File | null;
  sidePhoto: File | null;
  height: number | null;
  setPhotos: (front: File, side: File) => void;
  setHeight: (height: number) => void;
  resetProgress: () => void;
}

const GetMeasuredContext = createContext<GetMeasuredContext | null>(null);

export const GetMeasuredProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { storedValue: storedStep, setValue: setStoredStep } = useLocalStorage(
    "get-measured-steps",
    0
  );
  console.log("storedStep", storedStep);
  const [currentStep, setCurrentStep] = useState(storedStep as number);
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const [height, setHeightState] = useState<number | null>(null);

  // Move to next step and save state in browser
  const stepTo = (to?: number) => {
    if (to && (to <= 2 || to === 0)) {
      setCurrentStep(to);
      setStoredStep(to);
      return;
    }

    setStoredStep(to);
    setCurrentStep(storedStep + 1);
  };

  const setPhotos = (front: File, side: File) => {
    setFrontPhoto(front);
    setSidePhoto(side);
  };

  const setHeight = (newHeight: number) => {
    setHeightState(newHeight);
  };

  const resetProgress = () => {
    setCurrentStep(0);
    setStoredStep(0);
    setFrontPhoto(null);
    setSidePhoto(null);
    setHeightState(null);
  };

  const value = { 
    currentStep, 
    stepTo, 
    frontPhoto, 
    sidePhoto, 
    height,
    setPhotos, 
    setHeight,
    resetProgress
  };

  return (
    <GetMeasuredContext.Provider value={value}>
      {children}
    </GetMeasuredContext.Provider>
  );
};


// eslint-disable-next-line
export const useGetMeasured = () => {
  const context = useContext(GetMeasuredContext);

  if (!context) {
    throw new Error("GetMeasured must be within a ShopProvider");
  }

  return context;
};
