
import React from 'react';
import { Home, BarChart2, MessageSquare, Briefcase, User } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileBottomNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'quotes', label: '行情', icon: BarChart2 },
    { id: 'ai', label: 'i问财', icon: MessageSquare },
    { id: 'trade', label: '交易', icon: Briefcase },
    { id: 'me', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-2 safe-bottom z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center space-y-1 transition-all relative ${
              isActive ? 'text-[#E63946]' : 'text-[#666666]'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
            {tab.id === 'ai' && (
              <div className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
