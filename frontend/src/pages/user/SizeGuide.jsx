import React, { useState } from "react";
import "../../styles/user/SizeChart.css";

const menSizeData = [
  { us: "8.0", uk: "7.0", eu: "41", cm: "25.4 cm" },
  { us: "9.0", uk: "8.0", eu: "42", cm: "26.2 cm" },
  { us: "10.0", uk: "9.0", eu: "43", cm: "27.1 cm" },
  { us: "11.0", uk: "10.0", eu: "44.5", cm: "27.9 cm" },
  { us: "12.0", uk: "11.0", eu: "45", cm: "28.8 cm" },
];

const womenSizeData = [
  { us: "6.0", uk: "4.0", eu: "37", cm: "23.5 cm" },
  { us: "7.0", uk: "5.0", eu: "38", cm: "24.4 cm" },
  { us: "8.0", uk: "6.0", eu: "39", cm: "25.4 cm" },
  { us: "9.0", uk: "7.0", eu: "40", cm: "26.2 cm" },
  { us: "10.0", uk: "8.0", eu: "41", cm: "27.1 cm" },
];

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState("men");
  const sizeData = activeTab === "men" ? menSizeData : womenSizeData;

  return (
    <div className="sc-page">
      <section className="sc-hero">
        <h1>
          Size <span className="sc-hero-accent">Guide</span>
        </h1>
        <p className="sc-hero-sub">
          Compare your foot length to find your best fit across global sizing
          standards.
        </p>
      </section>

      <div className="sc-wrapper">
        <div className="sc-card">
          <div className="sc-card-header">
            <h2 className="sc-card-title">Global Size Matrix</h2>
            <div className="sc-tabs">
              <button
                className={`sc-tab ${activeTab === "men" ? "sc-tab--active" : ""}`}
                onClick={() => setActiveTab("men")}
                type="button"
              >
                MEN
              </button>
              <button
                className={`sc-tab ${activeTab === "women" ? "sc-tab--active" : ""}`}
                onClick={() => setActiveTab("women")}
                type="button"
              >
                WOMEN
              </button>
            </div>
          </div>

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
              {sizeData.map((row, index) => (
                <tr key={index}>
                  <td className="sc-td--bold">{row.us}</td>
                  <td>{row.uk}</td>
                  <td>{row.eu}</td>
                  <td className="sc-td--right">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="sc-disclaimer">
            MEASUREMENTS REPRESENT FOOT LENGTH, NOT SHOE DIMENSIONS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
