import {
  dashboardImage,
  measurementImage,
  recommendationImage,
  visualizationImage,
} from "./images/images";

/* -------------------------------------------- */

export const companyOfferings = [
  {
    title: "Smart measurement tools",
    description:
      "No tape measure? No problem. Our AI-powered system lets users get measured digitally using their photos — securely and accurately.",
    image: measurementImage,
  },
  {
    title: "Tailor-Friendly Dashboard",
    description:
      "We also equip you with an intuitive dashboard to manage your orders, track requests, and stay on top of delivery updates — all in one place.",
    image: dashboardImage,
  },
  {
    title: "Style Visualization",
    description:
      "Choose your style and see how it might look before it's made. We help you visualize corsets, jumpsuits, gowns, and more — all customized to your size.",
    image: visualizationImage,
  },
  {
    title: "Fabric Recommendations",
    description:
      "Based on your skin tone and selected style, we recommend fabrics that suit your tone and flatter your fit.",
    image: recommendationImage,
  },
];

export const companyValues = [
  {
    value: "Accuracy",
    caption:
      "We prioritize precision to ensure every garment fits beautifully.",
  },
  {
    value: "Innovation",
    caption:
      "By combining fashion with technology, we continue to push boundaries and redefine what tailoring can be.",
  },
  {
    value: "Privacy first",
    caption:
      "Your body data is handled with care and stored securely. You’re always in control.",
  },
];
