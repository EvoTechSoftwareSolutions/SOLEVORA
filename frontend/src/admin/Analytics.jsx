import React, { useState } from 'react';
import './Analytics.css';

const Analytics = () => {

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
        },
        {
            name: 'Heritage Classics',
            units: '850',
            revenue: '$93,500',
            growth: '-2%',
            img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&h=100&fit=crop',
            positive: false
        }
    ];

    const regions = [
        {
            code: 'US',
            name: 'North America',
            transactions: '420 Transactions',
            amount: '$425,000',
            change: '+15%',
            positive: true
        },
        {
            code: 'EU',
            name: 'Europe',
            transactions: '310 Transactions',
            amount: '$318,000',
            change: '+8.2%',
            positive: true
        },
        {
            code: 'AS',
            name: 'Asia Pacific',
            transactions: '280 Transactions',
            amount: '$294,000',
            change: '-2.4%',
            positive: false
        }
    ];

    return (
        <div className="dashboard-content">

            <div className="page-header" style={{ marginBottom: '25px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>Analytics Deep-Dive</h1>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Review real-time performance metrics and business intelligence.</p>
            </div>

            {/* Top Stats Metric Line */}
            <div className="metrics-grid-analytics">

                {/* Box 1 */}
                <div className="metric-card-top card-orange-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        </div>
                        <div className="trend-badge trend-up">+12.5%</div>
                    </div>
                    <div className="metric-title-top">Total Revenue</div>
                    <div className="metric-value-top">$1,284,500</div>
                </div>

                {/* Box 2 */}
                <div className="metric-card-top card-blue-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        </div>
                        <div className="trend-badge trend-up">+0.8%</div>
                    </div>
                    <div className="metric-title-top">Conversion Rate</div>
                    <div className="metric-value-top">3.45%</div>
                </div>

                {/* Box 3 */}
                <div className="metric-card-top card-purple-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        </div>
                        <div className="trend-badge trend-down">-2.1%</div>
                    </div>
                    <div className="metric-title-top">Avg. Order Value</div>
                    <div className="metric-value-top">$142.00</div>
                </div>

                {/* Box 4 */}
                <div className="metric-card-top card-green-a">
                    <div className="card-top-row">
                        <div className="top-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                        </div>
                        <div className="trend-badge trend-up">+4.2%</div>
                    </div>
                    <div className="metric-title-top">Bounce Rate</div>
                    <div className="metric-value-top">42.1%</div>
                </div>
            </div>

            {/* Chart Dual Box Area */}
            <div className="charts-grid">

                {/* Left Side Wide Chart */}
                <div className="analytics-card">
                    <div className="card-header-flex-analytics">
                        <div>
                            <div className="analytics-card-title">Revenue vs. Target</div>
                            <div className="analytics-card-subtitle">Monthly performance compared to goals</div>
                        </div>
                        <button className="btn-filter">Last 12 Months</button>
                    </div>

                    <div className="chart-container">
                        <svg className="chart-svg-main" viewBox="0 0 600 200" preserveAspectRatio="none">
                            {/* Dotted Target Line */}
                            <line x1="0" y1="120" x2="600" y2="120" stroke="#dbeafe" strokeWidth="1.5" strokeDasharray="5,5" />

                            {/* Orange Curve Mimicking Screenshot Data */}
                            <path d="M 0 130 C 80 120, 100 20, 200 40 C 250 80, 260 85, 300 75 C 340 90, 360 85, 400 30 C 450 40, 500 20, 600 0"
                                fill="none" stroke="#f66d3b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <div className="y-axis-labels">
                            <span>$200k</span>
                            <span>$150k</span>
                            <span>$100k</span>
                            <span>$50k</span>
                            <span>0</span>
                        </div>
                        <div className="x-axis-labels">
                            <span>JAN</span>
                            <span>MAR</span>
                            <span>MAY</span>
                            <span>JUL</span>
                            <span>SEP</span>
                            <span>NOV</span>
                            <span style={{ visibility: 'hidden' }}>DEC</span> 
                        </div>
                    </div>
                </div>

                {/* Right Side Donut Chart */}
                <div className="analytics-card">
                    <div className="analytics-card-title">Sales by Category</div> <br />
                    <div className="donut-container">
                        <div className="donut-svg">
                            <svg viewBox="0 0 36 36" width="100%" height="100%">
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#f3f4f6" strokeWidth="4"></circle>
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#16a34a" strokeWidth="4" strokeDasharray="100 100"></circle>
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#f66d3b" strokeWidth="4" strokeDasharray="45 100" strokeDashoffset="-25"></circle>
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-70"></circle>
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-100"></circle>
                            </svg>
                            <div className="donut-inner-text">
                                <div className="donut-val">2,840</div>
                                <div className="donut-sub">Total Sales</div>
                            </div>
                        </div>

                        <div className="donut-legend">
                            <div className="legend-item"><div className="legend-dot" style={{ backgroundColor: '#f66d3b' }}></div> Sneakers (45%)</div>
                            <div className="legend-item"><div className="legend-dot" style={{ backgroundColor: '#3b82f6' }}></div> Running (30%)</div>
                            <div className="legend-item"><div className="legend-dot" style={{ backgroundColor: '#a855f7' }}></div> Casual (15%)</div>
                            <div className="legend-item"><div className="legend-dot" style={{ backgroundColor: '#16a34a' }}></div> Formal (10%)</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Secondary Row  */}
            <div className="secondary-grid">

                {/* Customer Acquisition Box */}
                <div className="analytics-card">
                    <div className="analytics-card-title">Customer Acquisition</div><br />

                    <div className="bar-row">
                        <div className="bar-label-flex">
                            <span>New Customers</span>
                            <span>65%</span>
                        </div>
                        <div className="bar-bg">
                            <div className="bar-fill-orange" style={{ width: '65%' }}></div>
                        </div>
                    </div>

                    <div className="bar-row">
                        <div className="bar-label-flex">
                            <span>Returning Customers</span>
                            <span>35%</span>
                        </div>
                        <div className="bar-bg">
                            <div className="bar-fill-blue" style={{ width: '35%' }}></div>
                        </div>
                    </div>

                    <div className="insight-box">
                        <div className="insight-text">
                            <strong>Retention Insight:</strong> Returning customers spend an average of 1.4x more per transaction than new users.
                        </div>
                    </div>
                </div>

                {/* Top Products Box */}
                <div className="analytics-card-beige">
                    <div className="card-header-flex-analytics">
                        <div className="analytics-card-title">Top Performing Products</div>
                        <button className="view-all-orange">View All</button>
                    </div>

                    <table className="performing-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Units Sold</th>
                                <th>Revenue</th>
                                <th>Growth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPerforming.map((prod, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="td-flex-prod">
                                            <img src={prod.img} alt={prod.name} />
                                            <span className="td-prod-name">{prod.name}</span>
                                        </div>
                                    </td>
                                    <td><span className="td-units">{prod.units}</span></td>
                                    <td><span className="td-rev">{prod.revenue}</span></td>
                                    <td><span className={prod.positive ? "growth-pos" : "growth-neg"}>{prod.growth}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Full Row Box */}
            <div className="analytics-card-beige">
                <div className="card-header-flex-analytics">
                    <div>
                        <div className="analytics-card-title">Geographic Sales Performance</div>
                        <div className="analytics-card-subtitle" style={{ marginBottom: 0 }}>Distribution of revenue by global regions</div>
                    </div>
                    <button className="btn-filter" style={{ backgroundColor: '#fff' }}>Manage Regions</button>
                </div>

                <div className="geo-flex">
                    <div className="map-container">
                        <svg width="120" height="120" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" className="globe-circle" fill="#9ca3af" />
                            <path d="M 20 40 Q 30 10 60 20 Q 80 40 70 60 Q 50 90 30 70 Z" className="globe-path" fill="#f3f4f6" />
                            <circle cx="55" cy="45" r="4" className="globe-dot active" />
                            <circle cx="35" cy="55" r="3" className="globe-dot" />
                        </svg>
                    </div>

                    <div className="region-list">
                        {regions.map((reg, i) => (
                            <div className="region-item" key={i}>
                                <div className="region-badge">{reg.code}</div>
                                <div className="region-info">
                                    <div className="region-name">{reg.name}</div>
                                    <div className="region-trans">{reg.transactions}</div>
                                </div>
                                <div className="region-value-box">
                                    <div className="region-amount">{reg.amount}</div>
                                    <div className={reg.positive ? "growth-pos" : "growth-neg"}>{reg.change}</div>
                                </div>
                            </div>
                        ))}

                        <button className="btn-dark">View Full Geographic Report</button>
                    </div>
                </div>
            </div>

            <div className="footer-text">
                © 2026 Solevora Admin Dashboard. Powered by Enterprise Intelligence Systems.
            </div>
        </div>
    );
};

export default Analytics;
