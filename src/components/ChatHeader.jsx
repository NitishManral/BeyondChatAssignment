import React from 'react';
import {
  Star,
  MoreHorizontal,
  Mail,
  Phone,
  MoonIcon,
  PanelBottomClose,
  Menu
} from 'lucide-react';

// ChatHeader displays the top navigation for an active chat
// Props:
// - contact: current selected contact object
// - isMobile: boolean indicating if view is on a mobile screen
// - onMenuToggle: function to toggle the sidebar or menu (used on mobile)
const ChatHeader = ({ contact, isMobile, onMenuToggle }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      {/* Main container for header layout */}
      <div className="flex items-center justify-between">

        {/* Left section: menu toggle and contact name */}
        <div className="flex items-center space-x-3">
          {/* Show hamburger menu on mobile */}
          {isMobile && (
            <button onClick={onMenuToggle} className="lg:hidden p-1">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {/* Contact name */}
          <h2 className="text-xl font-bold text-gray-900">
            {contact?.name}
          </h2>
        </div>

        {/* Right section: action buttons */}
        <div className="flex items-center space-x-2">
          {/* Favorite/star contact */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Star className="w-5 h-5 text-gray-600" />
          </button>

          {/* More options menu */}
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>

          {/* Send email */}
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Mail className="w-5 h-5 text-gray-600" />
          </button>

          {/* Call contact */}
          <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Phone className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-800">Call</span>
          </button>

          {/* Snooze notifications */}
          <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <MoonIcon className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-800">Snooze</span>
          </button>

          {/* Close conversation */}
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors">
            <PanelBottomClose className="w-4 h-4 mr-2" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
