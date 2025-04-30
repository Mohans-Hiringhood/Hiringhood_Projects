export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other Income',
];

export const expenseCategories = [
  'Food',
  'Transportation',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other Expenses',
];