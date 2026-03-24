import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [subTab, setSubTab] = useState('All Products');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    return (
        <div className="dashboard-content">
            {/* Page Title */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>Product Inventory</h1>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Manage and track your premium footwear collection</p>
                </div>
                <button className="btn-add-product" style={{ 
                    backgroundColor: '#f66d3b', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '10px 20px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(246, 109, 59, 0.2)'
                }}>
                    <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add New Product
                </button>
            </div>

            {/* Tabs Bar */}
            <div className="tabs-bar">
                <div className="tabs-left">
                    {['All Products', 'Active', 'Out of Stock', 'Drafts'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-link ${subTab === tab ? 'active' : ''}`}
                            onClick={() => setSubTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="tabs-right">
                    <button className="btn-secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        Filter
                    </button>
                    <button className="btn-secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>PRODUCT</th>
                            <th>SKU</th>
                            <th>CATEGORY</th>
                            <th>STOCK LEVEL</th>
                            <th>PRICE</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '50px' }}>Loading inventory...</td></tr>
                        ) : products.map(prod => {
                            const stockPct = Math.min(100, Math.round((prod.stock_quantity / 150) * 100)); // Assume 150 is max capacity for bar
                            let status = 'Active';
                            let badgeClass = 'status-active';
                            
                            if (prod.stock_quantity === 0) {
                                status = 'Out of Stock';
                                badgeClass = 'status-out';
                            } else if (prod.stock_quantity < 20) {
                                status = 'Low Stock';
                                badgeClass = 'status-low';
                            }

                            return (
                                <tr key={prod.id}>
                                    <td>
                                        <div className="td-product">
                                            <div className="product-images">
                                                <img src={prod.image_url} alt="shoe" className="product-img" />
                                            </div>
                                            <div>
                                                <div className="td-product-name">{prod.name}</div>
                                                <div className="td-product-desc">Standard Edition</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="td-sku">SLV-{prod.category?.name?.substring(0,3).toUpperCase()}-{prod.id}</div></td>
                                    <td><span className="category-badge">{prod.category?.name || 'Uncategorized'}</span></td>
                                    <td>
                                        <div className="stock-level-container">
                                            <div className="stock-text-row">
                                                <span className="stock-percent">{stockPct}%</span>
                                                <span className="stock-left">{prod.stock_quantity} left</span>
                                            </div>
                                            <div className="stock-bar-bg">
                                                <div className="stock-bar-fill" style={{ width: `${stockPct}%`, backgroundColor: '#f66d3b' }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="td-price">${prod.price}</div></td>
                                    <td>
                                        <div className={`status-badge ${badgeClass}`}>
                                            <span className="status-dot"></span>
                                            {status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="td-actions">
                                            <button className="action-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button className="action-icon" onClick={() => handleDelete(prod.id)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination">
                    <div className="page-info">
                        Showing 1 to 10 of 248 products
                    </div>
                    <div className="page-buttons">
                        <button className="page-btn">{'<'}</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">3</button>
                        <button className="page-btn dots">...</button>
                        <button className="page-btn">25</button>
                        <button className="page-btn">{'>'}</button>
                    </div>
                </div>
            </div>

            {/* Bottom Metrics Area */}
            <div className="bottom-metrics">
                <div className="metric-card-bottom">
                    <div className="metric-header">
                        <div className="metric-icon-circle ic-orange">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                        </div>
                        <div className="metric-badge badge-green">+4%</div>
                    </div>
                    <div className="metric-title">TOTAL SKU</div>
                    <div className="metric-value">1,284</div>
                </div>

                <div className="metric-card-bottom">
                    <div className="metric-header">
                        <div className="metric-icon-circle ic-orange">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div className="metric-badge badge-orange">Low Stock</div>
                    </div>
                    <div className="metric-title">LOW STOCK ITEMS</div>
                    <div className="metric-value">18</div>
                </div>

                <div className="metric-card-bottom">
                    <div className="metric-header">
                        <div className="metric-icon-circle ic-blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div className="metric-badge badge-gray">Monthly</div>
                    </div>
                    <div className="metric-title">INVENTORY VALUE</div>
                    <div className="metric-value">$248.5k</div>
                </div>

                <div className="metric-card-bottom">
                    <div className="metric-header">
                        <div className="metric-icon-circle ic-purple">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        </div>
                        <div className="metric-badge badge-red">Top Seller</div>
                    </div>
                    <div className="metric-title">BEST SELLING CAT</div>
                    <div className="metric-value">Sneakers</div>
                </div>
            </div>
        </div>
    );
};

export default ProductsManagement;
