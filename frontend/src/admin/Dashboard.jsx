import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [chartFilter, setChartFilter] = useState('Monthly');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading dashboard...</div>;
    
    const recentOrders = stats.recentOrders || [];

    const topSelling = [
        {
            name: 'Zenith Runner X',
            sales: '420',
            value: '$79,380',
            img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
            barWidth: '85%'
        },
        {
            name: 'Urban Glide Pro',
            sales: '315',
            value: '$45,832',
            img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&h=100&fit=crop',
            barWidth: '60%'
        },
        {
            name: 'Mountain Peak XT',
            sales: '280',
            value: '$58,800',
            img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&h=100&fit=crop',
            barWidth: '70%'
        },
        {
            name: 'Classic Suede',
            sales: '190',
            value: '$24,700',
            img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop',
            barWidth: '40%'
        }
    ];

    const monthlySales = stats.monthlySales || [];
    
    // Simple helper to generate SVG path from data
    const generatePath = (data) => {
        if (!data || data.length < 2) return "M 0 150 L 800 150";
        const maxVal = Math.max(...data.map(d => parseFloat(d.total) || 0), 1);
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * 800;
            const y = 180 - ((parseFloat(d.total) || 0) / maxVal) * 150;
            return `${x},${y}`;
        });
        return `M ${points.join(' L ')}`;
    };

    const areaPath = `${generatePath(monthlySales)} L 800 200 L 0 200 Z`;
    const linePath = generatePath(monthlySales);

    return (
        <div className="dashboard-content">
            {/* Metrics Grid */}
            <div className="metrics-grid">
                {/* Card 1 */}
                <div className="metric-card-top card-orange-c">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Total Revenue</div>
                    <div className="metric-value-top">${stats.totalRevenue.toLocaleString()}</div>
                </div>

                <div className="metric-card-top card-blue-c">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><path d="M7 8v-2a5 5 0 0 1 10 0v2"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Total Orders</div>
                    <div className="metric-value-top">{stats.totalOrders}</div>
                </div>

                <div className="metric-card-top card-purple-c">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Catalog Size</div>
                    <div className="metric-value-top">{stats.totalProducts}</div>
                </div>

                <div className="metric-card-top card-red-c">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="M5 13a10 10 0 0 1 14 0"></path><path d="M8.5 16.5a5 5 0 0 1 7 0"></path></svg>
                        </div>
                    </div>
                    <div className="metric-title-top">Low Stock</div>
                    <div className="metric-value-top">{stats.lowStockItems}</div>
                </div>
            </div>

            <div className="chart-card">
                <div className="chart-header">
                    <div className="chart-title">
                        <h3>Sales Overview</h3>
                        <p>Real-time revenue tracking from your orders database</p>
                    </div>
                </div>

                <div className="chart-placeholder">
                    <svg className="chart-svg" viewBox="0 0 800 200" preserveAspectRatio="none">
                        <path d={areaPath} fill="rgba(246, 109, 59, 0.05)" />
                        <path d={linePath} fill="none" stroke="#f66d3b" strokeWidth="4" />
                    </svg>

                    <div className="chart-axis-labels">
                        {monthlySales.length > 0 ? monthlySales.map((m, i) => (
                            <span key={i}>{m.month.split('-')[1]}</span>
                        )) : (
                            <><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span></>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="bottom-grid">
                {/* Recent Orders */}
                <div className="base-card">
                    <div className="card-header-flex">
                        <h3 className="card-title-main">Recent Orders</h3>
                        <Link to="/admin/orders" className="view-all-link">View All</Link>
                    </div>
                    <table className="recent-orders-table">
                        <thead>
                            <tr>
                                <th>ORDER ID</th>
                                <th>CUSTOMER</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="td-order-id">#ORD-{order.id}</td>
                                    <td>
                                        <div className="td-customer-flex">
                                            <div className="td-customer-name">
                                                {order.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="td-amount">${parseFloat(order.total_amount).toFixed(2)}</td>
                                    <td>
                                        <div className={`status-pill status-${order.status.toLowerCase()}`}>
                                            {order.status.toUpperCase()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top Selling */}
                <div className="base-card">
                    <div className="card-header-flex">
                        <h3 className="card-title-main">Top Selling</h3>
                    </div>
                    <div className="top-selling-list">
                        {topSelling.map((item, idx) => (
                            <div key={idx} className="top-selling-item">
                                <img src={item.img} alt="shoe" className="top-item-img" />
                                <div className="top-item-details">
                                    <div className="top-item-name">{item.name}</div>
                                    <div className="top-item-sales">{item.sales} SALES</div>
                                </div>
                                <div className="top-item-value-box">
                                    <div className="top-item-val">{item.value}</div>
                                    <div className="top-item-bar-bg">
                                        <div className="top-item-bar-fill" style={{ width: item.barWidth }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="inventory-btn">Inventory Report</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
