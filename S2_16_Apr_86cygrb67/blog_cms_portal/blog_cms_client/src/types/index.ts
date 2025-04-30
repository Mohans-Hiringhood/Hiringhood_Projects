export type Role = 'admin' | 'editor';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  disabled?: boolean;
  lastLogin?: string;
};
  
  export type Post = {
    id: string;
    title: string;
    content: string;
    status: 'draft' | 'published';
    author: User;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  
  export type Category = {
    id: string;
    name: string;
    slug: string;
    postCount?: number;
  };

  export type DashboardStats = {
    totalPosts: number;
    totalCategories: number;
    totalUsers: number;
    recentPosts: Post[];
  };