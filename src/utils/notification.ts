import { toast, type ToastOptions } from "react-hot-toast";

/* ----------------------------------------------------------------- */

// Toast type definitions
type ToastType = "success" | "error" | "warning" | "info" | "loading";

const toastStyles: Record<ToastType, React.CSSProperties> = {
  success: {
    background: "rgba(40, 167, 69, 1)",
    color: "#fff",
  },
  error: {
    background: "rgba(220, 53, 69, 1)",
    color: "#fff",
  },
  warning: {
    background: "rgba(255, 193, 7, 1)",
    color: "#000",
  },
  info: {
    background: "rgba(23, 162, 184, 1)",
    color: "#fff",
  },
  loading: {
    background: "rgba(108, 117, 125, 1)",
    color: "#fff",
  },
};

// Base toast durations by type (in ms)
const toastDurations: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  loading: 3000,
};

// Default options for all toasts
const defaultOptions: ToastOptions = {
  position: "top-right",
  style: {
    padding: "12px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    maxWidth: "350px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
  },
  duration: 3000,
};

const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, {
      ...defaultOptions,
      duration: toastDurations.success,
      style: { ...defaultOptions.style, ...toastStyles.success },
      ...options,
    }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, {
      ...defaultOptions,
      duration: toastDurations.error,
      style: { ...defaultOptions.style, ...toastStyles.error },
      ...options,
    }),

  warning: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...defaultOptions,
      duration: toastDurations.warning,
      style: { ...defaultOptions.style, ...toastStyles.warning },
      icon: "⚠️",
      ...options,
    }),

  info: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...defaultOptions,
      duration: toastDurations.info,
      style: { ...defaultOptions.style, ...toastStyles.info },
      icon: "ℹ️",
      ...options,
    }),

  loading: (message: string, options?: ToastOptions) =>
    toast.loading(message, {
      ...defaultOptions,
      duration: toastDurations.loading,
      style: { ...defaultOptions.style, ...toastStyles.loading },
      ...options,
    }),

  // Custom toast with any options
  custom: (message: string, options?: ToastOptions) =>
    toast(message, { ...defaultOptions, ...options }),

  // Dismiss a specific toast by ID
  dismiss: (toastId: string) => toast.dismiss(toastId),

  // Dismiss all toasts
  dismissAll: () => toast.dismiss(),

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...defaultOptions,
        loading: {
          ...defaultOptions,
          duration: toastDurations.loading,
          style: { ...defaultOptions.style, ...toastStyles.loading },
        },
        success: {
          ...defaultOptions,
          duration: toastDurations.success,
          style: { ...defaultOptions.style, ...toastStyles.success },
        },
        error: {
          ...defaultOptions,
          duration: toastDurations.error,
          style: { ...defaultOptions.style, ...toastStyles.error },
        },
        ...options,
      }
    );
  },
};

export default showToast;
