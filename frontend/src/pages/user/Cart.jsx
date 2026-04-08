// Importing necessary libraries, components, and styles
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, A11y, Navigation } from 'swiper/modules';
import 'swiper/css';
import '../../styles/user/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, selectedCartTotal, removeFromCart, updateQuantity, toggleItemSelection, toggleAllSelection, lockCheckoutSubtotal } = useCart();

  // Recommended products to display in the cart page
  const recommendedProducts = [
    { id: 101, name: 'Air Max 90', brand: 'Nike', price: 130, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
    { id: 102, name: 'UltraBoost 23', brand: 'Adidas', price: 180, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop' },
    { id: 103, name: '550 Vintage', brand: 'New Balance', price: 180, image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop' }
  ];

  // Filter selected items from the cart
  const selectedItems = cart.filter((item) => item.selected !== false);
  const selectedSubtotal = selectedCartTotal;

  // Calculate shipping cost and total
  const shipping = selectedItems.length ? 15.0 : 0.0;
  const total = selectedSubtotal + shipping;

  // Check if all items are selected
  const allSelected = cart.length > 0 && selectedItems.length === cart.length;

  // Handle selecting or deselecting all items
  const handleToggleAll = (e) => {
    toggleAllSelection(e.target.checked);
  };

  // Handle selecting or deselecting a single item
  const handleToggleItem = (item) => {
    toggleItemSelection(item.id, item.size);
  };

  // Display message if the cart is empty
  if (cart.length === 0) {
    return (
        <div className="cart-page">
            <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '80px', color: '#ccc', marginBottom: '20px' }}>shopping_cart_off</span>
                <h2>Your cart is empty</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/category" className="checkout-btn" style={{ display: 'inline-block', width: 'auto', padding: '15px 40px' }}>
                    Start Shopping
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Cart Title */}
        <div className="cart-header">
          <h2>
            <span className="material-symbols-outlined c-icon">shopping_bag</span>
            Shopping Cart <span className="item-count">({cart.length} items)</span>
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
          {/* Cart Items List — only item cards scroll; summary stays fixed */}
          <div className="cart-items-list">
            <div className="cart-items-scroll">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="cart-item-card">
                <div className="item-check">
                    <input
                      type="checkbox"
                      checked={item.selected !== false}
                      onChange={() => handleToggleItem(item)}
                    />
                </div>
                <div className="item-image">
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-meta">Color : {item.color || 'Standard'}</p>
                  <p className="item-meta">Size  : {item.size}</p>
                </div>
                <div className="item-price-qty">
                  <div className="item-quantity">
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                <button className="item-remove" onClick={() => removeFromCart(item.id, item.size)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}
            </div>

            <div className="cart-footer-links">
                <Link to="/category" className="back-link">
                    <span className="material-symbols-outlined">west</span>
                    Back to Shop
                </Link>
                <Link to="/category" className="add-more-link">
                    <span className="material-symbols-outlined">add_circle</span>
                    Add More Items
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
            <div className="summary-total">
              <span className="label">Total</span>
              <span className="value">${total.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => {
                lockCheckoutSubtotal(selectedSubtotal);
                navigate('/shipping');
              }}
            >
              Proceed to Checkout <span className="material-symbols-outlined">credit_card</span>
            </button>

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

            <Swiper
                modules={[Pagination, A11y, Navigation]}
                spaceBetween={20}
                slidesPerView={1.2}
                 centeredSlides={true}
                 centerInsufficientSlides={true}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2.2,
                        pagination: { clickable: true },
                    },
                    1024: {
                        slidesPerView: 3.2,
                        pagination: { clickable: true },
                    },
                    1200: {
                        slidesPerView: 4
                    }
                }}
                className="rec-swiper"
            >
                {recommendedProducts.map(product => (
                    <SwiperSlide key={product.id}>
                        <div className="rec-card">
                            <div className="rec-img">
                                <img src={product.image} alt={product.name} />
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
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Custom Navigation Arrows */}
            <div className="swiper-navigation">
                <button className="swiper-button-prev">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="swiper-button-next">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;
