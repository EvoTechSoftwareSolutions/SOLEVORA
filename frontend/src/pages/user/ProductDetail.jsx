import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
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
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedImage = location.state?.productImage;

  const { addToCart, cart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState(passedImage || "");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState({ text: "", type: "" });

  const user = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  // ── Fetch product ─────────────────────────────────────────────────────────
  const fetchProduct = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/slug/${slug}`);
      const data = await response.json();
      if (response.ok) {
        setProduct(data.data);
        if (!passedImage) {
          // Try both mapped fields
          const imgUrl =
            data.data.images?.[0]?.url ||
            data.data.productimage?.[0]?.url ||
            "";
          setMainImage(getImg(imgUrl));
        }
        fetchReviews(data.data.id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (passedImage) setMainImage(passedImage);
  }, [passedImage]);

  // Reset quantity when size changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  // Auto-select first in-stock size
  useEffect(() => {
    if (product?.stocks) {
      const inStockSizes = product.stocks
        .filter((s) => s.quantity > 0)
        .map((s) => String(s.size));
      if (inStockSizes.length > 0 && !inStockSizes.includes(selectedSize)) {
        setSelectedSize(inStockSizes[0]);
      }
    }
  }, [product]);

  // ── Fetch reviews ─────────────────────────────────────────────────────────
  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${productId}`);
      const data = await res.json();
      if (res.ok) setReviews(data);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  // ── Review submit ─────────────────────────────────────────────────────────
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewMsg({ text: "Please sign in to leave a review.", type: "error" });
      return;
    }
    if (!newReview.comment.trim()) {
      setReviewMsg({ text: "Please write a comment first.", type: "error" });
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newReview, userId: user.id, productId: product.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setNewReview({ rating: 5, comment: "" });
        setReviewMsg({ text: "Thank you! Your review has been posted.", type: "success" });
      } else {
        setReviewMsg({ text: data.message || "Error submitting review.", type: "error" });
      }
    } catch {
      setReviewMsg({ text: "Could not reach the server.", type: "error" });
    } finally {
      setSubmittingReview(false);
      setTimeout(() => setReviewMsg({ text: "", type: "" }), 4000);
    }
  };

  // ── Loading / not found ───────────────────────────────────────────────────
  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <Link to="/home">Go back to Home</Link>
      </div>
    );
  }

  // ── Build size/stock map ──────────────────────────────────────────────────
  // Use both possible field names from backend
  const rawStocks = product.stocks || product.productstock || [];

  let stockDetails = [];
  if (rawStocks.length > 0) {
    const grouped = rawStocks.reduce((acc, s) => {
      const size = String(s.size);
      if (!acc[size]) acc[size] = { size, quantity: 0 };
      acc[size].quantity += s.quantity;
      return acc;
    }, {});
    stockDetails = Object.values(grouped).sort(
      (a, b) => parseFloat(a.size) - parseFloat(b.size)
    );
  }

  // Max stock for selected size (for quantity cap)
  const selectedStockItem = stockDetails.find((s) => s.size === selectedSize);
  const maxStock = selectedStockItem?.quantity || 0;
  const isUnavailable = !selectedSize || maxStock <= 0;

  // ── Display price (FIFO: oldest batch for selected size) ──────────────────
  const getDisplayPrice = () => {
    const sortedStocks = [...rawStocks].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    let activeStock;
    if (selectedSize) {
      activeStock = sortedStocks.find(
        (s) => parseFloat(s.size) === parseFloat(selectedSize) && s.quantity > 0
      );
    } else {
      activeStock = sortedStocks.find((s) => s.quantity > 0);
    }
    return activeStock && Number(activeStock.sellingPrice) > 0
      ? Number(activeStock.sellingPrice)
      : parseFloat(product.price);
  };

  const displayPrice = getDisplayPrice();
  const originalPrice = product.discountPrice ? parseFloat(product.price) : null;

  // ── Average rating ────────────────────────────────────────────────────────
  const avgRating =
    reviews.length > 0
      ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
      : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
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
    if (maxStock <= 0) {
      setPopupMessage("This size is currently out of stock.");
      setShowPopup(true);
      return;
    }

    // Check existing cart quantity
    const inCart = cart.find(
      (c) => c.productId === product.id && String(c.size) === String(selectedSize)
    );
    const alreadyInCart = inCart?.quantity || 0;
    if (alreadyInCart + quantity > maxStock) {
      setPopupMessage(`Only ${maxStock} items available. You already have ${alreadyInCart} in cart.`);
      setShowPopup(true);
      return;
    }

    addToCart({ ...product, image_url: mainImage }, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      setPopupMessage("Please login to continue.");
      setShowPopup(true);
      return;
    }
    if (!selectedSize) {
      setPopupMessage("Please select a size.");
      setShowPopup(true);
      return;
    }
    if (maxStock <= 0) {
      setPopupMessage("Out of stock.");
      setShowPopup(true);
      return;
    }

    // Store buy-now item and navigate to checkout
    const buyNowItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image_url: mainImage,
      size: selectedSize,
      quantity,
      price: displayPrice,
      totalPrice: displayPrice * quantity,
    };
    localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    navigate("/checkout?buyNow=true");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="product-detail-page">
      {showPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          type="notice"
        />
      )}
      <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} />

      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs">
          <Link to="/home">Home</Link>
          <span className="separator">/</span>
          <Link to="/category">{product.category?.name || "All Products"}</Link>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </div>

        {/* Product grid */}
        <div className="product-grid">

          {/* ── Gallery ── */}
          <div className="gallery-section">
            <div className="main-viewport">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="thumb-strip">
              {(product.images || product.productimage || []).map((img, idx) => {
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

          {/* ── Details ── */}
          <div className="details-section">

            {/* Header */}
            <div className="details-header">
              <span className="brand-badge">PREMIUM PERFORMANCE</span>
              <h1>{product.name}</h1>
              <div className="rating-row">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`material-symbols-outlined ${star <= avgRating ? "fill" : ""}`}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="review-count">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="pricing">
              <span className="current-price">Rs. {displayPrice.toLocaleString()}</span>
              {originalPrice && originalPrice > displayPrice && (
                <span className="old-price">Rs. {originalPrice.toLocaleString()}</span>
              )}
            </div>

            {/* Description */}
            <p className="product-info-text">
              {product.description ||
                `Engineered for elite athletes and style enthusiasts alike. The ${product.name} features a breathable mesh upper and our signature carbon-fiber energy return system, tailored perfectly for ${product.category?.name || "everyday"} use.`}
            </p>

            {/* Size selector */}
            <div className="size-selector">
              <div className="selector-title">
                <span>SELECT SIZE (US)</span>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="guide-link"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit", textDecoration: "underline" }}
                >
                  Size Guide
                </button>
              </div>
              <div className="size-btns">
                {stockDetails.length === 0 ? (
                  <p style={{ color: "#e53e3e", fontWeight: "600", fontSize: "14px" }}>
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
                        title={isOutOfStock ? "Out of Stock" : `${item.quantity} available`}
                        style={{
                          position: "relative",
                          opacity: isOutOfStock ? 0.4 : 1,
                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                          textDecoration: isOutOfStock ? "line-through" : "none",
                        }}
                      >
                        {item.size}
                        {isOutOfStock && (
                          <span style={{
                            position: "absolute", bottom: "-12px", left: "50%",
                            transform: "translateX(-50%)", fontSize: "8px",
                            whiteSpace: "nowrap", color: "#e53e3e",
                            fontWeight: "bold", textDecoration: "none",
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

            {/* Quantity selector */}
            {selectedSize && maxStock > 0 && (
              <div className="quantity-selector">
                <span>Quantity</span>
                <div className="qty-box">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {maxStock} available
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="buy-actions">
              {/* Buy Now */}
              <button
                className="buy-now-btn"
                disabled={isUnavailable}
                style={isUnavailable ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                onClick={handleBuyNow}
              >
                <span className="material-symbols-outlined">payments</span>
                Buy Now
              </button>

              {/* Add to Cart */}
              <button
                className="add-cart-btn"
                disabled={isUnavailable}
                style={isUnavailable ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                onClick={handleAddToCart}
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                {isUnavailable ? "Unavailable" : "Add to Cart"}
              </button>

              {/* Wishlist */}
              <button
                className={`wish-btn ${isInWishlist(product.id) ? "active" : ""}`}
                onClick={() => {
                  if (!user) {
                    setPopupMessage("Please login to add items to your wishlist.");
                    setShowPopup(true);
                    return;
                  }
                  isInWishlist(product.id)
                    ? removeFromWishlist(product.id)
                    : addToWishlist(product);
                }}
              >
                <span className={`material-symbols-outlined ${isInWishlist(product.id) ? "fill" : ""}`}>
                  favorite
                </span>
              </button>
            </div>

            {/* Features strip */}
            <div className="features-strip">
              <div className="f-item">
                <span className="material-symbols-outlined">local_shipping</span>
                <span>Free Shipping</span>
              </div>
              <div className="f-item">
                <span className="material-symbols-outlined">verified</span>
                <span>Authenticity Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="product-extra-info">
          <div className="tabs-nav">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "reviews"
                  ? `Reviews (${reviews.length})`
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-pane-outer">
            <div className="tab-pane">

              {/* Description tab */}
              {activeTab === "description" && (
                <div className="pane-grid">
                  <div className="pane-content">
                    <h2>{product.name} - Unmatched Comfort and Speed</h2>
                    <p>
                      {product.description ||
                        `The ${product.name} represents the pinnacle of footwear engineering. Designed for high-intensity training and daily wear, it combines a responsive foam midsole with a structural TPU frame for ultimate stability.`}
                    </p>
                    <ul className="bullet-feats">
                      {[product.descriptionOne, product.descriptionTwo, product.descriptionThree]
                        .filter(Boolean)
                        .map((feat, idx) => (
                          <li key={idx}>
                            <span className="material-symbols-outlined">check_circle</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="pane-visual">
                    <img src={mainImage || passedImage} alt={product.name} />
                  </div>
                </div>
              )}

              {/* Specifications tab */}
              {activeTab === "specifications" && (
                <div className="specs-grid">
                  {product.specifications?.length > 0 && (
                    <div className="specs-db">
                      {product.specifications.map((spec, idx) => (
                        <div key={idx} className="spec-item">
                          <h5>{spec.key}</h5>
                          <p>{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="spec-item">
                    <h5>Gender</h5>
                    <p>{product.gender || "Unisex"}</p>
                  </div>
                  <div className="spec-item">
                    <h5>Stock</h5>
                    <p>
                      {selectedSize
                        ? maxStock > 0
                          ? `${maxStock} available`
                          : "Out of stock"
                        : product.stock_quantity > 0
                          ? `${product.stock_quantity} available`
                          : "Out of stock"}
                    </p>
                  </div>
                  <div className="spec-item">
                    <h5>Category</h5>
                    <p>{product.category?.name || "Lifestyle"}</p>
                  </div>
                  <div className="spec-item">
                    <h5>Best For</h5>
                    <p>
                      {product.descriptionOne ||
                        product.descriptionTwo ||
                        product.descriptionThree ||
                        "No description available"}
                    </p>
                  </div>
                </div>
              )}

              {/* Reviews tab */}
              {activeTab === "reviews" && (
                <div className="reviews-tab-content">
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
                            <span className="r-user">{review.user?.name || "Anonymous User"}</span>
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

                  <div className="add-review-section">
                    <h3>Submit Your Review</h3>
                    {!user ? (
                      <div className="review-login-prompt">
                        <p>Log in to share your experience with this product.</p>
                        <Link to="/login" className="login-link-btn">
                          Sign In to Review
                        </Link>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="review-form">
                        {reviewMsg.text && (
                          <div className={`review-msg ${reviewMsg.type}`}>
                            {reviewMsg.text}
                          </div>
                        )}
                        <div className="rating-input">
                          <label>Your Rating</label>
                          <div className="star-input-group">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                className={`star-btn ${newReview.rating >= val ? "active" : ""}`}
                                onClick={() => setNewReview((p) => ({ ...p, rating: val }))}
                              >
                                <span className="material-symbols-outlined">star</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="comment-input">
                          <label>Your Review</label>
                          <textarea
                            rows="4"
                            placeholder="What did you like or dislike?"
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview((p) => ({ ...p, comment: e.target.value }))
                            }
                            disabled={submittingReview}
                          />
                        </div>
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

export default ProductDetail;