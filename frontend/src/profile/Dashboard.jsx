import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Dashboard.css';

const Dashboard = () => {
    const { checkoutData } = useCart();
    const { wishlist } = useWishlist();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Get logged-in user
    const getLoggedInUser = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return { name: checkoutData.fullName || 'Valued Customer', email: checkoutData.email };
    };
    
    const user = getLoggedInUser();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user.email) return;
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/search?email=${user.email}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user.email]);

    const userName = user.name;
    const recentOrders = orders.slice(0, 3);
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'pdb-pill-pending';
            case 'shipped':
            case 'in transit':
                return 'pdb-pill-transit';
            case 'delivered':
                return 'pdb-pill-delivered';
            case 'cancelled':
                return 'pdb-pill-cancelled';
            default:
                return '';
        }
    };

    const getMembershipTier = (count) => {
        if (count >= 10) return "Platinum";
        if (count >= 5) return "Gold";
        if (count >= 1) return "Silver";
        return "Bronze";
    };

    const nextTierInfo = (count) => {
        if (count >= 10) return "Max Tier";
        if (count >= 5) return `${10 - count} orders until Platinum`;
        if (count >= 1) return `${5 - count} orders until Gold`;
        return "1 order until Silver";
    };

    return (
        <div className="pdb-container">
            {/* Header Section */}
            <div className="pdb-header">
                <div className="pdb-welcome-info">
                    <h2>Welcome back, {userName}!</h2>
                    <p>You have {orders.length} orders in your history.</p>
                </div>
                <button className="pdb-upgrade-btn">
                    <span className="material-symbols-outlined pdb-upgrade-icon">rocket_launch</span>
                    Upgrade Plan
                </button>
            </div>

            {/* Stats Grid */}
            <div className="pdb-stats-grid">
                {/* Points Card */}
                <div className="pdb-stat-card">
                    <div className="pdb-stat-bg-icon">
                        <span className="material-symbols-outlined">pentagon</span>
                    </div>
                    <div className="pdb-stat-header">
                        <p>Solevora Points</p>
                        <span className="material-symbols-outlined pdb-icon-color">pentagon</span>
                    </div>
                    <h3 className="pdb-stat-value">{orders.length * 100}</h3>
                    <p className="pdb-stat-change pdb-positive">
                        <span className="material-symbols-outlined pdb-trending-icon">trending_up</span>
                        Earned from {orders.length} purchases
                    </p>
                </div>

                {/* Membership Card */}
                <div className="pdb-stat-card">
                    <div className="pdb-stat-bg-icon">
                        <span className="material-symbols-outlined">stars</span>
                    </div>
                    <div className="pdb-stat-header">
                        <p>Membership</p>
                        <span className="material-symbols-outlined pdb-icon-color">stars</span>
                    </div>
                    <h3 className="pdb-stat-value">{getMembershipTier(orders.length)} Tier</h3>
                    <p className="pdb-stat-subtitle">{nextTierInfo(orders.length)}</p>
                </div>

                {/* Total Spent Card */}
                <div className="pdb-stat-card">
                    <div className="pdb-stat-bg-icon">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <div className="pdb-stat-header">
                        <p>Total Spent</p>
                        <span className="material-symbols-outlined pdb-icon-color">account_balance_wallet</span>
                    </div>
                    <h3 className="pdb-stat-value">${totalSpent.toFixed(2)}</h3>
                    <p className="pdb-stat-subtitle">Across {orders.length} orders</p>
                </div>
            </div>

            {/* Middle Section: Recent Orders & Wishlist */}
            <div className="pdb-middle">
                <div className="pdb-recent-orders">
                    <div className="pdb-section-header">
                        <h3>Recent Orders</h3>
                        <Link to="/profile/orders" className="pdb-view-link">View All</Link>
                    </div>
                    <div className="pdb-orders-list">
                        {loading ? (
                            <p>Loading your orders...</p>
                        ) : recentOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p>No orders found for your account.</p>
                                <Link to="/category" className="pdb-view-link">Start Shopping</Link>
                            </div>
                        ) : recentOrders.map(order => {
                            const firstItem = order.items && order.items[0];
                            const product = firstItem?.product;
                            const imageUrl = product?.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop";

                            return (
                                <div className="pdb-mini-order" key={order.id}>
                                    <div className="pdb-mini-order-img">
                                        <img src={imageUrl} alt="Order product" />
                                    </div>
                                    <div className="pdb-mini-order-info">
                                        <h4>#ORD-{order.id}</h4>
                                        <p>Placed on {formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="pdb-mini-order-meta">
                                        <span className="pdb-mini-price">${parseFloat(order.total_amount).toFixed(2)}</span>
                                        <span className={`pdb-mini-status ${getStatusClass(order.status)}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pdb-wishlist-section">
                    <div className="pdb-section-header">
                        <h3>Active Wishlist</h3>
                        <Link to="/profile/wishlist" className="pdb-view-link">Manage</Link>
                    </div>
                    <div className="pdb-wishlist-grid">
                        {wishlist.length === 0 ? (
                            <p style={{ padding: '10px' }}>Your wishlist is empty.</p>
                        ) : wishlist.slice(0, 2).map((item) => (
                            <div key={item.id} className="pdb-mini-wishlist-card">
                                <div className="pdb-wishlist-img-box">
                                    <span className="material-symbols-outlined pdb-heart-icon">favorite_border</span>
                                    <img src={item.image_url} alt={item.name} />
                                </div>
                                <div className="pdb-wishlist-info">
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile Overview Section */}
            <div className="pdb-overview-section">
                <h3>Profile Overview</h3>
                <div className="pdb-overview-cards">
                    <div className="pdb-overview-card">
                        <div className="pdb-overview-card-header">
                            <div className="pdb-overview-icon">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <Link to="/profile/account" className="pdb-edit-link">EDIT</Link>
                        </div>
                        <div className="pdb-overview-card-info">
                            <label>EMAIL ADDRESS</label>
                            <p>{user.email || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="pdb-overview-card">
                        <div className="pdb-overview-card-header">
                            <div className="pdb-overview-icon">
                                <span className="material-symbols-outlined">call</span>
                            </div>
                            <Link to="/profile/account" className="pdb-edit-link">EDIT</Link>
                        </div>
                        <div className="pdb-overview-card-info">
                            <label>PHONE NUMBER</label>
                            <p>{user.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="pdb-overview-card">
                        <div className="pdb-overview-card-header">
                            <div className="pdb-overview-icon">
                                <span className="material-symbols-outlined">home</span>
                            </div>
                            <Link to="/profile/addresses" className="pdb-edit-link">EDIT</Link>
                        </div>
                        <div className="pdb-overview-card-info">
                            <label>LOCATION</label>
                            <p>{user.location || 'No location saved'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;