import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// --- INTERFACES ---

// The User interface remains the same
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  balance: number;
  accountNumber: string;
  createdAt: string;
  lastLogin?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// --- NEW: Interfaces for the additional financial data ---
export interface Portfolio {
  id: string;
  symbol: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  name: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvestment: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: number;
}

export interface FixedDeposit {
  id: string;
  amount: number;
  interestRate: number;
  tenure: number;
  startDate: string;
  maturityDate: string;
  type: string;
  status: string;
  interestEarned: number;
  maturityAmount: number;
}

export interface Transaction {
    id: string;
    type: 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'DEPOSIT';
    symbol?: string;
    shares?: number;
    amount: number;
    description: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    createdAt: string;
    counterparty?: string;
}

// This new interface holds ONLY the extra data. The User object is kept separate.
export interface FinancialProfile {
  portfolio: Portfolio[];
  portfolioSummary: PortfolioSummary;
  recentTransactions: Transaction[];
  fixedDeposits: FixedDeposit[];
}

// --- MODIFIED: Add the new properties to the context type ---
export interface AuthContextType {
  // --- All your existing properties are preserved ---
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthState: (user: User, token: string) => void;

  // --- NEW: The new properties for detailed financial data ---
  financialProfile: FinancialProfile | null;
  fetchAndSetProfile: () => Promise<void>; // The function to refresh financial data
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // --- Your existing state is preserved ---
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: State to hold the detailed financial profile ---
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile | null>(null);


  // --- NEW: The core function to fetch detailed financial data ---
  const fetchAndSetProfile = async () => {
    const currentToken = localStorage.getItem("authToken"); // Use the token from storage to ensure it's current
    if (!currentToken) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (!response.ok) {
        // If token is invalid or expired, log the user out
        if (response.status === 401 || response.status === 422) {
          logout();
        }
        return;
      }

      const data = await response.json();
      if (data.success) {
        // Populate the new state with financial data
        setFinancialProfile({
          portfolio: data.portfolio,
          portfolioSummary: data.portfolioSummary,
          recentTransactions: data.recentTransactions,
          fixedDeposits: data.fixedDeposits,
        });

        // IMPORTANT: Also update the main user object to keep everything in sync
        // This ensures user.balance is always fresh.
        if (data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

      }
    } catch (error) {
      console.error("Failed to fetch financial profile:", error);
    }
  };


  // --- MODIFIED: The initial startup logic ---
  useEffect(() => {
    const initializeAuth = async () => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          try {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            // If a session is found, immediately fetch the detailed financial data
            await fetchAndSetProfile();
          } catch (error) {
            console.error("Error parsing saved user data:", error);
            logout(); // Clear corrupted data
          }
        }
        setIsLoading(false);
    }
    initializeAuth();
  }, []);

  // --- Your existing functions are preserved ---
  const setAuthState = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("authToken", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };


  // --- MODIFIED: Login now also fetches the financial profile on success ---
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setAuthState(data.user, data.token); // Your existing logic
        await fetchAndSetProfile(); // NEW: Fetch extra data right after login
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };


  // --- MODIFIED: Register now also fetches the financial profile on success ---
  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        setAuthState(data.user, data.token); // Your existing logic
        await fetchAndSetProfile(); // NEW: Fetch extra data right after registration
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };


  // --- MODIFIED: Logout now also clears the new financial profile state ---
  const logout = () => {
    const currentToken = token; // Capture token before clearing state
    setUser(null);
    setToken(null);
    setFinancialProfile(null); // NEW: Clear the financial data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    if (currentToken) {
      fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(console.error);
    }
  };


  // --- MODIFIED: The context value includes all old and new properties ---
  const value: AuthContextType = {
    // Existing Properties
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    setAuthState,
    // New Properties
    financialProfile,
    fetchAndSetProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}