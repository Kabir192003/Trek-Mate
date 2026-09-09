import { useRef, useState } from 'react';
import { Icon, TopoSvg } from '../components/Icon';
import { useProfile, type NotificationSettings } from '../context/ProfileContext';
import { productImg } from '../data/products';
import { ORDERS } from '../data/products';
import type { Address, PaymentMethod } from '../data/types';
import styles from './Profile.module.css';

type TabId = 'account' | 'orders' | 'addresses' | 'payment' | 'notifications';
const TABS: [TabId, string][] = [
  ['account', 'Account'],
  ['orders', 'Orders'],
  ['addresses', 'Addresses'],
  ['payment', 'Payment'],
  ['notifications', 'Notifications'],
];

export function Profile() {
  const [tab, setTab] = useState<TabId>('account');
  const { profile, updateProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  function onAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="tm-container" style={{ padding: '40px 40px 100px' }}>
      <div className={styles.title}>Profile</div>
      <div className="tm-profile-grid">
        <div>
          <div className={styles.userCard}>
            <TopoSvg color="rgba(250,247,241,0.10)" />
            <div className={styles.userCardInner}>
              <button className={styles.avatarBtn} onClick={() => fileRef.current?.click()} aria-label="Change avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <img src={productImg('photo-1500648767791-00dcc994a43e', 160, 160)} alt={profile.name} />
                )}
                <div className={styles.avatarEdit}>
                  <Icon name="edit" size={12} color="#fff" />
                </div>
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarPick} className="tm-visually-hidden" />
              <div>
                <div className={styles.userName}>{profile.name}</div>
                <div className={styles.userLocation}>{profile.location}</div>
              </div>
            </div>
          </div>
          <div className={styles.tabList}>
            {TABS.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={styles.tabBtn} data-active={tab === id}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          {tab === 'account' && <AccountTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'addresses' && <AddressesTab />}
          {tab === 'payment' && <PaymentTab />}
          {tab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}

function AccountTab() {
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function startEdit() {
    setForm(profile);
    setEditing(true);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    updateProfile(form);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div>
        <div className={styles.panelHead}>
          <div className={styles.panelHeadTitle}>Account details</div>
          <button onClick={startEdit} className={styles.editBtn}>
            <Icon name="edit" size={14} color="var(--tm-text)" /> Edit
          </button>
        </div>
        <div className="tm-account-grid">
          {(
            [
              ['Full name', profile.name],
              ['Email', profile.email],
              ['Phone', profile.phone],
              ['Location', profile.location],
              ['Member since', profile.memberSince],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <div className={styles.fieldLabel}>{k}</div>
              <div className={styles.fieldValue}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={save}>
      <div className={styles.panelHead}>
        <div className={styles.panelHeadTitle}>Edit account details</div>
      </div>
      <div className="tm-account-grid">
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Full name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Phone</span>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Location</span>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </label>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={`tm-btn tm-btn-primary ${styles.saveBtn}`}>
          Save changes
        </button>
        <button type="button" onClick={() => setEditing(false)} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function OrdersTab() {
  return (
    <div className={styles.list}>
      {ORDERS.map((o) => (
        <div key={o.id} className={styles.orderRow}>
          <div>
            <div className={styles.mono}>#{o.id}</div>
            <div className={styles.rowMeta}>
              {o.date} · {o.itemCount} {o.itemCount === 1 ? 'item' : 'items'} · ${o.total.toFixed(2)}
            </div>
          </div>
          <div className={styles.statusPill} data-status={o.status}>
            {o.status}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddressesTab() {
  const { addresses, addAddress, updateAddress, removeAddress } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const empty = { label: '', name: '', line: '', city: '' };
  const [form, setForm] = useState<Omit<Address, 'id'>>(empty);

  function startAdd() {
    setForm(empty);
    setEditingId(null);
    setShowForm(true);
  }
  function startEdit(a: Address) {
    setForm({ label: a.label, name: a.name, line: a.line, city: a.city });
    setEditingId(a.id);
    setShowForm(true);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) updateAddress(editingId, form);
    else addAddress(form);
    setShowForm(false);
  }

  return (
    <div>
      <div className={styles.panelHead}>
        <div className={styles.panelHeadTitle}>Saved addresses</div>
        {!showForm && (
          <button onClick={startAdd} className={styles.editBtn}>
            <Icon name="plus" size={14} color="var(--tm-text)" /> Add address
          </button>
        )}
      </div>
      {showForm && (
        <form onSubmit={submit} className={styles.inlineForm}>
          <div className="tm-account-grid">
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Label</span>
              <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home, Cabin, Trailhead…" required />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Recipient name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Street address</span>
              <input value={form.line} onChange={(e) => setForm({ ...form, line: e.target.value })} required />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>City, state, zip</span>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </label>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={`tm-btn tm-btn-primary ${styles.saveBtn}`}>
              {editingId ? 'Save address' : 'Add address'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className={styles.list}>
        {addresses.map((a) => (
          <div key={a.id} className={styles.addressCard}>
            <div>
              <div className={styles.rowTitle}>
                {a.name} · {a.label}
              </div>
              <div className={styles.rowMeta}>
                {a.line}, {a.city}
              </div>
            </div>
            <div className={styles.rowActions}>
              <button onClick={() => startEdit(a)} aria-label="Edit address">
                <Icon name="edit" size={15} color="var(--tm-text-soft)" />
              </button>
              <button onClick={() => removeAddress(a.id)} aria-label="Remove address">
                <Icon name="trash" size={15} color="var(--tm-text-soft)" />
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && <div className={styles.rowMeta}>No saved addresses yet.</div>}
      </div>
    </div>
  );
}

function PaymentTab() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [kind, setKind] = useState<PaymentMethod['kind']>('card');
  const [last4, setLast4] = useState('');
  const [expiry, setExpiry] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (kind === 'card') {
      addPaymentMethod({ kind: 'card', label: `Card ending in ${last4}`, sub: `Expires ${expiry}` });
    } else {
      addPaymentMethod({ kind: 'paypal', label: 'PayPal', sub: paypalEmail });
    }
    setLast4('');
    setExpiry('');
    setPaypalEmail('');
    setShowForm(false);
  }

  return (
    <div>
      <div className={styles.panelHead}>
        <div className={styles.panelHeadTitle}>Payment methods</div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className={styles.editBtn}>
            <Icon name="plus" size={14} color="var(--tm-text)" /> Add method
          </button>
        )}
      </div>
      {showForm && (
        <form onSubmit={submit} className={styles.inlineForm}>
          <div className={styles.kindToggle}>
            <button type="button" onClick={() => setKind('card')} data-active={kind === 'card'}>
              Card
            </button>
            <button type="button" onClick={() => setKind('paypal')} data-active={kind === 'paypal'}>
              PayPal
            </button>
          </div>
          {kind === 'card' ? (
            <div className="tm-account-grid">
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Last 4 digits</span>
                <input value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} required placeholder="4242" />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Expiry</span>
                <input value={expiry} onChange={(e) => setExpiry(e.target.value)} required placeholder="MM/YY" />
              </label>
            </div>
          ) : (
            <label className={styles.field}>
              <span className={styles.fieldLabel}>PayPal email</span>
              <input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} required placeholder="you@email.com" />
            </label>
          )}
          <div className={styles.formActions}>
            <button type="submit" className={`tm-btn tm-btn-primary ${styles.saveBtn}`}>
              Add method
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className={styles.list}>
        {paymentMethods.map((m) => (
          <div key={m.id} className={styles.addressCard}>
            <div className={styles.rowFlex}>
              <Icon name="card" size={20} color="var(--tm-text-soft)" />
              <div>
                <div className={styles.rowTitle}>{m.label}</div>
                <div className={styles.rowMeta}>{m.sub}</div>
              </div>
            </div>
            <div className={styles.rowActions}>
              <button onClick={() => removePaymentMethod(m.id)} aria-label="Remove payment method">
                <Icon name="trash" size={15} color="var(--tm-text-soft)" />
              </button>
            </div>
          </div>
        ))}
        {paymentMethods.length === 0 && <div className={styles.rowMeta}>No saved payment methods yet.</div>}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const { notifications, toggleNotification } = useProfile();
  const rows: [keyof NotificationSettings, string][] = [
    ['orderUpdates', 'Order updates'],
    ['restockAlerts', 'Restock alerts'],
    ['newsletter', 'Field notes newsletter'],
  ];
  return (
    <div className={styles.notifList}>
      {rows.map(([key, label]) => (
        <div key={key} className={styles.notifRow}>
          <span>{label}</span>
          <button
            onClick={() => toggleNotification(key)}
            className="tm-toggle"
            style={{ background: notifications[key] ? 'var(--tm-primary)' : 'var(--tm-line-c)' }}
            aria-pressed={notifications[key]}
            aria-label={`Toggle ${label}`}
          >
            <div className="tm-toggle-thumb" style={{ left: notifications[key] ? 21 : 3 }} />
          </button>
        </div>
      ))}
    </div>
  );
}
