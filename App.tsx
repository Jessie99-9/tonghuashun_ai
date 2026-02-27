
import React, { useState } from 'react';
import MobileBottomNav from './components/MobileBottomNav';
import MobileAgentSpace from './components/MobileAgentSpace';
import { TrendingUp, Search, Bell, Grid, ChevronRight, User } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai');

  const renderContent = () => {
    switch (activeTab) {
      case 'ai':
        return <MobileAgentSpace />;
      case 'home':
        return (
          <div className="flex-1 overflow-y-auto bg-[#F8F9FB] pb-20">
            {/* Tonghuashun Home Header */}
            <div className="bg-[#E63946] px-4 pt-2 pb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="font-bold">同花顺</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Bell size={20} />
                  <Grid size={20} />
                </div>
              </div>
              <div className="bg-white/20 rounded-lg flex items-center px-3 py-2 space-x-2">
                <Search size={16} />
                <span className="text-sm opacity-80">搜索股票/基金/资讯</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 -mt-3">
              <div className="bg-white rounded-xl shadow-sm grid grid-cols-4 py-4 gap-y-4">
                {[
                  { n: '自选', i: '⭐', c: 'text-orange-500' },
                  { n: '行情', i: '📈', c: 'text-red-500' },
                  { n: '交易', i: '💰', c: 'text-blue-500' },
                  { n: '理财', i: '💎', c: 'text-yellow-600' },
                  { n: '问财', i: '🤖', c: 'text-purple-500' },
                  { n: '打新', i: '🆕', c: 'text-red-600' },
                  { n: '基金', i: '📊', c: 'text-green-600' },
                  { n: '更多', i: '➕', c: 'text-gray-400' },
                ].map(item => (
                  <div key={item.n} className="flex flex-col items-center space-y-1">
                    <span className={`text-xl ${item.c}`}>{item.i}</span>
                    <span className="text-[11px] text-[#666666]">{item.n}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Overview */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#333333]">市场行情</h3>
                <ChevronRight size={16} className="text-[#999999]" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: '上证指数', v: '3045.21', p: '+0.21%', up: true },
                  { n: '深证成指', v: '9321.45', p: '-0.15%', up: false },
                  { n: '创业板指', v: '1812.23', p: '+1.02%', up: true },
                ].map(idx => (
                  <div key={idx.n} className={`p-2 rounded-lg border ${idx.up ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'} flex flex-col items-center`}>
                    <span className="text-[10px] text-[#666666]">{idx.n}</span>
                    <span className={`text-sm font-bold ${idx.up ? 'text-[#E63946]' : 'text-[#00A854]'}`}>{idx.v}</span>
                    <span className={`text-[10px] ${idx.up ? 'text-[#E63946]' : 'text-[#00A854]'}`}>{idx.p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* News List */}
            <div className="bg-white p-4 space-y-4">
              <h3 className="font-bold text-[#333333]">要闻聚焦</h3>
              {[
                "重磅！证监会发布多项新规，引导长期资金入市",
                "科技股领涨，半导体板块掀起涨停潮",
                "全球市场动态：美股收高，纳指创历史新高",
              ].map((news, i) => (
                <div key={i} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-[#333333] line-clamp-2 leading-snug">{news}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-[#999999]">
                      <span className="text-[#E63946] border border-[#E63946]/20 px-1 rounded">热点</span>
                      <span>10分钟前</span>
                    </div>
                  </div>
                  <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={`https://picsum.photos/seed/news${i}/200/140`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4 bg-white">
            <div className="text-6xl grayscale opacity-20">📊</div>
            <h2 className="text-lg font-bold text-[#999999]">"{activeTab}" 模块功能升级中</h2>
            <p className="text-xs text-[#CCCCCC]">同花顺 AI 2.0 正在逐步灰度测试，请点击底部 [i问财] 进行体验</p>
            <button 
              onClick={() => setActiveTab('ai')}
              className="px-8 py-2.5 bg-[#E63946] text-white rounded-full text-sm font-medium shadow-md active:scale-95 transition-all"
            >
              去体验 i问财
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-[500px] mx-auto bg-[#F8F9FB] overflow-hidden shadow-2xl relative">
      {/* Status Bar Spacer */}
      <div className="h-10 bg-white shrink-0"></div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
