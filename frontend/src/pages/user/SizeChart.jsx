// SizeChart Component - Displays international shoe size conversion chart
// Provides size conversion between US, UK, EU sizes and centimeters
// Features tabbed interface for men's and women's sizes with call-to-action
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/user/SizeChart.css';

// Men's shoe size conversion data
const menSizeData = [
  { us: '8.0',  uk: '7.0',  eu: '41',   cm: '25.4 cm' },
  { us: '9.0',  uk: '8.0',  eu: '42',   cm: '26.2 cm' },
  { us: '10.0', uk: '9.0',  eu: '43',   cm: '27.1 cm' },
  { us: '11.0', uk: '10.0', eu: '44.5', cm: '27.9 cm' },
  { us: '12.0', uk: '11.0', eu: '45',   cm: '28.8 cm' },
];

// Women's shoe size conversion data
const womenSizeData = [
  { us: '6.0',  uk: '4.0',  eu: '37',   cm: '23.5 cm' },
  { us: '7.0',  uk: '5.0',  eu: '38',   cm: '24.4 cm' },
  { us: '8.0',  uk: '6.0',  eu: '39',   cm: '25.4 cm' },
  { us: '9.0',  uk: '7.0',  eu: '40',   cm: '26.2 cm' },
  { us: '10.0', uk: '8.0',  eu: '41',   cm: '27.1 cm' },
];

const SizeChart = () => {
  // Component state management
  const [activeTab, setActiveTab] = useState('men'); // Active tab (men/women)
  const sizeData = activeTab === 'men' ? menSizeData : womenSizeData; // Size data based on active tab

  // Main component render
  return (
    <div className="sc-page">
      {/* Hero section */}
      <div className="sc-hero">
        <h1>Find Your <span className="sc-hero-accent">Perfect</span> Fit.</h1>
        <p className="sc-hero-sub">
          A direct guide to ensuring your performance footwear aligns perfectly with your<br />
          physiology. Simple, precise, and global.
        </p>
      </div>

      {/* Size matrix card */}
      <div className="sc-wrapper">
        <div className="sc-card">
          {/* Card header with title and tabs */}
          <div className="sc-card-header">
            <h2 className="sc-card-title">Global Size Matrix</h2>
            {/* Tab navigation for men/women sizes */}
            <div className="sc-tabs">
              <button
                className={`sc-tab ${activeTab === 'men' ? 'sc-tab--active' : ''}`}
                onClick={() => setActiveTab('men')}
              >
                MEN
              </button>
              <button
                className={`sc-tab ${activeTab === 'women' ? 'sc-tab--active' : ''}`}
                onClick={() => setActiveTab('women')}
              >
                WOMEN
              </button>
            </div>
          </div>

          {/* Size conversion table */}
          <table className="sc-table">
            <thead>
              <tr>
                <th>US SIZE</th>
                <th>UK SIZE</th>
                <th>EU SIZE</th>
                <th>HEEL TO TOE (CM)</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row, i) => (
                <tr key={i}>
                  <td className="sc-td--bold">{row.us}</td>
                  <td>{row.uk}</td>
                  <td>{row.eu}</td>
                  <td className="sc-td--right">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Measurement disclaimer */}
          <p className="sc-disclaimer">
            MEASUREMENTS REPRESENT FOOT LENGTH, NOT SHOE DIMENSIONS.
          </p>
        </div>

        {/* Call-to-action card */}
        <div className="sc-cta">
          <h2>Ready to step in?</h2>
          <p>Our 30-day fit guarantee ensures you'll always have the right support for your movement.</p>
          {/* Action buttons */}
          <div className="sc-cta-btns">
            <Link to="/category" className="sc-btn sc-btn--primary">SHOP COLLECTION</Link>
            <Link to="/product/1" className="sc-btn sc-btn--outline">RETURN TO PRODUCT</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChart; // Export SizeChart component
