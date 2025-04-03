import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import AddEditRecipe from './pages/AddEditRecipe';
import Navbar from './components/Navbar';
import { Container, Typography, Button } from '@mui/material';

function NotFound() {
  return (
    <Container sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        404 - Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" href="/" sx={{ mt: 3 }}>
        Go to Home
      </Button>
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/add" element={<AddEditRecipe />} />
          <Route path="/edit/:id" element={<AddEditRecipe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;