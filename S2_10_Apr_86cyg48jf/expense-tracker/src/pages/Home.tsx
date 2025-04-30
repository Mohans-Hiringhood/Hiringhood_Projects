import { Grid, Box, useTheme, Paper, Stack, IconButton, Collapse, Typography } from '@mui/material';
import TransactionList from '../components/TransactionList';
import BalanceSummary from '../components/BalanceSummary';
import TransactionFilters from '../components/TransactionFilters';
import SpendingChart from '../components/SpendingChart';
import { useTransactions } from '../hooks/useTransactions';
import MonthlySummary from '../components/MonthlySummary';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const Home = () => {
  const theme = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const {
    transactions,
    balance,
    income,
    expenses,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    categories,
    selectedCategories,
    setSelectedCategories,
  } = useTransactions();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      p: 3,
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Filter Toggle Button - Top Right */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 2
      }}>
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <FilterListIcon color="primary" />
          <Typography variant="body2" color="text.primary" ml={1}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Typography>
        </IconButton>
      </Box>

      {/* Filters Panel (Overlay) */}
      <Collapse in={showFilters} sx={{
        position: 'absolute',
        zIndex: 1200,
        top: '80px',
        right: '24px',
        width: '600px',
        boxShadow: theme.shadows[6],
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <Paper elevation={0} sx={{
          p: 3,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative'
        }}>
          <IconButton
            onClick={() => setShowFilters(false)}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: theme.palette.text.secondary
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <TransactionFilters
            transactions={transactions}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onReset={() => {
              setFilters({ type: '', startDate: '', endDate: '' });
              setSelectedCategories([]);
              setShowFilters(false);
            }}
          />
        </Paper>
      </Collapse>

      {/* Main Dashboard Content */}
      <Grid container spacing={3} sx={{
        width: '100%',
        margin: 0,
        placeContent: 'center',
        flexGrow: 1
      }}>
        {/* Left Column - Financial Overview */}
        <Grid item xs={12} md={3}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: '12px',
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              height: 'fit-content'
            }}>
              <BalanceSummary 
                balance={balance} 
                income={income} 
                expenses={expenses} 
              />
            </Paper>
          </Stack>
        </Grid>

        {/* Middle Column - Transactions */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{
            height: '100%',
            p: 3,
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TransactionList transactions={transactions} />
          </Paper>
        </Grid>

        {/* Right Column - Chart */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: '12px',
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              flex: 1
            }}>
              <SpendingChart />
            </Paper>
                      
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: '12px',
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              flex: 1
            }}>
              <MonthlySummary />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;