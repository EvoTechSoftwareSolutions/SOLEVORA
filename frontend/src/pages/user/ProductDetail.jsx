import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/user/ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
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
                    <Link to="/footwear">Footwear</Link>
                    <span className="separator">/</span>
                    <span className="current">{product.name}</span>
                </div>

                <div className="product-grid">
                    <div className="gallery-section">
                        <div className="main-viewport">
                            <img src={mainImage || product.image_url} alt={product.name} />
                        </div>
                        <div className="thumb-strip">
                            <div className="thumb-box active">
                                <img src={product.image_url} alt="Main view" />
                            </div>
                        </div>
                    </div>

                    <div className="details-section">
                        <div className="details-header">
                            <span className="brand-badge">{product.category ? product.category.name.toUpperCase() : 'PREMIUM'}</span>
                            <h1>{product.name}</h1>
                            <div className="rating-row">
                                <div className="stars">
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined fill">star</span>
                                    <span className="material-symbols-outlined">star_half</span>
                                </div>
                                <span className="review-count">(128 reviews)</span>
                            </div>
                        </div>

                        <div className="pricing">
                            <span className="current-price">${product.price}</span>
                            <span className="old-price">${(parseFloat(product.price) * 1.25).toFixed(2)}</span>
                        </div>

                        <p className="product-info-text">
                           {product.description || "The Solevora Elite features a breathable mesh upper and our signature carbon-fiber energy return system."}
                        </p>

                        <div className="size-selector">
                            <div className="selector-title">
                                <span>SELECT SIZE (US)</span>
                                <Link to="/size-guide" className="guide-link">Size Guide</Link>
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
                                alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
                            }}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                                Add to Cart
                            </button>
                            <button className="wish-btn" onClick={() => alert('Added to wishlist!')}>
                                <span className="material-symbols-outlined">favorite</span>
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
                        <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>DESCRIPTION</button>
                        <button className={activeTab === 'specifications' ? 'active' : ''} onClick={() => setActiveTab('specifications')}>SPECIFICATIONS</button>
                        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>REVIEWS (128)</button>
                    </div>

                    <div className="tab-pane">
                        <div className="pane-grid">
                            <div className="pane-content">
                                <h2>Unmatched Comfort and Speed</h2>
                                <p>{product.description}</p>
                                <ul className="bullet-feats">
                                    <li><span className="material-symbols-outlined">check_circle</span><span>Breathable mesh upper</span></li>
                                    <li><span className="material-symbols-outlined">check_circle</span><span>Superior energy return</span></li>
                                    <li><span className="material-symbols-outlined">check_circle</span><span>High-traction outsole</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
