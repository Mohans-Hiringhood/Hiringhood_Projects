import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import Navbar from './components/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useMemo, createContext } from 'react';
import { lightTheme, darkTheme } from './styles/theme';
import EditTransaction from './pages/EditTransaction';


export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddTransaction />} />
                <Route path="/edit/:id" element={<EditTransaction />} />
              </Routes>
          </Router>
        </Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;