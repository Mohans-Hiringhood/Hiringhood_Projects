import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { addContact, editContact, deleteContact } from '../store/contactsSlice'
import { Contact } from '../types/contact'
import { useNavigate } from 'react-router-dom'

const useContactsActions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleAddContact = (contact: Contact) => {
    dispatch(addContact(contact))
    navigate('/') // Ensure this navigation is happening
  }

  const handleEditContact = (contact: Contact) => {
    dispatch(editContact(contact))
    navigate('/') // Ensure this navigation is happening
  }

  const handleDeleteContact = (id: string) => {
    dispatch(deleteContact(id))
    navigate('/') // Ensure this navigation is happening
  }

  return {
    addContact: handleAddContact,
    editContact: handleEditContact,
    deleteContact: handleDeleteContact
  }
}

export default useContactsActions