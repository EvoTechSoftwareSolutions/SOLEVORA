import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import './MyOrders.css';

const PAGE_SIZE = 10;

const MyOrders = () => {
  const [subTab, setSubTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  // Tracking Card State
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const trackCardRef = useRef(null);

  // Get logged-in user from localStorage
  const getLoggedInUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  };
  const user = getLoggedInUser();

  // Fetch orders by userId
  const fetchOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/user/${user.id}`
      );
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  // Filter orders by tab/status
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

  const handleTrackOrder = (order) => {
    setActiveTrackingOrder(order);
    // Smooth scroll to top to see the tracking card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProgressStatus = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status.toLowerCase());
    if (currentIndex === -1) return -1;
    return currentIndex;
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: 'cancelled' });
        alert('Order cancelled successfully');
        fetchOrders();
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Error cancelling order');
      }
    }
  };

  return (
    <div className="mo-dashboard-content">
      <div className="mo-page-header">
        <h1 className="mo-main-title">My Orders</h1>
        <p className="mo-sub-title">Track your recent purchases and manage your order history</p>
      </div>

      {/* Live Tracking Card (Persists at top of content when an order is tracked) */}
      {activeTrackingOrder && (
        <div className="mo-tracking-card-wrap fade-in" ref={trackCardRef}>
          <div className="mo-tracking-card-header">
             <div className="mo-tc-title">
               <span className="material-symbols-outlined">local_shipping</span>
               <span>Live Order Tracking: #ORD-{activeTrackingOrder.id}</span>
             </div>
             <button className="mo-tc-close" onClick={() => setActiveTrackingOrder(null)}>
               <span className="material-symbols-outlined">close</span>
             </button>
          </div>
          
          <div className="mo-tracking-card-body">
            <div className="mo-tc-stepper">
              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                const progress = getProgressStatus(activeTrackingOrder.status);
                const isCompleted = index <= progress;
                const isActive = index === progress;
                
                return (
                  <div key={index} className={`mo-tc-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="mo-tc-point"></div>
                    <div className="mo-tc-label">{step}</div>
                  </div>
                );
              })}
            </div>

            <div className="mo-tc-grid">
              <div className="mo-tc-details">
                <div className="mo-tc-section-title">Delivery Details</div>
                <div className="mo-tc-info-row">
                  <span className="mo-tc-label">Status:</span>
                  <span className={`mo-badge ${activeTrackingOrder.status.toLowerCase()}`}>{activeTrackingOrder.status.toUpperCase()}</span>
                </div>
                <div className="mo-tc-info-row">
                  <span className="mo-tc-label">Address:</span>
                  <span className="mo-tc-value">{activeTrackingOrder.shipping_address}</span>
                </div>
                {activeTrackingOrder.tracking_number && (
                  <>
                    <div className="mo-tc-info-row">
                      <span className="mo-tc-label">Carrier:</span>
                      <span className="mo-tc-value">{activeTrackingOrder.carrier}</span>
                    </div>
                    <div className="mo-tc-info-row">
                      <span className="mo-tc-label">Tracking Info:</span>
                      <span className="mo-tc-value">{activeTrackingOrder.tracking_number}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mo-tc-items">
                 <div className="mo-tc-section-title">Ordered Items</div>
                 <div className="mo-tc-items-scroll">
                   {activeTrackingOrder.items?.map((item, idx) => (
                     <div key={idx} className="mo-tc-item">
                       <img src={item.product?.image_url} alt="" />
                       <div className="mo-tc-item-meta">
                         <div className="mo-tc-item-name">{item.product?.name}</div>
                         <div className="mo-tc-item-sub">Size: {item.size} | Qty: {item.quantity}</div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="mo-tc-actions">
               {activeTrackingOrder.tracking_number && (
                 <a 
                   href={`https://www.google.com/search?q=${activeTrackingOrder.carrier}+tracking+${activeTrackingOrder.tracking_number}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="mo-tc-track-btn"
                 >
                   Track via Carrier Website
                 </a>
               )}
               <div className="mo-tc-total">
                 Total Paid: <strong>${parseFloat(activeTrackingOrder.total_amount).toFixed(2)}</strong>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
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

      {/* Tabs */}
      <div className="mo-tabs-row">
        {['All Orders', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(tab => (
          <button
            key={tab}
            className={`mo-tab-link ${subTab === tab ? 'active' : ''}`}
            onClick={() => setSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
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
              <tr><td colSpan="6" className="mo-status-cell">No orders found for this account</td></tr>
            ) : paginatedOrders.map(order => (
              <tr key={order.id}>
                <td>#ORD-{order.id}</td>
                <td>
                  {order.items && order.items.length > 0 ? (
                    <div className="mo-img-stack">
                      <img src={order.items[0].product?.image_url} alt="product" className="mo-thumb" />
                      {order.items.length > 1 && (
                        <span className="mo-more-count">+{order.items.length - 1}</span>
                      )}
                    </div>
                  ) : 'No items'}
                </td>
                <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                <td><span className={`mo-badge ${order.status.toLowerCase()}`}>{order.status.toUpperCase()}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="mo-action-btns">
                    <button 
                      className={`mo-track-btn ${activeTrackingOrder?.id === order.id ? 'active' : ''}`} 
                      title="Track Order"
                      onClick={() => handleTrackOrder(order)}
                    >
                      <span className="material-symbols-outlined">local_shipping</span>
                    </button>
                    {['pending', 'processing'].includes(order.status.toLowerCase()) && (
                      <button 
                        className="mo-cancel-btn" 
                        title="Cancel Order"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <span className="material-symbols-outlined">cancel</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mo-pagination-footer">
        <div className="mo-page-stats">
          {totalFiltered === 0
            ? 'No orders to show'
            : `Showing ${rangeStart}–${rangeEnd} of ${totalFiltered} orders`}
        </div>
        {totalPages > 1 && (
          <div className="mo-page-nav">
            <button
              type="button"
              className="mo-nav-btn"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="mo-page-indicator">Page {page} of {totalPages}</span>
            <button
              type="button"
              className="mo-nav-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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