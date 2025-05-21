import React from 'react';
import ContactItem from './ContactItem';
import { getUnreadCount } from '../utils/helpers';
import { ChevronDown, AlignJustify, WalletCards, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import ChatHeader from './ChatHeader';

// InboxSidebar component displays a list of contacts with their unread messages count.
// It supports mobile view toggling and displays buttons for additional actions.
const InboxSidebar = ({ activeContact, onContactSelect, isMobile, isOpen, onToggle }) => {
  // Get contact list from Redux store
  const contacts = useSelector(state => state.contacts);

  // Calculate total unread messages from all contacts
  const totalUnread = contacts.reduce((total, contact) =>
    total + getUnreadCount(contact.messages), 0
  );

  // If on mobile and sidebar is closed, don't render it
  if (isMobile && !isOpen) return null;

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-20 bg-white' : ''} flex flex-col`}>
      {/* ChatHeader should only be shown in the main content area, not in sidebar */}
      {/* Removed the ChatHeader from here */}

      {/* Background overlay when sidebar is open on mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar container */}
      <div className={`${isMobile ? 'fixed left-0 top-0 z-40 h-full' : 'relative'} w-80 bg-white flex flex-col shadow-lg transition-transform duration-300 ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}>

        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          {/* Top row: Title and close button for mobile */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-gray-900">Your inbox</span>
            </div>

            {/* Mobile close (X) button */}
            {isMobile && (
              <button onClick={onToggle} className="lg:hidden p-1">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Second row: Filters and unread count */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-1 text-gray-700">
              <span className="text-sm font-bold text-black">{totalUnread} Open</span>
              <ChevronDown className="w-4 h-4 font-bold text-black" />
            </div>
            <div className="flex items-center space-x-1 text-gray-700">
              <span className="text-sm font-bold">Newest</span>
              <ChevronDown className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div
          style={{ scrollbarWidth: 'none' }} // Firefox
          className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide" // custom scrollbar class may be defined globally
        >
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={contact.id === activeContact}
              onClick={() => onContactSelect(contact.id)}
            />
          ))}
        </div>

        {/* Bottom action buttons */}
        <div className="fixed bottom-0 left-0 m-3 flex items-center justify-evenly w-16 h-8 p-1 bg-white border-t border-gray-200 rounded-md shadow-lg">
          <button>
            <AlignJustify size={18} />
          </button>
          <button>
            <WalletCards size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxSidebar;