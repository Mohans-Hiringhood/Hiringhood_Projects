import { MOCK_STATS } from '../utils/constants';

export const getDashboardStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_STATS;
};