import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Page not found</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>This URL does not exist.</p>
      <Link to="/home" style={{ color: '#f97316', fontWeight: 700 }}>
        Go to home
      </Link>
    </div>
  );
}
