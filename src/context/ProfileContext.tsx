import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { ADDRESSES, PAYMENT_METHODS } from '../data/products';
import type { Address, PaymentMethod } from '../data/types';

export interface ProfileInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  avatar: string | null;
}

export interface NotificationSettings {
  orderUpdates: boolean;
  restockAlerts: boolean;
  newsletter: boolean;
}

const DEFAULT_PROFILE: ProfileInfo = {
  name: 'Sam Halvorson',
  email: 'sam@trekmate.co',
  phone: '(503) 555-0142',
  location: 'Portland, OR',
  memberSince: '2023',
  avatar: null,
};

const DEFAULT_NOTIFS: NotificationSettings = {
  orderUpdates: true,
  restockAlerts: true,
  newsletter: false,
};

interface ProfileContextValue {
  profile: ProfileInfo;
  updateProfile: (patch: Partial<ProfileInfo>) => void;
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (p: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<ProfileInfo>('tm.profile', DEFAULT_PROFILE);
  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>('tm.notifications', DEFAULT_NOTIFS);
  const [addresses, setAddresses] = useLocalStorage<Address[]>('tm.addresses', ADDRESSES);
  const [paymentMethods, setPaymentMethods] = useLocalStorage<PaymentMethod[]>('tm.payments', PAYMENT_METHODS);
  const { showToast } = useToast();

  const updateProfile = useCallback(
    (patch: Partial<ProfileInfo>) => {
      setProfile((prev) => ({ ...prev, ...patch }));
      showToast('Profile updated');
    },
    [setProfile, showToast],
  );

  const toggleNotification = useCallback(
    (k: keyof NotificationSettings) => {
      setNotifications((prev) => ({ ...prev, [k]: !prev[k] }));
    },
    [setNotifications],
  );

  const addAddress = useCallback(
    (a: Omit<Address, 'id'>) => {
      setAddresses((prev) => [...prev, { ...a, id: `addr-${Date.now()}` }]);
      showToast('Address added');
    },
    [setAddresses, showToast],
  );

  const updateAddress = useCallback(
    (id: string, patch: Partial<Address>) => {
      setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
      showToast('Address updated');
    },
    [setAddresses, showToast],
  );

  const removeAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast('Address removed');
    },
    [setAddresses, showToast],
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
      setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
      showToast('Payment method removed');
    },
    [setPaymentMethods, showToast],
  );

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      notifications,
      toggleNotification,
      addresses,
      addAddress,
      updateAddress,
      removeAddress,
      paymentMethods,
      addPaymentMethod,
      removePaymentMethod,
    }),
    [
      profile,
      updateProfile,
      notifications,
      toggleNotification,
      addresses,
      addAddress,
      updateAddress,
      removeAddress,
      paymentMethods,
      addPaymentMethod,
      removePaymentMethod,
    ],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
