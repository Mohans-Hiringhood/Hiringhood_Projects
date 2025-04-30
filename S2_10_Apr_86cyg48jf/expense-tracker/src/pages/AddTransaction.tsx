import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { addTransaction } from '../features/transactionsSlice';
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

const AddTransaction = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    const newTransaction = {
      id: uuidv4(),
      title: title.trim(),
      amount: amountNum,
      type,
      date,
      category,
    };

    dispatch(addTransaction(newTransaction));
    navigate('/');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Add New Transaction
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
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          error={!!error && !title.trim()}
        />

        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
          error={!!error && (!amount || parseFloat(amount) <= 0)}
          inputProps={{ step: "0.01" }}
        />

        <FormControl component="fieldset" sx={{ mt: 2, mb: 2, width: '100%' }}>
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            row
            value={type}
            onChange={(e) => {
              setType(e.target.value as 'income' | 'expense');
              setCategory('');
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
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setError('');
          }}
          error={!!error && !category}
        >
          {(type === 'income' ? incomeCategories : expenseCategories).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={dayjs(date)}
            onChange={(newValue) => {
              setDate(newValue ? newValue.format('YYYY-MM-DD') : '');
              setError('');
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                error: !!error && !date,
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
            Add Transaction
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddTransaction;