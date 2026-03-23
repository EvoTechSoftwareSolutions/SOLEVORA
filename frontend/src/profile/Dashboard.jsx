import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="pdb-container">
            {/* Header Section */}
            <div className="pdb-header">
                <div className="pdb-welcome-info">
                    <h2>Welcome back, Marcus!</h2>
                    <p>You have 2 items arriving soon and 1250 points to spend.</p>
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
                    <h3 className="pdb-stat-value">2,450</h3>
                    <p className="pdb-stat-change pdb-positive">
                        <span className="material-symbols-outlined pdb-trending-icon">trending_up</span>
                        +15% from last month
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
                    <h3 className="pdb-stat-value">Gold Tier</h3>
                    <p className="pdb-stat-subtitle">550 pts until Platinum</p>
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
                    <h3 className="pdb-stat-value">$1,892.40</h3>
                    <p className="pdb-stat-subtitle">Across 12 orders</p>
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
                        <div className="pdb-mini-order">
                            <div className="pdb-mini-order-img">
                                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop" alt="Order product" />
                            </div>
                            <div className="pdb-mini-order-info">
                                <h4>#ORD-28491</h4>
                                <p>Placed on Oct 12, 2023</p>
                            </div>
                            <div className="pdb-mini-order-meta">
                                <span className="pdb-mini-price">$245.00</span>
                                <span className="pdb-mini-status pdb-pill-transit">IN TRANSIT</span>
                            </div>
                        </div>
                        <div className="pdb-mini-order">
                            <div className="pdb-mini-order-img">
                                <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop" alt="Order product" />
                            </div>
                            <div className="pdb-mini-order-info">
                                <h4>#ORD-28455</h4>
                                <p>Placed on Sep 28, 2023</p>
                            </div>
                            <div className="pdb-mini-order-meta">
                                <span className="pdb-mini-price">$180.00</span>
                                <span className="pdb-mini-status pdb-pill-delivered">DELIVERED</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pdb-wishlist-section">
                    <div className="pdb-section-header">
                        <h3>Active Wishlist</h3>
                        <Link to="/profile/wishlist" className="pdb-view-link">Manage</Link>
                    </div>
                    <div className="pdb-wishlist-grid">
                        <div className="pdb-mini-wishlist-card">
                            <div className="pdb-wishlist-img-box">
                                <span className="material-symbols-outlined pdb-heart-icon">favorite_border</span>
                                <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=150&h=150&fit=crop" alt="Wishlist item" />
                            </div>
                            <div className="pdb-wishlist-info">
                                <h4>Air Max Pulse</h4>
                                <p>$160.00</p>
                            </div>
                        </div>
                        <div className="pdb-mini-wishlist-card">
                            <div className="pdb-wishlist-img-box">
                                <span className="material-symbols-outlined pdb-heart-icon">favorite_border</span>
                                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=150&h=150&fit=crop" alt="Wishlist item" />
                            </div>
                            <div className="pdb-wishlist-info">
                                <h4>Court Vision Low</h4>
                                <p>$85.00</p>
                            </div>
                        </div>
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
                            <p>marcus.s@solevora.com</p>
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
                            <p>+1 (555) 123-4567</p>
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
                            <label>DEFAULT ADDRESS</label>
                            <p>2491 Madison Ave,<br />New York, NY 10016</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
