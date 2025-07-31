import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BankNotification {
  id: string;
  type: 'transaction' | 'transfer' | 'bill_payment' | 'tax_payment' | 'investment' | 'fd';
  title: string;
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
  icon?: string;
}

interface NotificationContextType {
  notifications: BankNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<BankNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<BankNotification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bankNotifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bankNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<BankNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: BankNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only last 50 notifications

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`SecureBank - ${notification.title}`, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: 'bank-activity'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper functions to create notifications for different bank activities
export const createTransactionNotification = (type: string, amount: number, description: string) => ({
  type: 'transaction' as const,
  title: 'Transaction Alert',
  message: `${type}: ₹${Math.abs(amount).toLocaleString('en-IN')} - ${description}`,
  amount: Math.abs(amount),
});

export const createTransferNotification = (amount: number, recipient: string, isInbound = false) => ({
  type: 'transfer' as const,
  title: isInbound ? 'Money Received' : 'Transfer Successful',
  message: isInbound 
    ? `₹${amount.toLocaleString('en-IN')} received from ${recipient}`
    : `₹${amount.toLocaleString('en-IN')} transferred to ${recipient}`,
  amount,
});

export const createBillPaymentNotification = (amount: number, biller: string) => ({
  type: 'bill_payment' as const,
  title: 'Bill Payment Successful',
  message: `₹${amount.toLocaleString('en-IN')} paid to ${biller}`,
  amount,
});

export const createTaxPaymentNotification = (taxType: string, amount: number) => ({
  type: 'tax_payment' as const,
  title: 'Tax Payment Successful',
  message: `₹${amount.toLocaleString('en-IN')} paid for ${taxType}`,
  amount,
});

export const createInvestmentNotification = (action: string, symbol: string, amount: number) => ({
  type: 'investment' as const,
  title: 'Investment Transaction',
  message: `${action} ${symbol} for ₹${amount.toLocaleString('en-IN')}`,
  amount,
});

export const createFDNotification = (action: string, amount: number, tenure?: number) => ({
  type: 'fd' as const,
  title: 'Fixed Deposit Update',
  message: action === 'created' 
    ? `Fixed Deposit of ₹${amount.toLocaleString('en-IN')} created for ${tenure} months`
    : `Fixed Deposit of ₹${amount.toLocaleString('en-IN')} ${action}`,
  amount,
});