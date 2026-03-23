import React, { useState } from 'react';
import './Addresses.css';

const Addresses = () => {
  const [addresses] = useState([
    {
      id: 1,
      icon: 'home',
      title: 'Home Office',
      name: 'Alex Rivers',
      street: '123 Orange Blossom Lane',
      cityStateZip: 'Citrus Heights, CA 95610',
      phone: '+1 (555) 012-3456',
      country: 'United States',
      isDefault: true,
      mapImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAu3ShOLTeg0dfGvTjpCautJY4CQ9DhYlfwygADl_6d1NesoMEAkTKLu8jSBFrCvYhyqqTy98r1NrQnYeRDJ6_DOkxRf002jWvLK9PIN0Ni6zIJ2fG3Gao_Fn3bpKINbHrNlxG5j3ZNmpX6Kx1LkfC673OHCsXdhIfJh2jWoA0ddlxud-GzsnUx2Hl9sN5FFyq35PraSMYfJ45WUjXitoDLO9K4eGsSkW9TJB0KRbU8c1lK9ld9TicEtlGGgwfDorx91YAUlvYjI0Q',
    },
    {
      id: 2,
      icon: 'apartment',
      title: 'Brooklyn Studio',
      name: 'Alex Rivers',
      street: '456 Atlantic Avenue, Apt 4B',
      cityStateZip: 'Brooklyn, NY 11217',
      phone: '+1 (555) 012-3456',
      country: 'United States',
      isDefault: false,
      mapImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBAtHNOulbVUSZBGJ48pI0jTUpOH4Wy-zbenFJs8mHflFDWSb1EmYZ49k4UqiHKPFownUGvtQwxIiA-n-W42aLXXAqLhIHBE_O9K0M_cCXS5QkK0wnN-d_tSZs3xW9eE47miJflQqLEcmyVklE_x3O1R02713GoQCrWouXKGvmHr6kTNUSnNTA75IC1TieJVpRWPsP0Sfj2Xk2jP0ODjAB1WvK7YBoZ2kPqFOxHcAw9EJ5-kGMFDZMabfh3nCqakiN0kLt7TpTtvdo',
    },
    {
      id: 3,
      icon: 'payments',
      title: 'Billing Address',
      name: 'Alex Rivers',
      street: '789 Market Street, Suite 200',
      cityStateZip: 'San Francisco, CA 94103',
      phone: '',
      country: 'United States',
      isDefault: false,
      mapImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCI5_OQQC1F6r5oDW4tab3xLmZ2QN3Ot67W0Uazil8WaHshvm_lsryVjBr6eCpmVrTG3jetFrcJfAQ92GRZm2Q2d4Alw4TjRmU2LCTYTZWPgRot8aeBNofUr2FPE1HL_djuKBXCnrHBBEvhvOTYAfHBfKXsl0pOcYrm9NTf-YaCiEm7iLT0IfMFuSvo9bhaOGIPLVmUqmCw8UMtYeP37Zz88-uU4qt3kr18gVBIcu-N1r9orVPlNTaP4WYVAc1WkmlfaAA89KY3GSo',
    },
  ]);

  return (
    <div className="addr-container">
      {/* Page Header */}
      <div className="addr-header">
        <div className="addr-title-box">
          <h2>Addresses</h2>
          <p>Manage your shipping and billing locations for a faster checkout.</p>
        </div>

        <button className="addr-add-btn" type="button">
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
                <div
                  className="addr-map-snippet"
                  style={{ backgroundImage: `url(${addr.mapImage})` }}
                  aria-hidden="true"
                />

                <div className="addr-card-details">
                  <h3 className="addr-card-heading">
                    <span className="material-symbols-outlined addr-card-heading-icon">{addr.icon}</span>
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
                <button className="addr-set-default-link" type="button">
                  Set as Default
                </button>
              )}

              <div className="addr-footer-actions">
                <button className="addr-action-btn" type="button" title="Edit">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="addr-action-btn delete" type="button" title="Delete">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Placeholder Card */}
        <div className="addr-card addr-add-placeholder">
          <div className="addr-add-inner">
            <div className="addr-add-icon-wrap">
              <span className="material-symbols-outlined">add</span>
            </div>
            <h3>Add Another Address</h3>
            <p>For gifts or temporary locations</p>
          </div>
        </div>
      </div>

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
