import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css';
import { API_URL } from '../config/api';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/stats`);
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics stats:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // 5 second refresh as per request
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', fontSize: '18px', color: '#666' }}>Analyzing data streams...</div>;
    if (!stats) return <div style={{ padding: '100px', textAlign: 'center' }}>Unable to retrieve analytics.</div>;

    const topPerforming = Array.isArray(stats.topProducts) ? stats.topProducts : [];
    const salesByCategory = stats.salesByCategory || [];

    // Calculate max values for bar chart scaling
    const maxCatRevenue = salesByCategory.length > 0 ? Math.max(...salesByCategory.map(c => Number(c.revenue))) : 1;

    return (
        <div className="dashboard-content">
            {/* page header */}
            <div className="page-header" style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111', letterSpacing: '-0.5px' }}>Analytics Deep-Dive</h1>
                <p style={{ fontSize: '15px', color: '#666', marginTop: '6px' }}>Advanced business intelligence and revenue distribution analysis.</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="metrics-grid-analytics">
                <div className="metric-card-top card-orange-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Gross Revenue</div>
                    <div className="metric-value-top">Rs. {(Number(stats.totalRevenue) || 0).toLocaleString()}</div>
                    <div className="metric-sub-top">Across {stats.totalOrders} total orders</div>
                </div>

                <div className="metric-card-top card-blue-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Average Order Value</div>
                    <div className="metric-value-top">Rs. {(Number(stats.averageOrderValue) || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    <div className="metric-sub-top">Average spend per customer</div>
                </div>

                <div className="metric-card-top card-purple-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Market Reach</div>
                    <div className="metric-value-top">{salesByCategory.length}</div>
                    <div className="metric-sub-top">Active product categories</div>
                </div>

                <div className="metric-card-top card-green-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Customer Base</div>
                    <div className="metric-value-top">{stats.totalOrders > 0 ? (stats.totalOrders * 0.8).toFixed(0) : 0}</div>
                    <div className="metric-sub-top">Estimated unique buyers</div>
                </div>
            </div>

            <div className="deep-dive-grid">
                {/* Sales by Category (Visual Bars) */}
                <div className="base-card analytics-main-card">
                    <h3 className="card-title-main">Revenue by Category</h3>
                    <div className="category-bars-container">
                        {salesByCategory.map((cat, idx) => {
                            const percentage = (Number(cat.revenue) / maxCatRevenue) * 100;
                            return (
                                <div key={idx} className="category-bar-row">
                                    <div className="category-bar-info">
                                        <span className="cat-bar-name">{cat.category}</span>
                                        <span className="cat-bar-val">Rs. {Number(cat.revenue).toLocaleString()}</span>
                                    </div>
                                    <div className="cat-bar-bg">
                                        <div className="cat-bar-fill" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                        {salesByCategory.length === 0 && <p className="empty-text">No category data available yet.</p>}
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="base-card analytics-main-card">
                    <h3 className="card-title-main">Top Performing Products</h3>
                    <div className="top-products-mini-list">
                        <table className="analytics-mini-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>UNITS</th>
                                    <th>REVENUE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topPerforming.map((item, idx) => {
                                    const name = item.productName ?? item.name ?? '—';
                                    const units = item._sum?.quantity ?? item.sales ?? 0;
                                    const revenue = item._sum?.sellingPrice ?? item.value ?? 0;
                                    return (
                                    <tr key={idx}>
                                        <td className="td-p-name">{name}</td>
                                        <td>{units}</td>
                                        <td className="td-p-rev">Rs. {Number(revenue).toLocaleString()}</td>
                                    </tr>
                                    );
                                })}
                                {topPerforming.length === 0 && <tr><td colSpan="3" className="empty-text">No sales data recorded.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="footer-text" style={{ marginTop: '40px', textAlign: 'center', opacity: '0.6' }}>
                © 2026 SoleVora Admin Analytics. Data updates every 5 seconds.
            </div>
        </div>
    );
};

export default Analytics;
