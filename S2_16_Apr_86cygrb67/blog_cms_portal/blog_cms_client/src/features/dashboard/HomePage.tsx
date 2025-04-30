import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import StatCard from '../../components/StatCard';
import {
  PostAdd as PostAddIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import { selectFilteredPosts } from '../posts/postsSlice';
import { selectAllCategories } from '../categories/categoriesSlice';
import { selectAllUsers } from '../users/usersSlice';
import { fetchCategories } from '../categories/categoriesSlice';
import { fetchUsers } from '../users/usersSlice';
import { initializeDashboard } from './dashboardSlice';


const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { status } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(initializeDashboard());
  }, [dispatch]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const posts = useAppSelector(selectFilteredPosts);
  const categories = useAppSelector(selectAllCategories);
  const users = useAppSelector(selectAllUsers);

  const stats = {
    totalPosts: posts.length,
    totalCategories: categories.length,
    totalUsers: users.length,
    recentPosts: [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  };


  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={<PostAddIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon={<CategoryIcon fontSize="large" />}
            color="#dc004e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Users"
            value={stats.totalUsers}
            icon={<PeopleIcon fontSize="large" />}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom>
        Recent Posts
      </Typography>
      
      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Published</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.recentPosts.map((post) => (
              <TableRow 
                key={post.id} 
                hover 
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author.name}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      color: post.status === 'published' ? 'success.main' : 'warning.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </Box>
                </TableCell>
                <TableCell>
                  {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<PostAddIcon />}
          onClick={() => navigate('/posts/new')}
        >
          Add New Post
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;