import { Transaction } from "@/contexts/AuthContext";
import { createTransferNotification } from "@/contexts/NotificationContext";

const API_URL = "http://localhost:5000/api";

export interface Beneficiary {
  id: string;
  user_id: string;
  account_number: string;
  account_holder_name: string;
  ifsc_code: string;
  bank_name: string;
  nickname: string;
  is_within_securebank: 0 | 1;
  created_at: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const transfersApi = {
  getBeneficiaries: async (): Promise<{ success: boolean; beneficiaries?: Beneficiary[] }> => {
    const response = await fetch(`${API_URL}/beneficiaries`, { headers: getAuthHeader() });
    return response.json();
  },

  addBeneficiary: async (data: {
    account_number: string;
    account_holder_name: string;
    ifsc_code: string;
    bank_name: string;
    nickname: string;
    is_within_securebank: boolean;
  }): Promise<{ success: boolean; beneficiary?: Beneficiary; error?: string }> => {
    try {
      console.log('Sending beneficiary data:', data);
      const response = await fetch(`${API_URL}/beneficiaries`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          ...data,
          is_within_securebank: data.is_within_securebank ? 1 : 0,
        }),
      });
      
      const result = await response.json();
      console.log('API response:', result);
      return result;
    } catch (error) {
      console.error('Network error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  },

  deleteBeneficiary: async (beneficiary_id: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`${API_URL}/beneficiaries/${beneficiary_id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  transferToOwnAccount: async (amount: number, addNotification?: (notification: any) => void): Promise<{ success: boolean; message?: string; error?: string }> => {
    const response = await fetch(`${API_URL}/transfers/own-account`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ amount }),
    });
    const result = await response.json();
    
    // Add notification if transfer was successful
    if (result.success && addNotification) {
      addNotification(createTransferNotification(amount, "Own Account", true));
    }
    
    return result;
  },

  transferToBeneficiary: async (data: {
    beneficiary_id: string;
    amount: number;
    remarks?: string;
  }, beneficiaryName?: string, addNotification?: (notification: any) => void): Promise<{ success: boolean; message?: string; error?: string }> => {
    const response = await fetch(`${API_URL}/transfers/to-beneficiary`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    // Add notification if transfer was successful
    if (result.success && addNotification && beneficiaryName) {
      addNotification(createTransferNotification(data.amount, beneficiaryName, false));
    }
    
    return result;
  },

  getRecentTransfers: async (): Promise<{ success: boolean; transfers?: Transaction[] }> => {
    const response = await fetch(`${API_URL}/transfers/recent`, { headers: getAuthHeader() });
    return response.json();
  },
};