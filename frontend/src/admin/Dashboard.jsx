import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { API_URL } from '../config/api';

const BASE_URL = "http://localhost:5001";
const getImgUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url.replace(/\\/g, '/')}`;
};

/* ─── Sales Chart Sub-Component ─── */
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const SalesChart = ({ monthlySales = [], totalRevenue = 0, totalOrders = 0 }) => {
    const [period, setPeriod] = useState('all');
    const [tooltip, setTooltip] = useState(null);

    const filtered = period === '3m' ? monthlySales.slice(-3)
        : period === '6m' ? monthlySales.slice(-6)
        : monthlySales;

    const W = 760, H = 180, PAD_L = 0, PAD_R = 0, PAD_T = 10, PAD_B = 0;
    const vals = filtered.map(d => Number(d.total) || 0);
    const maxVal = Math.max(...vals, 1);
    const minVal = 0;

    const toX = (i) => filtered.length < 2 ? W / 2 : PAD_L + (i / (filtered.length - 1)) * (W - PAD_L - PAD_R);
    const toY = (v) => PAD_T + (1 - (v - minVal) / (maxVal - minVal)) * (H - PAD_T - PAD_B);

    const points = filtered.map((d, i) => ({ x: toX(i), y: toY(Number(d.total) || 0), ...d }));

    const linePath = points.length > 1
        ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
        : `M 0 ${H / 2} L ${W} ${H / 2}`;

    const areaPath = points.length > 1
        ? `${linePath} L ${points[points.length-1].x},${H} L ${points[0].x},${H} Z`
        : '';

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => maxVal * r);

    const peakMonth = filtered.reduce((best, d) => Number(d.total) > Number(best?.total || 0) ? d : best, filtered[0]);
    const avgRevenue = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;

    const fmtMonth = (str) => {
        if (!str) return '';
        const [y, m] = str.split('-');
        return `${MONTH_NAMES[parseInt(m,10)-1] || m} '${y?.slice(2)}`;
    };

    return (
        <div className="sc-card">
            {/* Header */}
            <div className="sc-header">
                <div>
                    <h3 className="sc-title">Sales Overview</h3>
                    <p className="sc-sub">Real-time revenue tracking from your orders database</p>
                </div>
                <div className="sc-period-btns">
                    {[['all','All'],['6m','6M'],['3m','3M']].map(([k,l]) => (
                        <button key={k} className={`sc-period-btn ${period === k ? 'active' : ''}`} onClick={() => setPeriod(k)}>{l}</button>
                    ))}
                </div>
            </div>

            {/* KPI Strip */}
            <div className="sc-kpis">
                <div className="sc-kpi">
                    <span className="sc-kpi-label">Total Revenue</span>
                    <span className="sc-kpi-value">Rs. {Number(totalRevenue).toLocaleString()}</span>
                </div>
                <div className="sc-kpi-divider" />
                <div className="sc-kpi">
                    <span className="sc-kpi-label">Avg / Month</span>
                    <span className="sc-kpi-value">Rs. {Math.round(avgRevenue).toLocaleString()}</span>
                </div>
                <div className="sc-kpi-divider" />
                <div className="sc-kpi">
                    <span className="sc-kpi-label">Peak Month</span>
                    <span className="sc-kpi-value sc-kpi-peak">{peakMonth ? fmtMonth(peakMonth.month) : '—'}</span>
                </div>
                <div className="sc-kpi-divider" />
                <div className="sc-kpi">
                    <span className="sc-kpi-label">Total Orders</span>
                    <span className="sc-kpi-value">{totalOrders}</span>
                </div>
            </div>

            {/* Chart */}
            <div className="sc-chart-wrap" onMouseLeave={() => setTooltip(null)}>
                {filtered.length === 0 ? (
                    <div className="sc-empty">No sales data for this period yet.</div>
                ) : (
                    <svg viewBox={`-60 0 ${W + 80} ${H + 40}`} className="sc-svg" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="scGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f66d3b" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="#f66d3b" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Gridlines + Y-axis labels */}
                        {yTicks.map((v, i) => {
                            const y = toY(v);
                            return (
                                <g key={i}>
                                    <line x1={0} y1={y} x2={W} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                                    <text x={-8} y={y + 4} textAnchor="end" fontSize="9" fill="#bbb" fontFamily="Inter,sans-serif">
                                        {v >= 1000 ? `${(v/1000).toFixed(0)}k` : Math.round(v)}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area fill */}
                        {areaPath && <path d={areaPath} fill="url(#scGrad)" />}

                        {/* Line */}
                        <path d={linePath} fill="none" stroke="#f66d3b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

                        {/* Data points + tooltip triggers */}
                        {points.map((p, i) => (
                            <g key={i} onMouseEnter={() => setTooltip(p)} style={{ cursor: 'pointer' }}>
                                <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
                                <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#f66d3b" strokeWidth="2" />
                            </g>
                        ))}

                        {/* X-axis labels */}
                        {points.map((p, i) => (
                            <text key={i} x={p.x} y={H + 28} textAnchor="middle" fontSize="9" fill="#aaa" fontFamily="Inter,sans-serif">
                                {fmtMonth(p.month)}
                            </text>
                        ))}
                    </svg>
                )}

                {/* Tooltip */}
                {tooltip && (
                    <div className="sc-tooltip">
                        <div className="sc-tooltip-month">{fmtMonth(tooltip.month)}</div>
                        <div className="sc-tooltip-val">Rs. {Number(tooltip.total).toLocaleString()}</div>
                    </div>
                )}
            </div>
        </div>
    );
};


const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // get dashboard stats from backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use relative path since baseURL is set in AdminAuthContext
                const response = await axios.get('/admin/stats');
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('CRITICAL: Dashboard stats fetch failed:', error.response?.status, error.message);
                setLoading(false);
            }
        };
        fetchStats();

        // Silent background refresh every 3 seconds
        const interval = setInterval(() => {
            axios.get('/admin/stats')
                .then(response => {
                    setStats(response.data);
                })
                .catch(err => console.error('Silent stats fetch failed:', err.response?.status, err.message));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // simple loading UI
    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading dashboard...</div>;
    if (!stats) return <div style={{ padding: '50px', textAlign: 'center' }}>Error loading dashboard data. Please try again later.</div>;

    // fallback if no orders
    const recentOrders = stats.recentOrders || [];
    const monthlySales = stats.monthlySales || [];

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
                    <div className="metric-value-top">Rs. {(Number(stats.totalRevenue) || 0).toLocaleString()}</div>
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

            {/* ── Sales Overview Chart ── */}
            <SalesChart monthlySales={monthlySales} totalRevenue={stats.totalRevenue} totalOrders={stats.totalOrders} />


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
                                    <td className="td-amount">Rs. {(Number(order.totalAmount) || 0).toLocaleString()}</td>
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
                        {(stats.topProducts || []).map((item, idx) => (
                            <div key={idx} className="top-selling-item">
                                <img src={getImgUrl(item.img)} alt="shoe" className="top-item-img" />
                                <div className="top-item-details">
                                    <div className="top-item-name">{item.name}</div>
                                    <div className="top-item-sales">{item.sales} SALES</div>
                                </div>
                                <div className="top-item-value-box">
                                    <div className="top-item-val">Rs. {(Number(item.value) || 0).toLocaleString()}</div>
                                    <div className="top-item-bar-bg">
                                        <div className="top-item-bar-fill" style={{ width: `${Math.min(100, (item.sales / 50) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/inventory-report">
                        <button className="inventory-btn">Inventory Report</button>
                    </Link>
                </div>

                {/* Live Promotions */}
                <div className="base-card">
                    <div className="card-header-flex">
                        <h3 className="card-title-main">Live Promotions</h3>
                        <Link to="/admin/promo-codes" className="view-all-link">Manage</Link>
                    </div>
                    <div className="dashboard-promo-list">
                        {(stats.activePromos || []).length === 0 ? (
                            <div className="empty-promo-state">No active promos currently live.</div>
                        ) : (
                            stats.activePromos.map(promo => (
                                <div key={promo.id} className="dash-promo-item">
                                    <div className="dash-promo-code">{promo.code}</div>
                                    <div className="dash-promo-info">
                                        <div className="dash-promo-discount">
                                            {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `Rs. ${Number(promo.discountValue).toLocaleString()}`} OFF
                                        </div>
                                        <div className="dash-promo-min">Min: Rs. {Number(promo.minOrderAmount).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
