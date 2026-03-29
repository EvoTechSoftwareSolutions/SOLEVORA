import React from 'react'

function Toggle({ on = false }) {
  return (
    <button className={`toggle ${on ? 'on' : ''}`} type="button" aria-label="toggle setting">
      <span className="knob" />
    </button>
  )
}

function Icon({ label }) {
  return <span className="icon-chip">{label}</span>
}

export default function App() {
  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="logo-box">
          <img src="/assets/logo.svg" alt="SoleVero" />
        </div>

        <nav className="top-nav">
          <a href="#">Home</a>
          <a href="#">Category</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        <div className="top-actions" aria-label="quick actions">
          <span>🛒</span>
          <span>👤</span>
          <span>♥</span>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="profile-card">
            <div className="avatar">👨🏻</div>
            <div>
              <p className="name">Marcus Sterling</p>
              <p className="tier">GOLD MEMBER</p>
            </div>
          </div>

          <div className="menu">
            <button className="menu-item"><Icon label="⌗" />Dashboard</button>
            <button className="menu-item"><Icon label="◔" />My Orders</button>
            <button className="menu-item"><Icon label="♡" />Wishlist</button>
            <button className="menu-item active"><Icon label="⚙" />Account Settings</button>
            <button className="menu-item"><Icon label="⌖" />Addresses</button>
          </div>

          <button className="logout"><Icon label="↪" />Logout</button>

          <div className="offer-box">
            <p className="offer-label">EXCLUSIVE OFFER</p>
            <p className="offer-title">20% Off New Releases</p>
            <p className="offer-sub">Use code SOLEVERA20 at checkout.</p>
            <button className="shop-btn" type="button">SHOP NOW</button>
          </div>
        </aside>

        <main className="main">
          <section className="title-block">
            <h1>Account Management</h1>
            <p>Review your information and update your security preferences.</p>
          </section>

          <section className="card">
            <div className="card-head"><Icon label="◉" />Profile Information</div>
            <div className="grid two">
              <div className="field">
                <label>Full Name</label>
                <input value="Alex Morgan" readOnly />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input value="alex.morgan@example.com" readOnly />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input value="+1 (555) 000-0000" readOnly />
              </div>
              <div className="field">
                <label>Location</label>
                <input value="San Francisco, CA" readOnly />
              </div>
            </div>
            <div className="action-row">
              <button type="button" className="primary">Save Changes</button>
            </div>
          </section>

          <section className="card">
            <div className="card-head"><Icon label="🛡" />Security</div>
            <div className="grid one">
              <div className="field full">
                <label>Current Password</label>
                <input value="••••••••" readOnly />
              </div>
            </div>

            <div className="grid two">
              <div className="field">
                <label>New Password</label>
                <input value="Min. 8 characters" readOnly />
              </div>
              <div className="field">
                <label>Confirm New Password</label>
                <input value="Re-type new password" readOnly />
              </div>
            </div>

            <div className="two-factor">
              <div>
                <p className="tf-title"><Icon label="🛡" />Two-Factor Authentication</p>
                <p className="tf-sub">Secure your account with an extra layer of protection</p>
              </div>
              <Toggle on={false} />
            </div>

            <div className="action-row">
              <button type="button" className="primary">Update Password</button>
            </div>
          </section>

          <section className="card">
            <div className="card-head"><Icon label="⚙" />Preferences</div>

            <div className="pref-row">
              <div>
                <p className="pref-title"><Icon label="✉" />Newsletter</p>
                <p className="pref-sub">Weekly solar insights and energy saving tips</p>
              </div>
              <Toggle on />
            </div>

            <div className="pref-row">
              <div>
                <p className="pref-title"><Icon label="🔔" />Push Notifications</p>
                <p className="pref-sub">Get alerts about your panel performance in real-time</p>
              </div>
              <Toggle on />
            </div>

            <div className="pref-row">
              <div>
                <p className="pref-title"><Icon label="◫" />Usage Reports</p>
                <p className="pref-sub">Monthly breakdown of your energy consumption</p>
              </div>
              <Toggle on={false} />
            </div>

            <div className="action-row">
              <button type="button" className="primary">Save Preferences</button>
            </div>
          </section>

          <section className="delete-zone">
            <div>
              <p className="delete-title">Delete Account</p>
              <p className="delete-text">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button type="button" className="danger">Delete Account</button>
          </section>
        </main>
      </div>
    </div>
  )
}
