import React, { useState, useEffect } from 'react';
import { Star, Send, Bot, X, Square, ArrowUp, ChevronDown, SquarePen } from 'lucide-react';
import { useDispatch } from 'react-redux';

/**
 * AI assistant configuration with
 * - name, avatar,
 * - initial greeting content,
 * - predefined responses triggered by keywords,
 * - suggestions and typing settings.
 */
const aiConfig = {
  assistant: {
    name: 'Fin',
    avatar: 'AI',
    initialContent: {
      icon: '⌘',
      greeting: "Hi, I'm Fin AI Copilot",
      instruction: "Ask me anything about this conversation."
    },
    responses: [
      {
        trigger: 'refund',
        content: "We understand that sometimes a purchase may not meet your expectations. To help you with a refund, please provide your order ID and proof of purchase.",
        sources: [
          { id: 1, title: 'Getting a refund', type: 'document' },
          { id: 2, title: 'Refund for an order placed by mistake', type: 'policy' },
          { id: 3, title: 'Refund for an unwanted gift', type: 'policy' }
        ]
      }
    ],
    suggestions: ['How do I get a refund?'],
    settings: {
      typingSpeed: 30,    // ms delay per character while typing
      maxMessages: 20,    // max number of messages to keep in chat
      responseDelay: 500  // delay before assistant starts responding
    }
  }
};

/**
 * AICopilot Component
 * @param {boolean} isMobile - Indicates if rendering for mobile
 * @param {boolean} isOpen - Controls visibility on mobile
 * @param {function} onToggle - Toggle callback (used for mobile overlay)
 */
