import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/user/TrackOrder.css';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrderInfo(null);

        try {
            // First we get all orders for the user since backend doesn't have a direct "get order by id AND email"
            // Wait, we have getOrdersByEmail. Let's fetch and filter.
            const response = await axios.get(`http://localhost:5000/api/orders/search?email=${email}`);
            
            // Clean up the searched ID (remove # or ORD- prefix if user typed it)
            const cleanId = orderId.replace(/[^0-9]/g, '');
            
            const foundOrder = response.data.find(o => o.id.toString() === cleanId);

            if (foundOrder) {
                setOrderInfo(foundOrder);
            } else {
                setError('No matching order found for the provided details. Please check your Order ID and Email.');
            }

        } catch (err) {
            console.error("Error tracking order:", err);
            setError('There was an error retrieving your tracking information. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getProgressStatus = (status) => {
        const statuses = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = statuses.indexOf(status.toLowerCase());
        return Math.max(0, currentIndex);
    };

    return (
        <div className="track-order-page">
            <div className="track-container">
                <div className="track-header">
                    <h1>Track Your Order</h1>
                    <p>Enter your order details below to see the latest progress on your shipment.</p>
                </div>

                <div className="track-form-card">
                    <form onSubmit={handleTrack} className="track-form">
                        <div className="form-group">
                            <label>Order Number</label>
                            <input 
                                type="text" 
                                placeholder="e.g. ORD-123 or 123" 
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="Email used during checkout" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="track-btn" disabled={loading}>
                            {loading ? 'TRACKING...' : 'TRACK ORDER'}
                        </button>
                    </form>
                    {error && <div className="track-error"><span className="material-symbols-outlined">error</span> {error}</div>}
                </div>

                {orderInfo && (
                    <div className="tracking-results-card fade-in">
                        <div className="results-header">
                            <div>
                                <h2>Order #ORD-{orderInfo.id}</h2>
                                <p className="order-date">Placed on {new Date(orderInfo.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className={`status-badge ${orderInfo.status.toLowerCase()}`}>
                                {orderInfo.status.toUpperCase()}
                            </div>
                        </div>

                        <div className="tracking-stepper">
                            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                const progress = getProgressStatus(orderInfo.status);
                                const isCompleted = index <= progress;
                                const isActive = index === progress;
                                
                                return (
                                    <div key={index} className={`stepper-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                        <div className="step-point"></div>
                                        <div className="step-label">{step}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="order-contents">
                            <h3>Order Items</h3>
                            <div className="items-list">
                                {orderInfo.items.map((item, idx) => (
                                    <div key={idx} className="tracking-item">
                                        <div className="item-image-wrap">
                                            <img src={item.product?.image_url} alt={item.product?.name} />
                                        </div>
                                        <div className="item-details">
                                            <h4>{item.product?.name}</h4>
                                            <p>Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">
                                            ${((item.price_at_purchase || item.product?.price || 0) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="shipping-details-box">
                            <div>
                                <h4>Shipping To</h4>
                                <p>{orderInfo.email}</p>
                                <p>{orderInfo.shipping_address}</p>
                                {orderInfo.tracking_number && (
                                    <div className="external-tracking-info" style={{ marginTop: '15px', borderTop: '1px dashed #ddd', paddingTop: '10px' }}>
                                        <p><strong>Carrier:</strong> {orderInfo.carrier}</p>
                                        <p><strong>Tracking #:</strong> {orderInfo.tracking_number}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4>Total Paid</h4>
                                <p className="total-amount">${parseFloat(orderInfo.total_amount).toFixed(2)}</p>
                                {orderInfo.tracking_number && (
                                    <a 
                                        href={`https://www.google.com/search?q=${orderInfo.carrier}+tracking+${orderInfo.tracking_number}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="track-package-btn"
                                        style={{ 
                                            display: 'inline-block', 
                                            marginTop: '10px', 
                                            padding: '8px 16px', 
                                            background: '#1a1a1a', 
                                            color: '#fff', 
                                            textDecoration: 'none', 
                                            borderRadius: '8px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '700' 
                                        }}
                                    >
                                        Track Package
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
