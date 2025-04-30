import { Box, Typography, Paper, Button, Chip, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectPostById } from './postsSlice';
import { formatDateTime } from '../../utils/dateUtils';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useAppSelector((state) => selectPostById(state, postId || ''));

  if (!post) {
    return <Typography>Post not found</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Posts
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {post.title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/posts/${post.id}/edit`)}
        >
          Edit Post
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip label={post.category} color="primary" />
          <Chip
            label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            color={post.status === 'published' ? 'success' : 'default'}
          />
          <Typography variant="body2" color="text.secondary">
            By {post.author.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {formatDateTime(post.createdAt)}
          </Typography>
          {post.updatedAt !== post.createdAt && (
            <Typography variant="body2" color="text.secondary">
              Updated: {formatDateTime(post.updatedAt)}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostDetailPage;