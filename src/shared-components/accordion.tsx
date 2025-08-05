import { useState, useEffect, type ReactElement } from "react";
import { CN } from "../utils/class-merge";

/*--------------------------------------*/

export type AccordionItemType = {
  question: string;
  answer: string;
  isClicked: boolean;
  [name: string]: any;
};

export type AccordionType = {
  items: AccordionItemType[];
  containerClassName?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
  caretIconClassName?: string;
  icon?: ReactElement;
  openIcon?: ReactElement;
  closeIcon?: ReactElement;
  shouldAnimate?: boolean;
  clickedItem?(item: AccordionItemType): void;
};

export default function Accordion({
  items,
  icon,
  containerClassName,
  itemClassName,
  caretIconClassName,
  questionClassName,
  answerClassName,
  openIcon,
  closeIcon,
  shouldAnimate = false,
  clickedItem,
}: AccordionType) {
  const [accordionItems, setAccordionItems] =
    useState<AccordionItemType[]>(items);

  // Sync with external items if they change
  useEffect(() => {
    setAccordionItems(items);
  }, [items]);

  const defaultQuestionClass =
    "faq-question text-left flex items-center justify-between gap-4 group";
  const defaultAnswerClass = `faq-answer w-full text-neutral-950 font-normal transition-all`;

  const animate = shouldAnimate
    ? "overflow-hidden transition-all duration-700 ease-in-out"
    : "";

  const onClick = (item: any, itemIdx: number) => {
    clickedItem?.(item);

    setAccordionItems((prev) =>
      prev.map((item, idx) =>
        idx === itemIdx ? { ...item, isClicked: !item.isClicked } : item
      )
    );
  };

  return (
    <div
      className={`w-full faq-container transition-all ${containerClassName}`}
    >
      {accordionItems?.map((item, idx) => {
        const isOpen = item.isClicked;

        return (
          <div key={idx} className={CN("faq-item !w-full", itemClassName)}>
            <button
              type="button"
              className={`${CN(
                `${defaultQuestionClass} ${
                  isOpen ? "text-primary-500" : "text-neutral-950"
                }`,
                questionClassName
              )}`}
              onClick={() => onClick(item, idx)}
            >
              {item.question}

              {/* Caret icon */}
              {openIcon && closeIcon ? (
                isOpen ? (
                  <div>{openIcon}</div>
                ) : (
                  <div>{closeIcon}</div>
                )
              ) : icon ? (
                <div
                  className={CN(
                    isOpen ? "rotate-180" : "rotate-0",
                    "transition-transform"
                  )}
                >
                  {icon}
                </div>
              ) : (
                <span
                  className={`${CN(
                    `text-lg ${animate} ${isOpen ? "rotate-180" : "rotate-0"}`,
                    caretIconClassName
                  )}`}
                >
                  ^
                </span>
              )}
            </button>

            {/* Answer content */}
            <div
              className={CN(
                `${defaultAnswerClass} ${isOpen ? "h-[100px]" : "h-0 "} ${
                  animate
                    ? "overflow-hidden transition-all duration-700 ease-in-out"
                    : ""
                }`,
                answerClassName
              )}
            >
              <div className={animate ? "px-1 py-2" : ""}>{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
