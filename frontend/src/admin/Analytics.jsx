import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading analytics...</div>;

    const topPerforming = [
        {
            name: 'Air Max Velocity',
            units: '1,240',
            revenue: '$186,000',
            growth: '+18%',
            img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            positive: true
        },
        {
            name: 'Cloud Walker Pro',
            units: '980',
            revenue: '$142,100',
            growth: '+12%',
            img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop',
            positive: true
        }
    ];

    return (
        <div className="dashboard-content">
            {/* page header */}
            <div className="page-header" style={{ marginBottom: '25px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>Analytics Deep-Dive</h1>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Review real-time performance metrics and business intelligence.</p>
            </div>
           {/* top metrics cards */}
            <div className="metrics-grid-analytics">
                <div className="metric-card-top card-orange-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Total Revenue</div>
                    <div className="metric-value-top">${stats.totalRevenue.toLocaleString()}</div>
                </div>
                {/* total orders */}
                <div className="metric-card-top card-blue-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Total Orders</div>
                    <div className="metric-value-top">{stats.totalOrders}</div>
                </div>

                <div className="metric-card-top card-purple-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Catalog Size</div>
                    <div className="metric-value-top">{stats.totalProducts}</div>
                </div>

                <div className="metric-card-top card-green-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Low Stock</div>
                    <div className="metric-value-top">{stats.lowStockItems}</div>
                </div>
            </div>
           {/* simple chart section (static svg for now) */}
            <div className="charts-grid">
                <div className="analytics-card">
                    <div className="analytics-card-title">Revenue vs. Target</div>
                    <div className="chart-container">
                        {/* line chart using SVG */}
                        <svg className="chart-svg-main" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <path d="M 0 130 C 80 120, 100 20, 200 40 C 250 80, 260 85, 300 75 C 340 90, 360 85, 400 30 C 450 40, 500 20, 600 0"
                                fill="none" stroke="#f66d3b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
            {/* footer */}
            <div className="footer-text">
                © 2026 SoleVora Admin Dashboard. Powered by Enterprise Intelligence Systems.
            </div>
        </div>
    );
};

export default Analytics;
