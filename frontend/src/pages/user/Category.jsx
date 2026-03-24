import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/user/Category.css';

const Category = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                    <h1>Exclusive Collection</h1>
                    <p>Discover our range of premium footwear designed for comfort and performance.</p>
                </div>

                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            {product.stock_quantity < 10 && (
                                <span className="badge">Limited Stock</span>
                            )}
                            <button className="wishlist-btn" title="Add to Wishlist">
                                <span className="material-symbols-outlined">favorite</span>
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
                                            alert(`${product.name} added to cart!`);
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
