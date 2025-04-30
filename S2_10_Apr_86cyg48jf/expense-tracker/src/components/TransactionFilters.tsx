import { Box, TextField, MenuItem, Button, Typography, Paper, Autocomplete, Stack, useTheme } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TransactionType, Transaction } from '../types/transaction';
import DownloadIcon from '@mui/icons-material/Download';
import { ArrowUpward, ArrowDownward, FilterAlt, Sort } from '@mui/icons-material';

interface TransactionFiltersProps {
  transactions: Transaction[];
  filters: {
    type: TransactionType | '';
    startDate: string;
    endDate: string;
  };
  sortBy: 'date' | 'amount';
  categories: string[];
  selectedCategories: string[];
  setFilters: (filters: any) => void;
  setSortBy: (sortBy: 'date' | 'amount') => void;
  setSelectedCategories: (categories: string[]) => void;
  onReset: () => void;
}

const TransactionFilters = ({
  transactions,
  filters,
  sortBy,
  categories,
  selectedCategories,
  setFilters,
  setSortBy,
  setSelectedCategories,
  onReset,
}: TransactionFiltersProps) => {
  const theme = useTheme();

  const handleExportCSV = () => {
    const headers = ['Title', 'Amount', 'Type', 'Category', 'Date'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => 
        `"${t.title.replace(/"/g, '""')}",${t.amount},${t.type},"${t.category.replace(/"/g, '""')}",${t.date}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper elevation={0} sx={{
      p: 3,
      borderRadius: '12px',
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <FilterAlt fontSize="small" color="primary" />
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          color: 'text.primary'
        }}>
          Transaction Filters
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {/* Type and Category Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label="Transaction Type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as TransactionType | '' })}
            fullWidth
            size="small"
            InputProps={{
              sx: {
                borderRadius: '8px',
                backgroundColor: theme.palette.background.default
              }
            }}
          >
            <MenuItem value="">All Transactions</MenuItem>
            <MenuItem value="income">
              <Stack direction="row" alignItems="center" spacing={1}>
                <ArrowUpward fontSize="small" color="success" />
                <span>Income</span>
              </Stack>
            </MenuItem>
            <MenuItem value="expense">
              <Stack direction="row" alignItems="center" spacing={1}>
                <ArrowDownward fontSize="small" color="error" />
                <span>Expenses</span>
              </Stack>
            </MenuItem>
          </TextField>

          <Autocomplete
            multiple
            options={categories}
            value={selectedCategories}
            onChange={(_, newValue) => setSelectedCategories(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categories"
                placeholder="Select categories"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    borderRadius: '8px',
                    backgroundColor: theme.palette.background.default
                  }
                }}
              />
            )}
            fullWidth
            sx={{
              '& .MuiAutocomplete-tag': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                borderRadius: '6px'
              }
            }}
          />
        </Stack>

        {/* Date Range */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={filters.startDate ? dayjs(filters.startDate) : null}
              onChange={(newValue) =>
                setFilters({ ...filters, startDate: newValue ? newValue.format('YYYY-MM-DD') : '' })
              }
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  InputProps: {
                    sx: {
                      borderRadius: '8px',
                      backgroundColor: theme.palette.background.default
                    }
                  }
                }
              }}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate ? dayjs(filters.endDate) : null}
              onChange={(newValue) =>
                setFilters({ ...filters, endDate: newValue ? newValue.format('YYYY-MM-DD') : '' })
              }
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  InputProps: {
                    sx: {
                      borderRadius: '8px',
                      backgroundColor: theme.palette.background.default
                    }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </Stack>

        {/* Sort and Actions */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            size="small"
            InputProps={{
              startAdornment: <Sort fontSize="small" color="action" sx={{ mr: 1 }} />,
              sx: {
                borderRadius: '8px',
                backgroundColor: theme.palette.background.default,
                minWidth: '200px'
              }
            }}
          >
            <MenuItem value="date">Date (Newest First)</MenuItem>
            <MenuItem value="amount">Amount (Highest First)</MenuItem>
          </TextField>

          <Box flex={1} />

          <Stack direction="row" spacing={1} width={{ xs: '100%', sm: 'auto' }}>
            <Button
              variant="outlined"
              onClick={onReset}
              size="small"
              sx={{
                borderRadius: '8px',
                px: 3,
                borderColor: theme.palette.divider,
                '&:hover': {
                  borderColor: theme.palette.text.secondary
                }
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleExportCSV}
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{
                borderRadius: '8px',
                px: 3,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: `0 2px 8px ${theme.palette.primary.light}`
                }
              }}
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TransactionFilters;