import React, { useState } from 'react';
import './OrdersManagement.css';

const OrdersManagement = () => {
    const [subTab, setSubTab] = useState('All Orders');

    const orders = [
        {
            id: '#ORD-9421', date: 'Oct 24, 2023 | 09:42 AM',
            customer: 'Alexander Wright', email: 'alex.w@email.com', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            items: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=50&h=50&fit=crop'], extraItems: '+2 more',
            total: '$342.00', payment: 'Visa **** 4242', status: 'PROCESSING'
        },
        {
            id: '#ORD-9419', date: 'Oct 23, 2023 | 04:15 PM',
            customer: 'Sarah Jenkins', email: 'sarah.j@email.com', avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            items: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=50&h=50&fit=crop'], extraItems: '1 Item',
            total: '$125.50', payment: 'PayPal', status: 'DELIVERED'
        },
        {
            id: '#ORD-9415', date: 'Oct 23, 2023 | 01:05 PM',
            customer: 'Michael Chen', email: 'm.chen@email.com', avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
            items: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=50&h=50&fit=crop'], extraItems: '1 Item',
            total: '$450.00', payment: 'Mastercard', status: 'CANCELLED'
        },
        {
            id: '#ORD-9410', date: 'Oct 22, 2023 | 11:20 AM',
            customer: 'Emily Davis', email: 'emily.d@email.com', avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            items: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=50&h=50&fit=crop'], extraItems: '',
            total: '$210.00', payment: 'Amex **** 1005', status: 'DELIVERED'
        }
    ];

    return (
        <React.Fragment>

            {/* Main Content Area */}
            <div className="main-content">

                {/* Top Header */}
                <div className="top-header">
                    <div className="header-left">
                        <h1>Orders Management</h1>
                        <div className="header-search">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search orders, SKU..." />
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="icon-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </button>
                        <button className="icon-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </button>
                        <div className="user-avatar-top">
                            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User Avatar" />
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="dashboard-content">

                    {/* Top Metric Cards */}
                    <div className="metric-cards">
                        {/* Card 1 */}
                        <div className="metric-card-box card-blue">
                            <div className="card-top-icon-row">
                                <div className="icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                </div>
                                <span className="small-trend trend-pos">+12.5%</span>
                            </div>
                            <div className="card-title-text">Total Orders Today</div>
                            <div className="card-value-text">142</div>
                        </div>

                        {/* Card 2 */}
                        <div className="metric-card-box card-orange">
                            <div className="card-top-icon-row">
                                <div className="icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                </div>
                                <span className="small-trend trend-neg">-4.2%</span>
                            </div>
                            <div className="card-title-text">Pending Shipments</div>
                            <div className="card-value-text">28</div>
                        </div>

                        {/* Card 3 */}
                        <div className="metric-card-box card-purple">
                            <div className="card-top-icon-row">
                                <div className="icon-circle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                                </div>
                                <span className="small-trend trend-pos">+3.1%</span>
                            </div>
                            <div className="card-title-text">Average Order Value</div>
                            <div className="card-value-text">$215.50</div>
                        </div>
                    </div>

                    {/* Tabs Bar */}
                    <div className="tabs-bar">
                        <div className="tabs-left">
                            {['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                                <button
                                    key={tab}
                                    className={`tab-btn ${subTab === tab ? 'active' : ''}`}
                                    onClick={() => setSubTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="tabs-right">
                            <div className="date-filter">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                Oct 12, 2023 - Oct 19, 2023
                            </div>
                            <button className="filter-icon-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            </button>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="table-container">

                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ORDER ID</th>
                                    <th>CUSTOMER</th>
                                    <th>ITEMS</th>
                                    <th>TOTAL</th>
                                    <th>PAYMENT</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, idx) => (
                                    <tr key={idx}>

                                        {/* ORDER ID */}
                                        <td>
                                            <div className="td-order-id">{order.id}</div>
                                            <div className="td-order-date">{order.date}</div>
                                        </td>

                                        {/* CUSTOMER */}
                                        <td>
                                            <div className="td-customer">
                                                <img src={order.avatar} alt="avatar" className="customer-avatar" />
                                                <div>
                                                    <div className="td-name">{order.customer}</div>
                                                    <div className="td-email">{order.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ITEMS */}
                                        <td>
                                            <div className="td-items-flex">
                                                <div className="item-img-box">
                                                    {order.items.map((img, i) => (
                                                        <img key={i} src={img} alt="item" className="item-img" style={{ marginLeft: i > 0 ? '-10px' : '0' }} />
                                                    ))}
                                                </div>
                                                <span className="td-items-count">{order.extraItems}</span>
                                            </div>
                                        </td>

                                        {/* TOTAL */}
                                        <td>
                                            <span className="td-total">{order.total}</span>
                                        </td>

                                        {/* PAYMENT */}
                                        <td>
                                            <div className="td-payment">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                                {order.payment}
                                            </div>
                                        </td>

                                        {/* STATUS */}
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}
                                        <td>
                                            <div className="td-actions">
                                                <button className="action-btn-gray">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                                <button className="action-btn-gray">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Box */}
                        <div className="pagination">
                            <div className="page-info">
                                Showing 1 to 4 of 142 entries
                            </div>
                            <div className="page-buttons">
                                <button className="page-btn str-btn">{'<'} Prev</button>
                                <button className="page-btn active-page">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <button className="page-btn dots">...</button>
                                <button className="page-btn">36</button>
                                <button className="page-btn str-btn">Next {'>'}</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default OrdersManagement;
