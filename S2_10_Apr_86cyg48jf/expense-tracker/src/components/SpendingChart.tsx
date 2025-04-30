import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTransactions } from '../hooks/useTransactions';
import { Card, Typography, Box, useTheme } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = () => {
  const theme = useTheme();
  const { transactions } = useTransactions();

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categories = [...new Set(expenseTransactions.map(t => t.category))];
  const data = {
    labels: categories,
    datasets: [
      {
        data: categories.map(category => 
          expenseTransactions
            .filter(t => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.success.main,
          '#FF9F40',
          '#607D8B',
          '#9C27B0'
        ],
        borderColor: theme.palette.background.default,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <Card sx={{ 
      p: 2, 
      borderRadius: 2,
      boxShadow: theme.shadows[1]
    }}>
      <Typography variant="h6" gutterBottom sx={{ 
        fontWeight: 'bold',
        color: 'text.primary'
      }}>
        Spending by Category
      </Typography>
      <Box sx={{ height: 300 }}>
        {expenseTransactions.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
          }}>
            <Typography variant="body2" color="text.secondary">
              No expense data available
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default SpendingChart;