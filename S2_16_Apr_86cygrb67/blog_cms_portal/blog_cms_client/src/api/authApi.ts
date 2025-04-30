import { User } from "../types";
import { MOCK_USERS } from "../utils/constants";

const USERS_STORAGE_KEY = 'blog-cms-users';

const getStoredUsers = () => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : null;
  } catch (error) {
    console.error('Failed to parse users from localStorage', error);
    return null;
  }
};

export const login = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const storedUsers = getStoredUsers();
  const users = storedUsers || MOCK_USERS;
  const user = users.find((user: User) => user.email === email);
  
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  const token = 'mock-jwt-token';
  
  return { user, token };
};

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    return { user: JSON.parse(user), token };
  }
  
  return null;
};

export const resetMockUsers = () => {
  localStorage.removeItem(USERS_STORAGE_KEY);
};