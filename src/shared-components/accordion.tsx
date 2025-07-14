import React, { useState } from "react";
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
  caretIcon?: React.ReactElement;
  containerClassName?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
  caretIconClassName?: string;
  clickedItem?(item: AccordionItemType): void;
};

export default function Accordion({
  items,
  caretIcon,
  containerClassName,
  itemClassName,
  caretIconClassName,
  questionClassName,
  answerClassName,
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

  console.log(accordionItems);

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
            {caretIcon ? (
              <div
                className={`${caretIconClassName} ${
                  accordionItems[idx].isClicked ? "rotate-180" : "rotate-0"
                }`}
              >
                {caretIcon}
              </div>
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
