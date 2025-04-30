import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TransactionType, Transaction } from '../types/transaction';

export const useTransactions = () => {
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    type: '' as TransactionType | '',
    startDate: '',
    endDate: '',
  });
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesDate =
      (!filters.startDate || transaction.date >= filters.startDate) &&
      (!filters.endDate || transaction.date <= filters.endDate);
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(transaction.category);
    return matchesType && matchesDate && matchesCategory;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'income' 
      ? acc + transaction.amount 
      : acc - transaction.amount;
  }, 0);

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const categories = [...new Set(transactions.map(t => t.category))];

  return {
    transactions: sortedTransactions,
    balance,
    income,
    expenses,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    categories,
    selectedCategories,
    setSelectedCategories,
    loading,
    error,
  };
};