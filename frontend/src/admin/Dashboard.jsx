import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [chartFilter, setChartFilter] = useState('Monthly');

    const recentOrders = [
        {
            id: '#ORD-9421',
            customerName: 'Alex\nRivera',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            product: 'Zenith\nRunner X',
            amount: '$189.00',
            status: 'COMPLETED'
        },
        {
            id: '#ORD-9420',
            customerName: 'Sarah\nJenkins',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            product: 'Urban\nGlide Pro',
            amount: '$145.50',
            status: 'PROCESSING'
        },
        {
            id: '#ORD-9419',
            customerName: 'James\nWilson',
            avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
            product: 'Mountain\nPeak XT',
            amount: '$210.00',
            status: 'CANCELLED'
        },
        {
            id: '#ORD-9418',
            customerName: 'Emily\nChen',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            product: 'Swift Step\nAir',
            amount: '$120.00',
            status: 'COMPLETED'
        }
    ];

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

    return (
        <React.Fragment>
            {/* Main Content Area */}
            <div className="main-content">

                {/* Top Header */}
                <div className="top-header">
                    <div className="header-left">
                        <div className="header-search">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search orders, customers, products..." />
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="icon-btn-bg">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </button>
                        <div className="user-profile-header">
                            <div className="user-text">
                                <div className="user-name">Marcus Veridi</div>
                                <div className="user-role">Store Admin</div>
                            </div>
                            <div className="user-avatar-top">
                                <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User Avatar" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Cards Content */}
                <div className="dashboard-content">

                    {/* Metrics Grid */}
                    <div className="metrics-grid">

                        {/* Card 1 */}
                        <div className="metric-card-top card-orange-c">
                            <div className="card-top-row">
                                <div className="top-icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                                </div>
                                <div className="trend-badge trend-up">
                                    +12.5% <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                </div>
                            </div>
                            <div className="metric-title-top">Total Revenue</div>
                            <div className="metric-value-top">$128,430.00</div>
                        </div>

                        {/* Card 2 */}
                        <div className="metric-card-top card-blue-c">
                            <div className="card-top-row">
                                <div className="top-icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><path d="M7 8v-2a5 5 0 0 1 10 0v2"></path></svg>
                                </div>
                                <div className="trend-badge trend-up">
                                    +8.2% <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                </div>
                            </div>
                            <div className="metric-title-top">Total Orders</div>
                            <div className="metric-value-top">1,240</div>
                        </div>

                        {/* Card 3 */}
                        <div className="metric-card-top card-purple-c">
                            <div className="card-top-row">
                                <div className="top-icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                </div>
                                <div className="trend-badge trend-up">
                                    +5.4% <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                </div>
                            </div>
                            <div className="metric-title-top">New Customers</div>
                            <div className="metric-value-top">320</div>
                        </div>

                        {/* Card 4 */}
                        <div className="metric-card-top card-red-c">
                            <div className="card-top-row">
                                <div className="top-icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="M5 13a10 10 0 0 1 14 0"></path><path d="M8.5 16.5a5 5 0 0 1 7 0"></path></svg>
                                </div>
                                <div className="trend-badge trend-down">
                                    -2.1% <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                                </div>
                            </div>
                            <div className="metric-title-top">Active Sessions</div>
                            <div className="metric-value-top">85</div>
                        </div>

                    </div>

                    {/* Charts Area */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>Sales Overview</h3>
                                <p>Revenue growth across the {chartFilter === 'Monthly' ? 'last 12 months' : chartFilter === 'Weekly' ? 'last 4 weeks' : 'last 7 days'}</p>
                            </div>
                            <div className="chart-filters">
                                {['Monthly', 'Weekly', 'Daily'].map(filter => (
                                    <button
                                        key={filter}
                                        className={`chart-filter-btn ${chartFilter === filter ? 'active' : ''}`}
                                        onClick={() => setChartFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="chart-placeholder">
                            {/* Fake beginner friendly SVG chart matching the picture's aesthetics */}
                            <svg className="chart-svg" viewBox="0 0 800 200" preserveAspectRatio="none">
                                {/* Under Fill */}
                                <path
                                    d={
                                        chartFilter === 'Monthly' ? "M 0 150 C 100 130, 200 180, 350 110 C 500 70, 700 100, 800 40 L 800 200 L 0 200 Z" :
                                            chartFilter === 'Daily' ? "M 0 120 C 150 180, 300 60, 450 140 C 600 100, 700 130, 800 60 L 800 200 L 0 200 Z" :
                                                "M 0 180 C 150 160, 250 100, 450 80 C 600 60, 700 85, 800 30 L 800 200 L 0 200 Z"
                                    }
                                    fill="rgba(246, 109, 59, 0.05)"
                                />
                                <path
                                    d={
                                        chartFilter === 'Monthly' ? "M 0 150 C 100 130, 200 180, 350 110 C 500 70, 700 100, 800 40" :
                                            chartFilter === 'Daily' ? "M 0 120 C 150 180, 300 60, 450 140 C 600 100, 700 130, 800 60" :
                                                "M 0 180 C 150 160, 250 100, 450 80 C 600 60, 700 85, 800 30"
                                    }
                                    fill="none"
                                    stroke="#f66d3b"
                                    strokeWidth="4"
                                />
                            </svg>

                            <div className="chart-axis-labels">
                                {chartFilter === 'Monthly' && <><span style={{ flex: 0 }}>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span style={{ flex: 0 }}>NOV</span></>}
                                {chartFilter === 'Weekly' && <><span style={{ flex: 0 }}>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span style={{ flex: 0 }}>WEEK 4</span></>}
                                {chartFilter === 'Daily' && <><span style={{ flex: 0 }}>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span style={{ flex: 0 }}>SUN</span></>}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="bottom-grid">

                        {/* Recent Orders */}
                        <div className="base-card">
                            <div className="card-header-flex">
                                <h3 className="card-title-main">Recent Orders</h3>
                                <a href="#" className="view-all-link">View All</a>
                            </div>
                            <table className="recent-orders-table">
                                <thead>
                                    <tr>
                                        <th>ORDER ID</th>
                                        <th>CUSTOMER</th>
                                        <th>PRODUCT</th>
                                        <th>AMOUNT</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="td-order-id">{order.id}</td>
                                            <td>
                                                <div className="td-customer-flex">
                                                    <img src={order.avatar} alt="avatar" />
                                                    <div className="td-customer-name">
                                                        {order.customerName.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="td-product-name">
                                                {order.product.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                            </td>
                                            <td className="td-amount">{order.amount}</td>
                                            <td>
                                                <div className={`status-pill status-${order.status.toLowerCase()}`}>
                                                    {order.status}
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
            </div>
        </React.Fragment>
    );
};

export default Dashboard;
