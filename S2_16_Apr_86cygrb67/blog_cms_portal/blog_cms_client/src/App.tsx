import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import InitializeAuth from './features/auth/initializeAuth';


function App() {
  return (
    <BrowserRouter>
      <InitializeAuth/>
      <AppRoutes />      
    </BrowserRouter>
  );
}

export default App;