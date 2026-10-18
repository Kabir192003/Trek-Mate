import { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './Footer.module.css';
import { Icon } from './Icon';
import { LogoMark } from './LogoMark';
import { SYSTEMS } from '../data/systems';
import { MAKERS } from '../data/makers';
import { usePrefs } from '../context/PrefsContext';
import { Segmented } from './ui';

const PROMISES = [
  { icon: 'scale' as const, title: 'Weighed in-house', body: 'Every listing shows what it weighed on our scale, beside the maker\'s figure.' },
  { icon: 'route' as const, title: 'Field-tested first', body: 'Nothing goes live until testers have carried it on real routes.' },
  { icon: 'return' as const, title: '60-day returns', body: 'Used it on a trip and it was wrong for you? Send it back.' },
  { icon: 'edit' as const, title: 'Repairs, not landfill', body: 'Makers repair what they sell. We route the parcel.' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { units, setUnits } = usePrefs();

  return (
    <footer className={s.footer}>
      <div className={`container ${s.promises}`}>
        {PROMISES.map((p) => (
          <div key={p.title} className={s.promise}>
            <Icon name={p.icon} size={22} />
            <div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`container ${s.grid}`}>
        <div className={s.brandCol}>
          <Link to="/" className={s.brand}>
            <LogoMark size={26} onDark />
            Trek Mate
          </Link>
          <p>Gear from independent makers, weighed on our own scale and planned as a whole pack. Carry less, and know exactly why.</p>
          <div className={s.units}>
            <span className={s.unitsLabel}>Weights in</span>
            <Segmented
              dark
              label="Weight units"
              value={units}
              onChange={setUnits}
              options={[
                { value: 'metric', label: 'g / kg' },
                { value: 'imperial', label: 'oz / lb' },
              ]}
            />
          </div>
        </div>

        <div>
          <h3 className={s.head}>Shop by system</h3>
          <ul className={s.list}>
            {SYSTEMS.map((sy) => (
              <li key={sy.id}>
                <Link to={`/shop?sys=${sy.id}`}>{sy.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={s.head}>Makers</h3>
          <ul className={s.list}>
            {MAKERS.map((m) => (
              <li key={m.id}>
                <Link to={`/shop?maker=${m.id}`}>{m.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={s.head}>Field notes</h3>
          <p className={s.copy}>One email a month: new gear off the scale, field-test results and route reports. No sales countdowns.</p>
          {sent ? (
            <p className={s.sent}>
              <Icon name="check" size={16} /> You're on the list.
            </p>
          ) : (
            <form
              className={s.form}
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes('@')) setSent(true);
              }}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input id="footer-email" className="input" type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="btn btn-on-dark">
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className={`container ${s.bottom}`}>
        <span>© 2026 Trek Mate · Portland, Oregon</span>
        <span className="mono">45.5152° N · 122.6784° W</span>
      </div>
    </footer>
  );
}
