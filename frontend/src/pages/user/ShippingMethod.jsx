// ShippingMethod Component - Second step of checkout process
// Allows users to select shipping method (Standard, Express, Next Day)
// Calculates shipping costs based on selected method and displays updated totals
// Provides navigation back to shipping information and forward to payment
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import '../../styles/user/ShippingMethod.css';

const ShippingMethod = () => {
  const navigate = useNavigate();
  
  // Cart context - provides access to cart items and checkout data
  const {
    selectedCart: cart,
    selectedCartTotal,
    lockedSubtotal,
    lockCheckoutSubtotal,
    checkoutPromo,
    setCheckoutPromo,
    updateCheckoutData
  } = useCart();
  
  // Component state management
  const [isToastOpen, setIsToastOpen] = useState(false); // Toast notification visibility
  const [selectedMethod, setSelectedMethod] = useState('standard'); // Selected shipping method
  const [promoCode, setPromoCode] = useState(checkoutPromo?.code || ''); // Promo code input
  const [promoApplied, setPromoApplied] = useState(!!checkoutPromo?.applied); // Whether promo is applied
  const [promoLoading, setPromoLoading] = useState(false); // Loading state for apply button
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [modalContent, setModalContent] = useState({ title: '', body: '' }); // Modal message content

  // Utility function to display toast notifications
  const showMessage = (title, body) => {
    setModalContent({ title, body });
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 2500);
  };

  // Available shipping methods with pricing and delivery times
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', time: '3-5 business days', price: 0 },
    { id: 'express', name: 'Express Shipping', time: '1-2 business days', price: 15.00 },
    { id: 'nextday', name: 'Next Day Delivery', time: 'Delivery by tomorrow', price: 25.00 },
  ];

  // Price calculations
  const grossTotal = (lockedSubtotal ?? selectedCartTotal); // Use locked subtotal if available
  const promoDiscount = promoApplied ? (checkoutPromo?.discountAmount || 0) : 0;
  const currentShippingObj = shippingMethods.find(m => m.id === selectedMethod); // Find selected method
  const currentShipping = currentShippingObj?.price || 0; // Get shipping cost
  const total = grossTotal - promoDiscount + currentShipping; // Final total with shipping

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

  // Handle continue to payment step
  const handleContinueToPayment = () => {
    // Ensure locked subtotal exists before moving forward
    lockCheckoutSubtotal(grossTotal);
    updateCheckoutData({
        shippingMethod: currentShippingObj.name
    });
    navigate('/payment');
  };

  // Empty cart state - prevents access to shipping method page with no items
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

  // Main component render
  return (
    
    <div className="sm-page">
      <div className="sm-container">
        {/* Toast notification display */}
        {isToastOpen && (
  <div className="toast">
    {modalContent.body}
  </div>
)}
    
        {/* Breadcrumb navigation */}
        <nav className="sm-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sm-bc-sep">/</span>
          <Link to="/cart">Cart</Link>
          <span className="sm-bc-sep">/</span>
          <Link to="/shipping">Checkout</Link>
          <span className="sm-bc-sep">/</span>
          <span className="sm-bc-current">Shipping Method</span>
        </nav>

        {/* Checkout progress stepper */}
        <div className="sm-stepper-wrap">
          <div className="sm-stepper">
            {/* Step 1 - Completed */}
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-completed">1</div>
              <span className="sm-step-lbl sm-lbl-completed">Shipping</span>
            </div>
            {/* Connector 1 - Filled */}
            <div className="sm-connector sm-connector-filled"></div>
            {/* Step 2 - Active */}
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-active">2</div>
              <span className="sm-step-lbl sm-lbl-active">Method</span>
            </div>
            {/* Connector 2 - Empty */}
            <div className="sm-connector"></div>
            {/* Step 3 - Idle */}
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-idle">3</div>
              <span className="sm-step-lbl sm-lbl-idle">Payment</span>
            </div>
          </div>
          <p className="sm-step-desc">Step 2 of 3: Delivery Preferences</p>
        </div>

        {/* Main content grid - shipping methods and order summary */}
        <div className="sm-grid">

          {/* Shipping methods selection column */}
          <div className="sm-methods-col">
            <h1 className="sm-page-title">Shipping method</h1>
            
            {/* Shipping method options */}
            <div className="sm-methods-list">
              {shippingMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`sm-method-card ${selectedMethod === method.id ? 'active' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="sm-method-main">
                    {/* Custom radio button */}
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
                  {/* Price display */}
                  <div className="sm-method-price">
                    {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation actions */}
            <div className="sm-nav-actions">
              <Link to="/shipping" className="sm-back-link">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Shipping Information
              </Link>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="sm-summary-card">
            <h3 className="sm-summary-title">Order Summary</h3>

            {/* Cart items display */}
            <div className="sm-items-scroll">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="sm-item-card">
                  <div className="sm-item-img-wrap">
                    <img src={item.image_url} alt={item.name} className="sm-item-img" />
                    <span className="sm-qty-badge">{item.quantity}</span>
                  </div>
                  <p className="sm-item-name">{item.name}</p>
                  <p className="sm-item-variant">Size: {item.size}</p>
                  <div className="sm-item-footer">
                    <span className="sm-item-qty-lbl">Qty: {item.quantity}</span>
                    <span className="sm-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo code input section */}
            <div className="sm-promo">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); if (promoApplied) { setPromoApplied(false); setCheckoutPromo({ code: '', applied: false }); } }}
                className="sm-promo-input"
                disabled={promoApplied}
              />
              {promoApplied ? (
                <button type="button" onClick={() => { setPromoApplied(false); setPromoCode(''); setCheckoutPromo({ code: '', applied: false }); }} className="sm-promo-btn sm-promo-remove">
                  Remove
                </button>
              ) : (
                <button type="button" onClick={handleApplyPromo} className="sm-promo-btn" disabled={promoLoading}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              )}
            </div>
            {promoApplied && (
              <div className="sm-promo-badge">
                ✅ <strong>{checkoutPromo?.code}</strong> — ${promoDiscount.toFixed(2)} off
              </div>
            )}

            {/* Order total breakdown */}
            <div className="sm-totals">
              <div className="sm-total-row">
                <span className="sm-total-key">Gross Total</span>
                <span className="sm-total-val">${grossTotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
              <div className="sm-total-row" style={{ color: '#22c55e' }}>
                <span className="sm-total-key">Promo Discount ({checkoutPromo?.code})</span>
                <span className="sm-total-val">-${promoDiscount.toFixed(2)}</span>
              </div>
              )}
              <div className="sm-total-row">
                <span className="sm-total-key">Shipping</span>
                <span className="sm-free">
                  {currentShipping === 0 ? 'Free' : `$${currentShipping.toFixed(2)}`}
                </span>
              </div>
              {/* Final total amount */}
              <div className="sm-total-final">
                <span className="sm-final-label">Total</span>
                <span className="sm-final-amount">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Continue to payment button */}
            <button className="sm-place-order-btn" onClick={handleContinueToPayment}>
              <span className="material-symbols-outlined">local_shipping</span>
              Continue to Payment
            </button>

            {/* Terms and conditions */}
            <p className="sm-terms">
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

export default ShippingMethod; // Export ShippingMethod component
