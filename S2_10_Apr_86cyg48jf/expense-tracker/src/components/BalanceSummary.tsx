import { Box, Typography, useTheme } from '@mui/material';

interface BalanceSummaryProps {
  balance?: number;
  income?: number;
  expenses?: number;
}

const BalanceSummary = ({ balance = 0, income = 0, expenses = 0 }: BalanceSummaryProps) => {
  const theme = useTheme();

  const summaryItems = [
    { 
      label: 'Total Balance', 
      value: balance, 
      color: theme.palette.text.primary,
      bgColor: theme.palette.mode === 'dark' ? 'rgba(100, 255, 100, 0.1)' : 'rgba(100, 200, 100, 0.1)'
    },
    { 
      label: 'Income', 
      value: income, 
      color: theme.palette.success.main,
      bgColor: theme.palette.mode === 'dark' ? 'rgba(100, 255, 100, 0.1)' : 'rgba(100, 200, 100, 0.1)'
    },
    { 
      label: 'Expenses', 
      value: expenses, 
      color: theme.palette.error.main,
      bgColor: theme.palette.mode === 'dark' ? 'rgba(255, 100, 100, 0.1)' : 'rgba(200, 100, 100, 0.1)'
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 600,
        color: 'text.primary',
        mb: 1
      }}>
        Financial Overview
      </Typography>
      
      {summaryItems.map((item) => (
        <Box key={item.label} sx={{ 
          p: 2,
          borderRadius: '8px',
          backgroundColor: item.bgColor,
          borderLeft: `4px solid ${item.color}`
        }}>
          <Typography variant="subtitle2" color="text.secondary">
            {item.label}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: item.color
            }}
          >
            ${item.value.toFixed(2)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BalanceSummary;