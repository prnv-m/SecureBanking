import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications, BankNotification } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getNotificationIcon = (type: BankNotification['type']) => {
    switch (type) {
      case 'transaction': return '💳';
      case 'transfer': return '💸';
      case 'bill_payment': return '🧾';
      case 'tax_payment': return '🏛️';
      case 'investment': return '📈';
      case 'fd': return '🏦';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: BankNotification['type']) => {
    switch (type) {
      case 'transaction': return 'border-l-blue-500';
      case 'transfer': return 'border-l-purple-500';
      case 'bill_payment': return 'border-l-orange-500';
      case 'tax_payment': return 'border-l-red-500';
      case 'investment': return 'border-l-green-500';
      case 'fd': return 'border-l-indigo-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString('en-IN');
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/10 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearNotifications}
                      className="text-xs"
                      title="Clear all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No notifications yet</p>
                  <p className="text-sm">You'll see bank activity updates here</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors",
                        getNotificationColor(notification.type),
                        !notification.read && "bg-blue-50"
                      )}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              "text-sm font-medium",
                              !notification.read && "text-gray-900",
                              notification.read && "text-gray-600"
                            )}>
                              {notification.title}
                              {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-2" />}
                            </p>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 10 && (
              <div className="p-3 border-t text-center">
                <p className="text-xs text-gray-500">
                  Showing latest 10 notifications
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}