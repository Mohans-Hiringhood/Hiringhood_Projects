import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateTransaction } from '../features/transactionsSlice';
import { incomeCategories, expenseCategories } from '../types/transaction';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Box,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  MenuItem,
  Paper,
  Alert,
} from '@mui/material';
import { RootState } from '../store/store';
import { useState } from 'react';

const EditTransaction = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transaction = useSelector((state: RootState) => 
    state.transactions.transactions.find(t => t.id === id)
  );

  const [formData, setFormData] = useState({
    title: transaction?.title || '',
    amount: transaction?.amount.toString() || '',
    type: transaction?.type || 'income',
    date: transaction?.date || dayjs().format('YYYY-MM-DD'),
    category: transaction?.category || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!formData.amount) {
      setError('Please enter an amount');
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.date) {
      setError('Please select a date');
      return;
    }

    dispatch(updateTransaction({
      id: id!,
      title: formData.title.trim(),
      amount: amountNum,
      type: formData.type as 'income' | 'expense',
      date: formData.date,
      category: formData.category,
    }));
    navigate('/');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Edit Transaction
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.title}
          onChange={(e) => {
            setFormData({...formData, title: e.target.value});
            setError('');
          }}
          error={!!error && !formData.title.trim()}
        />

        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={formData.amount}
          onChange={(e) => {
            setFormData({...formData, amount: e.target.value});
            setError('');
          }}
          error={!!error && (!formData.amount || parseFloat(formData.amount) <= 0)}
          inputProps={{ step: "0.01" }}
        />

        <FormControl component="fieldset" sx={{ mt: 2, mb: 2, width: '100%' }}>
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            row
            value={formData.type}
            onChange={(e) => {
              setFormData({
                ...formData, 
                type: e.target.value as 'income' | 'expense',
                category: ''
              });
              setError('');
            }}
          >
            <FormControlLabel value="income" control={<Radio />} label="Income" />
            <FormControlLabel value="expense" control={<Radio />} label="Expense" />
          </RadioGroup>
        </FormControl>

        <TextField
          select
          label="Category"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.category}
          onChange={(e) => {
            setFormData({...formData, category: e.target.value});
            setError('');
          }}
          error={!!error && !formData.category}
        >
          {(formData.type === 'income' ? incomeCategories : expenseCategories).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={dayjs(formData.date)}
            onChange={(newValue) => {
              setFormData({
                ...formData, 
                date: newValue ? newValue.format('YYYY-MM-DD') : ''
              });
              setError('');
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                error: !!error && !formData.date,
              },
            }}
          />
        </LocalizationProvider>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ px: 4 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 4 }}
          >
            Update Transaction
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditTransaction;