import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryReport.css';

import { API_URL, getImageUrl } from '../config/api';

const InventoryReport = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [stockFilter, setStockFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [prodRes, catRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/inventory`),
                    axios.get(`${API_URL}/category`)
                ]);
                
                setProducts(prodRes.data);
                setFilteredProducts(prodRes.data);
                setCategories(catRes.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch inventory data:", err);
                setError("Could not load inventory data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let result = products;

        if (stockFilter === 'Low Stock') {
            result = result.filter(p => p.stock_quantity > 0 && p.stock_quantity < 20);
        } else if (stockFilter === 'Out of Stock') {
            result = result.filter(p => p.stock_quantity === 0);
        } else if (stockFilter === 'In Stock') {
            result = result.filter(p => p.stock_quantity >= 20);
        }

        if (categoryFilter !== 'All') {
            result = result.filter(p => p.category?.name === categoryFilter);
        }

        setFilteredProducts(result);
    }, [stockFilter, categoryFilter, products]);

    const handlePrint = () => {
        window.print();
    };

    const handleCSVExport = () => {
        const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
        const rows = filteredProducts.map(p => [
            p.id,
            p.name,
            p.category?.name || 'Uncategorized',
            p.price,
            p.stock_quantity,
            p.stock_quantity === 0 ? "Out of Stock" : (p.stock_quantity < 20 ? "Low Stock" : "In Stock")
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Inventory_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="inventory-report-container"><p>Generating Report...</p></div>;
    if (error) return <div className="inventory-report-container"><p className="error-msg">{error}</p></div>;

    const totalStockValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);
    const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 20).length;
    const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

    return (
        <div className="inventory-report-container">
            <div className="inventory-header">
                <div>
                    <h2>Inventory Report</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Detailed breakdown of current stock levels and valuation</p>
                </div>
                <div className="inventory-actions">
                    <button className="export-btn" style={{ backgroundColor: '#4b5563' }} onClick={handlePrint}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Print PDF
                    </button>
                    <button className="export-btn" onClick={handleCSVExport}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="inventory-stats-grid">
                <div className="inventory-stat-card">
                    <span className="stat-label">Total Unique Products</span>
                    <span className="stat-value">{products.length}</span>
                    <div className="stat-indicator bg-blue"></div>
                </div>
                <div className="inventory-stat-card">
                    <span className="stat-label">Estimated Inventory Value</span>
                    <span className="stat-value">Rs. {totalStockValue.toLocaleString()}</span>
                    <div className="stat-indicator bg-green"></div>
                </div>
                <div className="inventory-stat-card">
                    <span className="stat-label">Low Stock Items</span>
                    <span className="stat-value">{lowStockCount}</span>
                    <div className="stat-indicator bg-orange"></div>
                </div>
                <div className="inventory-stat-card">
                    <span className="stat-label">Out of Stock</span>
                    <span className="stat-value">{outOfStockCount}</span>
                    <div className="stat-indicator bg-red"></div>
                </div>
            </div>

            <div className="report-filters">
                <div className="filter-group">
                    <label>Stock Status:</label>
                    <select className="filter-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Category:</label>
                    <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="All">All Categories</option>
                        {(categories || []).map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#666' }}>
                    Showing {filteredProducts.length} items
                </div>
            </div>

            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product Details</th>
                            <th>Category</th>
                            <th>Unit Price</th>
                            <th>Stock Level</th>
                            <th>Total Value</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => {
                            let statusClass = 'badge-in-stock';
                            let statusText = 'In Stock';
                            if (product.stock_quantity === 0) {
                                statusClass = 'badge-out-of-stock';
                                statusText = 'Out of Stock';
                            } else if (product.stock_quantity < 20) {
                                statusClass = 'badge-low-stock';
                                statusText = 'Low Stock';
                            }

                            return (
                                <tr key={product.id}>
                                    <td>
                                        <div className="prod-info">
                                            <img 
                                                src={getImageUrl(product.image_url)} 
                                                alt={product.name} 
                                                className="prod-thumb" 
                                            />
                                            <div>
                                                <div className="prod-name">{product.name}</div>
                                                <div className="prod-sku">ID: #{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td>Rs. {parseFloat(product.price).toLocaleString()}</td>
                                    <td>{product.stock_quantity} Units</td>
                                    <td>Rs. {(product.price * product.stock_quantity).toLocaleString()}</td>
                                    <td>
                                        <span className={`stock-badge ${statusClass}`}>
                                            {statusText}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        No items found matching the selected filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryReport;
