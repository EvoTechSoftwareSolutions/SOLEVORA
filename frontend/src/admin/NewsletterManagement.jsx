import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsletterManagement.css';

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/newsletter/subscribers');
      setSubscribers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        await axios.delete(`http://localhost:5000/api/newsletter/subscribers/${id}`);
        fetchSubscribers();
      } catch (error) {
        alert('Error deleting subscriber');
      }
    }
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-content">
      <div className="page-header" style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>Newsletter Subscribers</h1>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Manage users who have opted into your marketing emails</p>
      </div>

      <div className="metric-cards">
        <div className="metric-card">
          <div className="card-top">
            <span className="card-title">Total Subscribers</span>
          </div>
          <div className="card-value">{subscribers.length}</div>
          <div className="chart-line-orange"></div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-filters">
          <div className="filters-left">
            <div className="search-input-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search by email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>EMAIL ADDRESS</th>
              <th>SUBSCRIBED DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading subscribers...</td></tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No subscribers found</td></tr>
            ) : filteredSubscribers.map((sub) => (
              <tr key={sub.id}>
                <td><div className="td-text">#{sub.id}</div></td>
                <td>
                  <div className="td-email-container">
                    <span className="material-symbols-outlined email-icon">mail</span>
                    <div className="td-email">{sub.email}</div>
                  </div>
                </td>
                <td><div className="td-text light-text">{new Date(sub.createdAt).toLocaleString()}</div></td>
                <td>
                  <div className="td-actions">
                    <button className="action-btn delete-btn" onClick={() => handleDelete(sub.id)} title="Remove Subscriber">
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

export default NewsletterManagement;
