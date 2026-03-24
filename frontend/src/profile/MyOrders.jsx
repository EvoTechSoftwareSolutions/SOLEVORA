import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All Orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { checkoutData } = useCart();
    
    // In a real app, we'd use the logged-in user's email.
    const userEmail = checkoutData.email || 'user@example.com'; 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/user/${userEmail}`);
                
                const formattedOrders = response.data.map(ord => ({
                    id: ord.id,
                    date: new Date(ord.created_at).toLocaleDateString(),
                    total: `$${ord.total_amount}`,
                    shipTo: ord.full_name,
                    status: ord.status.charAt(0).toUpperCase() + ord.status.slice(1),
                    statusStyle: getStatusStyle(ord.status),
                    deliveryDate: ord.status === 'delivered' ? 'Delivered' : 'Processing',
                    productName: ord.items[0]?.name || 'Product',
                    meta: `Items: ${ord.items.length}`,
                    image: ord.items[0]?.image_url || "https://placeholder.com",
                    actions: ['Track Order', 'View Details']
                }));

                setOrders(formattedOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userEmail]);

    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
            case 'pending': return { color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' };
            case 'delivered': return { color: '#059669', backgroundColor: 'rgba(16, 185, 129, 0.1)' };
            case 'shipped': return { color: '#2563eb', backgroundColor: 'rgba(59, 130, 246, 0.1)' };
            case 'cancelled': return { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' };
            default: return { color: '#666', backgroundColor: '#eee' };
        }
    };

    const tabs = ['All Orders', 'In Transit', 'Completed', 'Cancelled', 'Processing'];

    return (
        <div className="mo-container">
            {/* Header */}
            <header className="mo-header">
                <div className="mo-title-section">
                    <h2>My Orders</h2>
                    <p>Manage your recent purchases and track your active shipments.</p>
                </div>
                
                <div className="mo-search-box">
                    <span className="material-symbols-outlined mo-search-icon">search</span>
                    <input className="mo-search-input" placeholder="Find an order..." type="text" />
                </div>
            </header>

            {/* Tabs */}
            <div className="mo-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`mo-tab-btn ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab}
                        {activeTab === tab && <div className="mo-tab-indicator"></div>}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="mo-list">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>No orders found for this account. ({userEmail})</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="mo-card">
                            {/* Order Header */}
                            <div className="mo-card-header">
                                <div className="mo-meta-group">
                                    <div className="mo-meta-item">
                                        <p>Order Placed</p>
                                        <p>{order.date}</p>
                                    </div>
                                    <div className="mo-meta-item">
                                        <p>Total</p>
                                        <p className="mo-total-val">{order.total}</p>
                                    </div>
                                    <div className="mo-meta-item">
                                        <p>Ship To</p>
                                        <p className="mo-ship-to-link">{order.shipTo}</p>
                                    </div>
                                </div>
                                <div className="mo-order-number-group">
                                    <p className="mo-order-id">Order # ORD-{order.id}</p>
                                    <button className="mo-invoice-btn">View Invoice</button>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className="mo-card-body">
                                <div className="mo-item-img-box">
                                    <img src={order.image} alt={order.productName} />
                                </div>
                                <div className="mo-item-main-info">
                                    <div className="mo-status-row">
                                        <span className="mo-status-pill" style={order.statusStyle}>
                                            {order.status}
                                        </span>
                                        <span className="mo-delivery-info">{order.deliveryDate}</span>
                                    </div>
                                    <h3 className="mo-item-name">{order.productName}</h3>
                                    <p className="mo-item-meta">{order.meta}</p>
                                    
                                    <div className="mo-action-buttons">
                                        {order.actions.map((action, idx) => (
                                            <button 
                                                key={idx} 
                                                className={idx === 0 ? "mo-btn-primary" : "mo-btn-secondary"}
                                                onClick={() => {
                                                    if (action === 'Track Order') {
                                                        navigate('/track-order');
                                                    }
                                                }}
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="mo-pagination">
                <button className="mo-page-arrow">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {[1, 2, 3].map(page => (
                    <button 
                        key={page} 
                        className={`mo-page-btn ${page === 1 ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button className="mo-page-arrow">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default MyOrders;
