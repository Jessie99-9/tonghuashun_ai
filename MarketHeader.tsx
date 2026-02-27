
import React from 'react';
import { MOCK_STOCKS } from '../constants';

const MarketHeader: React.FC = () => {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm">
      <div className="flex items-center space-x-6 overflow-hidden">
        <div className="flex items-center space-x-1 shrink-0">
          <span className="text-sm font-bold text-gray-700">上证指数</span>
          <span className="text-sm font-bold text-red-600">3025.42</span>
          <span className="text-xs text-red-600">+0.45%</span>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          <span className="text-sm font-bold text-gray-700">深证成指</span>
          <span className="text-sm font-bold text-green-600">9245.10</span>
          <span className="text-xs text-green-600">-0.12%</span>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          <span className="text-sm font-bold text-gray-700">创业板指</span>
          <span className="text-sm font-bold text-red-600">1785.66</span>
          <span className="text-xs text-red-600">+1.22%</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="代码/全拼/首字母" 
            className="w-64 h-8 bg-gray-100 border border-gray-300 rounded px-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button className="absolute right-2 top-1 text-gray-400">🔍</button>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>09:30:15</span>
          <span className="px-1 bg-red-100 text-red-600 rounded">开盘中</span>
        </div>
      </div>
    </div>
  );
};

export default MarketHeader;
