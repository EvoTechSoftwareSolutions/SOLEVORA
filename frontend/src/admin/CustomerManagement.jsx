import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import Pagination from '../components/common/Pagination';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // fetch customers from API
  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/customers?page=${page}&limit=${limit}`);
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setCustomers(data);
      setTotalPages(response.data?.pagination?.totalPages || 1);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage);
    // Silent background refresh every 3 seconds - disabled for now to avoid reset issues with pagination
    /*
    const interval = setInterval(() => {
      axios.get(`${API_URL}/admin/customers?page=${currentPage}&limit=${limit}`)
        .then(response => {
          const data = Array.isArray(response.data?.data) ? response.data.data : [];
          setCustomers(data);
          setTotalPages(response.data?.pagination?.totalPages || 1);
        })
        .catch(err => console.error('Silent fetch failed', err));
    }, 3000);
    return () => clearInterval(interval);
    */
  }, [currentPage]);

  // toggle customer status
  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/customers/${id}/toggle`);
      fetchCustomers();
    } catch (error) {
      showError('Error', 'Error toggling customer status');
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
                    <div 
                      className="status-toggle-container" 
                      onClick={() => handleToggleStatus(cust.id)}
                      title={cust.status === 1 ? 'Deactivate Customer' : 'Activate Customer'}
                    >
                      <div className={`status-toggle-pill ${cust.status === 1 ? 'active' : 'inactive'}`}>
                        <div className="status-toggle-knob">
                          <span className="knob-icon">{cust.status === 1 ? '✓' : '✕'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => setCurrentPage(page)} 
        />
      </div>
    </div>
  );
};

export default CustomerManagement;
