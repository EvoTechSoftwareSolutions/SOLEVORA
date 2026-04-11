import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineClipboardList,
  HiOutlineTag,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlinePencilAlt,
  HiOutlineScale,
  HiOutlineShoppingBag
} from "react-icons/hi";

import "../../styles/user/Legal.css";

function PrivacyPolicyPage() {
  const privacyCards = [
    {
      id: "01",
      icon: <HiOutlineDocumentText size={20} />,
      title: "Collecting Information",
      text1:
        "We collect personal details like name, email, address, and order data when you use Solevora.",
      text2:
        "We also collect usage data like browser type, device, and pages visited to improve experience."
    },
    {
      id: "02",
      icon: <HiOutlineEye size={20} />,
      title: "How We Use It",
      text1:
        "Your data is used to process orders, support requests, and improve services.",
      text2:
        "We may send updates or promotions, which you can opt out of anytime."
    },
    {
      id: "03",
      icon: <HiOutlineClock size={20} />,
      title: "Cookies & Tracking",
      text1:
        "We use cookies to remember preferences and improve performance.",
      text2:
        "You can disable cookies in your browser settings anytime."
    },
    {
      id: "04",
      icon: <HiOutlineUserGroup size={20} />,
      title: "Third-Party Services",
      text1:
        "We may share limited data with payment, delivery, and analytics partners.",
      text2: "They only receive data needed to perform their service."
    },
    {
      id: "05",
      icon: <HiOutlineShieldCheck size={20} />,
      title: "Your Rights",
      text1:
        "You can request access, correction, or deletion of your data.",
      text2: "We respond to privacy requests as quickly as possible."
    },
    {
      id: "06",
      icon: <HiOutlineLockClosed size={20} />,
      title: "Data Security",
      text1:
        "We use security measures to protect your personal data.",
      text2:
        "However, no system is 100% secure online."
    }
  ];

  const termsCards = [
    {
      id: "01",
      icon: <HiOutlineClipboardList size={20} />,
      title: "Acceptance of Terms",
      text1:
        "By using Solevora, you agree to follow our terms and policies.",
      text2: "If you disagree, please stop using the website."
    },
    {
      id: "02",
      icon: <HiOutlineTag size={20} />,
      title: "Products & Availability",
      text1:
        "Prices, stock, and product details may change without notice.",
      text2:
        "We may remove or update products anytime."
    },
    {
      id: "03",
      icon: <HiOutlineShoppingBag size={20} />,
      title: "Orders & Payments",
      text1:
        "Orders are confirmed only after successful payment.",
      text2:
        "We may cancel suspicious or invalid orders."
    },
    {
      id: "04",
      icon: <HiOutlineExclamationCircle size={20} />,
      title: "User Responsibilities",
      text1:
        "You must provide correct information and use the site legally.",
      text2:
        "Abuse or fraud may result in account suspension."
    },
    {
      id: "05",
      icon: <HiOutlineRefresh size={20} />,
      title: "Returns & Refunds",
      text1:
        "Refunds depend on product condition and return policy.",
      text2:
        "Processing time depends on your payment method."
    },
    {
      id: "06",
      icon: <HiOutlinePencilAlt size={20} />,
      title: "Changes to Terms",
      text1:
        "We may update terms anytime based on business needs.",
      text2:
        "Continued use means you accept updates."
    },
    {
      id: "07",
      icon: <HiOutlineScale size={20} />,
      title: "Limitation of Liability",
      text1:
        "We are not responsible for indirect damages from site usage.",
      text2:
        "Your legal rights remain protected under law."
    }
  ];

  const renderCard = (card) => (
    <div key={card.id} className="legal-card">
      <div className="card-sidebar">
        <span className="card-number">{card.id}</span>

        <div className="card-tag-wrapper">
          <div className="card-icon-box">{card.icon}</div>
          <h3 className="card-tag-text">{card.title}</h3>
        </div>
      </div>

      <div className="card-main-content">
        <p>{card.text1}</p>
        <p>{card.text2}</p>
      </div>
    </div>
  );

  const Hero = ({ title, desc, type }) => (
    <section className={`legal-hero ${type}`}>
      <div className="hero-overlay">
        <div className="hero-content">
          <span className="badge">Legal Information</span>
          <h1>{title}</h1>
          <p>{desc}</p>

          <div className="hero-meta-info">
            <div className="meta-item">
              <strong>Last Updated:</strong> April 2026
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <strong>Effective:</strong> Immediately
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="legal-page-container">

      <Hero
        type="privacy"
        title="Privacy Policy"
        desc="We respect your privacy and are committed to protecting your personal data."
      />

      <section className="legal-intro">
        <p>
          At Solevora, we ensure your data is handled with care and transparency.
        </p>
      </section>

      <div className="section-divider">
        <span>Privacy Policy</span>
      </div>

      <section className="cards-section">
        {privacyCards.map(renderCard)}
      </section>

      <Hero
        type="terms"
        title="Terms & Conditions"
        desc="These terms govern your use of Solevora platform and services."
      />

      <section className="legal-intro">
        <p>
          By using our website, you agree to our rules, policies, and service conditions.
        </p>
      </section>

      <div className="section-divider">
        <span>Terms & Conditions</span>
      </div>

      <section className="cards-section">
        {termsCards.map(renderCard)}
      </section>

      <div className="legal-page-footer">
        © Solevora — All rights reserved
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;