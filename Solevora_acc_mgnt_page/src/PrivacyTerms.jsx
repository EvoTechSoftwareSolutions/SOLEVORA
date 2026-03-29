import React from 'react'

function InfoCard({title, children}){
  return (
    <div className="info-card">
      <div className="info-left"> 
        <div className="info-icon">🔹</div>
      </div>
      <div className="info-right">
        <div className="info-title">{title}</div>
        <div className="info-body">{children}</div>
      </div>
    </div>
  )
}

export default function PrivacyTerms({mode='privacy'}){
  return (
    <div className="page page-privacy">
      <section className="hero-privacy">
        <img src="/assets/privacy-hero.jpg" alt="Privacy Hero" />
        <div className="hero-text">Privacy Policy</div>
      </section>

      <section className="content container">
        <p className="lead">At SoleVera, we believe that luxury extends beyond the physical product—it encompasses the entire experience, including how we handle your personal information. This policy outlines our commitment to your privacy.</p>

        <InfoCard title="Information We Collect">
          When you interact with SoleVera, we collect information that helps us deliver a premium shopping experience. This includes personal identifiers such as your name, email address, shipping and billing addresses, and phone number when you create an account or place an order.
        </InfoCard>

        <InfoCard title="How We Use It">
          Your information is the foundation of a tailored experience. We use this data primarily to process orders, manage your account, and improve our customer service.
        </InfoCard>

        <InfoCard title="Cookies & Tracking">
          Our platform uses cookies and similar tracking technologies to personalize your experience and to analyze site usage for improvements.
        </InfoCard>

        <InfoCard title="Third-Party Services">
          We may share data with trusted service providers who help us deliver the site and fulfill orders. These partners are contractually required to protect your information.
        </InfoCard>

        <InfoCard title="Your Rights">
          You maintain choices about how we use your personal information. You may request access, correction, or deletion of your data.
        </InfoCard>

        <InfoCard title="Data Security">
          We implement administrative, technical, and physical safeguards to protect your information. While no system is perfect, we continually review our security practices.
        </InfoCard>
      </section>

      <section className="hero-terms">
        <img src="/assets/terms-hero.jpg" alt="Terms Hero" />
        <div className="hero-text small">Terms & Conditions</div>
      </section>

      <section className="content container">
        <p className="lead">Welcome to SoleVera. These terms govern your use of our platform and purchase of premium footwear. By accessing our site, you agree to these conditions of craft and commerce.</p>

        <InfoCard title="Acceptance of Terms">By accessing SoleVera, you agree to be bound by these Terms & Conditions.</InfoCard>
        <InfoCard title="Products and Orders">We reserve the right to limit quantities and to refuse service.</InfoCard>
        <InfoCard title="Pricing and Payment">Prices are displayed in USD. Payment methods are accepted at checkout.</InfoCard>
        <InfoCard title="Shipping and Returns">Shipping and return policies are available on our support pages.</InfoCard>
      </section>

      <footer className="page-footer">
        <div className="container">© 2024 SoleVera Sneakers Inc. All rights reserved.</div>
      </footer>
    </div>
  )
}