const AICopilot = ({ isMobile, isOpen, onToggle }) => {
  // UI state for active tab (copilot or details)
  const [activeTab, setActiveTab] = useState('copilot');
  // User's current question input
  const [question, setQuestion] = useState('');
  // Array of chat messages
  const [messages, setMessages] = useState([]);
  // Typing indicator state
  const [isTyping, setIsTyping] = useState(false);
  // Response rendering stages: 0 = no response, 1 = typing, 2 = completed
  const [responseStage, setResponseStage] = useState(0);
  // Current text being typed out (incremental)
  const [currentText, setCurrentText] = useState('');
  // Current character index for typing animation
  const [charIndex, setCharIndex] = useState(0);
  // The current response object being displayed
  const [currentResponse, setCurrentResponse] = useState(null);

  // Redux dispatch function to send messages/actions
  const dispatch = useDispatch();

  const { assistant } = aiConfig;
  const { typingSpeed, maxMessages, responseDelay } = assistant.settings;

  /**
   * Dispatch the assistant's message content to redux store.
   * This could be used to insert the AI response elsewhere (like a composer).
   * @param {string} content
   */
  const handleInsertResponse = (content) => {
    dispatch({
      type: 'SET_AI_MESSAGE',  // action type to store AI message in redux
      payload: content
    });
  };

  /**
   * Scroll chat container to the bottom for latest messages.
   */
  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  /**
   * Effect to keep messages array within maxMessages limit and scroll down when messages change.
   */
  useEffect(() => {
    if (messages.length > maxMessages) {
      setMessages(messages.slice(messages.length - maxMessages));
    }
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, maxMessages]);

  /**
   * Effect to animate assistant typing response character-by-character.
   * When done typing, move to responseStage 2 (completed).
   */
  useEffect(() => {
    if (responseStage === 1 && charIndex < currentResponse?.content?.length) {
      // Continue typing next character
      const typingTimer = setTimeout(() => {
        setCurrentText(currentResponse.content.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        scrollToBottom();
      }, typingSpeed);

      return () => clearTimeout(typingTimer);
    } else if (responseStage === 1 && charIndex >= currentResponse?.content?.length) {
      // Typing complete, finalize response display
      const completeTimer = setTimeout(() => {
        setResponseStage(2);
        setIsTyping(false);
        setMessages([...messages, {
          id: Date.now() + 1,
          sender: assistant.name,
          content: currentResponse.content,
          avatar: assistant.avatar,
          sources: currentResponse.sources
        }]);
        setTimeout(scrollToBottom, 100);
      }, responseDelay);
      return () => clearTimeout(completeTimer);
    }
  }, [responseStage, charIndex, currentResponse, messages, assistant, responseDelay, typingSpeed]);

  /**
   * Handle sending user's question.
   * Finds matching response based on keywords or fallback to unknown answer.
   * Resets typing animation states.
   */
  const handleSendMessage = () => {
    if (!question.trim()) return;

    // Find response triggered by a keyword in question (case insensitive)
    const matchedResponse = assistant.responses.find(response =>
      question.toLowerCase().includes(response.trigger)
    ) || {
      content: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
      sources: []
    };

    setCurrentResponse(matchedResponse);

    // Add user's question to chat messages
    const newMessages = [...messages, {
      id: Date.now(),
      sender: 'You',
      content: question,
      avatar: '👤'
    }];

    setMessages(newMessages);
    setQuestion('');
    setIsTyping(true);
    setCurrentText('');
    setCharIndex(0);
    setTimeout(scrollToBottom, 100);

    // Delay before assistant starts typing response
    setTimeout(() => {
      setResponseStage(1);
      setTimeout(scrollToBottom, 50);
    }, responseDelay);
  };

  /**
   * Handle clicking on a suggested question.
   * Auto-fills input and sends immediately.
   * @param {string} suggestion
   */
  const handleSuggestedQuestion = (suggestion) => {
    setQuestion(suggestion);
    setTimeout(handleSendMessage, 100);
  };

  // Hide component on mobile if closed
  if (isMobile && !isOpen) return null;

  /**
   * Renders the assistant's response based on current response stage:
   * - Stage 1: typing animation
   * - Stage 2: fully displayed response with sources
   */
  const renderResponseByStage = () => {
    if (responseStage === 0 || !currentResponse) return null;

    return (
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex items-start">
          <div className="w-6 h-6 rounded bg-black flex items-center justify-center mr-2 flex-shrink-0">
            <span className="text-white text-xs">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{assistant.name}</span>

            {responseStage === 1 && (
              <div className="mt-1 w-full rounded-lg relative overflow-hidden transition-all duration-300"
                style={{ minHeight: '24px', maxHeight: '150px' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 animate-gradient"></div>
                <div className="p-4 relative z-10">
                  {currentText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            )}

            {responseStage === 2 && (
              <>
                <div className="mt-1 p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 animate-gradient"></div>
                  <p className="relative z-10">{currentResponse.content}</p>
                </div>

                {currentResponse.sources.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">{currentResponse.sources.length} relevant sources found</p>
                    <div className="flex flex-col space-y-1 mt-1">
                      {currentResponse.sources.map(source => (
                        <div key={source.id} className="flex items-center">
                          {source.type === 'document' ? (
                            <Square className="w-3 h-3 text-black mr-2" />
                          ) : (
                            <div className="w-3 h-3 bg-blue-600 mr-2"></div>
                          )}
                          <span className="text-sm">{source.title}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="flex items-center text-xs text-blue-600 mt-2"
                      onClick={() => handleInsertResponse(currentResponse.content)}
                      aria-label="Insert AI response into composer"
                    >
                      <SquarePen className="w-3 h-3 mr-1" />
                      Insert this response
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full border-l border-gray-200 bg-white shadow-lg flex flex-col">

      {/* Mobile overlay for toggling */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
          aria-label="Close AI Copilot"
        />
      )}

      {/* Header with tabs and close button */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
              ${activeTab === 'copilot' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
            aria-selected={activeTab === 'copilot'}
            aria-label="Open AI Copilot tab"
          >
            Copilot
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
              ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
            aria-selected={activeTab === 'details'}
            aria-label="Open Details tab"
          >
            Details
          </button>
        </div>

        {isMobile && (
          <button
            onClick={onToggle}
            aria-label="Close AI Copilot panel"
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Content container */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Copilot Tab */}
        {activeTab === 'copilot' && (
          <div className="flex flex-col flex-grow p-4 overflow-y-auto chat-container" role="log" aria-live="polite" aria-relevant="additions">
            {/* Initial greeting message */}
            {messages.length === 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-bold mr-2">⌘</div>
                  <h2 className="text-lg font-semibold">{assistant.initialContent.greeting}</h2>
                </div>
                <p className="text-gray-700">{assistant.initialContent.instruction}</p>
              </div>
            )}

            {/* Render existing messages */}
            {messages.map(({ id, sender, content, avatar, sources }) => (
              <div key={id} className="flex items-start mb-4 space-x-2">
                <div className="flex-shrink-0 w-6 h-6 rounded bg-gray-300 flex items-center justify-center text-xs font-semibold">
                  {avatar || sender[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{sender}</p>
                  <p className="text-sm">{content}</p>
                  {sources && sources.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      Sources: {sources.map(src => src.title).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Render the assistant response currently typing or just completed */}
            {renderResponseByStage()}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="p-4 text-sm text-gray-700">
            {/* You can populate details content here */}
            <p>Details panel content goes here...</p>
          </div>
        )}

        {/* User Input */}
        {activeTab === 'copilot' && (
          <div className="p-4 border-t flex flex-col space-y-2">
            {/* Suggested questions buttons */}
            <div className="flex space-x-2 overflow-x-auto">
              {assistant.suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(suggestion)}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs whitespace-nowrap"
                  aria-label={`Suggested question: ${suggestion}`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Question input and send button */}
            <div className="flex items-center">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask AI..."
                className="flex-grow border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-600 transition"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                aria-label="Enter your question"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
                aria-label="Send question"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICopilot;
