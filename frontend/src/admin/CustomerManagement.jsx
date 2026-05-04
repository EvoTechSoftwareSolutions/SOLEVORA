import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerManagement.css';
import { API_URL, BASE_URL, getImageUrl } from '../config/api';
import { showConfirm, showSuccess, showError } from '../utils/notifications';


const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/customers`);
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // Silent background refresh every 3 seconds
    const interval = setInterval(() => {
      axios.get(`${API_URL}/admin/customers`)
        .then(response => {
          const data = Array.isArray(response.data?.data) ? response.data.data : [];
          setCustomers(data);
        })
        .catch(err => console.error('Silent fetch failed', err));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // delete customer by id
  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Are you sure?', 'You want to delete this customer? This action cannot be undone.');
    if (confirmed) {
      try {
        await axios.delete(`${API_URL}/admin/customers/${id}`);
        showSuccess('Deleted!', 'Customer has been deleted successfully.');
        fetchCustomers();
      } catch (error) {
        showError('Error', 'Error deleting customer');
      }
    }
  };


  const safeCustomers = Array.isArray(customers) ? customers : [];
  const filteredCustomers = safeCustomers.filter(cust => 
    cust.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cust.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            ) : filteredCustomers.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No customers found</td></tr>
            ) : filteredCustomers.map((cust) => (
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
