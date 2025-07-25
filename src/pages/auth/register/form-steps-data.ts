//  Form Steps
type FormSteps = {
  title: string;
  caption: string;
  googleAutBtnText?: string;
  googleAuthTrigger?: () => void;
  verifyTrigger?: () => void;
}[];

export const formSteps: FormSteps = [
  {
    title: "Create free account",
    caption:
      "Unlock personalized measurements and custom style recommendations.",
    googleAutBtnText: "Sign up with Google",
    googleAuthTrigger() {
      console.log("Google auth trigger");
    },
  },
  {
    title: "Verify Your Email",
    caption:
      "We need to be sure it’s you. Enter the 6 digit code sent to your email.",
    verifyTrigger() {
      console.log("Verify code");
    },
  },
  {
    title: "Help Us Get to Know You",
    caption:
      "This helps us personalize your experience and get your orders to the right place.",
  },
  {
    title: "Set a Password",
    caption:
      "Set a secure password to protect your personal details and saved measurements.",
  },
];
