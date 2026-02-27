
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'quotes', label: '行情', icon: '📊' },
    { id: 'portfolio', label: '自选', icon: '⭐' },
    { id: 'ai', label: 'AI智能体', icon: '🤖' },
    { id: 'news', label: '资讯', icon: '📰' },
    { id: 'trade', label: '交易', icon: '💰' },
  ];

  return (
    <div className="w-16 h-full bg-[#1e1e1e] flex flex-col items-center py-4 space-y-6 text-white text-xs">
      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-lg mb-4">
        同
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center space-y-1 transition-colors w-full py-2 ${
            activeTab === tab.id ? 'text-red-500 border-r-2 border-red-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
      <div className="mt-auto flex flex-col items-center space-y-4">
        <button className="text-gray-400 hover:text-white">设置</button>
        <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
          <img src="https://picsum.photos/32" alt="avatar" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
