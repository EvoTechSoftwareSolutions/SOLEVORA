import React from 'react';
import '../../styles/user/Careers.css';
import { 
  FiAward, 
  FiUsers, 
  LuLeaf, 
  TbWorld, 
  ArrowRightIcon, 
  CiClock1, 
  LuMapPinHouse 
} from "../../components/common/icons.jsx";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Footwear Designer",
      type: "Full-time",
      location: "Tech City / Design Lab",
      department: "Design",
      requirements: [
        "Bachelor's degree in Industrial or Fashion Design",
        "5+ years of experience in athletic footwear design",
        "Proficiency in Adobe Creative Suite and 3D modeling (Rhino/CLO3D)"
      ]
    },
    {
      title: "Material Innovation Specialist",
      type: "Full-time",
      location: "Remote / Hybrid",
      department: "R&D",
      requirements: [
        "Degree in Material Science or Textile Engineering",
        "Strong knowledge of sustainable and bio-based textiles",
        "Experience in physical and chemical testing of footwear materials"
      ]
    },
    {
      title: "Footwear Production Manager",
      type: "Full-time",
      location: "Manufacturing Hub",
      department: "Operations",
      requirements: [
        "8+ years in footwear manufacturing or supply chain",
        "Deep understanding of molding, lasting, and assembly processes",
        "Proven leadership in managing large-scale production teams"
      ]
    },
    {
      title: "Technical Sole Engineer",
      type: "Full-time",
      location: "Tech City",
      department: "Engineering",
      requirements: [
        "Mechanical or Chemical Engineering background",
        "Expertise in performance foam (EVA/TPU) and rubber compounds",
        "Experience with midsole performance testing and biomechanics"
      ]
    },
    {
      title: "Quality Assurance Specialist",
      type: "Contract",
      location: "On-site",
      department: "Manufacturing",
      requirements: [
        "Experience in high-end footwear quality control",
        "Meticulous eye for stitching, bonding, and material defects",
        "Familiarity with international safety and durability standards"
      ]
    }
  ];

  const cultureItems = [
    {
      icon: <FiAward />,
      title: "Craftsmanship",
      description: "We are obsessed with the details. From the first sketch to the final stitch, excellence is our standard."
    },
    {
      icon: <FiUsers />,
      title: "Unity",
      description: "Our team is our greatest strength. We work together across design, engineering, and product to create magic."
    },
    {
      icon: <LuLeaf />,
      title: "Sustainable Innovation",
      description: "We are pioneering eco-friendly materials to ensure our footprint on the Earth is as light as our shoes."
    }
  ];

  return (
    <div className="careers-container">
      {/* Hero Section */}
      <section className="careers-hero">
        <div className="careers-hero-content">
          <p>CRAFT THE FUTURE</p>
          <h1>Walk the Path of <span>Innovation</span></h1>
          <p>
            SoleVora is more than a brand; it's a movement. Join our team of designers, 
            engineers, and visionaries to create the next generation of footwear.
          </p>
        </div>
        <div className="hero-pattern">
          <TbWorld style={{ fontSize: '300px', color: '#F97316' }} />
        </div>
      </section>

      {/* Our Culture */}
      <section className="culture-section">
        <div className="section-header">
          <p>The SoleVora Spirit</p>
          <h2>Our Values & Culture</h2>
        </div>
        <div className="culture-grid">
          {cultureItems.map((item, index) => (
            <div className="culture-card" key={index}>
              <div className="culture-icon-box">
                <span className="culture-icon">{item.icon}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="positions-section">
        <div className="section-header">
          <p>Current Openings</p>
          <h2>Join Our Factory & Lab</h2>
        </div>
        <div className="positions-list">
          {openPositions.map((job, index) => (
            <div className="position-item" key={index}>
              <div className="position-info">
                <h3>{job.title}</h3>
                <div className="position-meta">
                  <div className="meta-item">
                    <CiClock1 /> {job.type}
                  </div>
                  <div className="meta-item">
                    <LuMapPinHouse /> {job.location}
                  </div>
                  <div className="meta-item">
                    <FiUsers /> {job.department}
                  </div>
                </div>
                <div className="job-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="application-instruction">
                <p>Send your CV to</p>
                <span className="official-email">careers@solevora.com</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="careers-cta">
        <div className="cta-box">
          <h2>Don't see the right fit?</h2>
          <p>
            We're always looking for exceptional talent. If you have a passion for footwear 
            and innovation, we'd love to hear from you.
          </p>
          <a href="mailto:careers@solevora.com" className="cta-button">
            Send us your CV
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;
