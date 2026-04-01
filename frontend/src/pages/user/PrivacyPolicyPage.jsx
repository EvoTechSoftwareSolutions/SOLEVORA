import React from 'react';
import { Link } from 'react-router-dom';
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
} from 'react-icons/hi';

// Assets
import privacyHeroImg from '../../assets/privacy/privacy-hero.png';
import termsHeroImg from '../../assets/privacy/terms-hero.png';

function PrivacyPolicyPage() {
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

  return (
    <div className="flex flex-col w-full bg-[#f7f7f7] font-poppins min-h-screen overflow-x-hidden pt-px">
      
      {/* Privacy Hero */}
      <section className="relative w-full h-[500px] flex items-center justify-center bg-[#7a1515] overflow-hidden">
        <div className="absolute top-10 left-10 md:left-16 z-20">
          <Link to="/home" className="px-6 py-2 bg-brand-gold text-white font-black rounded-lg shadow-xl hover:bg-orange-600 transition-all uppercase tracking-widest text-xs">Sole Vora</Link>
        </div>
        <div className="absolute left-[50%] md:left-[35%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-lg opacity-40 md:opacity-100 mix-blend-screen pointer-events-none z-10">
           <img src={privacyHeroImg} alt="Privacy Backdrop" className="w-full rotate-[-5deg] scale-125" />
        </div>
        <h1 className="relative z-20 text-7xl md:text-9xl text-white font-black leading-none uppercase italic tracking-tighter opacity-90 drop-shadow-2xl text-center">
            Privacy<br /><span className="text-brand-gold">Policy</span>
        </h1>
      </section>

      {/* Privacy Intro */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500 font-medium text-lg leading-relaxed italic opacity-80">
          At Solevora, we believe that luxury extends beyond the physical product—it encompasses 
          the entire experience, including how we handle your personal information. This policy 
          outlines our commitment to your privacy and data security.
        </p>
      </section>

      {/* Privacy Cards List */}
      <section className="max-w-7xl mx-auto px-6 pb-24 space-y-8 w-full">
        {privacyCards.map((card) => (
          <div key={card.id} className="bg-white rounded-[2rem] shadow-sm flex flex-col md:flex-row overflow-hidden border border-black/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-500">
             <div className="w-full md:w-1/3 bg-gray-50/50 p-10 flex flex-col items-start gap-4 relative overflow-hidden">
                <span className="absolute -bottom-10 -right-5 text-gray-200/40 font-black text-[12rem] italic tracking-tighter leading-none pointer-events-none select-none">{card.id}</span>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary relative z-10 shadow-sm">{card.icon}</div>
                <h3 className="text-xl font-black uppercase tracking-tight relative z-10 leading-tight">{card.title}</h3>
             </div>
             <div className="flex-1 p-10 md:p-12 flex flex-col justify-center gap-4">
                <p className="text-gray-600 leading-relaxed font-medium italic">"{card.text1}"</p>
                <p className="text-gray-400 text-sm leading-relaxed">{card.text2}</p>
             </div>
          </div>
        ))}
      </section>

      {/* Terms Hero */}
      <section className="relative w-full h-[500px] flex items-center justify-center bg-[#3a261a] overflow-hidden">
        <div className="absolute right-[50%] md:right-[35%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-lg opacity-40 md:opacity-100 mix-blend-screen pointer-events-none z-10">
           <img src={termsHeroImg} alt="Terms Backdrop" className="w-full rotate-[15deg] scale-125" />
        </div>
        <h2 className="relative z-20 text-7xl md:text-9xl text-white font-black leading-none uppercase italic tracking-tighter opacity-90 drop-shadow-2xl text-center">
            Terms &<br /><span className="text-primary">Conditions</span>
        </h2>
      </section>

      {/* Terms Intro */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500 font-medium text-lg leading-relaxed italic opacity-80">
          Welcome to Solevora. These terms govern your use of our platform and the purchase 
          of our premium footwear. By accessing our site, you agree to these conditions of 
          use and our commerce policies.
        </p>
      </section>

      {/* Terms Cards List */}
      <section className="max-w-7xl mx-auto px-6 pb-32 space-y-8 w-full">
        {termsCards.map((card) => (
          <div key={card.id} className="bg-white rounded-[2rem] shadow-sm flex flex-col md:flex-row overflow-hidden border border-black/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-500">
             <div className="w-full md:w-1/3 bg-gray-50/50 p-10 flex flex-col items-start gap-4 relative overflow-hidden">
                <span className="absolute -bottom-10 -right-5 text-gray-200/40 font-black text-[12rem] italic tracking-tighter leading-none pointer-events-none select-none">{card.id}</span>
                <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary relative z-10 shadow-sm">{card.icon}</div>
                <h3 className="text-xl font-black uppercase tracking-tight relative z-10 leading-tight">{card.title}</h3>
             </div>
             <div className="flex-1 p-10 md:p-12 flex flex-col justify-center gap-4">
                <p className="text-gray-600 leading-relaxed font-medium italic">"{card.text1}"</p>
                <p className="text-gray-400 text-sm leading-relaxed">{card.text2}</p>
             </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;