import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Chip, 
  Button, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Paper,
  IconButton,
  Drawer,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  Calendar, 
  Filter,
  X
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import useJobs, { Job, JobFilters } from '../../hooks/useJobs';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import AlertMessage from '../../components/common/AlertMessage';
import EmptyState from '../../components/common/EmptyState';
import { formatDistanceToNow } from '../../utils/dateUtils';

const JobsList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { jobs, loading, error, pagination, getJobs } = useJobs();
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 10
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Job types for filter dropdown
  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote'
  ];

  // Fetch jobs on initial load and when filters change
  useEffect(() => {
    getJobs(filters);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10
    });
  };

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const FiltersComponent = () => (
    <Box sx={{ p: isMobile ? 2 : 0 }}>
      {isMobile && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={toggleFilterDrawer} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      )}

      <TextField
        fullWidth
        name="search"
        label="Search Jobs"
        variant="outlined"
        margin="normal"
        value={filters.search || ''}
        onChange={handleFilterChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="location"
        label="Location"
        variant="outlined"
        margin="normal"
        value={filters.location || ''}
        onChange={handleFilterChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MapPin size={20} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="job-type-label">Job Type</InputLabel>
        <Select
          labelId="job-type-label"
          id="job-type"
          name="type"
          value={filters.type || ''}
          label="Job Type"
          onChange={handleFilterChange}
          startAdornment={
            <InputAdornment position="start">
              <Briefcase size={20} />
            </InputAdornment>
          }
        >
          <MenuItem value="">All Types</MenuItem>
          {jobTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        name="company"
        label="Company"
        variant="outlined"
        margin="normal"
        value={filters.company || ''}
        onChange={handleFilterChange}
      />

      <Button 
        variant="outlined" 
        fullWidth 
        onClick={clearFilters}
        sx={{ mt: 2 }}
      >
        Clear Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Find Your Perfect Job
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Browse through our curated list of job opportunities from top employers.
      </Typography>

      {/* Mobile Filter Button */}
      {isMobile && (
        <Button
          variant="outlined"
          startIcon={<Filter size={18} />}
          onClick={toggleFilterDrawer}
          fullWidth
          sx={{ mb: 2 }}
        >
          Filters
        </Button>
      )}

      <Grid container spacing={3}>
        {/* Filter Sidebar - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <FiltersComponent />
            </Paper>
          </Grid>
        )}

        {/* Filter Drawer - Mobile */}
        <Drawer
          anchor="bottom"
          open={filterDrawerOpen}
          onClose={toggleFilterDrawer}
          PaperProps={{
            sx: {
              width: '100%',
              maxHeight: '80vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              pb: 4
            },
          }}
        >
          <FiltersComponent />
        </Drawer>

        {/* Jobs List */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <LoadingSpinner fullPage message="Loading jobs..." />
          ) : error ? (
            <AlertMessage severity="error" message={error} />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="Try adjusting your search filters or check back later for new opportunities."
              actionText="Clear Filters"
              onActionClick={clearFilters}
            />
          ) : (
            <>
              <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Showing {jobs.length} of {pagination.total} jobs
                </Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </Box>

              {pagination.pages > 1 && (
                <Box mt={4} display="flex" justifyContent="center">
                  <Pagination
                    count={pagination.pages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.05)',
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            {job.title}
          </Typography>
          <Chip 
            label={job.type} 
            size="small" 
            color={job.type === 'Remote' ? 'secondary' : 'primary'}
            variant={job.type === 'Remote' ? 'filled' : 'outlined'}
          />
        </Box>
        
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" component="span">
            <Briefcase size={16} style={{ marginRight: '4px' }} color="#6b7280" />
            <Typography variant="body2" color="text.secondary">
              {job.company}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" component="span">
            <MapPin size={16} style={{ marginRight: '4px' }} color="#6b7280" />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" component="span">
            <Clock size={16} style={{ marginRight: '4px' }} color="#6b7280" />
            <Typography variant="body2" color="text.secondary">
              Posted {formatDistanceToNow(new Date(job.createdAt))} ago
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {job.description.length > 160 
            ? `${job.description.substring(0, 160)}...`
            : job.description}
        </Typography>
        
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {job.skills.slice(0, 4).map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small" 
              variant="outlined" 
              sx={{ borderRadius: 1 }}
            />
          ))}
          {job.skills.length > 4 && (
            <Chip 
              label={`+${job.skills.length - 4} more`} 
              size="small" 
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          )}
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {job.salary ? (
            <Typography variant="subtitle2" fontWeight="medium" color="primary">
              {job.salary}
            </Typography>
          ) : (
            <Box />
          )}
          
          <Button 
            variant="contained" 
            size="small" 
            component={RouterLink} 
            to={`/jobs/${job._id}`}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobsList;