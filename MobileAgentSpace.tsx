
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, Image as ImageIcon, Send, ChevronRight, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { AGENTS } from '../constants';
import { Agent, Message } from '../types';
import { getAgentResponse } from '../services/geminiService';

const MobileAgentSpace: React.FC = () => {
  const [activeAgents, setActiveAgents] = useState<Agent[]>([AGENTS[0]]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleAgent = (agent: Agent) => {
    setActiveAgents(prev => {
      const exists = prev.find(a => a.id === agent.id);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter(a => a.id !== agent.id);
      }
      return [...prev, agent];
    });
  };

  const onSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text: messageText,
      timestamp: Date.now(),
      isUser: true
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!text) setInputText('');
    setIsTyping(true);

    try {
      const aiResponses = await Promise.all(
        activeAgents.map(async (agent) => {
          const responseText = await getAgentResponse(agent, userMsg.text);
          return { agent, text: responseText };
        })
      );

      const newMsgs = aiResponses.map(resp => ({
        id: Math.random().toString(),
        senderId: resp.agent.id,
        text: resp.text,
        timestamp: Date.now(),
        isUser: false,
        agentName: resp.agent.name,
        agentAvatar: resp.agent.avatar
      }));

      setChatHistory(prev => [...prev, ...newMsgs]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden">
      {/* Tonghuashun Style Index Header */}
      <div className="bg-white px-4 py-2 flex overflow-x-auto hide-scrollbar space-x-6 border-b border-gray-100 shadow-sm">
        <div className="flex flex-col shrink-0">
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-[#666666]">上证指数</span>
            <TrendingUp size={10} className="text-[#E63946]" />
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold text-[#E63946]">3045.21</span>
            <span className="text-[10px] font-medium text-[#E63946]">+0.21%</span>
          </div>
        </div>
        <div className="flex flex-col shrink-0">
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-[#666666]">深证成指</span>
            <TrendingDown size={10} className="text-[#00A854]" />
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold text-[#00A854]">9321.45</span>
            <span className="text-[10px] font-medium text-[#00A854]">-0.15%</span>
          </div>
        </div>
        <div className="flex flex-col shrink-0">
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-[#666666]">创业板指</span>
            <TrendingUp size={10} className="text-[#E63946]" />
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold text-[#E63946]">1812.23</span>
            <span className="text-[10px] font-medium text-[#E63946]">+1.02%</span>
          </div>
        </div>
      </div>

      {/* i问财 Style Agent Selector */}
      <div className="bg-white px-4 py-3 border-b border-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#333333] flex items-center">
            <span className="w-1 h-3 bg-[#E63946] rounded-full mr-2"></span>
            多维智能体分析
          </h3>
          <span className="text-[10px] text-[#999999]">多选可对比</span>
        </div>
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar py-1">
          {AGENTS.map(agent => {
            const isSelected = !!activeAgents.find(a => a.id === agent.id);
            return (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent)}
                className={`flex flex-col items-center shrink-0 space-y-1.5 transition-all relative`}
              >
                <div className={`relative p-0.5 rounded-full border-2 transition-all ${
                  isSelected ? 'border-[#E63946] scale-110' : 'border-transparent opacity-60'
                }`}>
                  <img src={agent.avatar} className="w-11 h-11 rounded-full object-cover shadow-sm" />
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-[#E63946] text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] border border-white"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${
                  isSelected ? 'text-[#E63946]' : 'text-[#666666]'
                }`}>{agent.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-5 pb-44 hide-scrollbar"
      >
        <AnimatePresence>
          {chatHistory.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <MessageSquare size={32} className="text-[#E63946]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-[#333333]">我是 i问财 智能助手</h2>
                <p className="text-xs text-[#999999]">您可以问我行情、诊股或搜策略</p>
              </div>
              <div className="grid grid-cols-1 gap-2 px-4">
                {[
                  { t: "今日大盘走势如何？", icon: "📈" },
                  { t: "深度诊股：宁德时代", icon: "🔍" },
                  { t: "近期有哪些热门题材？", icon: "🔥" }
                ].map(item => (
                  <button 
                    key={item.t}
                    onClick={() => onSend(item.t)}
                    className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs text-[#333333] shadow-sm active:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-sm">{item.icon}</span>
                      <span>{item.t}</span>
                    </div>
                    <ChevronRight size={14} className="text-[#CCCCCC] group-hover:text-[#E63946]" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          
          {chatHistory.map((msg, i) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isUser && (
                <img src={(msg as any).agentAvatar} className="w-9 h-9 rounded-full mr-2.5 mt-1 border border-white shadow-sm" />
              )}
              <div className={`max-w-[80%] space-y-1`}>
                {!msg.isUser && (
                  <span className="text-[10px] text-[#999999] ml-1">{(msg as any).agentName}</span>
                )}
                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.isUser 
                    ? 'bg-[#E63946] text-white rounded-tr-none' 
                    : 'bg-white text-[#333333] rounded-tl-none border border-gray-50'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-center space-x-3"
            >
              <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
              <div className="bg-white px-4 py-2 rounded-2xl border border-gray-50 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-[#E63946] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#E63946] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#E63946] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* i问财 Style Input Section */}
      <div className="absolute bottom-[64px] left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        {/* Quick Suggestion Chips */}
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar mb-3 py-0.5">
          {["智能诊股", "主力分析", "涨停原因", "选股器"].map(tool => (
            <button key={tool} className="shrink-0 flex items-center px-3 py-1.5 bg-[#F5F7FA] rounded-lg text-[11px] text-[#666666] border border-transparent hover:border-[#E63946]/20 transition-all">
               {tool}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-[#F5F7FA] rounded-xl flex items-center px-3 border border-transparent focus-within:border-[#E63946]/30 focus-within:bg-white transition-all">
            <Search size={18} className="text-[#999999] mr-2" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
              placeholder="问行情、找个股、搜策略"
              className="bg-transparent flex-1 h-11 text-[14px] focus:outline-none text-[#333333]"
            />
            <div className="flex items-center space-x-2 ml-2">
              <button className="p-1 text-[#999999] hover:text-[#E63946] transition-colors">
                <Mic size={20} />
              </button>
              <button className="p-1 text-[#999999] hover:text-[#E63946] transition-colors">
                <ImageIcon size={20} />
              </button>
            </div>
          </div>
          <button 
            onClick={() => onSend()}
            disabled={!inputText.trim() || isTyping}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
              inputText.trim() ? 'bg-[#E63946] text-white shadow-md' : 'bg-[#EEEEEE] text-[#BBBBBB]'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAgentSpace;
