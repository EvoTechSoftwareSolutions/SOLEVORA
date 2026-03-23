import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/status');
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        console.error('Backend connection failed:', err);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className='App'>
      <div className='glass-card'>
        <h1>SoleVora</h1>
        <p className='subtitle'>Premium Full-Stack Integrated Solution</p>
        
        <div className='content-section'>
          <p>This is your initial workspace for SoleVora development.</p>
          <p>Both frontend and backend are initialized and ready to go.</p>
        </div>

        <div className='status-container'>
          {loading ? (
            <div className='status-badge'>Checking backend...</div>
          ) : status ? (
            <div className='status-badge'>
              <div className='status-dot'></div>
              Backend: {status.status} ({status.service})
            </div>
          ) : (
            <div className='status-badge error'>
              <div className='status-dot error'></div>
              Backend Offline (Start it in @backend)
            </div>
          )}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <a href="#" className='btn-primary'>Documentation</a>
        </div>
      </div>
    </div>
  );
}

export default App;
