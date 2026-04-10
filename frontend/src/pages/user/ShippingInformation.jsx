// ShippingInformation Component - First step of checkout process
// Collects shipping address and contact information from users
// Pre-fills data for logged-in users and validates form fields
// Displays order summary with promo code functionality
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import '../../styles/user/ShippingInformation.css';

const ShippingInformation = () => {
  const navigate = useNavigate();
  
  // Cart context - provides access to cart items and checkout data
  const {
    selectedCart: cart,
    selectedCartTotal,
    lockedSubtotal,
    lockCheckoutSubtotal,
    checkoutPromo,
    setCheckoutPromo,
    checkoutData,
    updateCheckoutData
  } = useCart();
  
  // Component state management
  const [isToastOpen, setIsToastOpen] = useState(false); // Toast notification visibility
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(checkoutPromo?.code || '');
  const [promoApplied, setPromoApplied] = useState(!!checkoutPromo?.applied);
  const [promoLoading, setPromoLoading] = useState(false);

  // Utility: show inline toast
  const showMessage = (title, body) => {
    setModalContent({ title, body });
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 2500);
  };

  // Initialize form data with pre-filled values for logged-in users
  const [formData, setFormData] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        ...checkoutData,
        fullName: user.name || checkoutData.fullName,
        email: user.email || checkoutData.email,
        phone: user.phone || checkoutData.phone,
        streetAddress: user.streetAddress || user.location || checkoutData.streetAddress,
        city: user.city || checkoutData.city,
        postalCode: user.postalCode || checkoutData.postalCode,
        country: user.country || checkoutData.country || 'United States',
        userId: user.id
      };
    }
    return { ...checkoutData, country: checkoutData.country || 'United States' };
  });

  // Price calculations
  const grossTotal = (lockedSubtotal ?? selectedCartTotal);
  const promoDiscount = promoApplied ? (checkoutPromo?.discountAmount || 0) : 0;
  const total = grossTotal - promoDiscount;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Apply promo code — validated against the backend API
  const handleApplyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) {
      showMessage('Empty Code', 'Please enter a promo code first.');
      return;
    }
    setPromoLoading(true);
    try {
      const axios = (await import('axios')).default;
      const { data } = await axios.post('http://localhost:5000/api/promo/validate', {
        code: trimmed,
        orderAmount: grossTotal
      });
      setPromoApplied(true);
      setCheckoutPromo({
        code: data.code,
        applied: true,
        discountAmount: data.discountAmount,
        discountType: data.discountType,
        discountValue: data.discountValue
      });
      showMessage('Promo Applied! 🎉', data.message);
    } catch (err) {
      setPromoApplied(false);
      setCheckoutPromo({ code: '', applied: false });
      showMessage('Invalid Promo', err.response?.data?.message || 'Invalid promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  // Handle continue to shipping method
  const handleContinue = () => {
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.streetAddress) {
        showMessage('Required Fields', 'Please fill in all shipping fields before continuing.');
        return;
    }
    // Lock subtotal to prevent changes during checkout process
    lockCheckoutSubtotal(grossTotal);
    updateCheckoutData(formData);
    navigate('/shipping-method');
  };

  // Empty cart state - prevents access to shipping page with no items
  if (cart.length === 0) {
    return (
        <div className="si-page">
            <div className="si-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Your cart is empty</h2>
                <p>Add some items to your cart before proceeding to checkout.</p>
                <Link to="/category" className="si-form-continue-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '20px' }}>
                    Shop Now
                </Link>
            </div>
        </div>
    );
  }

  // Main component render
  return (
    <div className="si-page">
      <div className="si-container">

        {/* Breadcrumb navigation */}
        <nav className="si-breadcrumb">
          <Link to="/">Home</Link>
          <span className="si-bc-sep">/</span>
          <Link to="/cart">Cart</Link>
          <span className="si-bc-sep">/</span>
          <Link to="/checkout">Checkout</Link>
          <span className="si-bc-sep">/</span>
          <span className="si-bc-current">Shipping Information</span>
        </nav>

        {/* Checkout progress stepper */}
        <div className="si-stepper-wrap">
          <div className="si-stepper">
            {/* Step 1 - Active */}
            <div className="si-step-item">
              <div className="si-circle si-circle-active">1</div>
              <span className="si-step-lbl si-lbl-active">Shipping</span>
            </div>
            {/* Connector 1 */}
            <div className="si-connector">
              <div className="si-connector-fill"></div>
            </div>
            {/* Step 2 - Idle */}
            <div className="si-step-item">
              <div className="si-circle si-circle-idle">2</div>
              <span className="si-step-lbl si-lbl-idle">Method</span>
            </div>
            {/* Connector 2 */}
            <div className="si-connector si-connector-empty"></div>
            {/* Step 3 - Idle */}
            <div className="si-step-item">
              <div className="si-circle si-circle-idle">3</div>
              <span className="si-step-lbl si-lbl-idle">Payment</span>
            </div>
          </div>
          <p className="si-step-desc">Step 1 of 3: Enter your delivery information</p>
        </div>

        {/* Main content grid - shipping form and order summary */}
        <div className="si-grid">

          {/* Shipping form column */}
          <div className="si-form-card">
            {/* Form header with truck icon */}
            <div className="si-form-heading">
              <span className="si-truck-icon">🚚</span>
              <h2 className="si-form-title">Shipping Information</h2>
            </div>

            {/* Shipping information form */}
            <div className="si-form">
              {/* Full name field */}
              <div className="si-field">
                <label className="si-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="si-input"
                />
              </div>

              {/* Email and phone fields in row */}
              <div className="si-row-2">
                <div className="si-field">
                  <label className="si-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="si-input"
                  />
                </div>
                <div className="si-field">
                  <label className="si-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="si-input"
                  />
                </div>
              </div>

              {/* Street address field */}
              <div className="si-field">
                <label className="si-label">Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="123 Luxury Lane"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  className="si-input"
                />
              </div>

              {/* City and postal code fields in row */}
              <div className="si-row-2">
                <div className="si-field">
                  <label className="si-label">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="si-input"
                  />
                </div>
                <div className="si-field">
                  <label className="si-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="10001"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="si-input"
                  />
                </div>
              </div>

              {/* Country field */}
              <div className="si-field">
                <label className="si-label">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="si-input"
                  required
                />
              </div>
              {/* Toast notification display */}
{isToastOpen && (
  <div className="toast">
    {modalContent.body}
  </div>
)}
              {/* Continue button */}
              <div className="si-continue-btn-container">
                <button 
                  type="button" 
                  className="si-form-continue-btn"
                  onClick={handleContinue}
                >
                  Continue to Shipping Method
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="si-summary-card">
            <h3 className="si-summary-title">Order Summary</h3>

            {/* Cart items display */}
            <div className="si-items-scroll">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="si-item-card">
                  <div className="si-item-img-wrap">
                    <img src={item.image_url} alt={item.name} className="si-item-img" />
                    <span className="si-qty-badge">{item.quantity}</span>
                  </div>
                  <p className="si-item-name">{item.name}</p>
                  <p className="si-item-variant">Size: {item.size}</p>
                  <div className="si-item-footer">
                    <span className="si-item-qty-lbl">Qty: {item.quantity}</span>
                    <span className="si-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo code input section */}
            <div className="si-promo">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); if (promoApplied) { setPromoApplied(false); setCheckoutPromo({ code: '', applied: false }); } }}
                className="si-promo-input"
                disabled={promoApplied}
              />
              {promoApplied ? (
                <button type="button" onClick={() => { setPromoApplied(false); setPromoCode(''); setCheckoutPromo({ code: '', applied: false }); }} className="si-promo-btn si-promo-remove">
                  Remove
                </button>
              ) : (
                <button type="button" onClick={handleApplyPromo} className="si-promo-btn" disabled={promoLoading}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              )}
            </div>
            {promoApplied && (
              <div className="si-promo-badge">
                ✅ <strong>{checkoutPromo?.code}</strong> — ${promoDiscount.toFixed(2)} off
              </div>
            )}

            {/* Order total breakdown */}
            <div className="si-totals">
              <div className="si-total-row">
                <span className="si-total-key">Gross Total</span>
                <span className="si-total-val">${grossTotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
              <div className="si-total-row" style={{ color: '#22c55e' }}>
                <span className="si-total-key">Promo Discount ({checkoutPromo?.code})</span>
                <span className="si-total-val">-${promoDiscount.toFixed(2)}</span>
              </div>
              )}
              <div className="si-total-row">
                <span className="si-total-key">Shipping</span>
                <span className="si-free">Free</span>
              </div>
              {/* Final total amount */}
              <div className="si-total-final">
                <span className="si-final-label">Total</span>
                <span className="si-final-amount">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Terms and conditions */}
            <p className="si-terms">
              By placing your order, you agree to Solevora's{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>

        </div>

        {/* Modal for displaying messages */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={modalContent.title}
          actions={
            <button className="modal-btn modal-btn-confirm" onClick={() => setIsModalOpen(false)}>Got it</button>
          }
        >
          <p>{modalContent.body}</p>
        </Modal>

      </div>
    </div>
  );
};

export default ShippingInformation; // Export ShippingInformation component
