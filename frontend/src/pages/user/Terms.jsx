import React from 'react';
import '../../styles/user/Legal.css';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="legal-page">
      <header className="legal-hero terms">
        <div className="legal-hero-content">
          <h1>Terms & Conditions</h1>
          <p>Last updated: April 10, 2026</p>
          <p>
            Please read these terms and conditions carefully before using our
            website.
          </p>
        </div>
      </header>

      <main className="legal-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            These Terms govern your use of the SoleVora website and services. By
            accessing or using the site you agree to be bound by these terms.
          </p>
        </section>

        <section>
          <h2>2. Use of the Site</h2>
          <p>
            You agree to use the site only for lawful purposes and in a manner
            consistent with all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2>3. Orders and Payments</h2>
          <p>
            All orders are subject to acceptance and availability. Payments are
            processed according to our Payment Policy.
          </p>
        </section>

        <section>
          <h2>4. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us via the
            <Link to="/contact"> Contact page</Link>.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Terms;
