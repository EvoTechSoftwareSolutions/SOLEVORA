import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Navigation } from "swiper/modules";
import "swiper/css";
import "../../styles/user/Cart.css";

// ✅ inline SVG fallback — no external request, no infinite loop
const FALLBACK =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='80' height='80' viewBox='0 0 80 80'%3E` +
  `%3Crect width='80' height='80' fill='%23f3f4f6'/%3E` +
  `%3Cpath d='M20 55l14-18 10 12 8-10 14 16H20z' fill='%23d1d5db'/%3E` +
  `%3Ccircle cx='52' cy='28' r='7' fill='%23d1d5db'/%3E%3C/svg%3E`;

const handleImgError = (e) => {
  if (e.target.src !== FALLBACK) e.target.src = FALLBACK;
};

const recommendedProducts = [
  {
    id: 101,
    name: "Air Max 90",
    brand: "Nike",
    price: 39000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
  },
  {
    id: 102,
    name: "UltraBoost 23",
    brand: "Adidas",
    price: 54000,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
  },
  {
    id: 103,
    name: "550 Vintage",
    brand: "New Balance",
    price: 54000,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop",
  },
];

const Cart = () => {
  const navigate = useNavigate();

  // only destructure what exists in CartContext
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const total = cartTotal;

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "80px", color: "#ccc", marginBottom: "20px" }}>
            shopping_cart_off
          </span>
          <h2>Your cart is empty</h2>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/category" className="checkout-btn" style={{ display: "inline-block", width: "auto", padding: "15px 40px" }}>
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

        <div className="cart-main-layout">
          {/* Cart Items */}
          <div className="cart-items-list">
            <div className="cart-items-scroll">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="item-image">
                    {/* ✅ image_url comes from CartContext fetchCart */}
                    <img
                      src={item.image_url || FALLBACK}
                      alt={item.name}
                      onError={handleImgError}
                    />
                  </div>

                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-meta">Size : {item.size}</p>
                  </div>

                  <div className="item-price-qty">
                    <div className="item-quantity">
                      <div className="qty-selector">
                        {/* ✅ CartContext updateQuantity takes (cartId, quantity) */}
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="item-price">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  {/* ✅ removeFromCart takes cartId only */}
                  <button className="item-remove" onClick={() => removeFromCart(item.id)}>
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

          {/* Order Summary */}
          <aside className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span className="label">Subtotal</span>
              <span className="value">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="label">Shipping</span>
              <span className="value">Calculated at checkout</span>
            </div>
            <div className="summary-total">
              <span className="label">Total</span>
              <span className="value">Rs. {total.toLocaleString()}</span>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => navigate("/shipping")}
            >
              Proceed to Checkout{" "}
              <span className="material-symbols-outlined">credit_card</span>
            </button>

            <div className="payment-icons">
              <div className="pay-rect"></div>
              <div className="pay-rect active"></div>
              <div className="pay-rect"></div>
            </div>
          </aside>
        </div>

        {/* You May Also Like */}
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
            navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
            breakpoints={{
              640: { slidesPerView: 2.2, pagination: { clickable: true } },
              1024: { slidesPerView: 3.2, pagination: { clickable: true } },
              1200: { slidesPerView: 4 },
            }}
            className="rec-swiper"
          >
            {recommendedProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="rec-card">
                  <div className="rec-img">
                    <img src={product.image} alt={product.name} onError={handleImgError} />
                  </div>
                  <div className="rec-info">
                    <span className="rec-brand">{product.brand}</span>
                    <h4>{product.name}</h4>
                    <p className="rec-price">Rs. {product.price.toLocaleString()}</p>
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