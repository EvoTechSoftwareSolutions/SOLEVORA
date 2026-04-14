// Importing necessary libraries and styles
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../styles/user/OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, items, paymentMethod } = location.state || {};

  // Function to generate and download PDF receipt
  const handleDownloadReceipt = () => {
    alert("Preparing your receipt PDF...");
    try {
      console.log("Starting PDF generation...");
      const doc = new jsPDF();
      const orderedItems = items || [];
      
      // Safety calculation for subtotal
      const safeSubtotal = orderedItems.reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 1;
        return acc + (price * qty);
      }, 0);
      
      // Add Branding / Header
      doc.setFillColor(26, 26, 46); // Dark blue theme
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(249, 115, 22); // Orange logo color
      doc.setFontSize(28);
      doc.text('SOLEVORA', 105, 22, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('OFFICIAL ORDER RECEIPT', 105, 32, { align: 'center' });

      // Order Info
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(10);
      doc.text(`Order Number: #${orderId || 'N/A'}`, 15, 55);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 62);
      doc.text(`Payment Method: ${paymentMethod?.toUpperCase() || 'N/A'}`, 15, 69);

      // Customer Info (if available)
      if (user) {
          doc.text(`Customer Name: ${user.name || 'Valued Customer'}`, 130, 55);
          doc.text(`Customer Email: ${user.email || 'N/A'}`, 130, 62);
      }

      // Table of Items
      const tableData = orderedItems.map(item => [
        item.name || 'Product',
        item.size || 'N/A',
        (item.quantity || 1).toString(),
        `$${parseFloat(item.price || 0).toFixed(2)}`,
        `$${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}`
      ]);

      // Use autoTable function directly
      autoTable(doc, {
        startY: 80,
        head: [['Product Name', 'Size', 'Qty', 'Unit Price', 'Subtotal']],
        body: tableData,
        headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255] },
        margin: { left: 15, right: 15 },
        theme: 'grid'
      });

      // Totals
      let finalY = 150;
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        finalY = doc.lastAutoTable.finalY + 15;
      } else if (doc.previousAutoTable && doc.previousAutoTable.finalY) {
        finalY = doc.previousAutoTable.finalY + 15;
      }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Grand Total: $${safeSubtotal.toFixed(2)}`, 195, finalY, { align: 'right' });

      // Footer
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Thank you for choosing SoleVora! We hope you love your new gear.', 105, finalY + 25, { align: 'center' });
      doc.text('Contact Support: support@solevora.com', 105, finalY + 32, { align: 'center' });

      // Save PDF
      console.log("Saving PDF...");
      doc.save(`SoleVora_Receipt_${orderId || 'Order'}.pdf`);
      console.log("PDF download triggered.");
    } catch (error) {
      console.error("Receipt Download Error:", error);
      alert("Error generating receipt: " + error.message);
    }
  };

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
          <button className="oc-download-btn" onClick={handleDownloadReceipt} style={{
              backgroundColor: '#1a1a2e',
              color: 'white',
              border: 'none',
              padding: '14px 25px',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.3s ease'
          }}>
            <span className="material-symbols-outlined">download</span>
            DOWNLOAD RECEIPT
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
