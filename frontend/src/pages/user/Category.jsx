import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import '../../styles/user/Category.css';

const Category = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryName = queryParams.get('type') || 'All';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/products?category=${categoryName}`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-dots">
                    <div></div><div></div><div></div>
                </div>
                <p>Curating the best collection for you...</p>
            </div>
        );
    }

    return (
        <div className="category-page">
            <div className="category-container">
                <div className="category-header">
                    <h1>{categoryName === 'All' ? 'Exclusive Collection' : `${categoryName} Collection`}</h1>
                    <p>Discover our range of premium {categoryName === 'All' ? 'footwear' : categoryName.toLowerCase()} designed for comfort and performance.</p>
                </div>

                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            {product.stock_quantity < 10 && (
                                <span className="badge">Limited Stock</span>
                            )}
                            <button 
                                className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
                                title="Add to Wishlist"
                                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                            >
                                <span className="material-symbols-outlined">
                                    {isInWishlist(product.id) ? 'favorite' : 'favorite_border'}
                                </span>
                            </button>
                            
                            <div className="card-image-box">
                                <img src={product.image_url} alt={product.name} />
                            </div>

                            <div className="card-details">
                                <span className="card-category">{product.category?.name || 'Footwear'}</span>
                                <h3>{product.name}</h3>
                                
                                <div className="price-row">
                                    <span className="price">${product.price}</span>
                                </div>

                                <div className="card-actions">
                                    <Link to={`/product/${product.id}`} className="view-btn">
                                        View Details
                                    </Link>
                                    <button 
                                        className="add-btn" 
                                        onClick={() => {
                                            addToCart(product, '9.0'); // Default size
                                        }}
                                        title="Quick Add to Cart"
                                    >
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;
