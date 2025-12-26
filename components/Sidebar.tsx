
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'chat' as AppView, label: 'Intelligent Chat', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'images' as AppView, label: 'Image Studio', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'videos' as AppView, label: 'Video Lab', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'code' as AppView, label: 'Code Architect', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { id: 'settings' as AppView, label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <div className="w-20 md:w-64 glass h-full flex flex-col border-r border-white/5">
      <div className="p-6">
        <h1 className="text-xl font-bold gradient-text hidden md:block">DreamBoost AI</h1>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:hidden mx-auto" />
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="ml-3 font-medium hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 hidden md:block">
        <div className="glass rounded-xl p-4 text-xs text-gray-400">
          <p className="font-semibold text-white mb-1">Status</p>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Gemini Models Online
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
