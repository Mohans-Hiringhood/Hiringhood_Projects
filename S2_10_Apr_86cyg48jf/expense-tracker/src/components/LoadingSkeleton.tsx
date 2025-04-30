import { Skeleton, Box, Grid } from '@mui/material';

export const LoadingSkeleton = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Balance Summary Skeleton */}
        <Grid item xs={12}>
          <Skeleton variant="rounded" height={120} />
        </Grid>
        
        {/* Chart Skeletons */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Skeleton variant="rounded" height={300} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rounded" height={250} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rounded" height={250} />
            </Grid>
          </Grid>
        </Grid>
        
        {/* Filters Skeleton */}
        <Grid item xs={12} md={4}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        
        {/* Transaction List Skeleton */}
        <Grid item xs={12}>
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rounded" 
              height={70} 
              sx={{ mb: 2 }} 
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};