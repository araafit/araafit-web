import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import Button from "../../../shared-components/button";
import Spinner from "../../../shared-components/spinner";
import {
  useCompleteRegistration,
  useVerifyEmail,
  useVerifyOtp,
  useResendOtp,
} from "../../../hooks/auth.hooks";
import { XIcon, CheckCircleIcon } from "@phosphor-icons/react";

/* ---------------------------------------------------------------------- */

interface GuestRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "email" | "otp" | "details";

export function GuestRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: GuestRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState<string[]>(["", "", "", "", "", ""]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    deliveryAddress: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cooldown, setCooldown] = useState<number>(0); // seconds for resend OTP

  const verifyEmailMutation = useVerifyEmail();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const completeRegistration = useCompleteRegistration();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("email");
      setEmail("");
      setOtpCode(["", "", "", "", "", ""]);
      setFormData({
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        deliveryAddress: "",
        dateOfBirth: "",
      });
      setErrors({});
      setCooldown(0);
    }
  }, [isOpen]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Step 1: Verify Email
  const handleSendOtp = async () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setErrors({});
    try {
      await verifyEmailMutation.mutateAsync({ email: emailTrimmed });
      setCurrentStep("otp");
      setCooldown(30); // 30s cooldown
    } catch (error) {
      // Error handled in hook
      console.error("Email verification failed:", error);
    }
  };

  // Step 2: Verify OTP
  const handleOtpChange = (value: string, idx: number) => {
    // Only allow single digits
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[idx] = value;
    setOtpCode(newCode);

    // Auto-focus next input
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpCode[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newCode = [...otpCode];
        for (let i = 0; i < 6; i++) {
          newCode[i] = digits[i] || "";
        }
        setOtpCode(newCode);
        const nextEmptyIndex = newCode.findIndex((val) => !val);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
      });
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/\D/g, "").slice(0, 6);
    const newCode = [...otpCode];
    for (let i = 0; i < 6; i++) {
      newCode[i] = digits[i] || "";
    }
    setOtpCode(newCode);
    const nextEmptyIndex = newCode.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otp = otpCode.join("");
    if (otp.length !== 6) {
      setErrors({ otp: "Please enter all 6 digits" });
      return;
    }

    setErrors({});
    try {
      const response = await verifyOtpMutation.mutateAsync({
        email: email.trim(),
        otp,
      });

      if (response && response.isSuccess) {
        setCurrentStep("details");
      } else {
        setErrors({ otp: "Invalid or expired OTP. Please try again." });
      }
    } catch (error) {
      setErrors({ otp: "Invalid or expired OTP. Please try again." });
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || !email.trim()) return;
    try {
      await resendOtpMutation.mutateAsync({ email: email.trim() });
      setCooldown(30); // 30s cooldown
      setErrors({});
    } catch (error) {
      // Error handled in hook
      console.error("Resend OTP failed:", error);
    }
  };

  // Step 3: Complete Registration
  const validateDetailsForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteRegistration = async () => {
    if (!validateDetailsForm()) return;

    try {
      await completeRegistration.mutateAsync({
        email: email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
        deliveryAddress: formData.deliveryAddress.trim(),
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (error) {
      // Error handled in hook
      console.error("Registration failed:", error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isDetailsFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.password &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.deliveryAddress.trim()
    );
  };

  const isOtpComplete = otpCode.every((digit) => digit !== "");

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Verify Your Email";
      case "otp":
        return "Enter Verification Code";
      case "details":
        return "Complete Your Registration";
      default:
        return "Complete Your Registration";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "We'll send a verification code to your email";
      case "otp":
        return `Enter the 6-digit code sent to ${email}`;
      case "details":
        return "Please provide your details to complete your order";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-neutral-900">
                {getStepTitle()}
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-600 mt-1">
                {getStepDescription()}
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors ml-4"
            >
              <XIcon size={20} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {(["email", "otp", "details"] as Step[]).map((step, idx) => {
              const stepIndex = ["email", "otp", "details"].indexOf(currentStep);
              const isCompleted = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isCompleted
                        ? "bg-[#9A6C50] text-white"
                        : isCurrent
                        ? "bg-[#9A6C50] text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon size={16} weight="fill" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 2 && (
                    <div
                      className={`w-12 h-0.5 mx-1 ${
                        isCompleted ? "bg-[#9A6C50]" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </DialogHeader>

        <div className="mt-6">
          {/* Step 1: Email Verification */}
          {currentStep === "email" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`w-full h-11 border rounded-md px-3 text-sm ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#D0D5DD] focus:border-[#9A6C50]"
                  } focus:outline-none focus:ring-1 focus:ring-[#9A6C50]`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.email;
                        return next;
                      });
                    }
                  }}
                  disabled={verifyEmailMutation.isPending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendOtp();
                    }
                  }}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <Button
                text="Send Verification Code"
                variant="solid"
                className="w-full bg-[#9A6C50] text-white"
                onClick={handleSendOtp}
                disabled={verifyEmailMutation.isPending || !email.trim()}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Send Verification Code</span>
                  <Spinner
                    isLoading={verifyEmailMutation.isPending}
                    size="sm"
                    speed="fast"
                    arcColor="#ffff"
                  />
                </div>
              </Button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === "otp" && (
            <div className="space-y-4">
              <div className="w-full">
                <div className="w-full flex justify-center gap-3 mb-1">
                  {otpCode.map((value, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={value}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      disabled={verifyOtpMutation.isPending}
                      className={`size-12 text-center text-lg text-neutral-950 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9A6C50] ${
                        value
                          ? "border-[#9A6C50] bg-[#9A6C50]/5"
                          : "border-[#D0D5DD]"
                      }`}
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    {errors.otp}
                  </p>
                )}
              </div>

              <div className="text-center">
                <span className="text-sm text-neutral-600">
                  Didn't receive code?{" "}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || resendOtpMutation.isPending}
                  className={`text-sm ${
                    cooldown > 0 || resendOtpMutation.isPending
                      ? "text-neutral-400 cursor-not-allowed"
                      : "text-[#9A6C50] hover:underline"
                  }`}
                >
                  {cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : resendOtpMutation.isPending
                    ? "Sending..."
                    : "Resend"}
                </button>
              </div>

              <Button
                text="Verify Code"
                variant="solid"
                className="w-full bg-[#9A6C50] text-white"
                onClick={handleVerifyOtp}
                disabled={verifyOtpMutation.isPending || !isOtpComplete}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Verify Code</span>
                  <Spinner
                    isLoading={verifyOtpMutation.isPending}
                    size="sm"
                    speed="fast"
                    arcColor="#ffff"
                  />
                </div>
              </Button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep("email");
                  setOtpCode(["", "", "", "", "", ""]);
                  setErrors({});
                }}
                className="w-full text-sm text-neutral-600 hover:text-neutral-800 underline"
              >
                Change email address
              </button>
            </div>
          )}

          {/* Step 3: Complete Registration */}
          {currentStep === "details" && (
            <div className="space-y-4">
              {/* First Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full h-11 border rounded-md px-3 text-sm ${
                    errors.firstName
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#D0D5DD] focus:border-[#9A6C50]"
                  } focus:outline-none focus:ring-1 focus:ring-[#9A6C50]`}
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange("firstName", e.target.value)}
                  disabled={completeRegistration.isPending}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full h-11 border rounded-md px-3 text-sm ${
                    errors.lastName
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#D0D5DD] focus:border-[#9A6C50]"
                  } focus:outline-none focus:ring-1 focus:ring-[#9A6C50]`}
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange("lastName", e.target.value)}
                  disabled={completeRegistration.isPending}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className={`w-full h-11 border rounded-md px-3 text-sm ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#D0D5DD] focus:border-[#9A6C50]"
                  } focus:outline-none focus:ring-1 focus:ring-[#9A6C50]`}
                  placeholder="Create a password (min. 8 characters)"
                  value={formData.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  disabled={completeRegistration.isPending}
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className={`w-full h-11 border rounded-md px-3 text-sm ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#D0D5DD] focus:border-[#9A6C50]"
                  } focus:outline-none focus:ring-1 focus:ring-[#9A6C50]`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleFieldChange("confirmPassword", e.target.value)
                  }
                  disabled={completeRegistration.isPending}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full h-20 border rounded-md px-3 py-2 text-sm resize-none ${
                    errors.deliveryAddress
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#D0D5DD] focus:border-[#9A6C50]"
                  } focus:outline-none focus:ring-1 focus:ring-[#9A6C50]`}
                  placeholder="Enter your delivery address"
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    handleFieldChange("deliveryAddress", e.target.value)
                  }
                  disabled={completeRegistration.isPending}
                />
                {errors.deliveryAddress && (
                  <p className="text-xs text-red-600">{errors.deliveryAddress}</p>
                )}
              </div>

              {/* Date of Birth (Optional) */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Date of Birth{" "}
                  <span className="text-neutral-400">(optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full h-11 border border-[#D0D5DD] rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A6C50] focus:border-[#9A6C50]"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                  disabled={completeRegistration.isPending}
                />
              </div>

              <Button
                text="Complete Registration"
                variant="solid"
                className="w-full bg-[#9A6C50] text-white"
                onClick={handleCompleteRegistration}
                disabled={completeRegistration.isPending || !isDetailsFormValid()}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>
                    {completeRegistration.isPending
                      ? "Registering..."
                      : "Complete Registration"}
                  </span>
                  <Spinner
                    isLoading={completeRegistration.isPending}
                    size="sm"
                    speed="fast"
                    arcColor="#ffff"
                  />
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== "email" && (
          <div className="flex items-center justify-start mt-6 pt-4 border-t border-neutral-200">
            <Button
              text="Back"
              variant="outline"
              className="border border-[#E7E7E7] text-[#3D3D3D]"
              onClick={() => {
                if (currentStep === "otp") {
                  setCurrentStep("email");
                  setOtpCode(["", "", "", "", "", ""]);
                } else if (currentStep === "details") {
                  setCurrentStep("otp");
                }
                setErrors({});
              }}
              disabled={
                verifyEmailMutation.isPending ||
                verifyOtpMutation.isPending ||
                completeRegistration.isPending
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
