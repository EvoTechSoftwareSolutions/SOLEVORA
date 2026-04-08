// PrivacyPolicyPage Component - Displays privacy policy and terms & conditions
// Provides comprehensive information about data collection, usage, and user rights
// Features card-based layout with icons and detailed explanations for each policy point
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
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
} from 'react-icons/hi';

import '../../styles/user/Legal.css';

// Hero section images for visual appeal
import privacyHeroImg from '../../assets/privacy/privacy-hero.png';
import termsHeroImg from '../../assets/privacy/terms-hero.png';

function PrivacyPolicyPage() {
  // Privacy policy card data structure - each card represents a key privacy aspect
  const privacyCards = [
    {
      id: '01',
      icon: <HiOutlineDocumentText size={22} />,
      title: "Collecting Information",
      text1: "When you interact with Solevora, we collect information you share with us, such as your name, email address, shipping address, and details from purchases or account creation.",
      text2: "We also collect basic usage data to help us improve your experience. This may include device type, browser details, pages visited, and time spent on the platform."
    },
    {
      id: '02',
      icon: <HiOutlineEye size={22} />,
      title: "How We Use It",
      text1: "Your information is used to process orders, provide support, personalize content, and improve the overall shopping experience across our website.",
      text2: "We may also use contact information for occasional product updates, promotions, or service-related notifications. You can unsubscribe at any time."
    },
    {
      id: '03',
      icon: <HiOutlineClock size={22} />,
      title: "Cookies & Tracking",
      text1: "Our platform uses cookies and similar tools to remember your preferences, keep your session secure, and understand how visitors use the website.",
      text2: "These technologies help us optimize performance and present content more effectively. You can control cookies through your browser settings."
    },
    {
      id: '04',
      icon: <HiOutlineUserGroup size={22} />,
      title: "Third-Party Services",
      text1: "To provide services like payment processing, analytics, and delivery tracking, we may share limited information with trusted third-party partners.",
      text2: "Every partner is selected carefully and only receives the data necessary to perform their role securely and responsibly."
    },
    {
      id: '05',
      icon: <HiOutlineShieldCheck size={22} />,
      title: "Your Rights",
      text1: "You can request access to your personal information, ask for corrections, or request deletion where legally permitted.",
      text2: "If you need help with your data or have privacy concerns, contact us and we will support your request as quickly as possible."
    },
    {
      id: '06',
      icon: <HiOutlineLockClosed size={22} />,
      title: "Data Security",
      text1: "We implement appropriate security measures to protect your information against unauthorized access, misuse, or alteration.",
      text2: "While no online system is completely risk-free, we continuously improve our safeguards to help keep your data protected."
    }
  ];

  // Terms & conditions card data structure - each card represents a key policy aspect
  const termsCards = [
    {
      id: '01',
      icon: <HiOutlineClipboardList size={22} />,
      title: "Acceptance of Terms",
      text1: "By accessing, browsing, or using the Solevora platform, you agree to follow these Terms & Conditions. If you do not agree with them, please do not use the site.",
      text2: "These terms apply to all visitors, customers, and users of our platform and related services."
    },
    {
      id: '02',
      icon: <HiOutlineTag size={22} />,
      title: "Products & Availability",
      text1: "Product descriptions, pricing, images, and availability are updated regularly. However, occasional errors may happen and some products may sell out quickly.",
      text2: "We reserve the right to modify or discontinue products without prior notice when necessary."
    },
    {
      id: '03',
      icon: <HiOutlineShoppingBag size={22} />,
      title: "Orders & Payments",
      text1: "All orders are subject to confirmation and availability. Payment must be completed successfully before an order is processed and shipped.",
      text2: "If fraud prevention or verification issues arise, we may cancel or delay an order to protect both customer and business security."
    },
    {
      id: '04',
      icon: <HiOutlineExclamationCircle size={22} />,
      title: "User Responsibilities",
      text1: "You agree to provide accurate account and payment information and to use the website lawfully and respectfully.",
      text2: "Any misuse of the site, including unauthorized access attempts or harmful activity, may result in account suspension."
    },
    {
      id: '05',
      icon: <HiOutlineRefresh size={22} />,
      title: "Returns & Refunds",
      text1: "Return and refund eligibility depends on our return policy, product condition, and request timing. Please review the policy before submitting a return.",
      text2: "Approved refunds are processed according to the original payment method and may take time to appear in your account."
    },
    {
      id: '06',
      icon: <HiOutlinePencilAlt size={22} />,
      title: "Changes to Terms",
      text1: "Solevora may update these Terms & Conditions from time to time to reflect changes in the business, legal requirements, or services offered.",
      text2: "Continued use of the site after updates means you accept the revised terms."
    },
    {
      id: '07',
      icon: <HiOutlineScale size={22} />,
      title: "Limitation of Liability",
      text1: "To the maximum extent permitted by law, Solevora is not responsible for indirect or unexpected damages arising from use of the site or products.",
      text2: "Nothing in these terms removes rights that cannot legally be excluded under applicable law."
    }
  ];

  // Main component render
  return (
    <div className="legal-page-container bg-[#f7f7f7]">
      {/* Privacy Policy Hero Section */}
      <section className="legal-hero privacy">
        {/* Brand navigation button */}
        <div className="absolute top-8 left-8 sm:left-12 lg:left-16 z-20">
          <Link to="/home" className="flex items-center gap-2 px-5 py-2.5 rounded shadow-lg bg-[#ef8a3a] text-white text-sm font-bold hover:bg-[#db7c31] transition-all tracking-wider">
            SOLE VORA
          </Link>
        </div>

        {/* Hero shoe image for visual appeal */}
        <div className="hero-shoe">
           <img src={privacyHeroImg} alt="Privacy Sneakers" />
        </div>

        {/* Hero title */}
        <h1 className="hero-title relative z-10">
          Privacy<br /><b>Policy</b>
        </h1>
      </section>

      {/* Privacy Policy Introduction */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <p className="max-w-4xl text-[#404040] text-sm sm:text-base leading-8 opacity-80 text-center mx-auto">
          At Solevora, we believe that luxury extends beyond the physical product—it encompasses 
          the entire experience, including how we handle your personal information. This policy 
          outlines our commitment to your privacy and data security.
        </p>
      </section>

      {/* Privacy Policy Cards Display */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 space-y-6">
        {privacyCards.map((card) => (
          <div key={card.id} className="legal-card flex flex-col md:flex-row shadow-sm">
            {/* Card sidebar with number and icon */}
            <div className="card-sidebar">
              <span className="card-number">{card.id}</span>
              <div className="card-tag-wrapper">
                <div className="card-icon-box">{card.icon}</div>
                <h3 className="card-tag-text">{card.title}</h3>
              </div>
            </div>
            {/* Card main content with detailed text */}
            <div className="card-main-content">
              <p>{card.text1}</p>
              <p className="mt-4">{card.text2}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Terms & Conditions Hero Section */}
      <section className="legal-hero terms">
        {/* Hero shoe image with rotation effect */}
        <div className="hero-shoe rotate-[-15deg] top-[45%] left-[50%]">
           <img src={termsHeroImg} alt="Terms Sneakers" />
        </div>
        {/* Hero title */}
        <h2 className="hero-title relative z-10">
          Terms &<br /><b>Conditions</b>
        </h2>
      </section>

      {/* Terms & Conditions Introduction */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <p className="max-w-4xl text-[#404040] text-sm sm:text-base leading-8 opacity-80 text-center mx-auto">
          Welcome to Solevora. These terms govern your use of our platform and the purchase 
          of our premium footwear. By accessing our site, you agree to these conditions of 
          use and our commerce policies.
        </p>
      </section>

      {/* Terms & Conditions Cards Display */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-24 space-y-6">
        {termsCards.map((card) => (
          <div key={card.id} className="legal-card flex flex-col md:flex-row shadow-sm">
            {/* Card sidebar with number and icon */}
            <div className="card-sidebar">
              <span className="card-number">{card.id}</span>
              <div className="card-tag-wrapper">
                <div className="card-icon-box">{card.icon}</div>
                <h3 className="card-tag-text">{card.title}</h3>
              </div>
            </div>
            {/* Card main content with detailed text */}
            <div className="card-main-content">
              <p>{card.text1}</p>
              <p className="mt-4">{card.text2}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default PrivacyPolicyPage; // Export PrivacyPolicyPage component