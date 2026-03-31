import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './MyOrders.css';

const PAGE_SIZE = 10;

const MyOrders = () => {
    const [subTab, setSubTab] = useState('All Orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const getLoggedInUser = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return null;
    };

    const user = getLoggedInUser();

    const fetchOrders = async () => {
        if (!user?.email) {
            setLoading(false);
            return;
        }
        try {
            const encodedEmail = encodeURIComponent(user.email.trim());
            const response = await axios.get(`http://localhost:5000/api/orders/search?email=${encodedEmail}`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user?.email]);

    const filteredOrders = useMemo(() => orders.filter(order => {
        if (subTab === 'All Orders') return true;
        return order.status.toLowerCase() === subTab.toLowerCase();
    }), [orders, subTab]);

    useEffect(() => {
        setPage(1);
    }, [subTab]);

    const totalFiltered = filteredOrders.length;
    const totalPages = totalFiltered === 0 ? 0 : Math.ceil(totalFiltered / PAGE_SIZE);

    useEffect(() => {
        if (totalPages > 0 && page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredOrders.slice(start, start + PAGE_SIZE);
    }, [filteredOrders, page]);

    const rangeStart = totalFiltered === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeEnd = totalFiltered === 0 ? 0 : Math.min(page * PAGE_SIZE, totalFiltered);

    return (
        <div className="mo-dashboard-content">
            <div className="mo-page-header">
                <h1 className="mo-main-title">My Orders</h1>
                <p className="mo-sub-title">Track your recent purchases and manage your order history</p>
            </div>

            <div className="mo-metric-cards">
                <div className="mo-metric-card card-blue">
                    <div className="mo-card-icon-wrap">
                        <div className="mo-icon-circle">
                            <span className="material-symbols-outlined">shopping_bag</span>
                        </div>
                    </div>
                    <div className="mo-card-info">
                        <span className="mo-card-label">Total Orders</span>
                        <h2 className="mo-card-value">{orders.length}</h2>
                    </div>
                </div>
                <div className="mo-metric-card card-orange">
                    <div className="mo-card-icon-wrap">
                        <div className="mo-icon-circle">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                    </div>
                    <div className="mo-card-info">
                        <span className="mo-card-label">Pending</span>
                        <h2 className="mo-card-value">{orders.filter(o => o.status === 'pending').length}</h2>
                    </div>
                </div>
                <div className="mo-metric-card card-green">
                    <div className="mo-card-icon-wrap">
                        <div className="mo-icon-circle">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div className="mo-card-info">
                        <span className="mo-card-label">Completed</span>
                        <h2 className="mo-card-value">{orders.filter(o => o.status === 'delivered').length}</h2>
                    </div>
                </div>
            </div>

            <div className="mo-tabs-row">
                {['All Orders', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                    <button
                        key={tab}
                        className={`mo-tab-link ${subTab === tab ? 'active' : ''}`}
                        onClick={() => setSubTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mo-table-wrapper">
                <table className="mo-orders-data-table">
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>ITEMS</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="mo-status-cell">Loading orders...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="6" className="mo-status-cell">{`No orders found for ${user?.email || 'this account'}`}</td></tr>
                        ) : paginatedOrders.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <div className="mo-id-text">#ORD-{order.id}</div>
                                </td>
                                <td>
                                    <div className="mo-items-preview">
                                        {order.items && order.items.length > 0 ? (
                                            <div className="mo-img-stack">
                                                <img src={order.items[0].product?.image_url} alt="product" className="mo-thumb" />
                                                {order.items.length > 1 && (
                                                    <span className="mo-more-count">+{order.items.length - 1}</span>
                                                )}
                                            </div>
                                        ) : 'No items'}
                                    </div>
                                </td>
                                <td>
                                    <div className="mo-price-text">${parseFloat(order.total_amount).toFixed(2)}</div>
                                </td>
                                <td>
                                    <span className={`mo-badge ${order.status.toLowerCase()}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <div className="mo-date-text">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td>
                                    <div className="mo-action-btns">
                                        <button className="mo-view-btn" title="View Details">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                        <button className="mo-track-btn" title="Track Order">
                                            <span className="material-symbols-outlined">local_shipping</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mo-pagination-footer">
                <div className="mo-page-stats">
                    {totalFiltered === 0
                        ? 'No orders to show'
                        : `Showing ${rangeStart}–${rangeEnd} of ${totalFiltered} orders`}
                </div>
                {totalPages > 1 && (
                    <div className="mo-page-nav" role="navigation" aria-label="Order list pages">
                        <button
                            type="button"
                            className="mo-nav-btn"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            aria-label="Previous page"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <span className="mo-page-indicator" aria-current="page">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            type="button"
                            className="mo-nav-btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            aria-label="Next page"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
