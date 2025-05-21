import { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import Message from './Message';
import {
  Zap,
  Paperclip,
  Smile,
  ChevronDown,
  MessageSquareText,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const ChatArea = ({ contact, isMobile, onMenuToggle }) => {
  const [messageInput, setMessageInput] = useState('');
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const textAreaRef = useRef(null);

  const aiMessage = useSelector(state => state.aiMessage); // Fetch AI message from Redux store
  const dispatch = useDispatch();

  // Toggle right sidebar for mobile
  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  // Autofill AI message response when available
  useEffect(() => {
    if (aiMessage) {
      setMessageInput(aiMessage);
      dispatch({ type: 'CLEAR_AI_MESSAGE' }); // Clear AI message after using it
    }
  }, [aiMessage, dispatch]);

  // Send the message to Redux store
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'agent',
      content: messageInput,
      state: 'read',
      receivedTime: new Date().toISOString(),
      seenTime: null,
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        contactId: contact.id,
        message: newMessage,
      },
    });

    setMessageInput('');
  };

  // Dynamically adjust textarea height
  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.min(400, Math.max(44, textArea.scrollHeight))}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [messageInput]);

  // When no contact is selected
  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquareText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
<div className={`flex-1 flex flex-col bg-white relative ${isMobile ? "h-[calc(100%-50px)]" : "h-screen"}`}>
        {/* Header with contact info and actions */}
      <ChatHeader 
        contact={contact} 
        isMobile={isMobile} 
        onMenuToggle={onMenuToggle}
        onOptionsToggle={toggleRightSidebar}
      />

      {/* Right sidebar for mobile options */}
      {isMobile && rightSidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleRightSidebar}
          />
          
          {/* Right sidebar */}
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col transition-transform duration-300">
            {/* Sidebar header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-lg">Options</h2>
              <button onClick={toggleRightSidebar}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Options content - mobile only */}
            <div className="p-4 space-y-4">
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
                <MessageSquareText className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Message Options</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
                <Zap className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Quick Replies</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
                <Paperclip className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Attachments</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
                <Smile className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Emojis</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Chat messages section */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {contact.messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            contactId={contact.id}
            index={index}
          />
        ))}
      </div>

      {/* Input area for composing new messages */}
      <div className="bg-white m-4 shadow-2xl rounded-xl p-4 flex flex-col">
        {/* Top bar with dropdown (visible on both mobile and desktop) */}
        <div className='flex items-start justify-between mb-2'>
          <button className="text-white hover:text-gray-700 transition-colors flex flex-row items-center space-x-2">
            <MessageSquareText className="w-5 h-5 text-black" />
            <span className="text-sm font-semibold text-black">Chat</span>
            <ChevronDown className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Textarea for typing */}
        <div className="flex-1 relative">
          <textarea
            ref={textAreaRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Use ⌘K for shortcuts"
            rows={1}
            style={{
              resize: 'none',
              height: 'auto',
              minHeight: '44px',
              maxHeight: '400px',
              overflow: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              outline: 'none',
            }}
            className="w-full focus:transparent focus:border-transparent transition-all scrollbar-hide"
          />
        </div>

        {/* Buttons below the text area */}
        <div className="flex items-center justify-between space-x-3 mt-2">
          <div className='flex items-center space-x-3'>
            {!isMobile ? (
              /* On desktop, show all buttons normally */
              <>
                <button className="text-black hover:text-gray-700 transition-colors">
                  <Zap className="w-5 h-5" />
                </button>
                <button className="text-black hover:text-gray-700 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-black hover:text-gray-700 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </>
            ) : (
              /* On mobile, show a button to open the right sidebar */
              <button 
                className="text-black hover:text-gray-700 transition-colors"
                onClick={toggleRightSidebar}
              >
                <MessageSquareText className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Send button */}
          <button
            className={`${messageInput.trim() ? 'bg-black' : 'bg-gray-300'} text-white px-2 py-1 rounded-md font-semibold flex items-center space-x-2 transition-colors`}
            onClick={handleSendMessage}
          >
            <span className="pr-2 border-r-2">Send</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;