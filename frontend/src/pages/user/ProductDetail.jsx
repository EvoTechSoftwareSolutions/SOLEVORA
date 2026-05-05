// ProductDetail Component - Displays detailed product information and handles user interactions
// Shows product images, specifications, reviews, and provides cart/wishlist functionality
// Includes size selection, review submission, and tabbed content display
import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "../../styles/user/ProductDetail.css";

import SuccessPopup from "../../components/common/SuccessPoppup";
import SizeChartModal from "../../components/user/SizeChartModal";
const BASE_URL = "http://localhost:5001";

const getImg = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url.replace(/\\/g, "/")}`;
};
function ProductDetail() {
  // Route parameter for product ID
  const { slug } = useParams();
  const location = useLocation();
  const passedImage = location.state?.productImage;

  // Cart and wishlist context hooks
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // Component state management
  const [product, setProduct] = useState(null); // Product data from API
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [selectedSize, setSelectedSize] = useState(""); // Selected shoe size
  const [activeTab, setActiveTab] = useState("description"); // Active content tab
  const [mainImage, setMainImage] = useState(passedImage || ""); // Currently displayed product image
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    if (passedImage) {
      setMainImage(passedImage);
    }
  }, [passedImage]);

  // Review system state
  const [reviews, setReviews] = useState([]); // Product reviews array
  const [submittingReview, setSubmittingReview] = useState(false); // Review submission state
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" }); // New review form data
  const [reviewMsg, setReviewMsg] = useState({ text: "", type: "" }); // Review status messages
  // Get logged-in user from localStorage for review functionality
  const user = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/products/slug/${slug}`,
      );
      const data = await response.json();
      if (response.ok) {
        setProduct(data.data);
        if (!passedImage) {
          setMainImage(getImg(data.data.images?.[0]?.url));
        }
        // Fetch reviews for this product
        fetchReviews(data.data.id);
      } else {
        console.error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product data and reviews on component mount
  useEffect(() => {
    fetchProduct();
    // Silent background refresh every 3 seconds
    const interval = setInterval(fetchProduct, 3000);
    return () => clearInterval(interval);
  }, [slug]); 

  // Auto-select first available in-stock size when product loads
  useEffect(() => {
    if (product && product.stocks) {
      const inStockSizes = product.stocks
        .filter(s => s.quantity > 0)
        .map(s => String(s.size));
      if (inStockSizes.length > 0 && !inStockSizes.includes(selectedSize)) {
        setSelectedSize(inStockSizes[0]);
      }
    }
  }, [product]);

  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${productId}`);
      const data = await res.json();
      if (res.ok) setReviews(data);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };
  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Validate user is logged in
    if (!user) {
      setReviewMsg({
        text: "Please sign in to leave a review.",
        type: "error",
      });
      return;
    }

    // Validate review comment
    if (!newReview.comment.trim()) {
      setReviewMsg({ text: "Please write a comment first.", type: "error" });
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("http://localhost:5001/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReview,
          userId: user.id,
          productId: product.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Add new review to the top of the list
        setReviews([data.review, ...reviews]);
        setNewReview({ rating: 5, comment: "" });
        setReviewMsg({
          text: "Thank you! Your review has been posted.",
          type: "success",
        });
      } else {
        setReviewMsg({
          text: data.message || "Error submitting review.",
          type: "error",
        });
      }
    } catch (err) {
      setReviewMsg({ text: "Could not reach the server.", type: "error" });
    } finally {
      setSubmittingReview(false);
      // Clear success message after 4 seconds
      setTimeout(() => setReviewMsg({ text: "", type: "" }), 4000);
    }
  };

  // Loading state display
  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <Link to="/home">Go back to Home</Link>
      </div>
    );
  }

  // Main component render

  // Use all sizes from productstock in the DB
  let stockDetails = [];
  if (product && product.stocks && product.stocks.length > 0) {
    stockDetails = product.stocks.map(s => ({
      size: String(s.size),
      quantity: s.quantity
    }));
  }
  // Sort sizes numerically
  stockDetails.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));


  // Helper to get unique features based on product category or name
  const getProductFeatures = () => {
    const cat = product.category?.name?.toLowerCase() || "";
    const name = product.name?.toLowerCase() || "";

    // Default features
    let features = [
      "Breathable AeroWeave™ mesh upper for thermal regulation.",
      "Dynamic Cushioning System for 30% more energy return.",
      "Precision-engineered fit for all-day comfort.",
    ];

    if (cat.includes("running") || name.includes("run")) {
      features = [
        "Carbon-fiber energy transition plate for maximum propulsion.",
        "Reflective elements for safety during low-light sessions.",
        "Ultra-lightweight construction to minimize fatigue.",
      ];
    } else if (cat.includes("basketball") || name.includes("hoop")) {
      features = [
        "Multi-directional traction pattern for elite court control.",
        "Reinforced high-top collar for tactical ankle stability.",
        "Impact-reactive foam for explosive vertical jumps.",
      ];
    } else if (
      cat.includes("boots") ||
      cat.includes("combat") ||
      name.includes("explorer")
    ) {
      features = [
        "Military-grade ballistic nylon for superior durability.",
        "Water-repellent NanoTech™ coating for all-weather use.",
        "Self-cleaning tread pattern prevents mud buildup.",
      ];
    } else if (
      cat.includes("sandals") ||
      cat.includes("casual") ||
      name.includes("peep")
    ) {
      features = [
        "Anatomically contoured footbed for natural arch support.",
        "Soft-touch premium inner lining prevents skin irritation.",
        "Flex-Groove sole technology for natural foot movement.",
      ];
    } else if (name.includes("glide") || name.includes("walker")) {
      features = [
        'Cloud-foam midsole for a "walking on air" experience.',
        "Easy-slip heel construction for effortless transitions.",
        "Anti-microbial finish for long-lasting freshness.",
      ];
    }

    return features;
  };

  return (
    <div className="product-detail-page">
      {showPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          type="notice"
        />
      )}
      <SizeChartModal
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />
      <div className="container">
        {/* Breadcrumb navigation */}
        <div className="breadcrumbs">
          <Link to="/home">Home</Link>
          <span className="separator">/</span>
          <Link to="/category">
            {product.category ? product.category.name : "All Products"}
          </Link>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </div>

        {/* Product grid layout - gallery and details */}
        <div className="product-grid">
          {/* Product image gallery */}
          <div className="gallery-section">
            {/* Main product image display */}
            <div className="main-viewport">
              <img src={mainImage} alt={product.name} />
            </div>

            <div className="thumb-strip">
              {(product.images || []).map((img, idx) => {
                const url = getImg(img.url);
                return (
                  <div
                    key={idx}
                    className={`thumb-box ${mainImage === url ? "active" : ""}`}
                    onClick={() => setMainImage(url)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={url} alt={`view ${idx}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product details section */}
          <div className="details-section">
            {/* Product header with title and rating */}
            <div className="details-header">
              <span className="brand-badge">PREMIUM PERFORMANCE</span>
              <h1>{product.name}</h1>
              <div className="rating-row">
                {/* Star rating display based on average review rating */}
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`material-symbols-outlined ${reviews.length > 0 && star <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? "fill" : ""}`}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="review-count">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Product pricing */}
            <div className="pricing">
              {(() => {
                const activeStock = (product.stocks || []).find(s => parseFloat(s.size) === parseFloat(selectedSize) && s.quantity > 0);
                // Use sellingPrice if available and > 0, otherwise fall back to product's base price (never cost price)
                const displayPrice = (activeStock && Number(activeStock.sellingPrice) > 0) 
                  ? Number(activeStock.sellingPrice) 
                  : parseFloat(product.price);
                const originalPrice = product.discountPrice ? parseFloat(product.price) : null;
                
                return (
                  <>
                    <span className="current-price">
                      Rs. {displayPrice.toLocaleString()}
                    </span>
                    {originalPrice && originalPrice > displayPrice && (
                      <span className="old-price">
                        Rs. {originalPrice.toLocaleString()}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Product description teaser */}
            <p className="product-info-text">
              {product.description ||
                `Engineered for elite athletes and style enthusiasts alike. The ${product.name} features a breathable mesh upper and our signature carbon-fiber energy return system, tailored perfectly for ${product.category?.name || "everyday"} use.`}
            </p>

            {/* Size selection interface */}
            <div className="size-selector">
              <div className="selector-title">
                <span>SELECT SIZE (US)</span>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="guide-link"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    font: "inherit",
                    color: "inherit",
                    textDecoration: "underline",
                  }}
                >
                  Size Guide
                </button>
              </div>
              <div className="size-btns">
                {stockDetails.length === 0 ? (
                  <p style={{ color: '#e53e3e', fontWeight: '600', fontSize: '14px' }}>
                    ⚠ No sizes available for this product.
                  </p>
                ) : (
                  stockDetails.map((item) => {
                    const isOutOfStock = item.quantity <= 0;
                    return (
                      <button
                        key={item.size}
                        className={`${selectedSize === item.size ? "active" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
                        onClick={() => !isOutOfStock && setSelectedSize(item.size)}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Out of Stock" : ""}
                        style={{
                          position: 'relative',
                          opacity: isOutOfStock ? 0.4 : 1,
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          textDecoration: isOutOfStock ? 'line-through' : 'none'
                        }}
                      >
                        {item.size}
                        {isOutOfStock && (
                          <span style={{
                            position: 'absolute',
                            bottom: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '8px',
                            whiteSpace: 'nowrap',
                            color: '#e53e3e',
                            fontWeight: 'bold',
                            textDecoration: 'none'
                          }}>
                            SOLD OUT
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Add to cart and wishlist actions */}
            <div className="buy-actions">
              <button
                className="add-cart-btn"
                disabled={!selectedSize || (stockDetails.find(s => s.size === selectedSize)?.quantity <= 0)}
                style={(!selectedSize || (stockDetails.find(s => s.size === selectedSize)?.quantity <= 0)) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                onClick={() => {
                  if (!user) {
                    setPopupMessage("Please login to add items to your cart.");
                    setShowPopup(true);
                    return;
                  }
                  if (!selectedSize) {
                    setPopupMessage("Please select a size.");
                    setShowPopup(true);
                    return;
                  }
                  const stockItem = stockDetails.find(s => s.size === selectedSize);
                  if (!stockItem || stockItem.quantity <= 0) {
                    setPopupMessage("This size is currently out of stock.");
                    setShowPopup(true);
                    return;
                  }
                  addToCart({ ...product, image_url: mainImage }, selectedSize);
                }}
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                {(!selectedSize || (stockDetails.find(s => s.size === selectedSize)?.quantity <= 0)) ? 'Unavailable' : 'Add to Cart'}
              </button>
              <button
                className={`wish-btn ${isInWishlist(product.id) ? "active" : ""}`}
                onClick={() => {
                  if (!user) {
                    setPopupMessage(
                      "Please login to add items to your wishlist.",
                    );
                    setShowPopup(true);
                    return;
                  }
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
              >
                <span
                  className={`material-symbols-outlined ${isInWishlist(product.id) ? "fill" : ""}`}
                >
                  favorite
                </span>
                <span className="wish-text">Wishlist</span>
              </button>
            </div>

            {/* Product features highlights */}
            <div className="features-strip">
              <div className="f-item">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
                <span>Free Shipping</span>
              </div>
              <div className="f-item">
                <span className="material-symbols-outlined">verified</span>
                <span>Authenticity Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional product information with tabs */}
        <div className="product-extra-info">
          {/* Tab navigation */}
          <div className="tabs-nav">
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={activeTab === "specifications" ? "active" : ""}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab content area */}
          <div className="tab-pane-outer">
            <div className="tab-pane">
              {activeTab === "description" && (
                // Description tab content
                <div className="pane-grid">
                  <div className="pane-content">
                    <h2>{product.name} - Unmatched Comfort and Speed</h2>
                    <p>
                      {product.description ||
                        `The ${product.name} represents the pinnacle of footwear engineering. Designed for high-intensity training and daily wear, it combines a responsive foam midsole with a structural TPU frame for ultimate stability.`}
                    </p>
                    <ul className="bullet-feats">
                      {getProductFeatures().map((feat, idx) => (
                        <li key={idx}>
                          <span className="material-symbols-outlined">
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pane-visual">
                    <img
                      src={mainImage || passedImage || product.image_url}
                      alt={product.name}
                    />
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                // Specifications tab content
                <div className="specs-grid">
                  <div className="spec-item">
                    <h5>Gender</h5>
                    <p>{product.gender || "Unisex"}</p>
                  </div>
                  <div className="spec-item">
                    <h5>Stock</h5>
                    <p>
                      {selectedSize 
                        ? (product.stocks?.find(s => String(s.size) === String(selectedSize))?.quantity > 0 
                            ? `${product.stocks.find(s => String(s.size) === String(selectedSize)).quantity} available` 
                            : "Out of stock")
                        : (product.stock_quantity > 0 
                            ? `${product.stock_quantity} available` 
                            : "Out of stock")
                      }
                    </p>
                  </div>
                  <div className="spec-item">
                    <h5>Category</h5>
                    <p>{product.category?.name || "Lifestyle"}</p>
                  </div>
                  <div className="spec-item">
                    <h5>Material</h5>
                    <p>
                      {product.category?.name === "Running"
                        ? "Engineered Mesh & Synthetic"
                        : product.category?.name === "Boots"
                          ? "Ballistic Nylon & Leather"
                          : "Premium Leather & Textile"}
                    </p>
                  </div>
                  <div className="spec-item">
                    <h5>Weight</h5>
                    <p>
                      {product.category?.name === "Running"
                        ? "240g (Size 9)"
                        : product.category?.name === "Boots"
                          ? "580g (Size 9)"
                          : "310g (Size 9)"}
                    </p>
                  </div>
                  <div className="spec-item">
                    <h5>Best For</h5>
                    <p>
                      {product.category?.name === "Running"
                        ? "High-Intensity Training & Marathons"
                        : product.category?.name === "Basketball"
                          ? "Competitive Court Play"
                          : product.category?.name === "Boots"
                            ? "Outdoor Exploration & Tactical Use"
                            : "Daily Lifestyle & Urban Fashion"}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                // Reviews tab content
                <div className="reviews-tab-content">
                  {/* Existing reviews display */}
                  <div className="reviews-list">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="review-card">
                          <div className="r-header">
                            <div className="stars">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span
                                  key={s}
                                  className={`material-symbols-outlined ${s <= review.rating ? "fill" : ""}`}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="r-user">
                              {review.user?.name || "Anonymous User"}
                            </span>
                            <span className="r-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p>"{review.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "40px 0", color: "#888" }}>
                        No reviews yet. Be the first to review this product!
                      </div>
                    )}
                  </div>

                  {/* Review submission form */}
                  <div className="add-review-section">
                    <h3>Submit Your Review</h3>
                    {!user ? (
                      // Login prompt for non-authenticated users
                      <div className="review-login-prompt">
                        <p>
                          Log in to share your experience with this product.
                        </p>
                        <Link to="/login" className="login-link-btn">
                          Sign In to Review
                        </Link>
                      </div>
                    ) : (
                      // Review form for authenticated users
                      <form
                        onSubmit={handleReviewSubmit}
                        className="review-form"
                      >
                        {reviewMsg.text && (
                          <div className={`review-msg ${reviewMsg.type}`}>
                            {reviewMsg.text}
                          </div>
                        )}

                        {/* Rating selection */}
                        <div className="rating-input">
                          <label>Your Rating</label>
                          <div className="star-input-group">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                className={`star-btn ${newReview.rating >= val ? "active" : ""}`}
                                onClick={() =>
                                  setNewReview((p) => ({ ...p, rating: val }))
                                }
                              >
                                <span className="material-symbols-outlined">
                                  star
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment input */}
                        <div className="comment-input">
                          <label>Your Review</label>
                          <textarea
                            rows="4"
                            placeholder="What did you like or dislike?"
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview((p) => ({
                                ...p,
                                comment: e.target.value,
                              }))
                            }
                            disabled={submittingReview}
                          ></textarea>
                        </div>

                        {/* Submit button */}
                        <button
                          type="submit"
                          className="submit-review-btn"
                          disabled={submittingReview}
                        >
                          {submittingReview ? "Posting..." : "Post Review"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetail; // Export ProductDetail component
