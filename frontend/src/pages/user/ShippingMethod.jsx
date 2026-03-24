import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/user/ShippingMethod.css';

const ShippingMethod = () => {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', time: '3-5 business days', price: 0 },
    { id: 'express', name: 'Express Shipping', time: '1-2 business days', price: 15.00 },
    { id: 'nextday', name: 'Next Day Delivery', time: 'Delivery by tomorrow', price: 25.00 },
  ];

  const grossTotal = cartTotal;
  const promoDiscount = promoApplied ? grossTotal * 0.1 : 0;
  const currentShipping = shippingMethods.find(m => m.id === selectedMethod)?.price || 0;
  const estimatedTax = grossTotal * 0.08;
  const total = grossTotal - promoDiscount + currentShipping + estimatedTax;

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'save10') setPromoApplied(true);
    else alert('Invalid promo code. Try "SAVE10"');
  };

  const handleContinueToPayment = () => {
    navigate('/payment');
  };

  if (cart.length === 0) {
    return (
        <div className="sm-page">
            <div className="sm-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Your cart is empty</h2>
                <Link to="/category" className="sm-continue-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '20px' }}>
                    Shop Now
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="sm-page">
      <div className="sm-container">
        
        {/* ── Breadcrumb ── */}
        <nav className="sm-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sm-bc-sep">/</span>
          <Link to="/cart">Cart</Link>
          <span className="sm-bc-sep">/</span>
          <Link to="/shipping">Checkout</Link>
          <span className="sm-bc-sep">/</span>
          <span className="sm-bc-current">Shipping Method</span>
        </nav>

        {/* ── Step Progress ── */}
        <div className="sm-stepper-wrap">
          <div className="sm-stepper">
            {/* Step 1 */}
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-completed">1</div>
              <span className="sm-step-lbl sm-lbl-completed">Shipping</span>
            </div>
            {/* Connector 1 */}
            <div className="sm-connector sm-connector-filled"></div>
            {/* Step 2 */}
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-active">2</div>
              <span className="sm-step-lbl sm-lbl-active">Method</span>
            </div>
            {/* Connector 2 */}
            <div className="sm-connector"></div>
            {/* Step 3 */}
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-idle">3</div>
              <span className="sm-step-lbl sm-lbl-idle">Payment</span>
            </div>
          </div>
          <p className="sm-step-desc">Step 2 of 3: Delivery Preferences</p>
        </div>

        {/* ── Two-column Layout ── */}
        <div className="sm-grid">

          {/* ─── LEFT: Shipping Methods ─── */}
          <div className="sm-methods-col">
            <h1 className="sm-page-title">Shipping method</h1>
            
            <div className="sm-methods-list">
              {shippingMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`sm-method-card ${selectedMethod === method.id ? 'active' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="sm-method-main">
                    <div className={`sm-radio-custom ${selectedMethod === method.id ? 'checked' : ''}`}>
                      {selectedMethod === method.id && (
                        <span className="material-symbols-outlined sm-check">check</span>
                      )}
                    </div>
                    <div className="sm-method-info">
                      <h3 className="sm-method-name">{method.name}</h3>
                      <p className="sm-method-time">{method.time}</p>
                    </div>
                  </div>
                  <div className="sm-method-price">
                    {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>

            <div className="sm-nav-actions">
              <Link to="/shipping" className="sm-back-link">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Shipping Information
              </Link>
              <button 
                className="sm-continue-btn"
                onClick={handleContinueToPayment}
              >
                Continue to Payment
              </button>
            </div>
          </div>

          {/* ─── RIGHT: Order Summary ─── */}
          <div className="sm-summary-card">
            <h3 className="sm-summary-title">Order Summary</h3>

            {/* Horizontal scroll item cards */}
            <div className="sm-items-scroll">
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
            <div className="sm-promo">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="sm-promo-input"
              />
              <button type="button" onClick={handleApplyPromo} className="sm-promo-btn">
                Apply
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="sm-totals">
              <div className="sm-total-row">
                <span className="sm-total-key">Gross Total</span>
                <span className="sm-total-val">${grossTotal.toFixed(2)}</span>
              </div>
              <div className="sm-total-row">
                <span className="sm-total-key">Promo Discount</span>
                <span className="sm-total-val">${promoDiscount.toFixed(2)}</span>
              </div>
              <div className="sm-total-row">
                <span className="sm-total-key">Shipping</span>
                <span className="sm-free">
                  {currentShipping === 0 ? 'Free' : `$${currentShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="sm-total-row">
                <span className="sm-total-key">Estimated Tax</span>
                <span className="sm-total-val">${estimatedTax.toFixed(2)}</span>
              </div>
              {/* Bold Total */}
              <div className="sm-total-final">
                <span className="sm-final-label">Total</span>
                <span className="sm-final-amount">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order - Note: This link might just confirm for now */}
            <button className="sm-place-order-btn">
              <span className="material-symbols-outlined">local_shipping</span>
              Place Order
            </button>

            {/* Terms */}
            <p className="sm-terms">
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

export default ShippingMethod;
