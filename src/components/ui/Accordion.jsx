import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`pb-accordion-item ${isOpen ? 'pb-accordion-item-open' : ''}`}>
      <style>{`
        .pb-accordion-item {
          border-bottom: 1px solid var(--border);
          padding: var(--space-4) 0;
          font-family: var(--font-family);
        }
        .pb-accordion-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          text-align: left;
          font-size: var(--font-size-base);
          font-weight: var(--fw-semibold);
          color: var(--text-primary);
          padding: var(--space-2) 0;
          cursor: pointer;
        }
        .pb-accordion-icon {
          color: var(--text-secondary);
          transition: transform 0.25s ease;
        }
        .pb-accordion-item-open .pb-accordion-icon {
          transform: rotate(180deg);
          color: var(--primary);
        }
        .pb-accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.25s ease-out, padding 0.25s ease;
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          line-height: 1.6;
        }
        .pb-accordion-item-open .pb-accordion-content {
          max-height: 200px;
          padding-top: var(--space-2);
        }
      `}</style>
      <button className="pb-accordion-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <ChevronDown size={18} className="pb-accordion-icon" />
      </button>
      <div className="pb-accordion-content">
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function Accordion({ items = [], className = '' }) {
  return (
    <div className={`pb-accordion ${className}`}>
      {items.map((item, index) => (
        <AccordionItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
