import { Link } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineTag,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlinePencilAlt,
  HiOutlineScale,
} from "react-icons/hi";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// change these paths to your real local images
import privacyHero from "../assets/privacy/privacy-hero.png";
import termsHero from "../assets/privacy/terms-hero.png";

function PrivacyPolicyPage() {
  const privacyCards = [
    {
      id: 1,
      icon: <HiOutlineDocumentText className="text-[#ef8a3a] text-xl" />,
      title: "Information We Collect",
      text1:
        "When you interact with Solevora, we collect information you share with us, such as your name, email address, shipping address, and details from purchases or account creation.",
      text2:
        "We also collect basic usage data to help us improve your experience. This may include device type, browser details, pages visited, and time spent on the platform.",
    },
    {
      id: 2,
      icon: <HiOutlineEye className="text-[#ef8a3a] text-xl" />,
      title: "How We Use It",
      text1:
        "Your information is used to process orders, provide support, personalize content, and improve the overall shopping experience across our website.",
      text2:
        "We may also use contact information for occasional product updates, promotions, or service-related notifications. You can unsubscribe at any time.",
    },
    {
      id: 3,
      icon: <HiOutlineClock className="text-[#ef8a3a] text-xl" />,
      title: "Cookies & Tracking",
      text1:
        "Our platform uses cookies and similar tools to remember your preferences, keep your session secure, and understand how visitors use the website.",
      text2:
        "These technologies help us optimize performance and present content more effectively. You can control cookies through your browser settings.",
    },
    {
      id: 4,
      icon: <HiOutlineUserGroup className="text-[#ef8a3a] text-xl" />,
      title: "Third-Party Services",
      text1:
        "To provide services like payment processing, analytics, and delivery tracking, we may share limited information with trusted third-party partners.",
      text2:
        "Every partner is selected carefully and only receives the data necessary to perform their role securely and responsibly.",
    },
    {
      id: 5,
      icon: <HiOutlineShieldCheck className="text-[#ef8a3a] text-xl" />,
      title: "Your Rights",
      text1:
        "You can request access to your personal information, ask for corrections, or request deletion where legally permitted.",
      text2:
        "If you need help with your data or have privacy concerns, contact us and we will support your request as quickly as possible.",
    },
    {
      id: 6,
      icon: <HiOutlineLockClosed className="text-[#ef8a3a] text-xl" />,
      title: "Data Security",
      text1:
        "We implement appropriate security measures to protect your information against unauthorized access, misuse, or alteration.",
      text2:
        "While no online system is completely risk-free, we continuously improve our safeguards to help keep your data protected.",
    },
  ];

  const termsCards = [
    {
      id: 1,
      icon: <HiOutlineClipboardList className="text-[#ef8a3a] text-xl" />,
      title: "Acceptance of Terms",
      text1:
        "By accessing, browsing, or using the Solevora platform, you agree to follow these Terms & Conditions. If you do not agree with them, please do not use the site.",
      text2:
        "These terms apply to all visitors, customers, and users of our platform and related services.",
    },
    {
      id: 2,
      icon: <HiOutlineTag className="text-[#ef8a3a] text-xl" />,
      title: "Products & Availability",
      text1:
        "Product descriptions, pricing, images, and availability are updated regularly. However, occasional errors may happen and some products may sell out quickly.",
      text2:
        "We reserve the right to modify or discontinue products without prior notice when necessary.",
    },
    {
      id: 3,
      icon: <HiOutlineShoppingBagFix /> ,
      title: "Orders & Payments",
      text1:
        "All orders are subject to confirmation and availability. Payment must be completed successfully before an order is processed and shipped.",
      text2:
        "If fraud prevention or verification issues arise, we may cancel or delay an order to protect both customer and business security.",
    },
    {
      id: 4,
      icon: <HiOutlineExclamationCircle className="text-[#ef8a3a] text-xl" />,
      title: "User Responsibilities",
      text1:
        "You agree to provide accurate account and payment information and to use the website lawfully and respectfully.",
      text2:
        "Any misuse of the site, including unauthorized access attempts or harmful activity, may result in account suspension.",
    },
    {
      id: 5,
      icon: <HiOutlineRefresh className="text-[#ef8a3a] text-xl" />,
      title: "Returns & Refunds",
      text1:
        "Return and refund eligibility depends on our return policy, product condition, and request timing. Please review the policy before submitting a return.",
      text2:
        "Approved refunds are processed according to the original payment method and may take time to appear in your account.",
    },
    {
      id: 6,
      icon: <HiOutlinePencilAlt className="text-[#ef8a3a] text-xl" />,
      title: "Changes to Terms",
      text1:
        "Solevora may update these Terms & Conditions from time to time to reflect changes in the business, legal requirements, or services offered.",
      text2:
        "Continued use of the site after updates means you accept the revised terms.",
    },
    {
      id: 7,
      icon: <HiOutlineScale className="text-[#ef8a3a] text-xl" />,
      title: "Limitation of Liability",
      text1:
        "To the maximum extent permitted by law, Solevora is not responsible for indirect or unexpected damages arising from use of the site or products.",
      text2:
        "Nothing in these terms removes rights that cannot legally be excluded under applicable law.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      {/* Privacy Hero */}
      <section className="relative h-[260px] sm:h-[340px] lg:h-[420px] overflow-hidden">
        <img
          src={privacyHero}
          alt="Privacy Policy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute top-6 left-4 sm:left-8 lg:left-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#ef8a3a] text-white text-sm font-medium hover:bg-[#db7c31] transition duration-300 shadow-md"
          >
            <HiOutlineArrowLeft />
            Back
          </Link>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-light text-center leading-tight">
            Privacy
            <br />
            Policy
          </h1>
        </div>
      </section>

      {/* Privacy Intro */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8">
        <p className="max-w-5xl text-[#404040] text-sm sm:text-base leading-7">
          At Solevora, we believe that luxury extends beyond the physical
          product—it encompasses the entire experience, including how we handle
          your personal information. This policy outlines our commitment to your
          privacy.
        </p>
      </section>

      {/* Privacy Cards */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-10">
        <div className="space-y-6">
          {privacyCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#f5eedf] border border-[#ef8a3a] rounded-sm shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <div className="border-b md:border-b-0 md:border-r border-[#efc29a] px-5 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#efc29a] flex items-center justify-center shrink-0 bg-white/40">
                    {card.icon}
                  </div>
                  <h3 className="text-[#2b2b2b] text-lg sm:text-xl font-medium">
                    {card.title}
                  </h3>
                </div>

                <div className="px-5 sm:px-6 py-6 text-[#555] text-sm sm:text-base leading-7">
                  <p>{card.text1}</p>
                  <p className="mt-4">{card.text2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Terms Hero */}
      <section className="relative h-[260px] sm:h-[340px] lg:h-[420px] overflow-hidden mt-4">
        <img
          src={termsHero}
          alt="Terms and Conditions"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-light text-center leading-tight">
            Terms &
            <br />
            Conditions
          </h2>
        </div>
      </section>

      {/* Terms Intro */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8">
        <p className="max-w-5xl text-[#404040] text-sm sm:text-base leading-7">
          Welcome to Solevora. These terms govern your use of our platform and
          the purchase of our premium footwear. By accessing our site, you agree
          to these conditions of use and our commerce policies.
        </p>
      </section>

      {/* Terms Cards */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-16">
        <div className="space-y-6">
          {termsCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#f5eedf] border border-[#ef8a3a] rounded-sm shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <div className="border-b md:border-b-0 md:border-r border-[#efc29a] px-5 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#efc29a] flex items-center justify-center shrink-0 bg-white/40">
                    {card.icon}
                  </div>
                  <h3 className="text-[#2b2b2b] text-lg sm:text-xl font-medium">
                    {card.title}
                  </h3>
                </div>

                <div className="px-5 sm:px-6 py-6 text-[#555] text-sm sm:text-base leading-7">
                  <p>{card.text1}</p>
                  <p className="mt-4">{card.text2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function HiOutlineShoppingBagFix() {
  return <HiOutlineDocumentText className="text-[#ef8a3a] text-xl" />;
}

export default PrivacyPolicyPage;