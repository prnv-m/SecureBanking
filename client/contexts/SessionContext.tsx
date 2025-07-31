import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

// Define the shape of a single event
export interface SessionEvent {
  event_type: string;
  time: string; // ISO 8601 format date string
  page_url?: string;
  transaction_amount?: number;
  additional_data?: string; // JSON string for other info
}

// Define the shape of the context's value
interface SessionContextType {
  sessionEvents: SessionEvent[];
  trackEvent: (event: Omit<SessionEvent, 'time'>) => void;
  clearSession: () => void; // Useful for when the user logs out
}

// Create the context with a default undefined value
const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Custom hook for easy access to the session context.
 * This is what your components will use.
 */
export const useSessionTracker = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionTracker must be used within a SessionProvider');
  }
  return context;
};

/**
 * The Provider component that will wrap your entire application.
 * It holds the state and the logic.
 */
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // THIS STATE IS NOW GLOBAL TO THE APP
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);

  // The function to add events to the global state
  const trackEvent = useCallback((event: Omit<SessionEvent, 'time'>) => {
    const newEvent: SessionEvent = {
      ...event,
      time: new Date().toISOString(),
    };
    setSessionEvents((prevEvents) => [...prevEvents, newEvent]);
    console.log('EVENT TRACKED (GLOBAL):', newEvent);
  }, []);

  // A function to clear events on logout
  const clearSession = useCallback(() => {
    setSessionEvents([]);
  }, []);
  
  // This effect runs ONCE when the provider first mounts (i.e., when the app loads after login)
  // It correctly simulates the start of the session.
  useEffect(() => {
    trackEvent({ event_type: 'login_success', page_url: '/dashboard' });
  }, []); // Note: I removed the second event to avoid duplication. Let the dashboard component track its own view.


  const value = { sessionEvents, trackEvent, clearSession };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};