import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Wishlist.css';
const BASE_URL = "http://localhost:5001";


const getImg = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url.replace(/\\/g, "/")}`;
};
const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

const handleAddToCart = (product, productId, imageUrl) => {
    addToCart(
        {
            ...product,
            image_url: imageUrl 
        },
        product.sizes?.[0] || "42"
    );

    removeFromWishlist(productId);
};

    return (
        <div className="wl-container">
            {/* Header */}
            <header className="wl-header">
                <div className="wl-title-section">
                    <h2>My Wishlist</h2>
                    <p>Keep track of the styles you love and wait for the right moment.</p>
                </div>
            </header>

            {/* Product Grid */}
            <div className="wl-grid">
                {!Array.isArray(wishlist) || wishlist.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
                        <h3>Your wishlist is empty</h3>
                        <p>Save items you like to see them here.</p>
                        <Link to="/category" className="wl-add-cart-btn" style={{ marginTop: '20px' }}>
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    wishlist.map((item) => {
                        const product = item.product;

                        if (!product) return null;
                        
                           const imageUrl = product.productimage?.[0]?.url
        ? getImg(product.productimage[0].url)
        : getImg(product.image_url);

                        return (
                            <div key={item.id} className="wl-card">

                                {/* Remove */}
                                <button
                                    className="wl-remove-btn"
                                    onClick={() => removeFromWishlist(item.productId)}
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>

                                {/* Image */}
                                <div className="wl-img-box">
                                   <img src={imageUrl} alt={product.name} />
                                </div>

                                {/* Info */}
                                <div className="wl-card-info">
                                    <div className="wl-info-header">
                                        <h3>{product.name}</h3>
                                        <p className="wl-price">
                                            Rs. {parseFloat(product.price || 0).toLocaleString()}
                                        </p>
                                    </div>

                                    <p className="wl-color-text">
                                        Brand: {product.brand || 'SoleVora'}
                                    </p>

                                    <button
                                        className="wl-add-cart-btn"
                                        onClick={() => handleAddToCart(product, item.productId, imageUrl)}
                                    >
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="wl-footer">
                <p className="wl-footer-text">
                    Showing {Array.isArray(wishlist) ? wishlist.length : 0} item(s)
                </p>
            </div>
        </div>
    );
};

export default Wishlist;