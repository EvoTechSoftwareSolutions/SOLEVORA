import React, { useState } from 'react';
import './CustomerManagement.css';

const CustomerManagement = () => {

  const customers = [
    { id: 1, name: 'James Wilson', email: 'james.w@gmail.com', orders: '24', spent: '$2,840.50', lastOrder: 'Oct 12, 2023', status: 'ACTIVE', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Elena Rodriguez', email: 'elena.rod@outlook.com', orders: '8', spent: '$1,215.00', lastOrder: 'Oct 05, 2023', status: 'NEW', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Marcus Chen', email: 'marcus.chen@tech.co', orders: '42', spent: '$6,790.25', lastOrder: 'Sep 28, 2023', status: 'ACTIVE', img: 'https://randomuser.me/api/portraits/men/46.jpg' },
    { id: 4, name: 'Sarah Jenkins', email: 'sarahj@me.com', orders: '2', spent: '$320.00', lastOrder: 'Jun 14, 2023', status: 'INACTIVE', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 5, name: 'David Lee', email: 'david.lee@outlook.com', orders: '15', spent: '$1,890.75', lastOrder: 'Oct 14, 2023', status: 'ACTIVE', img: 'https://randomuser.me/api/portraits/men/62.jpg' },
  ];

  return (
    <div className="dashboard-content">

      {/* Page Header Area */}
      <div className="page-header" style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>Customer Management</h1>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Analyze and interact with your customer base</p>
      </div>

      {/* Top Metric Cards */}
      <div className="metric-cards">

        <div className="metric-card">
          <div className="card-top">
            <span className="card-title">Total Customers</span>
            <span className="card-trend up">↑12%</span>
          </div>
          <div className="card-value">12,845</div>
          <div className="chart-line-orange"></div>
        </div>

        <div className="metric-card">
          <div className="card-top">
            <span className="card-title">Active Now</span>
            <span className="card-trend up">↑5%</span>
          </div>
          <div className="card-value">1,204</div>
          <div className="card-bottom avatars-bottom">
            <div className="avatar-group">
              <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Avatar 1" />
              <img src="https://randomuser.me/api/portraits/men/15.jpg" alt="Avatar 2" />
              <img src="https://randomuser.me/api/portraits/women/24.jpg" alt="Avatar 3" />
            </div>
            <span className="bottom-text">+1.2k others</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-top">
            <span className="card-title">New This Month</span>
            <span className="card-trend up">↑18%</span>
          </div>
          <div className="card-value">856</div>
          <div className="card-bottom">
            <span className="bottom-text">Goal: 1,000 customers</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-top">
            <span className="card-title">Customer NPS</span>
            <span className="card-trend up">↑2%</span>
          </div>
          <div className="card-value">72</div>
          <div className="card-bottom stars-bottom">
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star empty">★</span>
          </div>
        </div>

      </div>

      {/* Table Container */}
      <div className="table-container">

        {/* Table Filters */}
        <div className="table-filters">
          <div className="filters-left">
            <div className="search-input-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search by name, email or ID..." />
            </div>

            <div className="select-box">
              <select>
                <option>All Statuses</option>
              </select>
            </div>

            <div className="select-box">
              <select>
                <option>All Spending Tiers</option>
              </select>
            </div>
          </div>

          <div className="filters-right">
            <button className="white-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              More Filters
            </button>
          </div>
        </div>

        {/* Actual Table */}
        <table className="customers-table">
          <thead>
            <tr>
              <th>CUSTOMER NAME</th>
              <th>TOTAL ORDERS</th>
              <th>TOTAL SPENT</th>
              <th>LAST ORDER</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <div className="td-customer">
                    <img src={cust.img} alt={cust.name} />
                    <div className="td-customer-info">
                      <div className="td-name">{cust.name}</div>
                      <div className="td-email">{cust.email}</div>
                    </div>
                  </div>
                </td>
                <td><div className="td-text">{cust.orders}</div></td>
                <td><div className="td-text dark-text">{cust.spent}</div></td>
                <td><div className="td-text light-text">{cust.lastOrder}</div></td>
                <td>
                  <span className={`status-badge ${cust.status.toLowerCase()}`}>
                    {cust.status}
                  </span>
                </td>
                <td>
                  <div className="td-actions">
                    <button className="action-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button className="action-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="action-btn delete-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
            Showing 1 to 5 of 12,845 customers
          </div>
          <div className="page-buttons">
            <button className="page-btn">Previous</button>
            <button className="page-btn active-page">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerManagement;
