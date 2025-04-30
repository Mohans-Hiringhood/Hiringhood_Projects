import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from './authSlice';
import { checkAuth } from '../../api/authApi';

const InitializeAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authData = checkAuth();
    if (authData) {
      dispatch(setCredentials(authData));
    }
  }, [dispatch]);

  return null;
};

export default InitializeAuth;