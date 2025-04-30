import { Box, Typography, IconButton, Avatar, useTheme } from '@mui/material';
import { Transaction } from '../types/transaction';
import { ArrowUp, ArrowDown, Trash2, Edit } from 'react-feather';
import { useDispatch } from 'react-redux';
import { deleteTransaction } from '../features/transactionsSlice';
import { Link } from 'react-router-dom';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Box>
      <Typography variant="h6" sx={{ 
        fontWeight: 600,
        color: 'text.primary',
        mb: 3
      }}>
        Recent Transactions
      </Typography>
      
      {transactions.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 4,
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: '8px'
        }}>
          <Typography variant="body1" color="text.secondary">
            No transactions found
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {transactions.map((transaction) => (
            <Box
              key={transaction.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: '8px',
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <Avatar sx={{ 
                mr: 2,
                backgroundColor: transaction.type === 'income' 
                  ? 'rgba(100, 200, 100, 0.1)' 
                  : 'rgba(200, 100, 100, 0.1)',
                color: transaction.type === 'income' 
                  ? theme.palette.success.main 
                  : theme.palette.error.main
              }}>
                {transaction.type === 'income' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {transaction.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: transaction.type === 'income' 
                    ? theme.palette.success.main 
                    : theme.palette.error.main,
                  mr: 2
                }}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Typography>
              
              <IconButton
                component={Link}
                to={`/edit/${transaction.id}`}
                size="small"
                sx={{ color: theme.palette.text.secondary }}
              >
                <Edit size={18} />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={() => dispatch(deleteTransaction(transaction.id))}
                sx={{ color: theme.palette.error.main }}
              >
                <Trash2 size={18} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TransactionList;