import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useDispatch } from 'react-redux'
import { deleteContact } from '../store/contactsSlice'
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material'
import { Email, Phone, Home, ArrowBack, Edit, Delete } from '@mui/icons-material'

const ContactPage = () => {
  const { id } = useParams()
  const { contacts } = useSelector((state: RootState) => state.contacts)
  const contact = contacts.find(c => c.id === id)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  if (!contact) {
    return (
      <Box>
        <Typography variant="h5">Contact not found</Typography>
        <Button component={Link} to="/" startIcon={<ArrowBack />}>
          Back to contacts
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Button component={Link} to="/" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Back to contacts
      </Button>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {contact.name}
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Phone />
            </ListItemIcon>
            <ListItemText primary="Phone" secondary={contact.phone} />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText primary="Email" secondary={contact.email} />
          </ListItem>
          
          <Divider component="li" />
          
          <ListItem>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Address" secondary={contact.address} />
          </ListItem>
        </List>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/edit/${contact.id}`}
            startIcon={<Edit />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => {
              dispatch(deleteContact(contact.id))
              navigate('/')
            }}
          >
            Delete
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ContactPage