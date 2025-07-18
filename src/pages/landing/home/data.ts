/**
 * Landing page copy data
 */

import {
  featureSectionImage1,
  hookSectionImage1,
  hookSectionImage2,
  hookSectionImage3,
} from "./images/images";
import { type AccordionItemType } from "../../../shared-components/accordion";

/* ---------------------------------------- */

export const features: AccordionItemType[] = [
  {
    question: "Measure With Confidence",
    answer:
      "Get exact body measurements and skin tone using your phone camera. Share results with tailors or use them to shop confidently on Araafit.",
    image: featureSectionImage1,
    isClicked: true,
  },
  {
    question: "Personalised Dress Shop",
    answer:
      "Discover ready-made dresses perfectly matched to your body and skin-tone, making shopping easy and stylish and on Araafit's store.",
    image: featureSectionImage1,
    isClicked: false,
  },
  {
    question: "Custom tailor store",
    answer:
      "Select from fabric that compliment your skin tone and design custom styles, tailored perfectly to your measurement and preferences.",
    image: featureSectionImage1,
    isClicked: false,
  },
];

export const testimonials = [
  {
    name: "Anita M.",
    location: "Lagos",
    comment:
      "I’ve always struggled to find dresses that fit just right—until now. After uploading my measurements and skin tone, every item I’ve ordered fits like a dream.",
  },
  {
    name: "Chidera U.",
    location: "Lagos",
    comment:
      "I love how the fabrics suggested always complement my skin tone, and the fit? Perfect every time. No more guesswork. I’ve recommended it to all my friends!",
  },
  {
    name: "Toyin M.",
    location: "Ibadan",
    comment:
      "I used to avoid online shopping because nothing ever fit right. But with this app, I feel seen. The tool is super easy, and I can even leave notes for the tailor!",
  },
];

export const FAQ: AccordionItemType[] = [
  {
    question: "Do I need to download an app?",
    answer: "Nope! Everything works right in your browser.",
    isClicked: true,
  },
  {
    question: "How accurate are the measurements?",
    answer: "Nope! Everything works right in your browser.",
    isClicked: false,
  },
  {
    question: "Is my data safe?",
    answer: "Nope! Everything works right in your browser.",
    isClicked: false,
  },
  {
    question: "Can I retake photos?",
    answer: "Nope! Everything works right in your browser.",
    isClicked: false,
  },
  {
    question: "What should I wear while taking my measurements?",
    answer: "Nope! Everything works right in your browser.",
    isClicked: false,
  },
];
