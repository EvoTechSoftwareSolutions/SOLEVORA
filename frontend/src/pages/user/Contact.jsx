import "../../styles/user/Contact.css"
import { CiClock1,LuMapPinHouse,CiMail,IoCallOutline, FaInstagram,FaFacebookF ,FaTiktok ,FaXTwitter, IoPaperPlaneOutline } from "../../components/common/icons.jsx"

const Contact = () => {
   return(
     <div className="main-container">
 <section className="contact-banner">
  <div className="contact-content">
    <h1>Get in Touch</h1>
    <p>
      Have questions? We'd love to hear from you. Send us a message and we'll
      respond as soon as possible.
    </p>
  </div>
</section>

<section className="contact-box">
  {/* Contact Form */}
  <div className="contact-form">
    <h4>Send us a Message</h4>
<form>
  <div className="form-row">
    <div className="form-group">
    <label htmlFor="name"> Name</label>
    <input type="text" id="name" placeholder="Enter your Full Name" />
  </div>

  <div className="form-group">
    <label htmlFor="phone">Phone</label>
    <input type="phone" id="phone" placeholder="Phone your Address" />
  </div>
  </div>
<div className="form-group">
    <label htmlFor="email">Email</label>
    <input type="email" id="email" placeholder="Email your Address" />
  </div>
  <div className="form-group">
    <label htmlFor="subject">Subject</label>
    <select id="subject">
      <option value="">Select Subject</option>
      <option value="support">Support</option>
      <option value="sales">Sales</option>
      <option value="general">General</option>
    </select>
  </div>

  <div className="form-group">
    <label htmlFor="message"> Message</label>
    <textarea id="message" placeholder="Tell Something...."></textarea>
  </div>

<button type="submit" className="send-btn">
  <IoPaperPlaneOutline />
  <span>Send Message</span>
</button>
</form>
  </div>

  {/* Contact Info & Social */}
  <div className="contact-info">
    <div className="contact-grid">
      <div className="contact-items">
        <LuMapPinHouse className="contactUs-icon"/>
        <h5>Visit Us</h5>
        <span>123 Future Street</span>
        <span>Tech City, TC 12345</span>
      </div>

      <div className="contact-items">
        <IoCallOutline className="contactUs-icon"/>
        <h5>Call Us</h5>
        <span>0768575371</span>
        <span>0768575371</span>
      </div>

      <div className="contact-items">
        <CiMail className="contactUs-icon"/>
        <h5>Email Us</h5>
        <span>hello@nexstep.com</span>
        <span>support@nexstep.com</span>
      </div>

      <div className="contact-items">
        <CiClock1 className="contactUs-icon" />
        <h5>Business Hours</h5>
        <span>Mon - Fri: 9AM - 8PM</span>
        <span>Sat - Sun: 10AM - 6PM</span>
      </div>
    </div>

    {/* Social Section */}
    <div className="social">
      <h5>Follow Us</h5>
      <p>
        Stay connected and get the latest updates on new releases and exclusive offers.
      </p>
      <div className="social-icon-container">
        <span> <FaFacebookF className="social-media-icon" /> </span>
        <span> <FaInstagram className="social-media-icon" /> </span>
        <span> <FaTiktok className="social-media-icon" /> </span>
        <span> <FaXTwitter className="social-media-icon" /> </span>
      </div>
    </div>
  </div>
</section>

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
   )
}
export default Contact;