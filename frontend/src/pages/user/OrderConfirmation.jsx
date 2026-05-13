import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import SuccessPopup from '../../components/common/SuccessPoppup';
import '../../styles/user/OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    orderId,
    items,
    paymentMethod,
    promoCode,
    promoDiscount,
    customerName,
    email,
    shippingCharge,   // ← now read from state
    codFee,           // ← now read from state
    shippingMethod,   // ← optional label
  } = location.state || {};

  const [showPopup, setShowPopup]     = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType]     = React.useState("success");

  const user = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  }, []);

  const isCOD = paymentMethod === 'cod';

  // ── Totals (mirrors checkout math exactly) ──────────────────
  const orderedItems   = items || [];
  const subtotal       = orderedItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity || 1)), 0);
  const shipping       = Number(shippingCharge  || 0);
  const cod            = Number(codFee          || 0);
  const discount       = Number(promoDiscount   || 0);
  const grandTotal     = Math.max(0, subtotal - discount + shipping + cod);

  // ── Delivery estimate ────────────────────────────────────────
  const getDeliveryEstimate = () => {
    const now   = new Date();
    const start = new Date(now); start.setDate(start.getDate() + 5);
    const end   = new Date(now); end.setDate(end.getDate() + 7);
    const fmt   = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}`;
  };

  // ── PDF Receipt ──────────────────────────────────────────────
  const handleDownloadReceipt = () => {
    setPopupMessage("Your digital receipt is being prepared. It will download automatically in a few seconds.");
    setPopupType("success");
    setShowPopup(true);
    try {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(249, 115, 22);
      doc.setFontSize(28);
      doc.text('SOLEVORA', 105, 22, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('OFFICIAL ORDER RECEIPT', 105, 32, { align: 'center' });

      // Order / Customer info
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(10);
      doc.text(`Order Number: #${orderId || 'N/A'}`, 15, 55);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 62);
      doc.text(`Payment Method: ${paymentMethod?.toUpperCase() || 'N/A'}`, 15, 69);
      doc.text(`Customer Name: ${customerName || user?.name || 'Valued Customer'}`, 130, 55);
      doc.text(`Customer Email: ${email || user?.email || 'N/A'}`, 130, 62);

      // Items table
      const tableData = orderedItems.map((item) => [
        item.name     || 'Product',
        item.size     || 'N/A',
        (item.quantity || 1).toString(),
        `Rs. ${parseFloat(item.price || 0).toLocaleString()}`,
        `Rs. ${(parseFloat(item.price || 0) * (item.quantity || 1)).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 80,
        head: [['Product Name', 'Size', 'Qty', 'Unit Price', 'Subtotal']],
        body: tableData,
        headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255] },
        margin: { left: 15, right: 15 },
        theme: 'grid',
      });

      let y = (doc.lastAutoTable?.finalY || 150) + 15;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(33, 33, 33);
      doc.text(`Subtotal: Rs. ${subtotal.toLocaleString()}`, 195, y, { align: 'right' });

      if (discount > 0) {
        y += 7;
        doc.setTextColor(34, 197, 94);
        doc.text(`Discount (${promoCode}): -Rs. ${discount.toLocaleString()}`, 195, y, { align: 'right' });
        doc.setTextColor(33, 33, 33);
      }

      if (shipping > 0) {
        y += 7;
        doc.text(`Shipping: Rs. ${shipping.toLocaleString()}`, 195, y, { align: 'right' });
      }

      if (cod > 0) {
        y += 7;
        doc.text(`COD Fee: Rs. ${cod.toLocaleString()}`, 195, y, { align: 'right' });
      }

      y += 10;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Grand Total: Rs. ${grandTotal.toLocaleString()}`, 195, y, { align: 'right' });

      // Footer
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Thank you for choosing SoleVora! We hope you love your new gear.', 105, y + 25, { align: 'center' });
      doc.text('Contact Support: support@solevora.com', 105, y + 32, { align: 'center' });

      doc.save(`SoleVora_Receipt_${orderId || 'Order'}.pdf`);
    } catch (error) {
      setPopupMessage("We encountered a problem while generating your receipt: " + error.message);
      setPopupType("notice");
      setShowPopup(true);
    }
  };

  // ── Empty guard ──────────────────────────────────────────────
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

  return (
    <div className="oc-page">
      <div className="oc-container">
        {showPopup && (
          <SuccessPopup
            message={popupMessage}
            onClose={() => setShowPopup(false)}
            type={popupType}
          />
        )}

        {/* ── Header ── */}
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
          {isCOD && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginTop: '14px', backgroundColor: '#fff7f3',
              border: '1px solid #ffd5c0', borderRadius: '50px',
              padding: '8px 20px', color: '#e05c1a', fontWeight: '600', fontSize: '14px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payments</span>
              Cash on Delivery — Pay when you receive
            </div>
          )}
        </div>

        {/* ── Summary Card ── */}
        <div className="oc-summary-card">
          <div className="oc-card-header">
            <h2 className="oc-card-title">Order Summary</h2>
            <span className="oc-item-count">
              {orderedItems.length} ITEM{orderedItems.length !== 1 ? 'S' : ''}
            </span>
          </div>

          {/* Items */}
          {orderedItems.length > 0 ? (
            <div className="oc-items-list">
              {orderedItems.map((item, idx) => (
                <div key={idx} className="oc-item-row">
                  <div className="oc-item-visual">
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="oc-item-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                    />
                  </div>
                  <div className="oc-item-details">
                    <h4 className="oc-item-name">{item.name}</h4>
                    <p className="oc-item-variant">
                      Size: {item.size}&nbsp;|&nbsp;Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <div className="oc-item-price">
                    Rs. {(Number(item.price) * Number(item.quantity || 1)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>No items to display.</p>
          )}

          {/* Breakdown */}
          <div className="oc-breakdown-section">
            <div className="oc-estimated-delivery">
              <p className="oc-section-label">ESTIMATED DELIVERY</p>
              <div className="oc-delivery-info">
                <span className="material-symbols-outlined oc-truck-icon">local_shipping</span>
                <span className="oc-date">{getDeliveryEstimate()}</span>
              </div>
            </div>

            <div className="oc-totals">
              {/* Subtotal */}
              <div className="oc-total-row">
                <span className="oc-total-key">Subtotal</span>
                <span className="oc-total-val">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {/* Promo discount */}
              {discount > 0 && (
                <div className="oc-total-row" style={{ color: '#22c55e' }}>
                  <span className="oc-total-key">Discount ({promoCode})</span>
                  <span className="oc-total-val">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              {/* Shipping */}
              <div className="oc-total-row">
                <span className="oc-total-key">
                  Shipping{shippingMethod ? ` (${shippingMethod})` : ''}
                </span>
                <span className={shipping === 0 ? "oc-total-val-green" : "oc-total-val"}>
                  {shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}
                </span>
              </div>

              {/* COD fee */}
              {cod > 0 && (
                <div className="oc-total-row">
                  <span className="oc-total-key">Cash on Delivery Fee</span>
                  <span className="oc-total-val">Rs. {cod.toLocaleString()}</span>
                </div>
              )}

              {/* Grand total */}
              <div className="oc-grand-total">
                <span className="oc-grand-label">
                  {isCOD ? 'Amount Due on Delivery' : 'Total'}
                </span>
                <span className="oc-grand-amount">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="oc-card-footer">
            {isCOD ? (
              <>
                <span className="material-symbols-outlined oc-info-icon">info</span>
                <p className="oc-footer-text">
                  Please keep <span className="oc-bold">Rs. {grandTotal.toLocaleString()}</span> ready
                  to pay the delivery agent upon receipt.
                </p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined oc-info-icon">info</span>
                <p className="oc-footer-text">
                  A confirmation email has been sent to{' '}
                  <span className="oc-bold">{email || user?.email || 'your email'}</span>.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="oc-actions">
          <button className="oc-track-btn"     onClick={() => navigate('/profile/orders')}>TRACK ORDER</button>
          <button className="oc-download-btn"  onClick={handleDownloadReceipt}>
            <span className="material-symbols-outlined">download</span>DOWNLOAD RECEIPT
          </button>
          <button className="oc-continue-btn"  onClick={() => navigate('/category')}>CONTINUE SHOPPING</button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;