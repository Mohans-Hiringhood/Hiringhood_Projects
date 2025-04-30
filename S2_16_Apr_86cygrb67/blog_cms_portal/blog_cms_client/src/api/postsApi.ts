import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

// Get all posts
export const fetchPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a post
export const createPost = async (postData: {
  title: string;
  content: string;
  status: string;
  category?: string;
  tags?: string[];
}) => {
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Update a post
export const updatePost = async (id: string, postData: {
  title?: string;
  content?: string;
  status?: string;
}) => {
  const response = await axios.put(`${API_URL}/${id}`, postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Delete a post
export const deletePost = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};