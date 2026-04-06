import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersManagement.css';

const OrdersManagement = () => {
    const [subTab, setSubTab] = useState('All Orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    // Form states for update
    const [status, setStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [carrier, setCarrier] = useState('');
    const [estimatedDelivery, setEstimatedDelivery] = useState('');

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

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setStatus(order.status);
        setTrackingNumber(order.tracking_number || '');
        setCarrier(order.carrier || '');
        setEstimatedDelivery(order.estimated_delivery ? new Date(order.estimated_delivery).toISOString().split('T')[0] : '');
        setIsModalOpen(true);
    };

    const handleUpdateOrder = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/orders/${selectedOrder.id}/status`, {
                status,
                tracking_number: trackingNumber,
                carrier,
                estimated_delivery: estimatedDelivery
            });
            setIsModalOpen(false);
            fetchOrders();
        } catch (error) {
            alert('Error updating order: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdateLoading(false);
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
                <div className="metric-card-box card-orange">
                    <div className="card-top-icon-row">
                        <div className="icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                    </div>
                    <div className="card-title-text">Pending Shipment</div>
                    <div className="card-value-text">{orders.filter(o => o.status === 'processing').length}</div>
                </div>
            </div>

            <div className="tabs-bar">
                <div className="tabs-left">
                    {['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
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
                            <th>ITEMS</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th>DATE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading orders...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No orders found</td></tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td><div className="td-order-id">#ORD-{order.id}</div></td>
                                <td><div className="td-email">{order.email}</div></td>
                                <td>
                                    <div className="td-items-flex">
                                        <div className="item-img-box">
                                            {order.items?.slice(0, 3).map((item, i) => (
                                                <img key={i} src={item.product?.image_url} alt="" className="item-img" style={{ marginLeft: i > 0 ? '-10px' : '0' }} />
                                            ))}
                                        </div>
                                        <span className="td-items-count">{order.items?.length > 3 ? `+${order.items.length - 3}` : ''}</span>
                                    </div>
                                </td>
                                <td><span className="td-total">${parseFloat(order.total_amount).toFixed(2)}</span></td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td><div className="td-order-date">{new Date(order.createdAt).toLocaleDateString()}</div></td>
                                <td>
                                    <div className="td-actions">
                                        <button className="action-btn-gray" title="Manage Order" onClick={() => handleOpenModal(order)}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(order.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444', marginLeft: '10px' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details & Delivery Management Modal */}
            {isModalOpen && selectedOrder && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Manage Order #ORD-{selectedOrder.id}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="order-details-grid">
                                <div className="details-section">
                                    <h3>Customer & Contact</h3>
                                    <div className="details-card-inner">
                                        <div className="detail-row"><span className="detail-label">Email:</span> <span className="detail-value">{selectedOrder.email}</span></div>
                                        <div className="detail-row"><span className="detail-label">Phone:</span> <span className="detail-value">{selectedOrder.contact_number || 'N/A'}</span></div>
                                        <div className="detail-row"><span className="detail-label">Payment:</span> <span className="detail-value">{selectedOrder.payment_method?.toUpperCase()}</span></div>
                                        <div className="detail-row"><span className="detail-label">Address:</span> <span className="detail-value" style={{ textAlign: 'right', fontSize: '12px', maxWidth: '150px' }}>{selectedOrder.shipping_address}</span></div>
                                    </div>
                                </div>
                                <div className="details-section">
                                    <h3>Order Summary</h3>
                                    <div className="details-card-inner">
                                        <div className="detail-row"><span className="detail-label">Subtotal:</span> <span className="detail-value">${parseFloat(selectedOrder.total_amount).toFixed(2)}</span></div>
                                        <div className="detail-row"><span className="detail-label">Date:</span> <span className="detail-value">{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
                                        <div className="detail-row"><span className="detail-label">Current Status:</span> 
                                            <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-items-list">
                                <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Ordered Items</h3>
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="modal-item-row">
                                        <img src={item.product?.image_url} alt="" className="modal-item-img" />
                                        <div className="modal-item-info">
                                            <div className="item-name-tag">{item.product?.name}</div>
                                            <div className="item-meta-tag">Size: {item.size} | Qty: {item.quantity} | Price: ${parseFloat(item.price_at_purchase).toFixed(2)}</div>
                                        </div>
                                        <div className="item-total-price" style={{ fontWeight: '700' }}>
                                            ${(item.quantity * item.price_at_purchase).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form className="delivery-form" onSubmit={handleUpdateOrder}>
                                <div className="form-title-row">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                    <h3>Update Delivery Management</h3>
                                </div>
                                <div className="update-inputs-grid">
                                    <div className="form-group">
                                        <label>Order Status</label>
                                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Carrier Name</label>
                                        <input type="text" className="form-input" placeholder="e.g. UPS, DHL, Fedex" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Tracking Number</label>
                                        <input type="text" className="form-input" placeholder="Enter tracking ID" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Est. Delivery Date</label>
                                        <input type="date" className="form-input" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} />
                                    </div>
                                    <button type="submit" className="update-order-btn" disabled={updateLoading}>
                                        {updateLoading ? 'Updating...' : 'Update Order & Notify Customer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
