import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import { API_URL } from '../../config/api';
import '../../styles/user/PaymentDetails.css';

const FALLBACK =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='80' height='80' viewBox='0 0 80 80'%3E` +
  `%3Crect width='80' height='80' fill='%23f3f4f6'/%3E` +
  `%3Cpath d='M20 55l14-18 10 12 8-10 14 16H20z' fill='%23d1d5db'/%3E` +
  `%3Ccircle cx='52' cy='28' r='7' fill='%23d1d5db'/%3E%3C/svg%3E`;

const handleImgError = (e) => {
  if (e.target.src !== FALLBACK) e.target.src = FALLBACK;
};

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { selectedCart, selectedTotal, clearCart } = useCart();
  const cart = selectedCart;
  const cartTotal = selectedTotal;


  const initialPromoCode = sessionStorage.getItem('checkoutPromoCode') || '';
  const initialPromoDiscount = Number(sessionStorage.getItem('checkoutPromoDiscount')) || 0;

  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [promoCode, setPromoCode] = useState(initialPromoCode);
  const [promoApplied, setPromoApplied] = useState(initialPromoDiscount > 0);
  const [promoData, setPromoData] = useState(initialPromoDiscount > 0 ? { code: initialPromoCode, discountAmount: initialPromoDiscount } : null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });

  const showMessage = (title, body) => {
    setModalContent({ title, body });
    setIsModalOpen(true);
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  // read all checkout data from sessionStorage (set by previous steps)
  const checkoutFormData = (() => {
    try { return JSON.parse(sessionStorage.getItem('checkoutFormData') || '{}'); } catch { return {}; }
  })();

  const grossTotal = Number(sessionStorage.getItem('checkoutGrossTotal')) || cartTotal;
  const promoDiscount = promoApplied ? (promoData?.discountAmount || 0) : 0;
  const shippingCharge = Number(sessionStorage.getItem('checkoutShippingCharge')) || 0;
  const shippingMethodName = sessionStorage.getItem('checkoutShippingMethod') || 'Standard Shipping';
  const total = grossTotal - promoDiscount + shippingCharge;

  const handleApplyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) return;
    setPromoLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/promo/validate`, {
        code: trimmed, orderAmount: grossTotal,
      });
      setPromoApplied(true);
      setPromoData({ code: data.code, discountAmount: data.discountAmount });
      sessionStorage.setItem('checkoutPromoCode', data.code);
      sessionStorage.setItem('checkoutPromoDiscount', String(data.discountAmount));
    } catch (error) {
      showMessage('Error', 'Could not validate promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setPromoData(null);
    setPromoCode('');
    sessionStorage.setItem('checkoutPromoCode', '');
    sessionStorage.setItem('checkoutPromoDiscount', '0');
  };

 const handlePlaceOrder = async (paymentMethod) => {
    if (paymentMethod === 'COD') {
      handleCOD();
    } else if (paymentMethod === 'ONLINE') {
      handlePayHere();
    } else {
      showMessage('Payment Method Not Supported', 'Please select a valid payment method.');
    }
  };

  const handleCOD = async () => {
    try {
      const orderPayload = {
        userId: user?.id ? Number(user.id) : undefined,
        customerName: checkoutFormData.fullName || user?.name || 'Guest User',
        email: checkoutFormData.email || user?.email || 'guest@example.com',
        contactNumber: checkoutFormData.phone || '0000000000',
        shippingAddress: `${checkoutFormData.streetAddress || 'N/A'}, ${checkoutFormData.city || 'N/A'}, ${checkoutFormData.postalCode || '00000'}, ${checkoutFormData.country || 'Sri Lanka'}`,
        paymentMethod: 'COD',
        items: cart.map(item => ({
          productId: Number(item.productId || item.id),
          quantity: Number(item.quantity),
          price: Number(item.price),
          size: item.size,
        })),
        shippingCharge: Number(sessionStorage.getItem('checkoutShippingCharge')) || 0,
        promoDiscount: promoApplied ? (promoData?.discountAmount || 0) : 0,
        promoCode: promoApplied ? (promoData?.code || '') : '',
        totalAmount: total
      };

      const response = await axios.post(`${API_URL}/orders`, orderPayload);
      const orderData = response.data;
      const currentItems = [...cart];

      // ✅ clearCart — removes all items via context
      clearCart();

      // clear sessionStorage checkout data
      sessionStorage.removeItem('checkoutFormData');
      sessionStorage.removeItem('checkoutGrossTotal');
      sessionStorage.removeItem('checkoutShippingMethod');
      sessionStorage.removeItem('checkoutShippingCharge');
      sessionStorage.removeItem('checkoutPromoDiscount');
      sessionStorage.removeItem('checkoutPromoCode');

      navigate('/order-confirmation', {
        state: { 
          orderId: orderData.data?.orderId || orderData.id || orderData.data?.id, 
          items: currentItems, 
          paymentMethod: 'cod',
          promoCode: promoData?.code || '',
          promoDiscount: promoData?.discountAmount || 0,
          customerName: checkoutFormData.fullName || user?.name || 'Guest User',
          email: checkoutFormData.email || user?.email || 'guest@example.com'
        },
      });
    } catch (error) {
      console.error('Error placing COD order:', error);
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ') 
        : (error.response?.data?.message || 'Something went wrong. Please try again.');
      
      showMessage('Order Failed', errorMsg);
    }
  };

  const handlePayHere = async () => {
    try {
      const orderPayload = {
        userId: user?.id ? Number(user.id) : undefined,
        customerName: checkoutFormData.fullName || user?.name || 'Guest User',
        email: checkoutFormData.email || user?.email || 'guest@example.com',
        contactNumber: checkoutFormData.phone || '0000000000',
        shippingAddress: `${checkoutFormData.streetAddress || 'N/A'}, ${checkoutFormData.city || 'N/A'}, ${checkoutFormData.postalCode || '00000'}, ${checkoutFormData.country || 'Sri Lanka'}`,
        paymentMethod: 'ONLINE',
        items: cart.map(item => ({
          productId: Number(item.productId || item.id),
          quantity: Number(item.quantity),
          price: Number(item.price),
          size: item.size,
        })),
        shippingCharge: Number(sessionStorage.getItem('checkoutShippingCharge')) || 0,
        promoDiscount: promoApplied ? (promoData?.discountAmount || 0) : 0,
        promoCode: promoApplied ? (promoData?.code || '') : '',
        totalAmount: total
      };

      const response = await axios.post(`${API_URL}/orders`, orderPayload);
      const orderData = response.data;

      const orderId = orderData.data?.orderId || orderData.id;

      const hashResponse = await axios.post(`${API_URL}/payment/hash`, {
        order_id: orderId,
        amount: total,
        currency: 'LKR',
      });

      const { hash, merchant_id } = hashResponse.data.data || hashResponse.data;

      const payment = {
        sandbox: true,
        merchant_id: String(merchant_id),
        return_url: `${window.location.origin}/profile/orders`,
        cancel_url: window.location.href,
        notify_url: `${API_URL}/payment/notify`,
        order_id: String(orderId),
        items: `SoleVora Order #${orderId}`,
        amount: total.toFixed(2),
        currency: 'LKR',
        hash: hash,
        first_name: (checkoutFormData.fullName || user?.name || 'Guest').split(' ')[0] || 'Guest',
        last_name: (checkoutFormData.fullName || user?.name || 'Guest').split(' ').slice(1).join(' ') || 'User',
        email: checkoutFormData.email || user?.email || 'guest@example.com',
        phone: checkoutFormData.phone || user?.phone || '0000000000',
        address: checkoutFormData.streetAddress || user?.streetAddress || user?.location || 'Main Street',
        city: checkoutFormData.city || user?.city || 'Colombo',
        country: 'Sri Lanka',
      };

      window.payhere.onCompleted = function (orderId) {
        axios.put(`${API_URL}/payment/orders/${orderId}/status`, { status: 'PROCESSING', paymentStatus: 'PAID' })
          .finally(() => {
            const currentItems = [...cart];
            clearCart();
            sessionStorage.removeItem('checkoutFormData');
            sessionStorage.removeItem('checkoutGrossTotal');
            sessionStorage.removeItem('checkoutShippingMethod');
            sessionStorage.removeItem('checkoutShippingCharge');
            sessionStorage.removeItem('checkoutPromoDiscount');
            sessionStorage.removeItem('checkoutPromoCode');
            navigate('/order-confirmation', {
              state: { 
                orderId: orderId, 
                items: currentItems, 
                paymentMethod: 'online',
                promoCode: promoData?.code || '',
                promoDiscount: promoData?.discountAmount || 0,
                customerName: checkoutFormData.fullName || user?.name || 'Guest User',
                email: checkoutFormData.email || user?.email || 'guest@example.com'
              },
            });
          });
      };

      window.payhere.onDismissed = function () {
        showMessage('Payment Dismissed', 'You dismissed the payment popup. Your order is saved as pending.');
      };

      window.payhere.onError = function (error) {
        showMessage('Payment Error', 'There was an error with PayHere: ' + error);
      };

      window.payhere.startPayment(payment);
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ') 
        : (error.response?.data?.message || 'Error initiating payment. Please try again.');
      
      showMessage('Order Failed', errorMsg);
    }

  };

  if (cart.length === 0) {
    return (
      <div className="pd-page">
        <div className="pd-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Your cart is empty</h2>
          <p style={{ marginBottom: '20px', color: '#888' }}>Add some items before proceeding to payment.</p>
          <Link to="/category" className="pd-place-order-btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 30px' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page">
      <div className="pd-container">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/">Home</Link><span className="pd-bc-sep">/</span>
          <Link to="/cart">Cart</Link><span className="pd-bc-sep">/</span>
          <Link to="/shipping">Checkout</Link><span className="pd-bc-sep">/</span>
          <span className="pd-bc-current">Payment</span>
        </nav>

        {/* Stepper */}
        <div className="pd-stepper-wrap">
          <div className="pd-stepper">
            <div className="pd-step-item">
              <div className="pd-circle pd-circle-completed">1</div>
              <span className="pd-step-lbl pd-lbl-completed">Shipping</span>
            </div>
            <div className="pd-connector pd-connector-filled"></div>
            <div className="pd-step-item">
              <div className="pd-circle pd-circle-completed">2</div>
              <span className="pd-step-lbl pd-lbl-completed">Method</span>
            </div>
            <div className="pd-connector pd-connector-filled"></div>
            <div className="pd-step-item">
              <div className="pd-circle pd-circle-active">3</div>
              <span className="pd-step-lbl pd-lbl-active">Payment</span>
            </div>
          </div>
        </div>

        <div className="pd-grid">
          {/* Payment Method */}
          <div className="pd-content-col">
            <h1 className="pd-page-title">Payment Details</h1>
            <p className="pd-page-subtitle">Secure your order with your preferred payment method.</p>

            <h3 className="pd-section-title">Select Payment Method</h3>
            
            {/* Desktop / Tablet Grid */}
            <div className="pd-desktop-methods">
              <div className="pd-methods-grid">
                {[
                  { id: 'ONLINE', icon: 'credit_card', label: 'Credit / Debit Card' },
                  { id: 'paypal', icon: 'account_balance_wallet', label: 'PayPal' },
                  { id: 'applepay', icon: null, label: 'Apple Pay', sub: 'iOS' },
                  { id: 'COD', icon: 'payments', label: 'Cash on Delivery' },
                ].map(m => (
                  <div key={m.id}
                    className={`pd-method-card ${paymentMethod === m.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(m.id)}>
                    {m.icon
                      ? <span className="material-symbols-outlined pd-method-icon">{m.icon}</span>
                      : <span className="pd-method-sub">{m.sub}</span>}
                    <span className="pd-method-name">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Horizontal Scroll (Native) */}
            <div className="pd-mobile-methods">
              <div className="pd-mobile-methods-scroll">
                {[
                  { id: 'ONLINE', icon: 'credit_card', label: 'Credit / Debit Card' },
                  { id: 'paypal', icon: 'account_balance_wallet', label: 'PayPal' },
                  { id: 'applepay', icon: null, label: 'Apple Pay', sub: 'iOS' },
                  { id: 'COD', icon: 'payments', label: 'Cash on Delivery' },
                ].map(m => (
                  <div key={m.id}
                    className={`pd-method-card ${paymentMethod === m.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(m.id)}>
                    {m.icon
                      ? <span className="material-symbols-outlined pd-method-icon">{m.icon}</span>
                      : <span className="pd-method-sub">{m.sub}</span>}
                    <span className="pd-method-name">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment info */}
            <div className="pd-form-card" style={{ padding: '30px', textAlign: 'center' }}>
              {paymentMethod === 'ONLINE' ? (
                <>
                  <img src="https://www.payhere.lk/downloads/images/payhere_logo.png"
                    alt="PayHere" style={{ width: '150px', margin: '0 auto 20px' }} />
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                    You will be redirected to PayHere secure gateway to complete your transaction.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#16a34a', fontWeight: '600', fontSize: '14px' }}>
                    <span className="material-symbols-outlined">verified_user</span>
                    SSL Secure Transaction
                  </div>
                </>
              ) : paymentMethod === 'COD' ? (
                <div style={{ padding: '10px 0' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '52px', color: '#f66d3b', display: 'block', marginBottom: '16px' }}>local_shipping</span>
                  <h3 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '10px' }}>Pay When You Receive</h3>
                  <p style={{ fontSize: '14px', color: '#888', maxWidth: '320px', margin: '0 auto 16px', lineHeight: '1.7' }}>
                    Your order will be delivered to your address. Payment is collected by the delivery agent upon arrival.
                  </p>
                  <div style={{ background: '#fff7f3', border: '1px solid #ffd5c0', borderRadius: '12px', padding: '14px 18px', textAlign: 'left', maxWidth: '340px', margin: '0 auto' }}>
                    <p style={{ fontSize: '13px', color: '#444', marginBottom: '6px' }}><strong>📍 Delivery Address:</strong></p>
                    <p style={{ fontSize: '13px', color: '#666' }}>{checkoutFormData.streetAddress || 'N/A'}, {checkoutFormData.city || 'N/A'}</p>
                    <p style={{ fontSize: '13px', color: '#444', marginTop: '10px', marginBottom: '6px' }}><strong>💰 Amount Due on Delivery:</strong></p>
                    <p style={{ fontSize: '20px', fontWeight: '800', color: '#f66d3b' }}>Rs. {total.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#888', padding: '40px 0' }}>
                  Details for {paymentMethod} will be shown here.
                </p>
              )}
            </div>

            <div className="pd-nav-actions">
              <Link to="/shipping-method" className="pd-back-link">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Shipping Method
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="pd-summary-card">
            <h3 className="pd-summary-title">Order Summary</h3>
            <div className="pd-items-scroll">
              {cart.map((item, idx) => {
                // If there are multiple price batches, we show them as separate lines
                const displayItems = (item.priceBatches && item.priceBatches.length > 1) 
                  ? item.priceBatches.map(batch => ({
                      ...item,
                      quantity: batch.quantity,
                      price: batch.price,
                      total: batch.quantity * batch.price,
                      isBatch: true
                    }))
                  : [{
                      ...item,
                      total: item.totalPrice || (item.price * item.quantity),
                      isBatch: false
                    }];

                return displayItems.map((displayItem, bIdx) => (
                  <div key={`${item.id}-${item.size}-${idx}-${bIdx}`} className="pd-item-card">
                    <div className="pd-item-img-wrap">
                      <img src={displayItem.image_url || FALLBACK} alt={displayItem.name}
                        className="pd-item-img" onError={handleImgError} />
                      <span className="pd-qty-badge">{displayItem.quantity}</span>
                    </div>
                    <p className="pd-item-name">{displayItem.name}</p>
                    <p className="pd-item-variant">Size: {displayItem.size}</p>
                    <div className="pd-item-footer">
                      <span className="pd-item-qty-lbl">Qty: {displayItem.quantity}</span>
                      <span className="pd-item-price">Rs. {displayItem.total.toLocaleString()}</span>
                    </div>
                  </div>
                ));
              })}
            </div>

            {/* Promo */}
            <div className="pd-promo">
              <input type="text" placeholder="Promo code" value={promoCode}
                onChange={e => { setPromoCode(e.target.value); if (promoApplied) removePromo(); }}
                className="pd-promo-input" disabled={promoApplied} />
              {promoApplied ? (
                <button type="button" onClick={removePromo} className="pd-promo-btn" style={{backgroundColor: '#fee2e2', color: '#ef4444'}}>Remove</button>
              ) : (
                <button type="button" onClick={handleApplyPromo} className="pd-promo-btn" disabled={promoLoading}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              )}
            </div>
            {promoApplied && (
              <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px', padding: '8px', background: '#dcfce7', borderRadius: '6px' }}>
                ✅ <strong>{promoData?.code}</strong> — Rs. {promoDiscount.toLocaleString()} off
              </div>
            )}

            {/* Totals */}
            <div className="pd-totals">
              <div className="pd-total-row">
                <span className="pd-total-key">Gross Total</span>
                <span className="pd-total-val">Rs. {grossTotal.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="pd-total-row" style={{ color: '#22c55e' }}>
                  <span className="pd-total-key">Promo Discount ({promoData?.code})</span>
                  <span className="pd-total-val">-Rs. {promoDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pd-total-row">
                <span className="pd-total-key">Shipping ({shippingMethodName})</span>
                <span className="pd-free">{shippingCharge === 0 ? 'Free' : `Rs. ${shippingCharge.toLocaleString()}`}</span>
              </div>
              <div className="pd-total-final">
                <span className="pd-final-label">Total</span>
                <span className="pd-final-amount">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button className="pd-place-order-btn" onClick={() => handlePlaceOrder(paymentMethod)}>
              <span className="material-symbols-outlined">shopping_bag</span>
              {paymentMethod === 'COD' ? 'Place Order' : 'Pay Now'}
            </button>

            <p className="pd-terms">
              By placing your order, you agree to Solevora's{' '}
              <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}
          actions={<button className="modal-btn modal-btn-confirm" onClick={() => setIsModalOpen(false)}>Got it</button>}>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <span className="material-symbols-outlined modal-alert-icon modal-alert-error">error</span>
            <p style={{ fontWeight: '500', color: '#374151', fontSize: '16px' }}>{modalContent.body}</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentDetails;