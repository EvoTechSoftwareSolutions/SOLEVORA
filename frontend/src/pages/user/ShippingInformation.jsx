import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import Modal from '../../components/ui/Modal';
import { API_URL } from '../../config/api';
import '../../styles/user/ShippingInformation.css';

const FALLBACK =
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' ` +
  `width='80' height='80' viewBox='0 0 80 80'%3E` +
  `%3Crect width='80' height='80' fill='%23f3f4f6'/%3E` +
  `%3Cpath d='M20 55l14-18 10 12 8-10 14 16H20z' fill='%23d1d5db'/%3E` +
  `%3Ccircle cx='52' cy='28' r='7' fill='%23d1d5db'/%3E%3C/svg%3E`;

const handleImgError = (e) => {
  if (e.target.src !== FALLBACK) e.target.src = FALLBACK;
};

const ShippingInformation = () => {
  const navigate = useNavigate();

  // ✅ only use selected items for checkout flow
  const { selectedCart, selectedTotal } = useCart();
  const cart = selectedCart; // Map to local naming convention
  const cartTotal = selectedTotal;

  // local promo state
  const initialPromoCode = sessionStorage.getItem('checkoutPromoCode') || '';
  const initialPromoDiscount = Number(sessionStorage.getItem('checkoutPromoDiscount')) || 0;

  const [promoCode, setPromoCode] = useState(initialPromoCode);
  const [promoApplied, setPromoApplied] = useState(initialPromoDiscount > 0);
  const [promoData, setPromoData] = useState(initialPromoDiscount > 0 ? { code: initialPromoCode, discountAmount: initialPromoDiscount } : null); 
  const [promoLoading, setPromoLoading] = useState(false);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 2500);
  };

  // pre-fill form from localStorage user
  const [formData, setFormData] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      return {
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        streetAddress: user.streetAddress || user.location || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'Sri Lanka',
        userId: user.id || null,
      };
    } catch {
      return {
        fullName: '', email: '', phone: '',
        streetAddress: '', city: '', postalCode: '',
        country: 'Sri Lanka', userId: null,
      };
    }
  });

  // fetch user profile and saved addresses
  useEffect(() => {
    if (!formData.userId) return;
    
    const fetchUserData = async () => {
      try {
        // Fetch latest user profile data
        const token = localStorage.getItem('auth_token');
        if (token) {
          const profileRes = await axios.get(`/user/${formData.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Only update form if fields are empty or different from current values
          setFormData(prev => {
            const hasEmptyOrDifferentFields = 
              !prev.fullName || prev.fullName !== profileRes.data.name ||
              !prev.email || prev.email !== profileRes.data.email ||
              !prev.phone || prev.phone !== profileRes.data.phone ||
              !prev.streetAddress || prev.streetAddress !== profileRes.data.streetAddress ||
              !prev.city || prev.city !== profileRes.data.city ||
              !prev.postalCode || prev.postalCode !== profileRes.data.postalCode ||
              !prev.country || prev.country !== profileRes.data.country;
            
            if (hasEmptyOrDifferentFields) {
              return {
                ...prev,
                fullName: prev.fullName || profileRes.data.name || '',
                email: prev.email || profileRes.data.email || '',
                phone: prev.phone || profileRes.data.phone || '',
                streetAddress: prev.streetAddress || profileRes.data.streetAddress || profileRes.data.location || '',
                city: prev.city || profileRes.data.city || '',
                postalCode: prev.postalCode || profileRes.data.postalCode || '',
                country: prev.country || profileRes.data.country || 'Sri Lanka',
              };
            }
            return prev;
          });
        }

        // Fetch saved addresses
        const res = await axios.get(`/addresses/${formData.userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const addresses = res.data.data || [];
        setSavedAddresses(addresses);
        
        const def = addresses.find(a => a.isDefault);
        if (def && !formData.streetAddress) applySavedAddress(def);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    
    fetchUserData();
  }, [formData.userId]);

  const applySavedAddress = (addr) => {
    setFormData(prev => ({
      ...prev,
      fullName: addr.name || prev.fullName,
      phone: addr.phone || prev.phone,
      streetAddress: addr.street || prev.streetAddress,
      city: addr.city || prev.city,
      postalCode: addr.postalCode || prev.postalCode,
      country: addr.country || prev.country,
    }));
  };

  const refreshFromProfile = async () => {
    if (!formData.userId) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        showToast('Please login to refresh profile data');
        return;
      }

      const profileRes = await axios.get(`/user/${formData.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData(prev => ({
        ...prev,
        fullName: profileRes.data.name || '',
        email: profileRes.data.email || '',
        phone: profileRes.data.phone || '',
        streetAddress: profileRes.data.streetAddress || profileRes.data.location || '',
        city: profileRes.data.city || '',
        postalCode: profileRes.data.postalCode || '',
        country: profileRes.data.country || 'Sri Lanka',
      }));
      
      setProfileLoaded(true);
      showToast('Shipping information updated from your profile');
      setTimeout(() => setProfileLoaded(false), 3000);
    } catch (error) {
      console.error('Failed to refresh profile data:', error);
      showToast('Failed to refresh profile data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ price calculation — uses cartTotal from context
  const grossTotal = cartTotal;
  const promoDiscount = promoApplied ? (promoData?.discountAmount || 0) : 0;
  const total = grossTotal - promoDiscount;

  // apply promo code
  const handleApplyPromo = async () => {
    const trimmed = promoCode.trim();
    if (!trimmed) { showToast('Please enter a promo code first.'); return; }
    setPromoLoading(true);
    try {
      const { data } = await axios.post('/promo/validate', {
        code: trimmed,
        orderAmount: grossTotal,
      });
      setPromoApplied(true);
      setPromoData({ code: data.code, discountAmount: data.discountAmount });
      sessionStorage.setItem('checkoutPromoCode', data.code);
      sessionStorage.setItem('checkoutPromoDiscount', String(data.discountAmount));
      showToast(`Promo applied! ${data.message}`);
    } catch (err) {
      setPromoApplied(false);
      setPromoData(null);
      showToast(err.response?.data?.message || 'Invalid promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setPromoData(null);
    setPromoCode('');
    sessionStorage.setItem('checkoutPromoCode', '');
    sessionStorage.setItem('checkoutPromoDiscount', '0');
  };

  // continue to next step — save form to sessionStorage so ShippingMethod can read it
  const handleContinue = () => {
    if (!formData.fullName || !formData.email || !formData.streetAddress) {
      showToast('Please fill in all required shipping fields.');
      return;
    }

    const symbolRegex = /[!@#$%^&*()_+={}\[\]:;"'<>?|\\]/;
    if (symbolRegex.test(formData.fullName)) {
      showToast('Name should not contain special symbols.');
      return;
    }

    const addressFields = {
      'Street Address': formData.streetAddress,
      'City': formData.city,
      'Postal Code': formData.postalCode,
      'Country': formData.country
    };

    for (const [label, value] of Object.entries(addressFields)) {
      if (value && symbolRegex.test(value)) {
        showToast(`${label} should not contain special symbols.`);
        return;
      }
    }


    const phoneRegex = /^[0-9+-\s()]*$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      showToast('Invalid phone number format.');
      return;
    }
    // ✅ persist shipping data via sessionStorage (no longer in context)
    sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
    sessionStorage.setItem('checkoutGrossTotal', String(grossTotal));
    sessionStorage.setItem('checkoutPromoDiscount', String(promoDiscount));
    sessionStorage.setItem('checkoutPromoCode', promoApplied && promoData ? promoData.code : '');
    navigate('/shipping-method');
  };

  // empty cart guard
  if (cart.length === 0) {
    return (
      <div className="si-page">
        <div className="si-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before proceeding to checkout.</p>
          <Link to="/category" className="si-form-continue-btn" style={{ display: 'inline-block', width: 'auto', marginTop: '20px' }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="si-page">
      <div className="si-container">

        {/* Breadcrumb */}
        <nav className="si-breadcrumb">
          <Link to="/">Home</Link>
          <span className="si-bc-sep">/</span>
          <Link to="/cart">Cart</Link>
          <span className="si-bc-sep">/</span>
          <span className="si-bc-current">Shipping Information</span>
        </nav>

        {/* Stepper */}
        <div className="si-stepper-wrap">
          <div className="si-stepper">
            <div className="si-step-item">
              <div className="si-circle si-circle-active">1</div>
              <span className="si-step-lbl si-lbl-active">Shipping</span>
            </div>
            <div className="si-connector"><div className="si-connector-fill"></div></div>
            <div className="si-step-item">
              <div className="si-circle si-circle-idle">2</div>
              <span className="si-step-lbl si-lbl-idle">Method</span>
            </div>
            <div className="si-connector si-connector-empty"></div>
            <div className="si-step-item">
              <div className="si-circle si-circle-idle">3</div>
              <span className="si-step-lbl si-lbl-idle">Payment</span>
            </div>
          </div>
          <p className="si-step-desc">Step 1 of 3: Enter your delivery information</p>
        </div>

        <div className="si-grid">

          {/* Shipping Form */}
          <div className="si-form-card">
            <div className="si-form-heading">
              <span className="si-truck-icon">🚚</span>
              <h2 className="si-form-title">Shipping Information</h2>
              {formData.userId && (
                <button 
                  type="button" 
                  onClick={refreshFromProfile}
                  className="si-refresh-profile-btn"
                  title="Refresh data from your profile"
                >
                  <span className="material-symbols-outlined">refresh</span>
                  From Profile
                </button>
              )}
            </div>
            
            {profileLoaded && (
              <div className="si-profile-loaded-notice">
                <span className="material-symbols-outlined">check_circle</span>
                Information updated from your profile
              </div>
            )}

            <div className="si-form">
              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="si-saved-addresses">
                  <label className="si-label">Use Saved Address</label>
                  <div className="si-address-pills">
                    {savedAddresses.map(addr => (
                      <button key={addr.id} type="button"
                        onClick={() => applySavedAddress(addr)}
                        className={`si-address-pill ${formData.streetAddress === addr.street ? 'active' : ''}`}>
                        <span className="material-symbols-outlined">{addr.icon || 'home'}</span>
                        {addr.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="si-field">
                <label className="si-label">Full Name *</label>
                <input type="text" name="fullName" placeholder="John Doe"
                  value={formData.fullName} onChange={handleInputChange} className="si-input" />
              </div>

              <div className="si-row-2">
                <div className="si-field">
                  <label className="si-label">Email Address *</label>
                  <input type="email" name="email" placeholder="john@example.com"
                    value={formData.email} onChange={handleInputChange} className="si-input" />
                </div>
                <div className="si-field">
                  <label className="si-label">Phone Number</label>
                  <input type="tel" name="phone" placeholder="+94 77 000 0000"
                    value={formData.phone} onChange={handleInputChange} className="si-input" />
                </div>
              </div>

              <div className="si-field">
                <label className="si-label">Street Address *</label>
                <input type="text" name="streetAddress" placeholder="123 Luxury Lane"
                  value={formData.streetAddress} onChange={handleInputChange} className="si-input" />
              </div>

              <div className="si-row-2">
                <div className="si-field">
                  <label className="si-label">City</label>
                  <input type="text" name="city" placeholder="Colombo"
                    value={formData.city} onChange={handleInputChange} className="si-input" />
                </div>
                <div className="si-field">
                  <label className="si-label">Postal Code</label>
                  <input type="text" name="postalCode" placeholder="10001"
                    value={formData.postalCode} onChange={handleInputChange} className="si-input" />
                </div>
              </div>

              <div className="si-field">
                <label className="si-label">Country</label>
                <input type="text" name="country" placeholder="Sri Lanka"
                  value={formData.country} onChange={handleInputChange} className="si-input" />
              </div>

              {/* Toast */}
              {isToastOpen && <div className="toast">{toastMsg}</div>}

              <div className="si-continue-btn-container">
                <button type="button" className="si-form-continue-btn" onClick={handleContinue}>
                  Continue to Shipping Method
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="si-summary-card">
            <h3 className="si-summary-title">Order Summary</h3>

            <div className="si-items-scroll">
              {cart.map(item => (
                <div key={item.id} className="si-item-card">
                  <div className="si-item-img-wrap">
                    {/* ✅ image_url comes from CartContext fetchCart */}
                    <img
                      src={item.image_url || FALLBACK}
                      alt={item.name}
                      className="si-item-img"
                      onError={handleImgError}
                    />
                    <span className="si-qty-badge">{item.quantity}</span>
                  </div>
                  <p className="si-item-name">{item.name}</p>
                  <p className="si-item-variant">Size: {item.size}</p>
                  <div className="si-item-footer">
                    <span className="si-item-qty-lbl">Qty: {item.quantity}</span>
                    <span className="si-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="si-promo">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); if (promoApplied) removePromo(); }}
                className="si-promo-input"
                disabled={promoApplied}
              />
              {promoApplied ? (
                <button type="button" onClick={removePromo} className="si-promo-btn si-promo-remove">Remove</button>
              ) : (
                <button type="button" onClick={handleApplyPromo} className="si-promo-btn" disabled={promoLoading}>
                  {promoLoading ? '...' : 'Apply'}
                </button>
              )}
            </div>
            {promoApplied && (
              <div className="si-promo-badge">
                ✅ <strong>{promoData?.code}</strong> — Rs. {promoDiscount.toLocaleString()} off
              </div>
            )}

            {/* Totals */}
            <div className="si-totals">
              <div className="si-total-row">
                <span className="si-total-key">Gross Total</span>
                <span className="si-total-val">Rs. {grossTotal.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="si-total-row" style={{ color: '#22c55e' }}>
                  <span className="si-total-key">Promo Discount ({promoData?.code})</span>
                  <span className="si-total-val">-Rs. {promoDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="si-total-row">
                <span className="si-total-key">Shipping</span>
                <span className="si-free">Free</span>
              </div>
              <div className="si-total-final">
                <span className="si-final-label">Total</span>
                <span className="si-final-amount">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <p className="si-terms">
              By placing your order, you agree to Solevora's{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalContent.title}
          actions={<button className="modal-btn modal-btn-confirm" onClick={() => setIsModalOpen(false)}>Got it</button>}
        >
          <p>{modalContent.body}</p>
        </Modal>

      </div>
    </div>
  );
};

export default ShippingInformation;
