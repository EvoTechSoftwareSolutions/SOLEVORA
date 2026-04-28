import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsletterManagement.css';
import { API_URL } from '../config/api';

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(`${API_URL}/newsletter/subscribers`);
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
        await axios.delete(`${API_URL}/newsletter/subscribers/${id}`);
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
    <div className="newsletter-admin-container">
      <div className="newsletter-header">
        <div className="header-text">
          <h1 className="newsletter-title">Newsletter Subscribers</h1>
          <p className="newsletter-subtitle">You have {subscribers.length} active subscribers in your mailing list</p>
        </div>
        <div className="newsletter-stats-mini">
            <div className="mini-stat-card">
                <span className="material-symbols-outlined">group</span>
                <div>
                    <div className="mini-stat-val">{subscribers.length}</div>
                    <div className="mini-stat-lbl">Total</div>
                </div>
            </div>
        </div>
      </div>

      <div className="newsletter-table-wrap">
        <div className="table-controls">
          <div className="nl-search-box">
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              placeholder="Filter by email address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="export-btn" onClick={() => window.print()}>
            <span className="material-symbols-outlined">download</span>
            Export List
          </button>
        </div>

        <table className="nl-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="nl-loading-td">Fetching subscribers...</td></tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="nl-empty-td">
                  <div className="empty-msg">
                    <span className="material-symbols-outlined">mail_off</span>
                    <p>No subscribers found matching "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            ) : filteredSubscribers.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <div className="sub-info">
                    <div className="sub-avatar">{sub.email.charAt(0).toUpperCase()}</div>
                    <div className="sub-email">{sub.email}</div>
                  </div>
                </td>
                <td><span className="sub-status-pill">Active</span></td>
                <td>{new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>
                  <button className="nl-delete-btn" onClick={() => handleDelete(sub.id)} title="Remove Subscriber">
                    <span className="material-symbols-outlined">delete_forever</span>
                  </button>
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
