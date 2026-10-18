import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { ADDRESSES, ORDERS, PAYMENT_METHODS } from '../data/products';
import type { Address, Order, PaymentMethod } from '../data/types';

export interface ProfileInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
}

export interface NotificationSettings {
  orderUpdates: boolean;
  priceDrops: boolean;
  restockAlerts: boolean;
  fieldNotes: boolean;
}

const DEFAULT_PROFILE: ProfileInfo = {
  name: 'Sam Halvorson',
  email: 'sam@trekmate.co',
  phone: '(503) 555-0142',
  location: 'Portland, OR',
  memberSince: '2023',
};

const DEFAULT_NOTIFS: NotificationSettings = {
  orderUpdates: true,
  priceDrops: true,
  restockAlerts: false,
  fieldNotes: false,
};

interface ProfileContextValue {
  profile: ProfileInfo;
  updateProfile: (patch: Partial<ProfileInfo>) => void;
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (p: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  orders: Order[];
  addOrder: (o: Order) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<ProfileInfo>('tm2.profile', DEFAULT_PROFILE);
  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>('tm2.notifications', DEFAULT_NOTIFS);
  const [addresses, setAddresses] = useLocalStorage<Address[]>('tm2.addresses', ADDRESSES);
  const [paymentMethods, setPaymentMethods] = useLocalStorage<PaymentMethod[]>('tm2.payments', PAYMENT_METHODS);
  const [orders, setOrders] = useLocalStorage<Order[]>('tm2.orders', ORDERS);
  const { showToast } = useToast();

  const updateProfile = useCallback(
    (patch: Partial<ProfileInfo>) => {
      setProfile((prev) => ({ ...prev, ...patch }));
      showToast('Account details saved');
    },
    [setProfile, showToast],
  );

  const toggleNotification = useCallback(
    (k: keyof NotificationSettings) => setNotifications((prev) => ({ ...prev, [k]: !prev[k] })),
    [setNotifications],
  );

  const addAddress = useCallback(
    (a: Omit<Address, 'id'>) => {
      setAddresses((prev) => [...prev, { ...a, id: `addr-${Date.now()}` }]);
      showToast('Address added', { sub: a.label });
    },
    [setAddresses, showToast],
  );

  const removeAddress = useCallback(
    (id: string) => {
      const removed = addresses.find((a) => a.id === id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (removed)
        showToast('Address removed', { sub: removed.label, action: { label: 'Undo', run: () => setAddresses((prev) => [...prev, removed]) } });
    },
    [addresses, setAddresses, showToast],
  );

  const setDefaultAddress = useCallback(
    (id: string) => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id }))),
    [setAddresses],
  );

  const addPaymentMethod = useCallback(
    (p: Omit<PaymentMethod, 'id'>) => {
      setPaymentMethods((prev) => [...prev, { ...p, id: `pay-${Date.now()}` }]);
      showToast('Payment method added');
    },
    [setPaymentMethods, showToast],
  );

  const removePaymentMethod = useCallback(
    (id: string) => {
      const removed = paymentMethods.find((p) => p.id === id);
      setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
      if (removed)
        showToast('Payment method removed', { action: { label: 'Undo', run: () => setPaymentMethods((prev) => [...prev, removed]) } });
    },
    [paymentMethods, setPaymentMethods, showToast],
  );

  const addOrder = useCallback((o: Order) => setOrders((prev) => [o, ...prev]), [setOrders]);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      notifications,
      toggleNotification,
      addresses,
      addAddress,
      removeAddress,
      setDefaultAddress,
      paymentMethods,
      addPaymentMethod,
      removePaymentMethod,
      orders,
      addOrder,
    }),
    [
      profile,
      updateProfile,
      notifications,
      toggleNotification,
      addresses,
      addAddress,
      removeAddress,
      setDefaultAddress,
      paymentMethods,
      addPaymentMethod,
      removePaymentMethod,
      orders,
      addOrder,
    ],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
