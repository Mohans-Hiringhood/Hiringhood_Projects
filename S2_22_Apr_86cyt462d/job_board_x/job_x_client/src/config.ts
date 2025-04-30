// API URL based on environment
export const API_URL = import.meta.env.PROD 
  ? window.location.origin
  : 'http://localhost:5000';

export const APP_NAME = 'JobBoardX';