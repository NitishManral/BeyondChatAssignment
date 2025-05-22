import React, { useState } from 'react';
import { getUnreadCount } from '../utils/helpers';
import { useSelector } from 'react-redux';

import { 
  FolderKanban,
  BookOpenCheck,
  Send,
  Zap,
  BookText,
  BarChart3,
  Users,
  MessageSquareText,
  Grid3X3
} from 'lucide-react';

const NavigationSidebar = ({ isMobile, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('kanban');
  const contacts = useSelector(state => state.contacts);

  const totalUnread = contacts.reduce((total, contact) => 
    total + getUnreadCount(contact.messages), 0
  );

  const navItems = [
    { id: 'MessageSquare', icon: MessageSquareText, notificationCount: totalUnread },
    { id: 'bookOpen', icon: BookOpenCheck },
    { id: 'send', icon: Send },
  ];

  const bottomItems = [
    { id: 'zap', icon: Zap },
    { id: 'bookText', icon: BookText },
    { id: 'chart', icon: BarChart3 },
    { id: 'users', icon: Users },
    { id: 'message', icon: MessageSquareText },
    { id: 'grid', icon: Grid3X3 },
  ];

  // Hide sidebar on mobile if not open
  if (isMobile && !isOpen) return null;

  return (
    <div className={`
      ${isMobile ? 'fixed left-0 top-0 z-50 h-full' : 'relative'}
      w-12 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4
      transition-transform duration-300 
      ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
    `}>
      
      {/* App logo / icon */}
      <div className="mb-6">
        <svg className="h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" role="img" focusable="false" aria-hidden="true" width="36" height="36">
          <path fill="currentColor" d="M31.171 19.81c0 .321-.126.629-.35.856a1.19 1.19 0 0 1-1.694 0 1.22 1.22 0 0 1-.35-.856V9c0-.32.125-.629.35-.856a1.19 1.19 0 0 1 1.693 0c.225.227.351.535.351.856zm-.416 7.49c-.158.16-4.61 3.91-12.775 3.91S5.393 27.48 5.205 27.32a1.2 1.2 0 0 1-.414-.811 1.2 1.2 0 0 1 .276-.87 1.19 1.19 0 0 1 1.682-.13c.069.051 4.047 3.31 11.221 3.31s11.182-3.279 11.222-3.309a1.21 1.21 0 0 1 1.692.13 1.2 1.2 0 0 1-.119 1.67zM4.78 9c.017-.322.16-.624.398-.839a1.2 1.2 0 0 1 .868-.31c.296.016.574.143.783.355.208.213.331.495.345.794v10.79c0 .32-.126.629-.35.856a1.19 1.19 0 0 1-1.694 0 1.22 1.22 0 0 1-.35-.856zm6.006-2.4c.018-.322.161-.624.399-.839a1.2 1.2 0 0 1 .868-.31c.295.016.574.143.782.355.209.213.332.495.346.794v16c0 .321-.126.629-.35.856a1.19 1.19 0 0 1-1.694 0 1.22 1.22 0 0 1-.35-.856zm6.037-.6c0-.32.126-.629.35-.856a1.19 1.19 0 0 1 1.694 0c.224.227.35.535.35.856v17.4c0 .32-.126.629-.35.856a1.19 1.19 0 0 1-1.694 0 1.22 1.22 0 0 1-.35-.856zm5.937.6c0-.32.126-.629.35-.856a1.19 1.19 0 0 1 1.694 0c.224.227.35.535.35.856v16c0 .321-.126.629-.35.856a1.19 1.19 0 0 1-1.693 0 1.22 1.22 0 0 1-.351-.856zM31.497 0H4.502a4.4 4.4 0 0 0-1.716.334 4.5 4.5 0 0 0-1.458.972A4.561 4.561 0 0 0 0 4.5v27c.003.594.121 1.183.349 1.73.228.549.56 1.046.979 1.464s.913.748 1.458.972A4.4 4.4 0 0 0 4.502 36h26.996a4.4 4.4 0 0 0 1.713-.333 4.5 4.5 0 0 0 1.458-.97A4.557 4.557 0 0 0 36 31.51V4.5a4.56 4.56 0 0 0-1.324-3.19 4.5 4.5 0 0 0-1.455-.974A4.4 4.4 0 0 0 31.508 0"></path>
        </svg>
      </div>
      
      {/* Top navigation icons with notification */}
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              relative w-11 h-11 flex items-center justify-center 
              transition-all duration-200 transform hover:scale-105 
              ${activeTab === item.id
                ? 'bg-white text-blue-600 shadow-sm border-l-4 border-blue-600'
                : 'text-gray-950 hover:bg-gray-200 hover:text-black'}
            `}
          >
            <item.icon className="w-5 h-5" />

            {item.notificationCount ? (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold z-30">
                {item.notificationCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Spacer pushes bottom items to the bottom */}
      <div className="flex-1"></div>

      {/* Bottom utility icons */}
      <div className="space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-black hover:bg-gray-200 hover:text-black transition-all duration-200 transform hover:scale-105"
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* User avatar at the bottom */}
      <div className="mt-4 relative">
        <img
          src="https://picsum.photos/200"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
    </div>
  );
};

export default NavigationSidebar;