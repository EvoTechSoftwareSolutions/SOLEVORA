import React from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/user/ProductDetail.css';

function ProductDetail() {
    // Get the id from the url
    const params = useParams();
    const id = params.id;

    // State for the selected size
    const [selectedSize, setSelectedSize] = useState('9.0');
    // State for which tab we are looking at
    const [activeTab, setActiveTab] = useState('description');

    // All our images
    const thumbnails = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDcVWKRIEQKTdczefQ26RyCmwjQxO2wxh6uZTJzQf6vtd5FKc56wtqnzYUyXDp1A9R1QUzEDGxFZTR9fiT78MSQJyWa-QRIKW6cNjZzuitgKpdvoNrjSXPiEOsHB6WRXhN2pHVQc-0RVUQyUTlgAt94vEyTD_fzESIGVBwu4DVh9umTXNSJST2iubUsbKaYCkjUnHOkEqGlqxIRpocYo6_vlMKSBHSHxyHg8J5LF58NrUuKVcDkW8URlTqsRrXMHAp-F464FBRb2o8",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAqK9Sm3g31W8dSYXrTsjJCRucyq1dONto1nYxeUhceUsZFAhGq2PTfHOF4fCGykvAz09YeXckKlMt2UKyfcvRiaUffbjFqUKRpLU7qqScOt6z5RU2crSmXOW7EVKbPUc2_bVtc5IK3szkdnm849wNd4_ylK17tvOXZOveurNFQHQj_EQpCnBccSYgri-rLXg2OABRBvCEneGRF_DsbWnTf7kDGwS-RikDI0aWgRm8ImpgSvfIPePD7WOVY1wIL2ctbdIC4ia2-w1M",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCb-732VBwiD2o3rkuo7erJbm9acD7r5op7IdSSqY4JCPQ3YamoRHM7tnZLYaEBQfufLg786xjbn72z8OV_89DMtTjDyKbO0ekhkGLcml3kWU6tLmhfx-CpHFH08Tja3e0FI0GEGdb6ezmXJKibU31JvX6harrbqVkwbvsqcN-z7JBS0DnORvtJq8B8jFw1VZoodfJR9QZCs7rXVXTtnUJSpTTZQ8zx0AypzytvlJEg3J1g4P6TOFnQhZzfMbaICoCB22IrjZqU1h8",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCglGWU4eXkuQ0Z1XlL3FawAEAGfcDv6UckK9vPuysiZv_DtXAf8HoET4Kki_yo8o2Q1kfTm0TqEi_TwIYswxB1MOtlp9qVHvMsj4-YHDbFtuFcKRnkp4sqf9i58Ur7QdF09MRtyp4mnu2e_jA85cYU8sSyMO1qWMWnUcEDoHm-fxZwQUMNUH7liYkGtg6wofEnCZUyQLoxKGW1JRKdQ5grF5zTjycJBAJF6kW2yMNx6FjJH6sVckUb3xDzTYQojX37CKuVVlvoAfY",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCgdvIH7WuWf7lIH1O8Jq2qSpEku7mriyo4TV7-f3i2WQyRmf62LYza-_Gke17ZH490s5HpMdyoMi-Xv9GB2Ioj59jPK1xrBq61wsA9sGOUJV0uYCL66T2M1ZGD-48Im07kynFreKy8_XvNAx5rWnwlRLqARSVvFzIP2TpCQi05qeK_98kMzwkmVY6kA-gqhPLQ1bnGDtxoOyHUlZSi5cHFe7AnsylDXp5qgdeUF9iV4_ji7wWeviXaztTE3OYvzGuh-PHsIYusUZs"
    ];

    // This state is for the main big image
    const [mainImage, setMainImage] = useState(thumbnails[0]);

    // Functions to change the image
    function changeImageTo1() { setMainImage(thumbnails[1]); }
    function changeImageTo2() { setMainImage(thumbnails[2]); }
    function changeImageTo3() { setMainImage(thumbnails[3]); }
    function changeImageTo4() { setMainImage(thumbnails[4]); }

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* --- Breadcrumbs part --- */}
                <div className="breadcrumbs">
                    <Link to="/home">Home</Link>
                    <span className="separator">/</span>
                    <Link to="/footwear">Footwear</Link>
                    <span className="separator">/</span>
                    <span className="current">Solevora Elite Sneaker</span>
                </div>

                <div className="product-grid">
                    {/* Left side for images */}
                    <div className="gallery-section">
                        <div className="main-viewport">
                            <img src={mainImage} alt="Main Shoe" />
                        </div>
                        <div className="thumb-strip">
                            <div className={mainImage === thumbnails[1] ? "thumb-box active" : "thumb-box"} onClick={changeImageTo1}>
                                <img src={thumbnails[1]} alt="View 1" />
                            </div>
                            <div className={mainImage === thumbnails[2] ? "thumb-box active" : "thumb-box"} onClick={changeImageTo2}>
                                <img src={thumbnails[2]} alt="View 2" />
                            </div>
                            <div className={mainImage === thumbnails[3] ? "thumb-box active" : "thumb-box"} onClick={changeImageTo3}>
                                <img src={thumbnails[3]} alt="View 3" />
                            </div>
                            <div className={mainImage === thumbnails[4] ? "thumb-box active" : "thumb-box"} onClick={changeImageTo4}>
                                <img src={thumbnails[4]} alt="View 4" />
                            </div>
                        </div>
                    </div>

                    {/* Right side for info */}
                    <div className="details-section">
                        <div className="details-header">
                            <span className="brand-badge">PREMIUM PERFORMANCE</span>
                            <h1>Solevora Elite Sneaker</h1>
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
                            <span className="current-price">$189.00</span>
                            <span className="old-price">$240.00</span>
                        </div>

                        <p className="product-info-text">
                            Engineered for elite athletes and style enthusiasts alike. The Solevora Elite features a breathable mesh upper and our signature carbon-fiber energy return system.
                        </p>

                        {/* Size Selection Area */}
                        <div className="size-selector">
                            <div className="selector-title">
                                <span>SELECT SIZE (US)</span>
                                <Link to="/size-guide" className="guide-link">Size Guide</Link>
                            </div>
                            <div className="size-btns">
                                <button className={selectedSize === '7.0' ? 'active' : ''} onClick={function() { setSelectedSize('7.0'); }}>7.0</button>
                                <button className={selectedSize === '8.0' ? 'active' : ''} onClick={function() { setSelectedSize('8.0'); }}>8.0</button>
                                <button className={selectedSize === '9.0' ? 'active' : ''} onClick={function() { setSelectedSize('9.0'); }}>9.0</button>
                                <button className={selectedSize === '10.0' ? 'active' : ''} onClick={function() { setSelectedSize('10.0'); }}>10.0</button>
                                <button className={selectedSize === '11.0' ? 'active' : ''} onClick={function() { setSelectedSize('11.0'); }}>11.0</button>
                                <button className={selectedSize === '12.0' ? 'active' : ''} onClick={function() { setSelectedSize('12.0'); }}>12.0</button>
                            </div>
                        </div>

                        <div className="buy-actions">
                            <button className="add-cart-btn" onClick={function() { alert('Added to cart!'); }}>
                                <span className="material-symbols-outlined">shopping_bag</span>
                                Add to Cart
                            </button>
                            <button className="wish-btn" onClick={function() { alert('Added to wishlist!'); }}>
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

                {/* The Tabs at the bottom */}
                <div className="product-extra-info">
                    <div className="tabs-nav">
                        <button className={activeTab === 'description' ? 'active' : ''} onClick={function() { setActiveTab('description'); }}>DESCRIPTION</button>
                        <button className={activeTab === 'specifications' ? 'active' : ''} onClick={function() { setActiveTab('specifications'); }}>SPECIFICATIONS</button>
                        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={function() { setActiveTab('reviews'); }}>REVIEWS (128)</button>
                    </div>

                    {/* Content for tabs */}
                    <div className="tab-pane">
                        <div className="pane-grid">
                            <div className="pane-content">
                                <h2>Unmatched Comfort and Speed</h2>
                                <p>
                                    The Solevora Elite Sneaker represents the pinnacle of footwear engineering. Designed for high-intensity training and daily wear, it combines a responsive foam midsole with a structural TPU frame for ultimate stability.
                                </p>
                                <ul className="bullet-feats">
                                    <li>
                                        <span className="material-symbols-outlined">check_circle</span>
                                        <span>Breathable AeroWeave™ mesh upper for thermal regulation.</span>
                                    </li>
                                    <li>
                                        <span className="material-symbols-outlined">check_circle</span>
                                        <span>Dynamic Cushioning System for 30% more energy return.</span>
                                    </li>
                                    <li>
                                        <span className="material-symbols-outlined">check_circle</span>
                                        <span>Grippy All-Terrain outsole for superior traction on any surface.</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pane-visual">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCELZHr36YLYsUE_qfGy6mQItL7eITuaWRys6IQZNIKiR2U9ZP5FRjrI5aojzFPpDMVA5NWhwthaOrMDF7oLV1rRZPSCCEFq6q8wNivwPdqbiDmI7rcuvrKmpwEH0Onhva6Ig5nZUtxtkBHDRj5HFDiOQNzsewzkLCPHPDAeHgBm50SWR9BWYAZ9Em9rWSlWWtX2qMHHLJ0cE9VskBiUcjptXyrRnfYfHKfieJbgaNdAORj1Uj0Yi1KckOHqsh-Gor20ku0bNPwAkk" alt="Lifestyle" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
