import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../types/transaction';

const loadFromLocalStorage = (): Transaction[] => {
  try {
    const serializedState = localStorage.getItem('expense-tracker-transactions');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    console.warn('Failed to load transactions from localStorage', e);
    return [];
  }
};

const saveToLocalStorage = (transactions: Transaction[]) => {
  try {
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions));
  } catch (e) {
    console.warn('Failed to save transactions to localStorage', e);
  }
};

interface TransactionsState {
  transactions: Transaction[];
}

const initialState: TransactionsState = {
  transactions: loadFromLocalStorage(),
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      const newTransaction = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.transactions.push(newTransaction);
      saveToLocalStorage(state.transactions);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index >= 0) {
        state.transactions[index] = action.payload;
        saveToLocalStorage(state.transactions);
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
      saveToLocalStorage(state.transactions);
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;