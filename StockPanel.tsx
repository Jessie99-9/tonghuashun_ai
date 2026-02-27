
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_STOCKS } from '../constants';

const data = [
  { time: '09:30', price: 100 },
  { time: '10:00', price: 102 },
  { time: '10:30', price: 101 },
  { time: '11:00', price: 104 },
  { time: '11:30', price: 103 },
  { time: '13:00', price: 105 },
  { time: '13:30', price: 108 },
  { time: '14:00', price: 107 },
  { time: '14:30', price: 106 },
  { time: '15:00', price: 109 },
];

const StockPanel: React.FC = () => {
  const stock = MOCK_STOCKS[2]; // Ningde

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{stock.name}</h2>
            <p className="text-xs text-gray-400">{stock.code}.SZ</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">{stock.price}</p>
            <p className="text-xs text-red-600">+{stock.change} (+{stock.changePercent}%)</p>
          </div>
        </div>
      </div>
      
      <div className="h-48 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#ef4444" fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 p-4 text-xs">
        <div className="grid grid-cols-2 gap-y-2 border-b border-gray-100 pb-4 mb-4">
          <div className="flex justify-between px-2">
            <span className="text-gray-400">今开</span>
            <span className="text-red-600">155.20</span>
          </div>
          <div className="flex justify-between px-2">
            <span className="text-gray-400">最高</span>
            <span className="text-red-600">160.45</span>
          </div>
          <div className="flex justify-between px-2">
            <span className="text-gray-400">成交量</span>
            <span className="text-gray-700">12.5万</span>
          </div>
          <div className="flex justify-between px-2">
            <span className="text-gray-400">成交额</span>
            <span className="text-gray-700">18.2亿</span>
          </div>
        </div>

        <h3 className="font-bold mb-2">五档明细</h3>
        <div className="space-y-1">
          {[5,4,3,2,1].map(i => (
            <div key={`sell-${i}`} className="flex justify-between">
              <span className="text-gray-400">卖{i}</span>
              <span className="text-red-500">158.{i}0</span>
              <span className="text-gray-700">{i * 123}</span>
            </div>
          ))}
          <div className="h-px bg-gray-200 my-1"></div>
          {[1,2,3,4,5].map(i => (
            <div key={`buy-${i}`} className="flex justify-between">
              <span className="text-gray-400">买{i}</span>
              <span className="text-red-500">158.0{i}</span>
              <span className="text-gray-700">{i * 456}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockPanel;
