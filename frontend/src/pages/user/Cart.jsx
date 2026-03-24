import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/user/Cart.css';

const Cart = () => {
  // Sample data to match the mockup image
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Air Vora Elite',
      color: 'Blaze Orange',
      size: '42',
      price: 120.00,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcVWKRIEQKTdczefQ26RyCmwjQxO2wxh6uZTJzQf6vtd5FKc56wtqnzYUyXDp1A9R1QUzEDGxFZTR9fiT78MSQJyWa-QRIKW6cNjZzuitgKpdvoNrjSXPiEOsHB6WRXhN2pHVQc-0RVUQyUTlgAt94vEyTD_fzESIGVBwu4DVh9umTXNSJST2iubUsbKaYCkjUnHOkEqGlqxIRpocYo6_vlMKSBHSHxyHg8J5LF58NrUuKVcDkW8URlTqsRrXMHAp-F464FBRb2o8'
    },
    {
      id: 2,
      name: 'Cloud Walker Pro',
      color: 'Blaze Orange',
      size: '42',
      price: 120.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    }
  ]);

  // Selected item ids (checkboxes). Default: select all.
  const [selectedItemIds, setSelectedItemIds] = useState(() => new Set(cartItems.map((i) => i.id)));

  const recommendedProducts = [
    { id: 101, name: 'Air Max 90', brand: 'Nike', price: 130, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
    { id: 102, name: 'UltraBoost 23', brand: 'Adidas', price: 180, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop' },
    { id: 103, name: '550 Vintage', brand: 'New Balance', price: 180, image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop' },
    { id: 104, name: '550 Vintage', brand: 'New Balance', price: 180, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop' }
  ];

  const selectedItems = cartItems.filter((item) => selectedItemIds.has(item.id));
  const selectedSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const shipping = selectedItems.length ? 15.0 : 0.0;
  const tax = selectedSubtotal * 0.08;
  const total = selectedSubtotal + shipping + tax;

  const allSelected = cartItems.length > 0 && selectedItemIds.size === cartItems.length;

  const handleToggleAll = (e) => {
    const shouldSelectAll = e.target.checked;
    setSelectedItemIds(new Set(shouldSelectAll ? cartItems.map((i) => i.id) : []));
  };

  const handleToggleItem = (itemId) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  return (
    <div className="cart-page">
      <div className="container">
        {/* Cart Title */}
        <div className="cart-header">
          <h2>
            <span className="material-symbols-outlined c-icon">shopping_bag</span>
            Shopping Cart <span className="item-count">({cartItems.length} items)</span>
          </h2>
        </div>

        {/* Action Bar */}
        <div className="cart-action-bar">
          <label className="select-all">
            <input type="checkbox" checked={allSelected} onChange={handleToggleAll} />
            Select All
          </label>
        </div>

        <div className="cart-main-layout">
          {/* Cart Items List */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="item-check">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.has(item.id)}
                      onChange={() => handleToggleItem(item.id)}
                    />
                </div>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-meta">Color : {item.color}</p>
                  <p className="item-meta">Size  : {item.size}</p>
                </div>
                <div className="item-quantity">
                  <div className="qty-selector">
                    <button>-</button>
                    <span>{item.quantity}</span>
                    <button>+</button>
                  </div>
                </div>
                <div className="item-price">
                  ${item.price.toFixed(2)}
                </div>
                <button className="item-remove">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}

            <div className="cart-footer-links">
                <Link to="/home" className="back-link">
                    <span className="material-symbols-outlined">west</span>
                    Back
                </Link>
                <Link to="/home" className="add-more-link">
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Items
                </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span className="label">Subtotal</span>
              <span className="value">${selectedSubtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="label">Estimated Shipping</span>
              <span className="value">${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="label">Tax</span>
              <span className="value">${tax.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span className="label">Total</span>
              <span className="value">${total.toFixed(2)}</span>
            </div>

            <Link to="/shipping" className="checkout-btn">
              Checkout <span className="material-symbols-outlined">credit_card</span>
            </Link>

            <div className="payment-icons">
               <div className="pay-rect"></div>
               <div className="pay-rect active"></div>
               <div className="pay-rect"></div>
            </div>
          </aside>
        </div>

        {/* You May Also Like Section */}
        <section className="recommendations-section">
            <div className="rec-header">
                <h2>You May also Like</h2>
                <p>Discover styles that match your vibe</p>
            </div>

            <div className="rec-grid">
                {recommendedProducts.map(product => (
                    <div key={product.id} className="rec-card">
                        <div className="rec-img">
                            <img src={product.image} alt={product.name} />
                            <div className="rec-nav-arrows">
                                {/* Only visible for carousel feel */}
                            </div>
                        </div>
                        <div className="rec-info">
                            <span className="rec-brand">{product.brand}</span>
                            <h4>{product.name}</h4>
                            <p className="rec-price">${product.price}</p>
                            <div className="rec-footer">
                                <button className="view-btn">
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                    View Details
                                </button>
                                <div className="rec-actions">
                                    <span className="material-symbols-outlined">share</span>
                                    <span className="material-symbols-outlined">favorite</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;
