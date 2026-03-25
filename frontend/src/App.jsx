import { useState } from 'react';
import './App.css';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const recentOrders = [
    { id: '#ORD-28491', amount: '$245.00', date: 'Oct 12, 2023', status: 'IN TRANSIT' },
    { id: '#ORD-28455', amount: '$180.00', date: 'Sep 28, 2023', status: 'DELIVERED' }
  ];

  const wishlistItems = [
    { id: 1, name: 'Air Max Pulse', price: '$180.00', image: '👟' },
    { id: 2, name: 'Court Vision Low', price: '$85.00', image: '👟' }
  ];

  return (
    <div className='app-container'>
      {/* Header */}
      <header className='top-nav'>
        <div className='brand'>
          <div className='brand-main'>SoleVora</div>
          <div className='brand-sub'>THE SNEAKER MOVEMENT</div>
        </div>
        <nav className='menu-links'>
          <a href='#home'>Home</a>
          <a href='#category'>Category</a>
          <a href='#about'>About</a>
          <a href='#contact'>Contact</a>
        </nav>
        <div className='nav-icons'>
          <i className='fa-solid fa-cart-shopping'></i>
          <i className='fa-solid fa-user'></i>
          <i className='fa-solid fa-heart'></i>
        </div>
      </header>

      {/* Main Container */}
      <div className='main-wrapper'>
        {/* Left Sidebar */}
        <aside className='left-panel'>
          <section className='profile-user'>
            <div className='avatar-wrap'>
              <div className='avatar-head'></div>
            </div>
            <div className='profile-info'>
              <h2>Marcus Sterling</h2>
              <p className='member-badge'>GOLD MEMBER</p>
            </div>
          </section>

          <nav className='sidebar-nav'>
            <button 
              className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <i className='fa-solid fa-chart-line'></i>
              <span>Dashboard</span>
            </button>
            <button 
              className={`nav-item ${activeMenu === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveMenu('orders')}
            >
              <i className='fa-solid fa-bag-shopping'></i>
              <span>My Orders</span>
            </button>
            <button 
              className={`nav-item ${activeMenu === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveMenu('wishlist')}
            >
              <i className='fa-solid fa-heart'></i>
              <span>Wishlist</span>
            </button>
            <button 
              className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveMenu('settings')}
            >
              <i className='fa-solid fa-gear'></i>
              <span>Account Settings</span>
            </button>
            <button 
              className={`nav-item ${activeMenu === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveMenu('addresses')}
            >
              <i className='fa-solid fa-map-location-dot'></i>
              <span>Addresses</span>
            </button>
          </nav>

          <button className='logout-btn'>
            <i className='fa-solid fa-arrow-right-from-bracket'></i>
            <span>Logout</span>
          </button>

          <div className='promo-card'>
            <div className='promo-label'>EXCLUSIVE OFFER</div>
            <h3>20% Off New Releases</h3>
            <p>Use code SOLEVORA20 at checkout</p>
            <button className='shop-now-btn'>SHOP NOW</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className='main-content'>
          <section className='welcome-section'>
            <div className='welcome-text'>
              <h1>Welcome back, Marcus!</h1>
              <p>You have 2 items arriving soon and 1250 points to spend.</p>
            </div>
            <button className='upgrade-btn'>
              <i className='fa-solid fa-arrow-trend-up'></i>
              Upgrade Plan
            </button>
          </section>

          <section className='stats-grid'>
            <div className='stat-card'>
              <div className='stat-header'>
                <span className='stat-label'>Solevora Points</span>
                <i className='fa-solid fa-circle-info'></i>
              </div>
              <div className='stat-value'>2,450</div>
              <div className='stat-growth'>↑ 15% from last month</div>
            </div>

            <div className='stat-card'>
              <div className='stat-header'>
                <span className='stat-label'>Membership</span>
                <i className='fa-solid fa-circle-info'></i>
              </div>
              <div className='stat-value'>Gold Tier</div>
              <div className='stat-growth'>550 pts until Platinum</div>
            </div>

            <div className='stat-card'>
              <div className='stat-header'>
                <span className='stat-label'>Total Spent</span>
                <i className='fa-solid fa-circle-info'></i>
              </div>
              <div className='stat-value'>$1,892.40</div>
              <div className='stat-growth'>Across 12 orders</div>
            </div>
          </section>

          <section className='content-grid'>
            <div className='left-col'>
              <div className='section-header'>
                <h2>Recent Orders</h2>
                <a href='#view-all' className='view-all-link'>View All</a>
              </div>
              <div className='orders-container'>
                {recentOrders.map((order) => (
                  <div key={order.id} className='order-item'>
                    <div className='order-image'>
                      <i className='fa-solid fa-shoe-prints'></i>
                    </div>
                    <div className='order-details'>
                      <div className='order-id'>{order.id}</div>
                      <div className='order-date'>Placed on {order.date}</div>
                      <div className={`order-status ${order.status.replace(' ', '-').toLowerCase()}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className='order-amount'>{order.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className='right-col'>
              <div className='section-header'>
                <h2>Active Wishlist</h2>
                <a href='#manage' className='view-all-link'>Manage</a>
              </div>
              <div className='wishlist-container'>
                {wishlistItems.map((item) => (
                  <div key={item.id} className='wishlist-item'>
                    <div className='item-image'>{item.image}</div>
                    <div className='item-name'>{item.name}</div>
                    <div className='item-price'>{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='profile-overview'>
            <h2>Profile Overview</h2>
            <div className='overview-grid'>
              <div className='overview-item'>
                <div className='icon-box'>
                  <i className='fa-solid fa-envelope'></i>
                </div>
                <div className='info-box'>
                  <label>EMAIL ADDRESS</label>
                  <p>marcus.s@solevora.com</p>
                </div>
                <button className='edit-btn'>EDIT</button>
              </div>

              <div className='overview-item'>
                <div className='icon-box'>
                  <i className='fa-solid fa-phone'></i>
                </div>
                <div className='info-box'>
                  <label>PHONE NUMBER</label>
                  <p>+1 (555) 123-4567</p>
                </div>
                <button className='edit-btn'>EDIT</button>
              </div>

              <div className='overview-item'>
                <div className='icon-box'>
                  <i className='fa-solid fa-house'></i>
                </div>
                <div className='info-box'>
                  <label>DEFAULT ADDRESS</label>
                  <p>2691 Madison Ave, New York, NY 10016</p>
                </div>
                <button className='edit-btn'>EDIT</button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className='footer'>
        <a href='#privacy'>Privacy Policy</a>
        <a href='#terms'>Terms of Service</a>
        <a href='#help'>Help Center</a>
        <p className='footer-copyright'>© 2024 Solevora Sneakers Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
