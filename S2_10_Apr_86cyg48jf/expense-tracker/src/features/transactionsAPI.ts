import axios from 'axios';
import { Transaction } from '../types/transaction';

// Mock API configuration (using JSONBin.io as an example)
const API_BASE_URL = 'https://api.jsonbin.io/v3/b';
const API_KEY = '$2a$10$YOUR_API_KEY'; // Replace with your actual API key if using JSONBin
const BIN_ID = 'YOUR_BIN_ID'; // Replace with your actual bin ID if using JSONBin

// Helper function to simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Local storage key
const LOCAL_STORAGE_KEY = 'expense-tracker-transactions';

// Get transactions from localStorage
const getLocalTransactions = (): Transaction[] => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Save transactions to localStorage
const saveLocalTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Mock API functions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  await simulateNetworkDelay();
  
  // In a real app, you would use the actual API call:
  /*
  try {
    const response = await axios.get(`${API_BASE_URL}/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });
    return response.data.record.transactions || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return getLocalTransactions();
  }
  */
  
  // For demo purposes, we'll just use localStorage
  return getLocalTransactions();
};

export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  await simulateNetworkDelay();
  
  // In a real app, you would use the actual API call:
  /*
  try {
    await axios.put(`${API_BASE_URL}/${BIN_ID}`, { transactions }, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    saveLocalTransactions(transactions);
  } catch (error) {
    console.error('Error saving transactions:', error);
    saveLocalTransactions(transactions);
  }
  */
  
  // For demo purposes, we'll just use localStorage
  saveLocalTransactions(transactions);
};

// Alternative implementation using a completely mock API
const mockDatabase: { transactions: Transaction[] } = {
  transactions: [],
};

export const mockFetchTransactions = async (): Promise<Transaction[]> => {
  await simulateNetworkDelay();
  return mockDatabase.transactions;
};

export const mockSaveTransactions = async (transactions: Transaction[]): Promise<void> => {
  await simulateNetworkDelay();
  mockDatabase.transactions = transactions;
  saveLocalTransactions(transactions);
};

// Export the currently used implementation
export default {
  fetchTransactions,
  saveTransactions,
};