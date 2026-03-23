import React, { useState } from 'react';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [subTab, setSubTab] = useState('All Products');

    const products = [
        {
            id: 1,
            name: 'AeroGlide Pro X1',
            variant: 'Midnight / Crimson',
            sku: 'SLV -\nRUN -\n001',
            category: 'RUNNING',
            stockPct: 82,
            stockLeft: 124,
            price: '$189.00',
            status: 'Active',
            images: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&h=100&fit=crop'
            ]
        },
        {
            id: 2,
            name: 'Urban Drift High',
            variant: 'Bone White',
            sku: 'SLV -\nCSL -\n422',
            category: 'CASUAL',
            stockPct: 12,
            stockLeft: 8,
            price: '$145.00',
            status: 'Low Stock',
            images: [
                'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop'
            ]
        },
        {
            id: 3,
            name: 'Nova Prime Retro',
            variant: 'Obsidian / Gold',
            sku: 'SLV -\nSNK -\n109',
            category: 'SNEAKERS',
            stockPct: 0,
            stockLeft: 0,
            price: '$210.00',
            status: 'Out of Stock',
            images: [
                'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=100&h=100&fit=crop'
            ]
        },
        {
            id: 4,
            name: 'Apex Cloud 7',
            variant: 'Nimbus Gray',
            sku: 'SLV -\nRUN -\n045',
            category: 'RUNNING',
            stockPct: 45,
            stockLeft: 58,
            price: '$165.00',
            status: 'Active',
            images: [
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop'
            ]
        }
    ];

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
                        {products.map(prod => {
                            let badgeClass = 'status-active';
                            if (prod.status === 'Low Stock') badgeClass = 'status-low';
                            if (prod.status === 'Out of Stock') badgeClass = 'status-out';

                            let stockColor = '#f66d3b';
                            if (prod.stockPct === 0) stockColor = '#f3f4f6';

                            return (
                                <tr key={prod.id}>
                                    <td>
                                        <div className="td-product">
                                            <div className="product-images">
                                                {prod.images.map((img, i) => (
                                                    <img key={i} src={img} alt="shoe" className="product-img" />
                                                ))}
                                            </div>
                                            <div>
                                                <div className="td-product-name">{prod.name}</div>
                                                <div className="td-product-desc">{prod.variant}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="td-sku">{prod.sku}</div></td>
                                    <td><span className="category-badge">{prod.category}</span></td>
                                    <td>
                                        <div className="stock-level-container">
                                            <div className="stock-text-row">
                                                <span className="stock-percent">{prod.stockPct}%</span>
                                                <span className="stock-left">{prod.stockLeft} left</span>
                                            </div>
                                            <div className="stock-bar-bg">
                                                <div className="stock-bar-fill" style={{ width: `${prod.stockPct}%`, backgroundColor: stockColor }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="td-price">{prod.price}</div></td>
                                    <td>
                                        <div className={`status-badge ${badgeClass}`}>
                                            <span className="status-dot"></span>
                                            {prod.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="td-actions">
                                            <button className="action-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button className="action-icon">
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
