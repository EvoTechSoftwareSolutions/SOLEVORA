import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/user/PaymentDetails.css';

const PaymentDetails = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('creditcard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

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
  const shippingCharge = 0; // Assume free for now or from state
  const estimatedTax = 12.00;
  const total = grossTotal - promoDiscount + shippingCharge + estimatedTax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  const handlePlaceOrder = () => {
    navigate('/verify-code');
  };

  return (
    <div className="pd-page">
      <div className="pd-container">
        
        {/* ── Breadcrumb ── */}
        <nav className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <span className="pd-bc-sep">/</span>
          <Link to="/cart">Cart</Link>
          <span className="pd-bc-sep">/</span>
          <Link to="/shipping">Checkout</Link>
          <span className="pd-bc-sep">/</span>
          <span className="pd-bc-current">Payment</span>
        </nav>

        {/* ── Step Progress ── */}
        <div className="pd-stepper-wrap">
          <div className="pd-stepper">
            {/* Step 1: Completed */}
            <div className="pd-step-item">
              <div className="pd-circle pd-circle-completed">1</div>
              <span className="pd-step-lbl pd-lbl-completed">Shipping</span>
            </div>
            {/* Connector 1 */}
            <div className="pd-connector pd-connector-filled"></div>
            {/* Step 2: Completed */}
            <div className="pd-step-item">
              <div className="pd-circle pd-circle-completed">2</div>
              <span className="pd-step-lbl pd-lbl-completed">Method</span>
            </div>
            {/* Connector 2 */}
            <div className="pd-connector pd-connector-filled"></div>
            {/* Step 3: Active */}
            <div className="pd-step-item">
              <div className="pd-circle pd-circle-active">3</div>
              <span className="pd-step-lbl pd-lbl-active">Payment</span>
            </div>
          </div>
          <p className="pd-step-desc">Step 3 of 3: Enter your Payment information</p>
        </div>

        {/* ── Two-column Layout ── */}
        <div className="pd-grid">

          {/* ─── LEFT: Payment Content ─── */}
          <div className="pd-content-col">
            <h1 className="pd-page-title">Payment Details</h1>
            <p className="pd-page-subtitle">Secure your order with your preferred payment method.</p>

            <h3 className="pd-section-title">Select Payment Method</h3>
            
            <div className="pd-methods-grid">
              <div 
                className={`pd-method-card ${paymentMethod === 'creditcard' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('creditcard')}
              >
                <span className="material-symbols-outlined pd-method-icon">credit_card</span>
                <span className="pd-method-name">Credit Card</span>
              </div>
              <div 
                className={`pd-method-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <span className="material-symbols-outlined pd-method-icon">account_balance_wallet</span>
                <span className="pd-method-name">PayPal</span>
              </div>
              <div 
                className={`pd-method-card ${paymentMethod === 'applepay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('applepay')}
              >
                <span className="material-symbols-outlined pd-method-icon">phone_iphone</span>
                <span className="pd-method-name">Apple Pay</span>
              </div>
              <div 
                className={`pd-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <span className="material-symbols-outlined pd-method-icon">payments</span>
                <span className="pd-method-name">Cash on Delivery</span>
              </div>
            </div>

            {/* Credit Card Form Card */}
            <div className="pd-form-card">
              <div className="pd-form-field">
                <label className="pd-label">Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  className="pd-input"
                />
              </div>
              
              <div className="pd-form-field">
                <label className="pd-label">Card Number</label>
                <div className="pd-input-with-icon">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="pd-input"
                  />
                  <span className="material-symbols-outlined pd-input-icon">credit_card</span>
                </div>
              </div>

              <div className="pd-form-row">
                <div className="pd-form-field">
                  <label className="pd-label">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="pd-input"
                  />
                </div>
                <div className="pd-form-field">
                  <label className="pd-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="pd-input"
                  />
                </div>
              </div>

              <div className="pd-checkbox-row">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={formData.saveCard}
                  onChange={handleInputChange}
                  className="pd-checkbox"
                />
                <label htmlFor="saveCard" className="pd-checkbox-lbl">
                  Save card information for future purchases
                </label>
              </div>
            </div>

            <div className="pd-nav-actions">
              <Link to="/shipping-method" className="pd-back-link">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Shipping Method
              </Link>
            </div>
          </div>

          {/* ─── RIGHT: Order Summary ─── */}
          <div className="pd-summary-card">
            <h3 className="pd-summary-title">Order Summary</h3>

            {/* Horizontal scroll item cards */}
            <div className="pd-items-scroll">
              {cartItems.map(item => (
                <div key={item.id} className="pd-item-card">
                  <div className="pd-item-img-wrap">
                    <img src={item.image} alt={item.name} className="pd-item-img" />
                    <span className="pd-qty-badge">{item.qty}</span>
                  </div>
                  <p className="pd-item-name">{item.name}</p>
                  <p className="pd-item-variant">{item.variant}</p>
                  <div className="pd-item-footer">
                    <span className="pd-item-qty-lbl">Qty: {item.qty}</span>
                    <span className="pd-item-price">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="pd-promo">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="pd-promo-input"
              />
              <button type="button" onClick={handleApplyPromo} className="pd-promo-btn">
                Apply
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="pd-totals">
              <div className="pd-total-row">
                <span className="pd-total-key">Gross Total</span>
                <span className="pd-total-val">${grossTotal.toFixed(2)}</span>
              </div>
              <div className="pd-total-row">
                <span className="pd-total-key">Promo Discount</span>
                <span className="pd-total-val">${promoDiscount.toFixed(2)}</span>
              </div>
              <div className="pd-total-row">
                <span className="pd-total-key">Shipping</span>
                <span className="pd-free">Free</span>
              </div>
              <div className="pd-total-row">
                <span className="pd-total-key">Estimated Tax</span>
                <span className="pd-total-val">${estimatedTax.toFixed(2)}</span>
              </div>
              {/* Bold Total */}
              <div className="pd-total-final">
                <span className="pd-final-label">Total</span>
                <span className="pd-final-amount">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button className="pd-place-order-btn" onClick={handlePlaceOrder}>
              <span className="material-symbols-outlined">local_shipping</span>
              Place Order
            </button>

            {/* Terms */}
            <p className="pd-terms">
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

export default PaymentDetails;
