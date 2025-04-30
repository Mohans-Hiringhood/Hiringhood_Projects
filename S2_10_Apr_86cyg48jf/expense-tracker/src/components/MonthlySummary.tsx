import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';

const MonthlySummary = () => {
  const theme = useTheme();
  const { income, expenses } = useTransactions();
  
  const data = [
    { name: 'Income', value: income, color: theme.palette.success.main },
    { name: 'Expenses', value: expenses, color: theme.palette.error.main },
  ];

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 2,
      boxShadow: theme.shadows[1],
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: 'text.primary'
        }}>
          Monthly Summary
        </Typography>
        <Box sx={{ height: 200, flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box display="flex" justifyContent="space-around" mt={2}>
          {data.map((item) => (
            <Box key={item.name} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {item.name}
              </Typography>
              <Typography variant="h6" sx={{ color: item.color }}>
                ${item.value.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthlySummary;