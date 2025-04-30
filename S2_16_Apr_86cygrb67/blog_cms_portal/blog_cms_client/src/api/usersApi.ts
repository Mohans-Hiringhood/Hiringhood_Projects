import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Get all users (Admin only)
export const fetchUsers = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Update user role (Admin only)
export const updateUserRole = async (userId: string, role: string) => {
  const response = await axios.put(
    `${API_URL}/${userId}/role`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// Toggle user status (Admin only)
export const toggleUserStatus = async (userId: string) => {
  const response = await axios.put(
    `${API_URL}/${userId}/status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};