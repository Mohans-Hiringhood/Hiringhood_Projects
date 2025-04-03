import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import AddEditPage from './pages/AddEditPage'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contacts/:id" element={<ContactPage />} />
          <Route path="add" element={<AddEditPage />} />
          <Route path="edit/:id" element={<AddEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App