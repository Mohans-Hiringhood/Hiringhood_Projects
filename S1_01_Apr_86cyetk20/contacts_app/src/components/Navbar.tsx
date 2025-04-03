import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Contacts, Add } from '@mui/icons-material'

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Contacts sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Contacts App
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/add"
          startIcon={<Add />}
        >
          Add Contact
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar