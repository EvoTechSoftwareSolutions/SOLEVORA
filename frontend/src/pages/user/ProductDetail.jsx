import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import '../../styles/user/ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('9.0');
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setProduct(data);
                    setMainImage(data.image_url);
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!product) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Product Not Found</h2>
                <Link to="/home">Go back to Home</Link>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="breadcrumbs">
                    <Link to="/home">Home</Link>
                    <span className="separator">/</span>
                    <Link to="/category">{product.category ? product.category.name : 'All Products'}</Link>
                    <span className="separator">/</span>
                    <span className="current">{product.name}</span>
                </div>

                <div className="product-grid">
                    <div className="gallery-section">
                        <div className="main-viewport">
                            <img src={mainImage || product.image_url} alt={product.name} />
                        </div>
                        <div className="thumb-strip">
                            {product.image_url && (
                                <div className={`thumb-box ${mainImage === product.image_url ? 'active' : ''}`} onClick={() => setMainImage(product.image_url)}>
                                    <img src={product.image_url} alt="Main view" />
                                </div>
                            )}
                            {product.image_url_2 && (
                                <div className={`thumb-box ${mainImage === product.image_url_2 ? 'active' : ''}`} onClick={() => setMainImage(product.image_url_2)}>
                                    <img src={product.image_url_2} alt="Side view" />
                                </div>
                            )}
                            {product.image_url_3 && (
                                <div className={`thumb-box ${mainImage === product.image_url_3 ? 'active' : ''}`} onClick={() => setMainImage(product.image_url_3)}>
                                    <img src={product.image_url_3} alt="Alternate view" />
                                </div>
                            )}
                            {product.image_url_4 && (
                                <div className={`thumb-box ${mainImage === product.image_url_4 ? 'active' : ''}`} onClick={() => setMainImage(product.image_url_4)}>
                                    <img src={product.image_url_4} alt="Bottom view" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="details-section">
                        <div className="details-header">
                            <span className="brand-badge">PREMIUM PERFORMANCE</span>
                            <h1>{product.name}</h1>
                            <div className="rating-row">
                                <div className="stars">
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                </div>
                                <span className="review-count">(128 reviews)</span>
                            </div>
                        </div>

                        <div className="pricing">
                            <span className="current-price">${product.price}</span>
                            <span className="old-price">$240.00</span>
                        </div>

                        <p className="product-info-text">
                            Engineered for elite athletes and style enthusiasts alike. The Solevora Elite features a breathable mesh upper and our signature carbon-fiber energy return system.
                        </p>

                        <div className="size-selector">
                            <div className="selector-title">
                                <span>SELECT SIZE (US)</span>
                                <Link to="/size-chart" className="guide-link">Size Guide</Link>
                            </div>
                            <div className="size-btns">
                                {['7.0', '8.0', '9.0', '10.0', '11.0', '12.0'].map(size => (
                                    <button 
                                        key={size}
                                        className={selectedSize === size ? 'active' : ''} 
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="buy-actions">
                            <button className="add-cart-btn" onClick={() => {
                                addToCart(product, selectedSize);
                            }}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                                Add to Cart
                            </button>
                            <button 
                                className={`wish-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
                                onClick={() => {
                                    if (isInWishlist(product.id)) {
                                        removeFromWishlist(product.id);
                                    } else {
                                        addToWishlist(product);
                                    }
                                }}
                            >
                                <span className={`material-symbols-outlined ${isInWishlist(product.id) ? 'fill' : ''}`}>favorite</span>
                                Wishlist
                            </button>
                        </div>

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

                <div className="product-extra-info">
                    <div className="tabs-nav">
                        <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>Description</button>
                        <button className={activeTab === 'specifications' ? 'active' : ''} onClick={() => setActiveTab('specifications')}>Specifications</button>
                        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews (128)</button>
                    </div>

                    <div className="tab-pane-outer">
                        <div className="tab-pane">
                            {activeTab === 'description' && (
                                <div className="pane-grid">
                                    <div className="pane-content">
                                        <h2>Unmatched Comfort and Speed</h2>
                                        <p>
                                            The Solevora Elite Sneaker represents the pinnacle of footwear engineering. 
                                            Designed for high-intensity training and daily wear, it combines a responsive 
                                            foam midsole with a structural TPU frame for ultimate stability.
                                        </p>
                                        <ul className="bullet-feats">
                                            <li><span className="material-symbols-outlined">check_circle</span><span>Breathable AeroWeave™ mesh upper for thermal regulation.</span></li>
                                            <li><span className="material-symbols-outlined">check_circle</span><span>Dynamic Cushioning System for 30% more energy return.</span></li>
                                            <li><span className="material-symbols-outlined">check_circle</span><span>Grippy All-Terrain outsole for superior traction on any surface.</span></li>
                                        </ul>
                                    </div>
                                    <div className="pane-visual">
                                        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&h=400&auto=format&fit=crop" alt="Sneaker lifestyle" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <h5>Material</h5>
                                        <p>Sustainable Mesh, Recycled Rubber</p>
                                    </div>
                                    <div className="spec-item">
                                        <h5>Heel Drop</h5>
                                        <p>8mm</p>
                                    </div>
                                    <div className="spec-item">
                                        <h5>Weight</h5>
                                        <p>250g (Size 9)</p>
                                    </div>
                                    <div className="spec-item">
                                        <h5>Best For</h5>
                                        <p>Road Running, Daily Trainer</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="reviews-list">
                                    <div className="review-card">
                                        <div className="r-header">
                                            <div className="stars">
                                                <span className="material-symbols-outlined fill">star</span>
                                                <span className="material-symbols-outlined fill">star</span>
                                                <span className="material-symbols-outlined fill">star</span>
                                                <span className="material-symbols-outlined fill">star</span>
                                                <span className="material-symbols-outlined fill">star</span>
                                            </div>
                                            <span className="r-user">Alex G.</span>
                                            <span className="r-date">Oct 12, 2023</span>
                                        </div>
                                        <p>"Absolutely amazing. Best running shoes I've ever owned. Worth every penny!"</p>
                                    </div>
                                    <button className="load-more-btn">Load More Reviews</button>
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
