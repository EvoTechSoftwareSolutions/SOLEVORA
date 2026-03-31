import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../components/ui/Modal';
import './Addresses.css';

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ title: '', body: '' });

  const getUserId = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr).id;
    return null;
  };

  const fetchAddresses = async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/addresses/${userId}`);
      setAddresses(res.data);
    } catch (error) {
      showStatus("Error", "Failed to fetch addresses. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const showStatus = (title, body) => {
    setStatusMessage({ title, body });
    setIsStatusModalOpen(true);
  };

  const handleAddAddress = () => {
    navigate('/profile/addresses/add');
  };

  const handleDeleteClick = (id) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${addressToDelete}`);
      setIsDeleteModalOpen(false);
      fetchAddresses();
    } catch (error) {
      showStatus("Error", "Failed to delete address.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/addresses/${id}`, { isDefault: true });
      fetchAddresses();
    } catch (error) {
      showStatus("Error", "Failed to update default address.");
    }
  };

  if (loading) return <div className="addr-container">Loading addresses...</div>;

  return (
    <div className="addr-container">
      {/* Page Header */}
      <div className="addr-header">
        <div className="addr-title-box">
          <h2>Addresses</h2>
          <p>Manage your shipping and billing locations for a faster checkout.</p>
        </div>

        <button className="addr-add-btn" type="button" onClick={handleAddAddress}>
          <span className="material-symbols-outlined">add_location_alt</span>
          Add New Address
        </button>
      </div>

      {/* Address Grid */}
      <div className="addr-grid">
        {addresses.map((addr) => (
          <div key={addr.id} className={`addr-card ${addr.isDefault ? 'addr-default-card' : ''}`}>
            {addr.isDefault && (
              <div className="addr-default-badge">
                <span className="material-symbols-outlined">check_circle</span>
                Default
              </div>
            )}

            <div className="addr-card-inner">
              <div className="addr-card-top">
                <div className="addr-card-details">
                  <h3 className="addr-card-heading">
                    <span className="material-symbols-outlined addr-card-heading-icon">{addr.icon || 'location_on'}</span>
                    {addr.title}
                  </h3>

                  <div className="addr-card-lines">
                    <p className="addr-line addr-name">{addr.name}</p>
                    <p className="addr-line">{addr.street}</p>
                    <p className="addr-line addr-city-state">{addr.cityStateZip}</p>
                    <p className="addr-line">{addr.country}</p>

                    {addr.phone && (
                      <p className="addr-phone">
                        <span className="material-symbols-outlined">call</span>
                        {addr.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="addr-card-footer">
              {addr.isDefault ? (
                <div className="addr-primary-shipping">
                  <span className="material-symbols-outlined">check_circle</span>
                  PRIMARY SHIPPING
                </div>
              ) : (
                <button className="addr-set-default-link" type="button" onClick={() => handleSetDefault(addr.id)}>
                  Set as Default
                </button>
              )}

              <div className="addr-footer-actions">
                <button className="addr-action-btn" type="button" title="Edit" onClick={() => navigate(`edit/${addr.id}`)}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="addr-action-btn delete" type="button" title="Delete" onClick={() => handleDeleteClick(addr.id)}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Placeholder Card */}
        <div className="addr-card addr-add-placeholder" onClick={handleAddAddress} style={{ cursor: 'pointer' }}>
          <div className="addr-add-inner">
            <div className="addr-add-icon-wrap">
              <span className="material-symbols-outlined">add</span>
            </div>
            <h3>Add Another Address</h3>
            <p>For gifts or temporary locations</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        actions={
          <>
            <button className="modal-btn modal-btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
            <button className="modal-btn modal-btn-danger" onClick={confirmDelete}>Delete Address</button>
          </>
        }
      >
        Are you sure you want to delete this address? This action cannot be undone.
      </Modal>

      <Modal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)}
        title={statusMessage.title}
        actions={
          <button className="modal-btn modal-btn-confirm" onClick={() => setIsStatusModalOpen(false)}>Close</button>
        }
      >
        {statusMessage.body}
      </Modal>

      {/* Help Section */}
      <div className="addr-help-section">
        <div className="addr-help-icon">
          <span className="material-symbols-outlined">help_center</span>
        </div>

        <div className="addr-help-content">
          <h4>Need help managing your locations?</h4>
          <p>
            Our support team is available 24/7 to help you with shipping preferences and international orders.
          </p>
        </div>

        <button className="addr-help-btn" type="button">
          Visit Help Center
        </button>
      </div>

      {/* Footer */}
      <footer className="addr-footer">
        <p>© 2024 Solevora Inc. All rights reserved. Your addresses are encrypted and stored securely.</p>
      </footer>
    </div>
  );
};

export default Addresses;
