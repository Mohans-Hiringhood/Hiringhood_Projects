import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Contact } from '../types/contact'

interface ContactsState {
  contacts: Contact[]
}

const initialState: ContactsState = {
  contacts: [
    {
      id: '1',
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      address: '123 Main St, City',
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Dave Smith',
      phone: '0987654321',
      email: 'jane@example.com',
      address: '456 Oak Ave, Town',
      isFavorite: false,
    }
  ]
}

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload)
    },
    editContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.contacts[index] = action.payload
      }
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload)
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload);
      if (index !== -1) {
        state.contacts[index].isFavorite = !state.contacts[index].isFavorite;
      }
    }
  }
})

export const { addContact, editContact, deleteContact, toggleFavorite } = contactsSlice.actions
export default contactsSlice.reducer
export type { ContactsState }