import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import s from './Makers.module.css';
import { Icon } from '../components/Icon';
import { Img } from '../components/ui';
import { MAKERS } from '../data/makers';
import { PRODUCTS } from '../data/products';
import { img } from '../data/img';
import { usePrefs } from '../context/PrefsContext';
import { money, weight } from '../lib/format';

export function Makers() {
  const { units } = usePrefs();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    return () => window.clearTimeout(t);
  }, [hash]);

  const people = MAKERS.reduce((n, m) => n + m.team, 0);

  return (
    <main id="main">
      <section className={`${s.hero} topo-bg`}>
        <div className="container">
          <p className={s.eyebrow}>The makers</p>
          <h1 className="display" style={{ fontSize: 'var(--fs-3xl)' }}>
            Seven workshops.
            <br />
            No warehouses.
          </h1>
          <p className={s.lede}>
            {people} people across {MAKERS.length} small shops in the American West design, test and repair everything we sell. We pick them for the numbers, then weigh every item ourselves to make sure the numbers hold.
          </p>
          <nav className={s.index} aria-label="Makers">
            {MAKERS.map((m) => (
              <a key={m.id} href={`#${m.id}`} onClick={(e) => {
                e.preventDefault();
                document.getElementById(m.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>
                {m.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container">
        {MAKERS.map((m, i) => {
          const items = PRODUCTS.filter((p) => p.makerId === m.id).sort((a, b) => a.measuredGrams - b.measuredGrams);
          const days = items.reduce((n, p) => n + p.fieldTest.days, 0);
          return (
            <section key={m.id} id={m.id} className={s.maker} aria-labelledby={`m-${m.id}`}>
              <div className={s.media} data-flip={i % 2 === 1}>
                <Img id={m.img} alt="" w={900} ratio="4 / 3" sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
              <div className={s.body}>
                <p className="eyebrow">
                  <Icon name="pin" size={12} /> {m.place}
                </p>
                <h2 id={`m-${m.id}`} className="h1">
                  {m.name}
                </h2>
                <p className={s.makes}>{m.makes}</p>
                <dl className={s.facts}>
                  <div>
                    <dt>Founded</dt>
                    <dd className="num">{m.founded}</dd>
                  </div>
                  <div>
                    <dt>Team</dt>
                    <dd className="num">{m.team}</dd>
                  </div>
                  <div>
                    <dt>Products here</dt>
                    <dd className="num">{items.length}</dd>
                  </div>
                  <div>
                    <dt>Field-test days</dt>
                    <dd className="num">{days}</dd>
                  </div>
                </dl>
                <p className={s.story}>{m.story}</p>
                <blockquote className={s.quote}>“{m.quote}”</blockquote>
                <ul className={s.products}>
                  {items.map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.id}`}>
                        <img src={img(p.img, 96, 96)} alt="" loading="lazy" />
                        <span className={s.pName}>{p.name}</span>
                        <span className="num">{weight(p.measuredGrams, units)}</span>
                        <span className="num muted">{money(p.price)}</span>
                        <Icon name="chevR" size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
