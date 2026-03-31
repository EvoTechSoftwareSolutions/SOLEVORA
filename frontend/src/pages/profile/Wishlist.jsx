import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (item) => {
        // We'll use a default size if not specified
        addToCart(item, item.size || "42");
        removeFromWishlist(item.id);
    };

    return (
        <div className="wl-container">
            {/* Header */}
            <header className="wl-header">
                <div className="wl-title-section">
                    <h2>My Wishlist</h2>
                    <p>Keep track of the styles you love and wait for the right moment.</p>
                </div>

                <div className="wl-header-actions">
                    <div className="wl-search-box">
                        <span className="material-symbols-outlined wl-search-icon">search</span>
                        <input className="wl-search-input" placeholder="Search saved items..." type="text" />
                    </div>
                    <button className="wl-notify-btn">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="wl-share-btn">
                        Share List
                    </button>
                </div>
            </header>

            {/* Product Grid */}
            <div className="wl-grid">
                {wishlist.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
                        <h3>Your wishlist is empty</h3>
                        <p>Save items you like to see them here.</p>
                        <Link to="/category" className="wl-add-cart-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '20px' }}>Explore Products</Link>
                    </div>
                ) : (
                    wishlist.map((item) => (
                        <div key={item.id} className="wl-card">
                            {/* Remove Button */}
                            <button className="wl-remove-btn" onClick={() => removeFromWishlist(item.id)}>
                                <span className="material-symbols-outlined">delete</span>
                            </button>

                            {/* Image Box */}
                            <div className="wl-img-box">
                                <img src={item.image_url} alt={item.name} />
                                <div className="wl-stock-chip">
                                    <span className="wl-dot" style={{ backgroundColor: '#10b981' }}></span>
                                    <span style={{ color: '#059669' }}>In Stock</span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="wl-card-info">
                                <div className="wl-info-header">
                                    <h3>{item.name}</h3>
                                    <p className="wl-price">${item.price}</p>
                                </div>
                                <p className="wl-color-text">Brand: {item.brand || 'SoleVora'}</p>

                                <button className="wl-add-cart-btn" onClick={() => handleAddToCart(item)}>
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="wl-footer">
                <p className="wl-footer-text">Showing {wishlist.length} item(s) in your wishlist</p>
            </div>
        </div>
    );
};

export default Wishlist;
