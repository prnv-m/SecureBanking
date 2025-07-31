import { Transaction } from "@/contexts/AuthContext";
import { createTaxPaymentNotification } from "@/contexts/NotificationContext";

const API_URL = "http://localhost:5000/api";

export interface TaxPayment {
  id: string;
  user_id: string;
  transaction_id: string;
  tax_type: string;
  amount: number;
  status: string;
  created_at: string;
  payment_date: string;
  description: string;
  counterparty: string;
  // Direct tax fields
  pan_tan?: string;
  assessment_year?: string;
  tax_applicable?: string;
  payment_type?: string;
  // GST fields
  gstin?: string;
  cpin?: string;
  cgst?: number;
  sgst?: number;
  igst?: number;
  cess?: number;
  // State tax fields
  state?: string;
  municipality?: string;
  service_type?: string;
  consumer_id?: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const taxApi = {
  payDirectTax: async (data: {
    pan: string;
    assessmentYear: string;
    taxType: string;
    paymentType: string;
    amount: number;
  }, addNotification?: (notification: any) => void): Promise<{ success: boolean; message?: string; transaction_id?: string; tax_payment_id?: string; error?: string }> => {
    const response = await fetch(`${API_URL}/tax/direct`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    // Add notification if tax payment was successful
    if (result.success && addNotification) {
      addNotification(createTaxPaymentNotification(`Direct Tax (${data.taxType})`, data.amount));
    }
    
    return result;
  },

  payGst: async (data: {
    gstin: string;
    cpin: string;
    amount: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    cess?: number;
  }, addNotification?: (notification: any) => void): Promise<{ success: boolean; message?: string; transaction_id?: string; tax_payment_id?: string; error?: string }> => {
    const response = await fetch(`${API_URL}/tax/gst`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    // Add notification if GST payment was successful
    if (result.success && addNotification) {
      addNotification(createTaxPaymentNotification("GST", data.amount));
    }
    
    return result;
  },

  payStateTax: async (data: {
    state: string;
    municipality: string;
    service: string;
    consumerId: string;
    amount: number;
  }, addNotification?: (notification: any) => void): Promise<{ success: boolean; message?: string; transaction_id?: string; tax_payment_id?: string; error?: string }> => {
    const response = await fetch(`${API_URL}/tax/state`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    // Add notification if state tax payment was successful
    if (result.success && addNotification) {
      addNotification(createTaxPaymentNotification(`State Tax (${data.state})`, data.amount));
    }
    
    return result;
  },

  getTaxHistory: async (): Promise<{ success: boolean; tax_payments?: TaxPayment[] }> => {
    const response = await fetch(`${API_URL}/tax/history`, { headers: getAuthHeader() });
    return response.json();
  },

  downloadChallan: async (taxPaymentId: string): Promise<{ success: boolean; challan?: any; error?: string }> => {
    const response = await fetch(`${API_URL}/tax/download-challan/${taxPaymentId}`, { headers: getAuthHeader() });
    return response.json();
  },

  exportHistory: async (format: string = 'json'): Promise<{ success: boolean; exportData?: any; message?: string; error?: string }> => {
    const response = await fetch(`${API_URL}/tax/export-history?format=${format}`, { headers: getAuthHeader() });
    return response.json();
  },
};