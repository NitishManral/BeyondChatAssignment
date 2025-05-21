// store.js
import { createStore } from 'redux';
import { contacts as contactsData } from './data/data';

// Initial state
const initialState = {
  contacts: contactsData.map(contact => ({
    ...contact,
    messages: contact.messages.map(msg => ({...msg, state: 'unread'}))
  })),
    aiResponse: null 

};

// Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AI_MESSAGE':
      return { ...state, aiMessage: action.payload };
    case 'CLEAR_AI_MESSAGE':
      return { ...state, aiMessage: null };
    case 'MARK_ALL_MESSAGES_AS_READ':
      return {
        ...state,
        contacts: state.contacts.map(contact => {
          if (contact.id === action.payload.contactId) {
            return {
              ...contact,
              messages: contact.messages.map(message => ({
                ...message,
                state: 'read',
                seenTime: message.sender === 'contact' ? new Date().toISOString() : message.seenTime
              }))
            };
          }
          return contact;
        })
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        contacts: state.contacts.map(contact => {
          if (contact.id === action.payload.contactId) {
            return {
              ...contact,
              messages: [...contact.messages, action.payload.message]
            };
          }
          return contact;
        })
      };

    default:
      return state;
  }
};

const store = createStore(rootReducer);
export default store;