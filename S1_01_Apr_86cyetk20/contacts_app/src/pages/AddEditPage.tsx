import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useContactsActions from '../hooks/useContactsActions'
import { RootState } from '../store'
import ContactForm from '../features/contacts/ContactForm'
import { v4 as uuidv4 } from 'uuid'
import { Contact } from '../types/contact'

const AddEditPage = () => {
  const { id } = useParams()
  const { contacts } = useSelector((state: RootState) => state.contacts)
  const { addContact, editContact } = useContactsActions()
  
  const isEdit = !!id
  const contactToEdit = contacts.find(contact => contact.id === id)
  
  const initialValues: Contact = contactToEdit || {
    id: uuidv4(),
    name: '',
    phone: '',
    email: '',
    address: ''
  }

  const handleSubmit = async (values: Contact) => {
    try {
      if (isEdit) {
        editContact(values) 
      } else {
        addContact(values)
      }
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };


  return (
    <ContactForm 
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isEdit={isEdit}
    />
  )
}

export default AddEditPage