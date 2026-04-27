import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryBatches.css';
import { API_URL, BASE_URL, getImageUrl } from '../config/api';

const InventoryBatches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await axios.get(`${API_URL}/products/batches`);
                setBatches(response.data);
            } catch (error) {
                console.error("Error fetching batches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();

        // Silent background refresh every 15 seconds
        const interval = setInterval(() => {
            axios.get(`${API_URL}/products/batches`)
                .then(response => {
                    setBatches(response.data);
                })
                .catch(err => console.error('Silent fetch failed', err));
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="inventory-batches-container">Loading batches...</div>;
    }

    return (
        <div className="inventory-batches-container">
            <div className="inventory-batches-header">
                <div>
                    <h1>Stock Batch Tracking</h1>
                    <p>Monitor individual stock arrivals and FIFO deduction status.</p>
                </div>
                <div className="fifo-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v10m0 0l-4-4m4 4l4-4" />
                        <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
                    </svg>
                    <span>FIFO Logic Active</span>
                </div>
            </div>

            <div className="batches-table-card">
                <table className="batches-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Batch Date</th>
                            <th>Original Qty</th>
                            <th>Current Stock</th>
                            <th>Selling Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.map((batch) => (
                            <tr key={batch.id}>
                                <td>
                                    <div className="product-info-cell">
                                        <img 
                                            src={getImageUrl(batch.product?.image_url)} 
                                            alt={batch.product?.name} 
                                            className="product-batch-img"
                                        />
                                        <span className="product-batch-name">{batch.product?.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="batch-date">{formatDate(batch.createdAt)}</span>
                                </td>
                                <td>
                                    <span className="batch-qty-main">{batch.original_quantity}</span>
                                </td>
                                <td>
                                    <div className="batch-qty-wrap">
                                        <span className="batch-qty-main">{batch.quantity}</span>
                                        <span className="batch-qty-sub">remaining</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="batch-price-tag">Rs. {parseFloat(batch.selling_price).toLocaleString()}</span>
                                </td>
                                <td>
                                    <span className={`batch-status-badge ${batch.quantity > 0 ? 'batch-status-active' : 'batch-status-exhausted'}`}>
                                        {batch.quantity > 0 ? 'ACTIVE' : 'EXHAUSTED'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {batches.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                        No stock batches found. New arrivals will appear here.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryBatches;
