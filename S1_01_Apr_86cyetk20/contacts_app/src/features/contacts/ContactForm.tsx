import { useFormik } from 'formik'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import { 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Typography,
  Paper,
  Alert
} from '@mui/material'
import { Contact } from '../../types/contact'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

interface ContactFormProps {
  initialValues: Contact
  onSubmit: (values: Contact) => void
  isEdit?: boolean
}

const ContactForm = ({ initialValues, onSubmit, isEdit = false }: ContactFormProps) => {
  const { contacts } = useSelector((state: RootState) => state.contacts)

  const validationSchema = yup.object({
    name: yup.string()
      .required('Name is required')
      .test(
        'unique-name',
        'Contact with this name already exists',
        (value) => {
          if (!value || isEdit) return true
          return !contacts.some(contact => 
            contact.name.toLowerCase() === value.toLowerCase() && 
            contact.id !== initialValues.id
          )
        }
      ),
    phone: yup.string()
      .required('Phone is required')
      .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
      .test(
        'unique-phone',
        'Contact with this phone already exists',
        (value) => {
          if (!value || isEdit) return true
          return !contacts.some(contact => 
            contact.phone === value && 
            contact.id !== initialValues.id
          )
        }
      ),
    email: yup.string()
      .email('Enter a valid email')
      .required('Email is required')
      .test(
        'unique-email',
        'Contact with this email already exists',
        (value) => {
          if (!value || isEdit) return true
          return !contacts.some(contact => 
            contact.email.toLowerCase() === value.toLowerCase() && 
            contact.id !== initialValues.id
          )
        }
      ),
    address: yup.string().required('Address is required')
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values)
    }
  })

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Edit Contact' : 'Add New Contact'}
      </Typography>
      
      {formik.status && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formik.status}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} sx={{ flexDirection: "column" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Phone Number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              inputProps={{
                maxLength: 10,
                inputMode: 'numeric'
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Address"
              multiline
              rows={4}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                color="primary" 
                variant="outlined" 
                component={Link} 
                to="/"
              >
                Cancel
              </Button>
              <Button 
                color="primary" 
                variant="contained" 
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {isEdit ? 'Update Contact' : 'Add Contact'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default ContactForm