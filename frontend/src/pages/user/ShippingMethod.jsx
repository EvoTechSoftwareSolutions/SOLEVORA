import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import '../../styles/user/ShippingMethod.css';

const FALLBACK =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='80' height='80' viewBox='0 0 80 80'%3E` +
  `%3Crect width='80' height='80' fill='%23f3f4f6'/%3E` +
  `%3Cpath d='M20 55l14-18 10 12 8-10 14 16H20z' fill='%23d1d5db'/%3E` +
  `%3Ccircle cx='52' cy='28' r='7' fill='%23d1d5db'/%3E%3C/svg%3E`;

const handleImgError = (e) => {
  if (e.target.src !== FALLBACK) e.target.src = FALLBACK;
};

const ShippingMethod = () => {
  const navigate = useNavigate();

  // ✅ only use what exists in CartContext
  const { selectedCart, selectedTotal } = useCart();
  const cart = selectedCart;
  const cartTotal = selectedTotal;

  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });

  const showToast = (msg) => {
    setToastMsg(msg);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 2500);
  };

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping',  time: '3-5 business days',    price: 0       },
    { id: 'express',  name: 'Express Shipping',   time: '1-2 business days',    price: 650.00  },
    { id: 'nextday',  name: 'Next Day Delivery',  time: 'Delivery by tomorrow', price: 1200.00 },
  ];

  // ✅ read grossTotal from sessionStorage (set by ShippingInformation)
  const grossTotal = Number(sessionStorage.getItem('checkoutGrossTotal')) || cartTotal;
  const promoDiscount = promoApplied ? (promoData?.discountAmount || 0) : 0;
  const currentShippingObj = shippingMethods.find(m => m.id === selectedMethod);
  const currentShipping = currentShippingObj?.price || 0;
  const total = grossTotal - promoDiscount + currentShipping;

  const handleApplyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) { showToast('Please enter a promo code first.'); return; }
    setPromoLoading(true);
    try {
      const axios = (await import('axios')).default;
      const { data } = await axios.post('http://localhost:5001/api/promo/validate', {
        code: trimmed, orderAmount: grossTotal,
      });
      setPromoApplied(true);
      setPromoData({ code: data.code, discountAmount: data.discountAmount });
      showToast(`Promo applied! ${data.message}`);
    } catch (err) {
      setPromoApplied(false);
      setPromoData(null);
      showToast(err.response?.data?.message || 'Invalid promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setPromoData(null);
    setPromoCode('');
  };

  const handleContinueToPayment = () => {
    // ✅ save shipping method to sessionStorage for PaymentDetails to read
    sessionStorage.setItem('checkoutShippingMethod', currentShippingObj.name);
    sessionStorage.setItem('checkoutShippingCharge', String(currentShipping));
    sessionStorage.setItem('checkoutPromoDiscount', String(promoDiscount));
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

        {isToastOpen && <div className="toast">{toastMsg}</div>}

        {/* Breadcrumb */}
        <nav className="sm-breadcrumb">
          <Link to="/">Home</Link><span className="sm-bc-sep">/</span>
          <Link to="/cart">Cart</Link><span className="sm-bc-sep">/</span>
          <Link to="/shipping">Checkout</Link><span className="sm-bc-sep">/</span>
          <span className="sm-bc-current">Shipping Method</span>
        </nav>

        {/* Stepper */}
        <div className="sm-stepper-wrap">
          <div className="sm-stepper">
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-completed">1</div>
              <span className="sm-step-lbl sm-lbl-completed">Shipping</span>
            </div>
            <div className="sm-connector sm-connector-filled"></div>
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-active">2</div>
              <span className="sm-step-lbl sm-lbl-active">Method</span>
            </div>
            <div className="sm-connector"></div>
            <div className="sm-step-item">
              <div className="sm-circle sm-circle-idle">3</div>
              <span className="sm-step-lbl sm-lbl-idle">Payment</span>
            </div>
          </div>
          <p className="sm-step-desc">Step 2 of 3: Delivery Preferences</p>
        </div>

        <div className="sm-grid">

          {/* Shipping Method Selection */}
          <div className="sm-methods-col">
            <h1 className="sm-page-title">Shipping method</h1>
            <div className="sm-methods-list">
              {shippingMethods.map((method) => (
                <div key={method.id}
                  className={`sm-method-card ${selectedMethod === method.id ? 'active' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}>
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
                    {method.price === 0 ? 'Free' : `Rs. ${method.price.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="sm-nav-actions">
              <Link to="/shipping" className="sm-back-link">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Shipping Information
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="sm-summary-card">
            <h3 className="sm-summary-title">Order Summary</h3>
            <div className="sm-items-scroll">
              {cart.map(item => (
                <div key={item.id} className="sm-item-card">
                  <div className="sm-item-img-wrap">
                    <img src={item.image_url || FALLBACK} alt={item.name}
                      className="sm-item-img" onError={handleImgError} />
                    <span className="sm-qty-badge">{item.quantity}</span>
                  </div>
                  <p className="sm-item-name">{item.name}</p>
                  <p className="sm-item-variant">Size: {item.size}</p>
                  <div className="sm-item-footer">
                    <span className="sm-item-qty-lbl">Qty: {item.quantity}</span>
                    <span className="sm-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="sm-promo">
              <input type="text" placeholder="Enter promo code" value={promoCode}
                onChange={e => { setPromoCode(e.target.value); if (promoApplied) removePromo(); }}
                className="sm-promo-input" disabled={promoApplied} />
              {promoApplied ? (
                <button type="button" onClick={removePromo} className="sm-promo-btn sm-promo-remove">Remove</button>
              ) : (
                <button type="button" onClick={handleApplyPromo} className="sm-promo-btn" disabled={promoLoading}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              )}
            </div>
            {promoApplied && (
              <div className="sm-promo-badge">
                ✅ <strong>{promoData?.code}</strong> — Rs. {promoDiscount.toLocaleString()} off
              </div>
            )}

            {/* Totals */}
            <div className="sm-totals">
              <div className="sm-total-row">
                <span className="sm-total-key">Gross Total</span>
                <span className="sm-total-val">Rs. {grossTotal.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="sm-total-row" style={{ color: '#22c55e' }}>
                  <span className="sm-total-key">Promo Discount ({promoData?.code})</span>
                  <span className="sm-total-val">-Rs. {promoDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="sm-total-row">
                <span className="sm-total-key">Shipping</span>
                <span className="sm-free">
                  {currentShipping === 0 ? 'Free' : `Rs. ${currentShipping.toLocaleString()}`}
                </span>
              </div>
              <div className="sm-total-final">
                <span className="sm-final-label">Total</span>
                <span className="sm-final-amount">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button className="sm-place-order-btn" onClick={handleContinueToPayment}>
              <span className="material-symbols-outlined">local_shipping</span>
              Continue to Payment
            </button>

            <p className="sm-terms">
              By placing your order, you agree to Solevora's{' '}
              <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}
          actions={<button className="modal-btn modal-btn-confirm" onClick={() => setIsModalOpen(false)}>Got it</button>}>
          <p>{modalContent.body}</p>
        </Modal>
      </div>
    </div>
  );
};

export default ShippingMethod;