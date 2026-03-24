import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/user/ShippingInformation.css';

const ShippingInformation = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, checkoutData, updateCheckoutData } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [formData, setFormData] = useState(checkoutData);

  const grossTotal = cartTotal;
  const promoDiscount = promoApplied ? grossTotal * 0.1 : 0; // 10% discount for example
  const estimatedTax = grossTotal * 0.08;
  const total = grossTotal - promoDiscount + estimatedTax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'save10') setPromoApplied(true);
    else alert('Invalid promo code. Try "SAVE10"');
  };

  const handleContinue = () => {
    if (!formData.fullName || !formData.email || !formData.streetAddress) {
        alert('Please fill in required shipping fields.');
        return;
    }
    updateCheckoutData(formData);
    navigate('/shipping-method');
  };

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

  return (
    <div className="si-page">
      <div className="si-container">

        {/* ── Breadcrumb ── */}
        <nav className="si-breadcrumb">
          <Link to="/">Home</Link>
          <span className="si-bc-sep">/</span>
          <Link to="/cart">Cart</Link>
          <span className="si-bc-sep">/</span>
          <Link to="/checkout">Checkout</Link>
          <span className="si-bc-sep">/</span>
          <span className="si-bc-current">Shipping Information</span>
        </nav>

        {/* ── Step Progress ── */}
        <div className="si-stepper-wrap">
          <div className="si-stepper">
            {/* Step 1 */}
            <div className="si-step-item">
              <div className="si-circle si-circle-active">1</div>
              <span className="si-step-lbl si-lbl-active">Shipping</span>
            </div>
            {/* Connector 1 */}
            <div className="si-connector">
              <div className="si-connector-fill"></div>
            </div>
            {/* Step 2 */}
            <div className="si-step-item">
              <div className="si-circle si-circle-idle">2</div>
              <span className="si-step-lbl si-lbl-idle">Method</span>
            </div>
            {/* Connector 2 */}
            <div className="si-connector si-connector-empty"></div>
            {/* Step 3 */}
            <div className="si-step-item">
              <div className="si-circle si-circle-idle">3</div>
              <span className="si-step-lbl si-lbl-idle">Payment</span>
            </div>
          </div>
          <p className="si-step-desc">Step 1 of 3: Enter your delivery information</p>
        </div>

        {/* ── Two-column Layout ── */}
        <div className="si-grid">

          {/* ─── LEFT: Shipping Form ─── */}
          <div className="si-form-card">
            {/* Card heading */}
            <div className="si-form-heading">
              <span className="si-truck-icon">🚚</span>
              <h2 className="si-form-title">Shipping Information</h2>
            </div>

            <div className="si-form">
              {/* Full Name */}
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

              {/* Email + Phone */}
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

              {/* Street Address */}
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

              {/* City + Postal Code */}
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

              {/* Continue to Shipping Method Button */}
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

          {/* ─── RIGHT: Order Summary ─── */}
          <div className="si-summary-card">
            <h3 className="si-summary-title">Order Summary</h3>

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

            {/* Promo Code */}
            <div className="si-promo">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="si-promo-input"
              />
              <button type="button" onClick={handleApplyPromo} className="si-promo-btn">
                Apply
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="si-totals">
              <div className="si-total-row">
                <span className="si-total-key">Gross Total</span>
                <span className="si-total-val">${grossTotal.toFixed(2)}</span>
              </div>
              <div className="si-total-row">
                <span className="si-total-key">Promo Discount</span>
                <span className="si-total-val">${promoDiscount.toFixed(2)}</span>
              </div>
              <div className="si-total-row">
                <span className="si-total-key">Shipping</span>
                <span className="si-free">Free</span>
              </div>
              <div className="si-total-row">
                <span className="si-total-key">Estimated Tax</span>
                <span className="si-total-val">${estimatedTax.toFixed(2)}</span>
              </div>
              {/* Bold Total */}
              <div className="si-total-final">
                <span className="si-final-label">Total</span>
                <span className="si-final-amount">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order */}
            <button className="si-place-order-btn" onClick={handleContinue}>
              <span className="material-symbols-outlined">local_shipping</span>
              Continue
            </button>

            {/* Terms */}
            <p className="si-terms">
              By placing your order, you agree to Solevora's{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShippingInformation;
