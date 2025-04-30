import { format, formatDistanceToNow as formatDistanceToNowFn } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy h:mm a');
};

export const formatDistanceToNow = (date: Date): string => {
  return formatDistanceToNowFn(date, { addSuffix: false });
};