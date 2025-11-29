import { type UseFormRegister, type UseFormWatch } from "react-hook-form";

/* ------------------------------------------------- */

type Audience = "men" | "women" | "kids";

interface GenderRadioProps {
  fieldLabel: string;
  fieldId: string;
  fieldValue: Audience;
  fieldWatch: UseFormWatch<any>;
  registerField: UseFormRegister<any>;
}

export const GenderRadio = ({
  fieldLabel,
  fieldId,
  fieldValue,
  fieldWatch,
  registerField,
}: GenderRadioProps) => {
  const selectedAudience = fieldWatch("audience") || [];
  const isChecked = Array.isArray(selectedAudience)
    ? selectedAudience.includes(fieldValue)
    : false;

  return (
    <label htmlFor={fieldId} className="cursor-pointer flex items-center">
      <input
        type="checkbox"
        id={fieldId}
        className="hidden"
        value={fieldValue}
        {...registerField("audience")}
      />
      <div
        className={`border rounded-full p-1 flex items-center justify-center ${
          isChecked ? "border-primary-500" : "border-gray-300"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isChecked ? "bg-primary-500" : "bg-transparent"
          }`}
        />
      </div>
      <span className="ml-2 text-sm">{fieldLabel}</span>
    </label>
  );
};
