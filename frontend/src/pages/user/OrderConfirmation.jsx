// Importing necessary libraries and styles
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/user/OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, items, paymentMethod } = location.state || {};

  // Function to compute the estimated delivery date range (5-7 business days from now)
  const getDeliveryEstimate = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() + 5);
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    const fmt = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}`;
  };

  // If no order data is available, display a fallback message
  if (!orderId) {
    return (
      <div className="oc-page" style={{ textAlign: 'center', padding: '100px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#ccc' }}>receipt_long</span>
        <h2 style={{ marginTop: '16px' }}>No order data found.</h2>
        <p style={{ color: '#888', marginBottom: '28px' }}>It looks like you arrived here directly.</p>
        <Link to="/home" className="oc-continue-btn">Go Home</Link>
      </div>
    );
  }

  // Extracting ordered items and calculating totals
  const orderedItems = items || [];
  const subtotal = orderedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal;

  // Check if the payment method is Cash on Delivery (COD)
  const isCOD = paymentMethod === 'cod';

  // Retrieve user information from local storage
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  return (
    <div className="oc-page">
      <div className="oc-container">

        {/* Success Header Section */}
        <div className="oc-header">
          <div className="oc-check-circle">
            <span className="material-symbols-outlined oc-check-icon">
              {isCOD ? 'local_shipping' : 'check_circle'}
            </span>
          </div>
          <h1 className="oc-title">
            {isCOD ? 'Order Placed Successfully!' : 'Thank you for your order!'}
          </h1>
          <p className="oc-subtitle">
            Your order <span className="oc-order-number">#{orderId}</span> has been placed and is being processed.
          </p>

          {/* Display COD Badge if applicable */}
          {isCOD && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginTop: '14px', backgroundColor: '#fff7f3',
              border: '1px solid #ffd5c0', borderRadius: '50px',
              padding: '8px 20px', color: '#e05c1a', fontWeight: '600', fontSize: '14px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payments</span>
              Cash on Delivery — Pay when you receive
            </div>
          )}
        </div>

        {/* Order Details Section */}
        <div className="oc-summary-card">
          <div className="oc-card-header">
            <h2 className="oc-card-title">Order Summary</h2>
            <span className="oc-item-count">{orderedItems.length} ITEM{orderedItems.length !== 1 ? 'S' : ''}</span>
          </div>

          {/* Display ordered items or fallback message */}
          {orderedItems.length > 0 ? (
            <div className="oc-items-list">
              {orderedItems.map((item, idx) => (
                <div key={idx} className="oc-item-row">
                  <div className="oc-item-visual">
                    <img src={item.image_url || item.image} alt={item.name} className="oc-item-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                    />
                  </div>
                  <div className="oc-item-details">
                    <h4 className="oc-item-name">{item.name}</h4>
                    <p className="oc-item-variant">Size: {item.size} &nbsp;|&nbsp; Qty: {item.quantity}</p>
                  </div>
                  <div className="oc-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>No items to display.</p>
          )}

          {/* Order Breakdown Section */}
          <div className="oc-breakdown-section">
            <div className="oc-estimated-delivery">
              <p className="oc-section-label">ESTIMATED DELIVERY</p>
              <div className="oc-delivery-info">
                <span className="material-symbols-outlined oc-truck-icon">local_shipping</span>
                <span className="oc-date">{getDeliveryEstimate()}</span>
              </div>
            </div>

            <div className="oc-totals">
              <div className="oc-total-row">
                <span className="oc-total-key">Subtotal</span>
                <span className="oc-total-val">${subtotal.toFixed(2)}</span>
              </div>
              <div className="oc-total-row">
                <span className="oc-total-key">Shipping</span>
                <span className="oc-total-val-green">Free</span>
              </div>
              <div className="oc-grand-total">
                <span className="oc-grand-label">{isCOD ? 'Amount Due on Delivery' : 'Total'}</span>
                <span className="oc-grand-amount">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method or Email Confirmation */}
          <div className="oc-card-footer">
            {isCOD ? (
              <>
                <span className="material-symbols-outlined oc-info-icon">info</span>
                <p className="oc-footer-text">
                  Please keep <span className="oc-bold">${total.toFixed(2)}</span> ready to pay the delivery agent upon receipt.
                </p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined oc-info-icon">info</span>
                <p className="oc-footer-text">
                  A confirmation email has been sent to <span className="oc-bold">{user?.email || 'your email'}</span>.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="oc-actions">
          <button className="oc-track-btn" onClick={() => navigate('/profile/orders')}>
            TRACK ORDER
          </button>
          <button className="oc-continue-btn" onClick={() => navigate('/category')}>
            CONTINUE SHOPPING
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
