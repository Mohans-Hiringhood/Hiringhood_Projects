import { Card, CardContent, Typography, Stack } from '@mui/material';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

const StatCard = ({ title, value, icon, color = '#1976d2' }: StatCardProps) => {
  return (
    <Card sx={{ minWidth: 200, backgroundColor: color, color: 'white' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="body2">{title}</Typography>
            <Typography variant="h4">{value}</Typography>
          </div>
          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatCard;