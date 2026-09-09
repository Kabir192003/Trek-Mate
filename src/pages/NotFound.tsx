import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

export function NotFound() {
  return (
    <div className="tm-container" style={{ padding: '100px 40px', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: 99, margin: '0 auto', background: 'var(--tm-beige-c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="compass" size={32} color="var(--tm-text-soft)" />
      </div>
      <h1 style={{ fontFamily: 'var(--tm-sans)', fontSize: 30, fontWeight: 700, marginTop: 22 }}>Off the map.</h1>
      <p style={{ fontSize: 14, color: 'var(--tm-text-soft)', marginTop: 8 }}>We couldn't find that page.</p>
      <Link
        to="/"
        className="tm-btn tm-btn-primary"
        style={{ display: 'inline-block', marginTop: 24, padding: '13px 26px', borderRadius: 99, fontSize: 13.5, fontWeight: 600 }}
      >
        Back to home
      </Link>
    </div>
  );
}
