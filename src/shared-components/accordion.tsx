import React, { useState, type ReactElement } from "react";
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
  clickedItem,
}: AccordionType) {
  const [accordionItems, setAccordionItems] =
    useState<AccordionItemType[]>(items);

  const defaultQuestionClass =
    "faq-question block flex items-center justify-between gap-4 group";
  const defaultAnswerClass =
    "faq-answer w-full text-neutral-950 font-normal transition-all";

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
      {accordionItems?.map((item, idx) => (
        <div key={idx} className={`faq-item !w-full ${itemClassName}`}>
          <button
            type="button"
            className={`${CN(defaultQuestionClass, questionClassName)}`}
            onClick={() => onClick(item, idx)}
          >
            {item.question}

            {/* Caret icon */}
            {openIcon && closeIcon ? (
              accordionItems[idx].isClicked ? (
                <div>{openIcon}</div>
              ) : (
                <div>{closeIcon}</div>
              )
            ) : icon ? (
              <div
                className={`${
                  accordionItems[idx].isClicked ? "rotate-180" : "rotate-0"
                }`}
              >{icon}</div>
            ) : (
              <span
                className={`${CN(
                  `text-lg ${
                    accordionItems[idx].isClicked ? "rotate-180" : "rotate-0"
                  }`,
                  caretIconClassName
                )}`}
              >
                ^
              </span>
            )}
          </button>

          <div
            className={`${CN(
              `${defaultAnswerClass} ${
                accordionItems[idx].isClicked ? "block" : "hidden"
              }`,
              answerClassName
            )}`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
