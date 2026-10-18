import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

export function NotFound() {
  return (
    <main id="main" className="topo-bg flush" style={{ backgroundColor: 'var(--forest)', color: 'var(--on-forest)', minHeight: '64vh', display: 'grid', placeItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', padding: '80px var(--gutter)' }}>
        <p className="mono" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber)' }}>
          404 · No signal
        </p>
        <h1 className="display" style={{ fontSize: 'var(--fs-3xl)', marginTop: 12 }}>
          You're off trail.
        </h1>
        <p style={{ color: 'var(--on-forest-2)', maxWidth: 480, margin: '16px auto 0', fontSize: 17 }}>
          This page isn't on the map. Head back to the trailhead, or check your pack before you go.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-on-dark">
            <Icon name="home" size={16} /> Back to the trailhead
          </Link>
          <Link to="/pack" className="btn btn-outline-dark">
            Open the Pack Planner
          </Link>
        </div>
      </div>
    </main>
  );
}
