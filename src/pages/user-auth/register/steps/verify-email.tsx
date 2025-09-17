import { useRef, type KeyboardEvent } from "react";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../register";

/* --------------------------------------------------------- */

/**
 * Verify email
 *
 * @returns ReactElement
 */
export default function VerifyEmail() {
  const inputRefs = useRef<null | HTMLInputElement[]>([]);

  const {
    getValues,
    setValue,
    trigger,
    register,
    formState: { isSubmitting, errors },
  } = useFormContext<FormValues>();

  const codeValues = getValues("verificationCode");

  const handleInputChange = (inputValue: string, idx: number) => {
    // Only allow single digits
    if (inputValue.length > 1) return;
    if (inputValue && !/^\d$/.test(inputValue)) return;

    const newCode = [...codeValues];
    newCode[idx] = inputValue;

    // Update using react-hook-form-like setValue
    setValue("verificationCode", newCode, { shouldValidate: true });

    // trigger
    trigger("verificationCode");

    // Auto-focus next input
    if (inputValue && idx < 5) {
      inputRefs.current![idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (
      e.key === "Backspace" &&
      !codeValues[idx] &&
      idx > 0 &&
      inputRefs.current
    ) {
      inputRefs.current[idx - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();

      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newCode = [...codeValues];
        for (let i = 0; i < 6; i++) {
          newCode[i] = digits[i] || "";
        }
        setValue("verificationCode", newCode, { shouldValidate: true });

        // Focus the next empty input or the last input
        const nextEmptyIndex = newCode.findIndex((val) => !val);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current![focusIndex]?.focus();
      });
    }
  };

  // Handle paste via mouse (context menu)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/\D/g, "").slice(0, 6);
    const newCode = [...codeValues];
    for (let i = 0; i < 6; i++) {
      newCode[i] = digits[i] || "";
    }
    setValue("verificationCode", newCode, { shouldValidate: true });

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current![focusIndex]?.focus();
  };

  const assignInputRef = (el: HTMLInputElement, idx: number) => {
    if (inputRefs.current) {
      inputRefs.current[idx] = el;
    }
  };

  const validateInputCode = (value: string[]) => {
    if (!Array.isArray(value) || value.length !== 6) {
      return "Code must be 6 digits long";
    }

    const inValid = value.some((char) => !/^\d$/.test(char));

    return inValid ? "Please enter all 6 digits" : true;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full">
        <div className="w-full flex justify-center gap-3 mb-1">
          {codeValues?.map((value, idx) => (
            <input
              type="text"
              key={idx}
              {...register("verificationCode", {
                validate: validateInputCode,
              })}
              ref={(el: HTMLInputElement) => assignInputRef(el, idx)}
              title="code"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={value}
              disabled={isSubmitting}
              aria-label={`Digit ${idx + 1}`}
              onChange={(e) => handleInputChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`size-[56px] text-center text-[1.2rem] text-neutral-950 ${
                value ? "border border-primary-200" : "border border-[#E8E8E8]"
              } border border-[#E8E8E8] focus:outline-none rounded-md`}
            />
          ))}
        </div>
        {errors.verificationCode && (
          <p className="text-sm text-red-400">
            {errors.verificationCode.message}
          </p>
        )}
      </div>

      <p className="text-center">
        Didn’t receive code? <span className="text-primary-500">Resend</span>
      </p>
    </div>
  );
}
