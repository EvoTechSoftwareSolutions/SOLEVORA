import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
// fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/customers');
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
// delete customer by id
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        alert('Error deleting customer');
      }
    }
  };

  return (
    <div className="dashboard-content">
      {/* page header */}
      <div className="page-header" style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>Customer Management</h1>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Analyze and interact with your customer base</p>
      </div>
      {/* simple stats card */}
      <div className="metric-cards">
        <div className="metric-card">
          <div className="card-top">
            <span className="card-title">Total Customers</span>
          </div>
          <div className="card-value">{customers.length}</div>
          <div className="chart-line-orange"></div>
        </div>
      </div>
       {/* table section */}
      <div className="table-container">
        <div className="table-filters">
          <div className="filters-left">
            <div className="search-input-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search by name or email..." />
            </div>
          </div>
        </div>
           {/* customers table */}
        <table className="customers-table">
          <thead>
            <tr>
              <th>CUSTOMER NAME</th>
              <th>EMAIL</th>
              <th>JOINED DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading customers...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No customers found</td></tr>
            ) : customers.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <div className="td-customer">
                    <img src={`https://ui-avatars.com/api/?name=${cust.name}&background=random`} alt={cust.name} />
                    <div className="td-name">{cust.name}</div>
                  </div>
                </td>
                <td><div className="td-email">{cust.email}</div></td>
                <td><div className="td-text light-text">{new Date(cust.createdAt).toLocaleDateString()}</div></td>
                <td>
                  <div className="td-actions">
                    <button className="action-btn delete-btn" onClick={() => handleDelete(cust.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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

export default CustomerManagement;
