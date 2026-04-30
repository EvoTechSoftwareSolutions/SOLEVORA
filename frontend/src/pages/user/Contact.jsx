// Importing necessary libraries, components, and styles
import "../../styles/user/Contact.css";
import axios from "axios";
import {
  CiClock1,
  LuMapPinHouse,
  CiMail,
  IoCallOutline,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaXTwitter,
  IoPaperPlaneOutline,
} from "../../components/common/icons.jsx";
import { useState, useEffect } from "react";

const Contact = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  // State to manage loading status and success message
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Pre-fill from profile if logged in
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setFormData(prev => ({
          ...prev,
          name: user.name || user.fullName || prev.name,
          email: user.email || prev.email,
          phone: user.phone || user.contactNumber || user.contact || prev.phone
        }));
      }
    } catch (err) {
      console.error("Error pre-filling contact form:", err);
    }
  }, []);

  // Function to handle input changes and update form data
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Sending form data to the backend API
      const res = await axios.post(
        "http://localhost:5001/api/contact",
        formData,
      );

      setSuccessMsg(res.data.message || "Message sent successfully!");

      // Resetting the form after successful submission
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Contact Banner Section */}
      <section className="contact-banner">
        <div className="contact-content">
          <h1>Get in Touch</h1>
          <p>
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Success Message Popup */}
      {successMsg && <div className="success-popup">{successMsg}</div>}

      {/* Contact Form Section */}
      <section className="contact-box">
        <div className="contact-form">
          <div className="form-header">
            <h4>Send us a Message</h4>
            <p className="form-subtitle">We'd love to hear from you. Our team is here to help.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Govindi Tharsh"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">What can we help you with?</option>
                <option value="support">Technical Support</option>
                <option value="sales">Product Inquiry</option>
                <option value="delivery">Delivery Status</option>
                <option value="return">Returns &amp; Exchanges</option>
                <option value="other">General Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="send-btn"
              disabled={loading}
            >
              <IoPaperPlaneOutline />
              <span>{loading ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
        </div>

        {/* Contact Information Section */}
        <div className="contact-info">
          <div className="contact-grid">
            <div className="contact-items">
              <LuMapPinHouse className="contactUs-icon" />
              <h5>Visit Our Store</h5>
              <span>45/A Premium Arcade</span>
              <span>Colombo 07, Sri Lanka</span>
            </div>

            <div className="contact-items">
              <IoCallOutline className="contactUs-icon" />
              <h5>Support Hotline</h5>
              <span>+94 11 234 5678</span>
              <span>+94 77 123 4567</span>
            </div>

            <div className="contact-items">
              <CiMail className="contactUs-icon" />
              <h5>Email Support</h5>
              <span>hello@solevora.com</span>
              <span>support@solevora.com</span>
            </div>

            <div className="contact-items">
              <CiClock1 className="contactUs-icon" />
              <h5>Business Hours</h5>
              <span>Mon - Fri: 9AM - 8PM</span>
              <span>Weekend: 10AM - 6PM</span>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="social">
            <h5>Follow Us</h5>
            <p>
              Stay connected and get the latest updates on new releases and
              exclusive offers.
            </p>
            <div className="social-icon-container">
              <span>
                <FaFacebookF className="social-media-icon" />
              </span>
              <span>
                <FaInstagram className="social-media-icon" />
              </span>
              <span>
                <FaTiktok className="social-media-icon" />
              </span>
              <span>
                <FaXTwitter className="social-media-icon" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps?q=Colombo,Sri%20Lanka&output=embed"
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="map"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
