import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersManagement.css';

const OrdersManagement = () => {
    const [subTab, setSubTab] = useState('All Orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/orders/${id}`);
                fetchOrders();
            } catch (error) {
                alert('Error deleting order');
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        if (subTab === 'All Orders') return true;
        return order.status.toLowerCase() === subTab.toLowerCase();
    });

    return (
        <div className="dashboard-content">
            <div className="page-header" style={{ marginBottom: '25px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>Orders Management</h1>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Track and fulfill customer orders efficiently</p>
            </div>

            <div className="metric-cards">
                <div className="metric-card-box card-blue">
                    <div className="card-top-icon-row">
                        <div className="icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        </div>
                    </div>
                    <div className="card-title-text">Total Orders</div>
                    <div className="card-value-text">{orders.length}</div>
                </div>
            </div>

            <div className="tabs-bar">
                <div className="tabs-left">
                    {['All Orders', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${subTab === tab ? 'active' : ''}`}
                            onClick={() => setSubTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>EMAIL</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading orders...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No orders found</td></tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td><div className="td-order-id">#ORD-{order.id}</div></td>
                                <td><div className="td-email">{order.email}</div></td>
                                <td><span className="td-total">${parseFloat(order.total_amount).toFixed(2)}</span></td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td><div className="td-order-date">{new Date(order.createdAt).toLocaleDateString()}</div></td>
                                <td>
                                    <div className="td-actions">
                                        <button className="delete-btn" onClick={() => handleDelete(order.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersManagement;
