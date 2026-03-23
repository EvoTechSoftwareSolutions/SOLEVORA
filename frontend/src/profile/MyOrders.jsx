import React, { useState } from 'react';
import './MyOrders.css';

const MyOrders = () => {
    const [activeTab, setActiveTab] = useState('All Orders');

    const orders = [
        {
            id: 'SV-98234',
            date: 'Oct 24, 2023',
            total: '$189.00',
            shipTo: 'Alex Johnson',
            status: 'Delivered',
            statusStyle: { color: '#059669', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
            deliveryDate: 'Delivered on Oct 27, 2023',
            productName: 'Aura Runner Pro Gen-2',
            meta: 'Size: 10.5 | Color: Ember Orange / Cloud White',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRGJi7MTzKdY_WjtTKpTbqZpNrZnc4WQo03z38DHiPrLn24M-6bUs62amTIWgDAI-mUJls-VPfuwKInq5U-hfDNgXh2TQQ9WcMg1Q6EA99uNdcoyBodZv8wMPPfwDwePUJhwnGvLq_lm7I4m5DIsb2m5mnuI8_rUCtcb4xpiRjbh127qz6OZ8d2aDtC8Jq0kOtb4xVDhAaZEWFlFdJ1O0Ns-0uHy9GCuhw06nWV9ydBynDC9wBRftNktU_aDN3-G5t3j0tK6HjJ7o",
            actions: ['Buy Again', 'View Product', 'Write Review']
        },
        {
            id: 'SV-99412',
            date: 'Nov 02, 2023',
            total: '$145.00',
            shipTo: 'Alex Johnson',
            status: 'In Transit',
            statusStyle: { color: '#2563eb', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
            deliveryDate: 'Estimated Delivery: Tomorrow by 8PM',
            productName: 'Velocit Low-Top',
            meta: 'Size: 11 | Color: Midnight Grey',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxvGV4gmOupOTDj8fRSHKBufD4PBa7HFJVVRcOKBbqvc29j83ZHh3VMvjNeE5xot6RDFsJYTf8RLy6NTtaG1r7p3-4OZru3_0AwNa5hAQnF5P_oZuPNd8e5JoMFoSASxNwzWxzB6-JFAvgiksTU5Zj1slgLMSMRrbhAIOg5425q8YIB19dHIxoNPdJzX5DZVaGDD76k4QVPEVvVEcexWh2-EflYwvJ3iG-I2dHuFiLZf7nGPd9QtwLFyjZNSBWCTRqvXuw-MgTVmU",
            actions: ['Track Order', 'View Details'],
            trackingUpdate: 'Package arrived at local carrier facility in Brooklyn, NY',
            progress: 3
        },
        {
            id: 'SV-97551',
            date: 'Sep 18, 2023',
            total: '$95.00',
            shipTo: 'Alex Johnson',
            status: 'Cancelled',
            statusStyle: { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
            deliveryDate: 'Refunded on Sep 20, 2023',
            productName: 'TrekLite Sandals',
            meta: 'Size: 11 | Color: Onyx Black',
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk98AWUIdGzja8qf5R7ohYAVuQ17_jO6ukqJtb5EfFN-tSSKlEEC7dwkRI_H0ALJhS7E5QyqXZmiWPOHdcJEwMBRYw6UXVla3YgC-RJx_DWqw_1ZprRIgJEp6Nz-wP-zbZ_PU34rzCmOJvNPdfjGD0sPCpnnRBDYS892SIwPJupLnvWKCe9Koy70a-4CH-Ds5LWTDrgdDcDM9JwRWV6wTMjD7ryVUu6OVr27dKygETJfPmAGuMLmMhAl0wASHWH8sRpJXzWigz7k0",
            actions: ['Reorder', 'Cancellation Help']
        }
    ];

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
                {orders.map(order => (
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
                                <p className="mo-order-id">Order # {order.id}</p>
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
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tracking Update Column */}
                            {order.trackingUpdate && (
                                <div className="mo-tracking-col">
                                    <p className="mo-tracking-label">Last Update</p>
                                    <p className="mo-tracking-text">{order.trackingUpdate}</p>
                                    <div className="mo-progress-bar">
                                        {[1, 2, 3, 4].map(step => (
                                            <div key={step} className={`mo-progress-step ${step <= (order.progress || 0) ? 'completed' : ''}`}></div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
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
