import { useState, createContext, useContext } from "react";
import { useLocalStorage } from "../../../shared-hooks/loca-storage";

/* --------------------------------------------------------------------- */

interface GetMeasuredContext {
  currentStep: number;
  stepTo: (to: number | undefined) => void;
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
  const [currentStep, setCurrentStep] = useState(storedStep as number);

  // Move to next step and save state in browser
  const stepTo = (to?: number) => {
    if (to && (to <= 2 || to === 0)) {
      setCurrentStep(storedStep);
      setStoredStep(to);
      return;
    }

    setStoredStep(to);
    setCurrentStep(storedStep + 1);
  };

  const value = { currentStep, stepTo };

  return (
    <GetMeasuredContext.Provider value={value}>
      {children}
    </GetMeasuredContext.Provider>
  );
};

export const useGetMeasured = () => {
  const context = useContext(GetMeasuredContext);

  if (!context) {
    throw new Error("GetMeasured must be within a ShopProvider");
  }

  return context;
};
