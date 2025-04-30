import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

// Get all categories
export const fetchCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a category (Admin only)
export const createCategory = async (name: string) => {
  const response = await axios.post(
    API_URL,
    { name },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// Delete a category (Admin only)
export const deleteCategory = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};