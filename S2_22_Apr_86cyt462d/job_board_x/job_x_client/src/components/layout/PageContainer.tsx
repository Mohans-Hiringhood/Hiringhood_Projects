import React from 'react';
import { Container, Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const PageHeader = styled(Box)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const PageContent = styled(Paper)`
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  breadcrumbs,
  maxWidth = 'lg',
  children,
}) => {
  return (
    <Container maxWidth={maxWidth}>
      <PageHeader>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return isLast ? (
                <Typography key={item.label} color="text.primary">
                  {item.label}
                </Typography>
              ) : (
                <Link 
                  key={item.label}
                  component={RouterLink} 
                  to={item.path || '#'} 
                  color="inherit"
                  underline="hover"
                >
                  {item.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}
        
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </PageHeader>
      
      <PageContent>
        {children}
      </PageContent>
    </Container>
  );
};

export default PageContainer;