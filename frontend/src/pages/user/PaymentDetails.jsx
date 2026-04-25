import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
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
  const { cart, cartTotal, clearCart } = useCart();


  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
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
      const { data } = await axios.post('http://localhost:5001/api/promo/validate', {
        code: trimmed, orderAmount: grossTotal,
      });
      setPromoApplied(true);
      setPromoData({ code: data.code, discountAmount: data.discountAmount });
    } catch (error) {
      showMessage('Error', 'Could not validate promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

 const handlePlaceOrder = async (paymentMethod) => {

    try {
      
      // 1. Retrieve data from Session Storage
      const backendPaymentMethod = paymentMethod === 'COD' ? 'COD' : 'ONLINE';
      const shippingInfo = JSON.parse(sessionStorage.getItem('checkoutFormData'));
      const shippingMethodName = sessionStorage.getItem('checkoutShippingMethod');
      const shippingCharge = Number(sessionStorage.getItem('checkoutShippingCharge'));
      const promoDiscount = Number(sessionStorage.getItem('checkoutPromoDiscount')) || 0;

      // 2. Prepare the payload for your createOrder controller
      const orderPayload = {
        userId: user?.id ? Number(user.id) : undefined,
        customerName: shippingInfo.fullName,
        email: shippingInfo.email,
        contactNumber: shippingInfo.phone,
        // Combine address fields into one string or object as per your Prisma schema
        shippingAddress: `${shippingInfo.streetAddress}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
       paymentMethod: paymentMethod === 'COD' ? 'COD' : 'ONLINE',
        
        // Map cart items to match your backend productId/price expectation
        items: cart.map(item => ({
          productId: (item.productId), 
          quantity: item.quantity,
          price: item.price,
          size: item.size
        })),
        
        // Optional: Include shipping and discount if your backend supports these fields
        shippingCharge,
        promoDiscount,
        totalAmount: cartTotal + shippingCharge - promoDiscount
      };

   
      const response = await axios.post('http://localhost:5001/api/orders', orderPayload);

      if (response.data.success) {
        sessionStorage.clear(); 
        await clearCart();      
        
        navigate('/order-success', { 
          state: { 
            orderId: response.data.data.orderId,
            trackingNumber: response.data.data.trackingNumber 
          } 
        });
      }
    } catch (error) {
const errorMsg = error.response?.data?.errors 
      ? error.response.data.errors.map(e => e.message).join(', ')
      : error.response?.data?.message || "Validation failed. Please check your details.";
    
    showMessage('Order Error', errorMsg);
    console.error("Zod Validation Error:", error.response?.data);    }
  };

  const handleCOD = async () => {
    try {
      const orderPayload = {
        total_amount: total,
        status: 'PENDING',
        shipping_address: `${checkoutFormData.streetAddress || 'N/A'}, ${checkoutFormData.city || 'N/A'}, ${checkoutFormData.postalCode || '00000'}`,
        contact_number: checkoutFormData.phone || 'N/A',
        email: checkoutFormData.email || user?.email || 'guest@example.com',
        userId: user?.id || null,
        payment_method: 'COD',
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
        promo_code: promoApplied ? promoCode : null,
      };

      const response = await axios.post('http://localhost:5001/api/orders', orderPayload);
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

      navigate('/order-confirmation', {
        state: { orderId: orderData.id || orderData.data?.id, items: currentItems, paymentMethod: 'COD' },
      });
    } catch (error) {
      console.error('Error placing COD order:', error);
      showMessage('Order Failed', 'Could not place your order. Please try again.');
    }
  };

  const handlePayHere = async () => {
    try {
      const orderPayload = {
        total_amount: total,
        status: 'pending',
        shipping_address: `${checkoutFormData.streetAddress || 'N/A'}, ${checkoutFormData.city || 'N/A'}, ${checkoutFormData.postalCode || '00000'}`,
        contact_number: checkoutFormData.phone || 'N/A',
        email: checkoutFormData.email || user?.email || 'guest@example.com',
        userId: user?.id || null,
        payment_method: 'online',
        items: cart.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
        promo_code: promoApplied ? promoCode : null,
      };

      const response = await axios.post('http://localhost:5001/api/orders', orderPayload);
      const orderData = response.data;

      const hashResponse = await axios.post('http://localhost:5001/api/payment/hash', {
        order_id: orderData.id || orderData.data?.id,
        amount: total,
        currency: 'LKR',
      });

      const { hash, merchant_id } = hashResponse.data;

      const payment = {
        sandbox: true,
        merchant_id,
        return_url: `${window.location.origin}/profile/orders`,
        cancel_url: window.location.href,
        notify_url: 'http://localhost:5001/api/payment/notify',
        order_id: String(orderData.id || orderData.data?.id),
        items: `SoleVora Order #${orderData.id || orderData.data?.id}`,
        amount: total.toFixed(2),
        currency: 'LKR',
        hash,
        first_name: checkoutFormData.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Guest',
        last_name: checkoutFormData.fullName?.split(' ')[1] || user?.name?.split(' ')[1] || 'User',
        email: checkoutFormData.email || user?.email || 'guest@example.com',
        phone: checkoutFormData.phone || '0000000000',
        address: checkoutFormData.streetAddress || 'Address line 1',
        city: checkoutFormData.city || 'Colombo',
        country: 'Sri Lanka',
      };

      window.payhere.onCompleted = function (orderId) {
        axios.put(`http://localhost:5001/api/orders/${orderId}/status`, { status: 'paid' })
          .finally(() => {
            const currentItems = [...cart];
            clearCart();
            sessionStorage.removeItem('checkoutFormData');
            sessionStorage.removeItem('checkoutGrossTotal');
            sessionStorage.removeItem('checkoutShippingMethod');
            sessionStorage.removeItem('checkoutShippingCharge');
            navigate('/order-confirmation', {
              state: { orderId, items: currentItems, paymentMethod: 'ONLINE' },
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
      showMessage('Order Failed', 'Error initiating payment. Please try again.');
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
            <div className="pd-methods-grid">
              {[
                { id: 'ONLINE', icon: 'credit_card', label: 'Credit Card' },
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

            {/* Payment info */}
            <div className="pd-form-card" style={{ padding: '30px', textAlign: 'center' }}>
              {paymentMethod === 'ONLINE' ? (
                <>
                  <img src="https://www.payhere.lk/downloads/images/payhere_square_logo.png"
                    alt="PayHere" style={{ width: '100px', margin: '0 auto 20px' }} />
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
              {cart.map(item => (
                <div key={item.id} className="pd-item-card">
                  <div className="pd-item-img-wrap">
                    <img src={item.image_url || FALLBACK} alt={item.name}
                      className="pd-item-img" onError={handleImgError} />
                    <span className="pd-qty-badge">{item.quantity}</span>
                  </div>
                  <p className="pd-item-name">{item.name}</p>
                  <p className="pd-item-variant">Size: {item.size}</p>
                  <div className="pd-item-footer">
                    <span className="pd-item-qty-lbl">Qty: {item.quantity}</span>
                    <span className="pd-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="pd-promo">
              <input type="text" placeholder="Promo code" value={promoCode}
                onChange={e => setPromoCode(e.target.value)} className="pd-promo-input" />
              <button type="button" onClick={handleApplyPromo} className="pd-promo-btn" disabled={promoLoading}>
                {promoLoading ? '...' : 'Apply'}
              </button>
            </div>

            {/* Totals */}
            <div className="pd-totals">
              <div className="pd-total-row">
                <span className="pd-total-key">Gross Total</span>
                <span className="pd-total-val">Rs. {grossTotal.toLocaleString()}</span>
              </div>
              <div className="pd-total-row">
                <span className="pd-total-key">Promo Discount</span>
                <span className="pd-total-val">-Rs. {promoDiscount.toLocaleString()}</span>
              </div>
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
              {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
            </button>

            <p className="pd-terms">
              By placing your order, you agree to Solevora's{' '}
              <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
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

export default PaymentDetails;