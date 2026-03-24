import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/user/ShippingMethod.css';

const ShippingMethod = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      time: '3-5 business days',
      price: 0,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      time: '1-2 business days',
      price: 15.00,
    },
    {
      id: 'nextday',
      name: 'Next Day Delivery',
      time: 'Delivery by tomorrow',
      price: 25.00,
    },
  ];

  const cartItems = [
    {
      id: 1,
      name: 'Solar Speed Runner v2',
      variant: 'Size: 42 | Orange Pulse',
      qty: 1,
      price: 189.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcVWKRIEQKTdczefQ26RyCmwjQxO2wxh6uZTJzQf6vtd5FKc56wtqnzYUyXDp1A9R1QUzEDGxFZTR9fiT78MSQJyWa-QRIKW6cNjZzuitgKpdvoNrjSXPiEOsHB6WRXhN2pHVQc-0RVUQyUTlgAt94vEyTD_fzESIGVBwu4DVh9umTXNSJST2iubUsbKaYCkjUnHOkEqGlqxIRpocYo6_vlMKSBHSHxyHg8J5LF58NrUuKVcDkW8URlTqsRrXMHAp-F464FBRb2o8',
    },
    {
      id: 2,
      name: 'Luna Air Cushion',
      variant: 'Size: 42 | White Goud',
      qty: 1,
      price: 245.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqK9Sm3g31W8dSYXrTsjJCRucyq1dONto1nYxeUhceUsZFAhGq2PTfHOF4fCGykvAz09YeXckKlMt2UKyfcvRiaUffbjFqUKRpLU7qqScOt6z5RU2crSmXOW7EVKbPUc2_bVtc5IK3szkdnm849wNd4_ylK17tvOXZOveurNFQHQj_EQpCnBccSYgri-rLXg2OABRBvCEneGRF_DsbWnTf7kDGwS-RikDI0aWgRm8ImpgSvfIPePD7WOVY1wIL2ctbdIC4ia2-w1M',
    },
  ];

  const grossTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const promoDiscount = promoApplied ? grossTotal : 0;
  const currentShipping = shippingMethods.find(m => m.id === selectedMethod)?.price || 0;
  const estimatedTax = 12.00;
  const total = grossTotal - promoDiscount + currentShipping + estimatedTax;

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  const handleContinueToPayment = () => {
    navigate('/payment');
  };

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
              {cartItems.map(item => (
                <div key={item.id} className="sm-item-card">
                  <div className="sm-item-img-wrap">
                    <img src={item.image} alt={item.name} className="sm-item-img" />
                    <span className="sm-qty-badge">{item.qty}</span>
                  </div>
                  <p className="sm-item-name">{item.name}</p>
                  <p className="sm-item-variant">{item.variant}</p>
                  <div className="sm-item-footer">
                    <span className="sm-item-qty-lbl">Qty: {item.qty}</span>
                    <span className="sm-item-price">${item.price.toFixed(2)}</span>
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
