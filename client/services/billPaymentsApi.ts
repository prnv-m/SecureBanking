import { Transaction } from "@/contexts/AuthContext"; // Assuming Transaction type is exported from AuthContext

const API_URL = "http://localhost:5000/api";

export interface Biller {
  id: string;
  user_id: string;
  provider_name: string;
  category: string;
  consumer_id: string;
  nickname: string;
  created_at: string;
}
export interface AutoPayRule {
  id: string;
  user_id: string;
  biller_id: string;
  nickname: string; // From JOIN
  provider_name: string; // From JOIN
  consumer_id: string; // From JOIN
  max_amount: number;
  enabled: 0 | 1;
  created_at: string;
}


const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const billPaymentsApi = {
  getRegisteredBillers: async (): Promise<{ success: boolean; billers?: Biller[] }> => {
    const response = await fetch(`${API_URL}/billers`, { headers: getAuthHeader() });
    return response.json();
  },
    deleteBiller: async (biller_id: string): Promise<{ success: boolean; error?: string }> => {
        const response = await fetch(`${API_URL}/billers/${biller_id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
        });
        return response.json();
    },
    getAutoPayRules: async (): Promise<{ success: boolean; rules?: AutoPayRule[] }> => {
    const response = await fetch(`${API_URL}/autopay-rules`, { headers: getAuthHeader() });
    return response.json();
  },
  addBiller: async (data: { provider_name: string; category: string; consumer_id: string; nickname: string }): Promise<{ success: boolean; biller?: Biller; error?: string }> => {
    const response = await fetch(`${API_URL}/billers`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  payBill: async (biller_id: string, amount: number): Promise<{ success: boolean; message?: string; error?: string }> => {
    const response = await fetch(`${API_URL}/billers/pay`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ biller_id, amount }),
    });
    return response.json();
  },
    addAutoPayRule: async (biller_id: string, max_amount: number): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`${API_URL}/autopay-rules`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ biller_id, max_amount }),
    });
    return response.json();
  },
    toggleAutoPayRule: async (rule_id: string, enabled: boolean): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`${API_URL}/autopay-rules/${rule_id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ enabled }),
    });
    return response.json();
  },
    deleteAutoPayRule: async (rule_id: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`${API_URL}/autopay-rules/${rule_id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  getPaymentHistory: async (): Promise<{ success: boolean; transactions?: Transaction[] }> => {
     // We can reuse the existing transactions endpoint with a filter
    const response = await fetch(`${API_URL}/transactions?type=BILL_PAYMENT`, { headers: getAuthHeader() });
    return response.json();
  }
};