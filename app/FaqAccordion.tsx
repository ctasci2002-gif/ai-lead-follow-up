"use client";

import { useState } from "react";

export function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="lp-faq-list">
      {faqs.map((f, i) => {
        const open = openIndex === i;
        return (
          <div className="lp-faq-item" key={f.q}>
            <button
              type="button"
              className="lp-faq-question"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span>{f.q}</span>
              <span className={open ? "lp-faq-caret open" : "lp-faq-caret"}>
                ⌄
              </span>
            </button>

            <div className={open ? "lp-faq-answer open" : "lp-faq-answer"}>
              <p>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
