import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/user/OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, order, items, method } = location.state || {};
  const displayId = orderId || order?.id || 'N/A';
  const displayEmail = order?.email || 'your email';

  if (!displayId && !order) {
    return (
        <div className="oc-page" style={{ textAlign: 'center', padding: '100px' }}>
            <h2 style={{ marginBottom: '20px' }}>No order data found.</h2>
            <Link to="/home" className="oc-continue-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>GO HOME</Link>
        </div>
    );
  }

  const orderedItems = items || [];
  const subtotal = orderedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const estimatedTax = subtotal * 0.08;
  
  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', minDays: 3, maxDays: 5, price: 0 },
    { id: 'express', name: 'Express Shipping', minDays: 1, maxDays: 2, price: 15.00 },
    { id: 'nextday', name: 'Next Day Delivery', minDays: 0, maxDays: 1, price: 25.00 },
  ];

  // Map the passed method string to the corresponding pricing/timing
  const selectedMethod = shippingMethods.find(m => m.name === method) || shippingMethods[0];
  const shippingPrice = selectedMethod.price;
  const total = subtotal + estimatedTax + shippingPrice;

  // Helper to format date
  const getDeliveryRange = (min, max) => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + min);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + max);

    const options = { month: 'short', day: 'numeric' };
    const minStr = minDate.toLocaleDateString('en-US', options);
    const maxStr = maxDate.toLocaleDateString('en-US', { day: 'numeric' });
    const dayName = minDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (min === max) return `${dayName}, ${minDate.toLocaleDateString('en-US', options)}`;
    return `${dayName}, ${minStr} - ${maxStr}`;
  };

  const deliveryDateString = getDeliveryRange(selectedMethod.minDays, selectedMethod.maxDays);

  return (
    <div className="oc-page">
      <div className="oc-container">
        
        {/* Success Header */}
        <div className="oc-header">
           <div className="oc-check-wrapper">
             <span className="material-symbols-outlined oc-check-icon">check</span>
           </div>
           <h1 className="oc-title">Thank you for your order!</h1>
           <p className="oc-subtitle">
             Your order <span className="oc-order-number">#SV-{displayId}</span> has been placed and is being processed.
           </p>
        </div>

        {/* Order Details Card */}
        <div className="oc-summary-card">
          <div className="oc-card-header">
            <h2 className="oc-card-title">Order Summary</h2>
            <span className="oc-item-count">{orderedItems.length} ITEMS</span>
          </div>

          <div className="oc-items-list">
             {orderedItems.map((item, idx) => (
                <div key={idx} className="oc-item-row">
                   <div className="oc-item-visual">
                      <img src={item.image_url} alt={item.name} className="oc-item-img" />
                   </div>
                   <div className="oc-item-details">
                      <h4 className="oc-item-name">{item.name}</h4>
                      <p className="oc-item-variant">Size: {item.size} | Qty: {item.quantity}</p>
                   </div>
                   <div className="oc-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                   </div>
                </div>
             ))}
          </div>

          <div className="oc-breakdown-section">
             <div className="oc-estimated-delivery">
                <p className="oc-section-label">ESTIMATED DELIVERY</p>
                <div className="oc-delivery-info">
                   <span className="material-symbols-outlined oc-truck-icon">local_shipping</span>
                   <span className="oc-date">{deliveryDateString}</span>
                </div>
             </div>
             
             <div className="oc-totals">
                <div className="oc-total-row">
                   <span className="oc-total-key">Subtotal</span>
                   <span className="oc-total-val">${subtotal.toFixed(2)}</span>
                </div>
                <div className="oc-total-row">
                   <span className="oc-total-key">Shipping</span>
                   <span className={shippingPrice === 0 ? "oc-total-val-green" : "oc-total-val"}>
                       {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                   </span>
                </div>
                <div className="oc-total-row">
                   <span className="oc-total-key">Estimated Tax</span>
                   <span className="oc-total-val">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="oc-grand-total">
                   <span className="oc-grand-label">Total</span>
                   <span className="oc-grand-amount">${total.toFixed(2)}</span>
                </div>
             </div>
          </div>

          <div className="oc-card-footer">
             <span className="material-symbols-outlined oc-info-icon">info</span>
             <p className="oc-footer-text">A confirmation email has been sent to <span className="oc-bold">{displayEmail}</span></p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="oc-actions">
           <button className="oc-track-btn" onClick={() => navigate('/profile/orders')}>
              TRACK ORDER
           </button>
           <button className="oc-continue-btn" onClick={() => navigate('/home')}>
              CONTINUE SHOPPING
           </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
