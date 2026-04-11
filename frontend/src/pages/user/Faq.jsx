import React, { useState } from "react";
import "../../styles/user/Faq.css";

const faqsData = [
  {
    question: "How do I choose the right shoe size?",
    answer:
      "You can use our Size Guide to find the perfect fit. We recommend measuring your foot length and comparing it with our chart.",
  },
  {
    question: "Do you offer returns or exchanges?",
    answer:
      "Yes! We offer a 7-day return and exchange policy for unused products in original packaging.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 3–5 business days depending on your location.",
  },
  {
    question: "Are your shoes original branded products?",
    answer:
      "Absolutely. We only sell 100% authentic and high-quality branded shoes.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes, once your order is shipped, you will receive a tracking link via email or SMS.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards, cash on delivery, and online payments.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Find answers to common questions about our shoes, orders, and services.
        </p>

        <div className="faq-list">
          {faqsData.map((faq, index) => (
            <div
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              key={index}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>
                <span>{activeIndex === index ? "-" : "+"}</span>
              </div>

              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;