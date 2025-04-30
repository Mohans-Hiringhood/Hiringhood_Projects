import { User, Category, Post } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    disabled: false,
  },
  {
    id: '2',
    name: 'Editor User',
    email: 'editor@example.com',
    password: 'password123',
    role: 'editor',
    avatar: 'https://i.pravatar.cc/150?img=2',
    disabled: false,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Business', slug: 'business' },
  { id: '3', name: 'Health', slug: 'health' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: 'Lorem ipsum dolor sit amet...',
    status: 'published',
    author: MOCK_USERS[0],
    category: 'Technology',
    tags: ['react', 'frontend'],
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Advanced Redux Patterns',
    content: 'Lorem ipsum dolor sit amet...',
    status: 'published',
    author: MOCK_USERS[1],
    category: 'Technology',
    tags: ['redux', 'state-management'],
    createdAt: '2023-01-02T10:00:00Z',
    updatedAt: '2023-01-02T10:00:00Z',
  },
];

export const MOCK_STATS = {
  totalPosts: 24,
  totalCategories: 5,
  totalUsers: 3,
  recentPosts: MOCK_POSTS.slice(0, 5),
};

export type { Post };
