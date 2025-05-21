import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareText,
  Bot,
  Menu,
} from 'lucide-react';

import NavigationSidebar from './NavigationSidebar';
import InboxSidebar from './InboxSidebar';
import ChatArea from './ChatArea';
import AICopilot from './AICopilot';
import { markAllMessagesAsRead } from '../redux/actions/contactsActions'

import { useSelector, useDispatch } from 'react-redux';

// Main Component with mobile responsiveness
export default function MessagingInterface() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const dispatch = useDispatch();

  const contacts = useSelector(state => state.contacts);
  const [activeContact, setActiveContact] = useState(contacts[0]?.id || null);
  const seenContacts = useRef(new Set());

  useEffect(() => {
    if (activeContact && !seenContacts.current.has(activeContact)) {
      dispatch(markAllMessagesAsRead(activeContact));
      seenContacts.current.add(activeContact);
    }
  }, [activeContact, dispatch]);
  console.log(contacts);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
        setInboxOpen(true);
        setCopilotOpen(true);
      } else {
        setSidebarOpen(false);
        setInboxOpen(false);
        setCopilotOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContactSelect = (contactId) => {
    setActiveContact(contactId);
    dispatch({
      type: 'MARK_ALL_MESSAGES_AS_READ',
      payload: { contactId }
    });
    setActiveContact(contactId);
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? {
        ...contact,
        messages: contact.messages.map(msg => ({ ...msg, state: 'read' }))
      } : contact
    ));
    if (isMobile) {
      setInboxOpen(false);
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 relative overflow-hidden">
      {/* Mobile Overlays */}
      {(sidebarOpen || inboxOpen || copilotOpen) && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => {
            setSidebarOpen(false);
            setInboxOpen(false);
            setCopilotOpen(false);
          }}
        />
      )}

      {/* Navigation Sidebar */}
      <NavigationSidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        contacts={contacts}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Inbox Sidebar */}
      <InboxSidebar
        contacts={contacts}
        activeContact={activeContact}
        onContactSelect={handleContactSelect}
        isMobile={isMobile}
        isOpen={inboxOpen}
        onToggle={() => setInboxOpen(!inboxOpen)}
      />

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-transform duration-300 ${isMobile && activeContact ? '-translate-x-full' : 'translate-x-0'
        }`}>
        <ChatArea
          contact={contacts.find(c => c.id === activeContact)}
          isMobile={isMobile}
          onMenuToggle={() => setInboxOpen(true)}
        />
      </div>

      {/* AI Copilot */}
      <AICopilot
        isMobile={isMobile}
        isOpen={copilotOpen}
        onToggle={() => setCopilotOpen(!copilotOpen)}
      />

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-between z-50">
          <button
            onClick={() => setInboxOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <MessageSquareText className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCopilotOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <Bot className="w-6 h-6" />
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}