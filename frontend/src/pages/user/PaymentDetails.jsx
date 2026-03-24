import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import '../../styles/user/PaymentDetails.css';

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, checkoutData, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('creditcard');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const showMessage = (title, body) => {
    setModalContent({ title, body });
    setIsModalOpen(true);
  };

  const grossTotal = cartTotal;
  const promoDiscount = promoApplied ? grossTotal * 0.1 : 0;
  const shippingCharge = 0; // Fixed for now
  const estimatedTax = grossTotal * 0.08;
  const total = grossTotal - promoDiscount + shippingCharge + estimatedTax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'save10') setPromoApplied(true);
    else showMessage('Invalid Promo', 'The code you entered is invalid. Try "SAVE10" for a discount.');
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'creditcard' && (!formData.cardNumber || !formData.cvv)) {
        showMessage('Invalid Details', 'Please enter valid payment details before placing your order.');
        return;
    }
    
    try {
        const orderPayload = {
            total_amount: total,
            status: 'paid', // Mark as paid for demo purposes
            shipping_address: `${checkoutData.streetAddress}, ${checkoutData.city}, ${checkoutData.postalCode}`,
            contact_number: checkoutData.phone,
            email: checkoutData.email,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                size: item.size
            }))
        };

        const response = await axios.post('http://localhost:5000/api/orders', orderPayload);
        console.log('Order created:', response.data);
        const orderData = response.data;
        const currentItems = [...cart];
        clearCart();
        navigate('/verify-code', { state: { order: orderData, items: currentItems } });
    } catch (error) {
        console.error('Error placing order:', error);
        showMessage('Order Failed', 'There was an error placing your order. Please check your bank and try again.');
    }
  };

  if (cart.length === 0) {
    return (
        <div className="pd-page">
            <div className="pd-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>Your cart is empty</h2>
                <Link to="/category" className="pd-place-order-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '20px' }}>
                    Shop Now
                </Link>
            </div>
        </div>
    );
  }

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
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="pd-item-card">
                  <div className="pd-item-img-wrap">
                    <img src={item.image_url} alt={item.name} className="pd-item-img" />
                    <span className="pd-qty-badge">{item.quantity}</span>
                  </div>
                  <p className="pd-item-name">{item.name}</p>
                  <p className="pd-item-variant">Size: {item.size}</p>
                  <div className="pd-item-footer">
                    <span className="pd-item-qty-lbl">Qty: {item.quantity}</span>
                    <span className="pd-item-price">${(item.price * item.quantity).toFixed(2)}</span>
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

        {/* Modal for Messages */}
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

export default PaymentDetails;
