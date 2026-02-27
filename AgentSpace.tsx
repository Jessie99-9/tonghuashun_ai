
import React, { useState, useEffect, useRef } from 'react';
import { AGENTS } from '../constants';
import { Agent, AgentCategory, Message } from '../types';
import { getAgentResponse } from '../services/geminiService';

const AgentSpace: React.FC = () => {
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([AGENTS[0]]);
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleAgentSelection = (agent: Agent) => {
    setSelectedAgents(prev => {
      if (prev.find(a => a.id === agent.id)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(a => a.id !== agent.id);
      }
      return [...prev, agent];
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text: inputText,
      timestamp: Date.now(),
      isUser: true
    };

    // Add user message to all selected agents' histories
    const newHistories = { ...chatHistories };
    selectedAgents.forEach(agent => {
      newHistories[agent.id] = [...(newHistories[agent.id] || []), userMsg];
    });
    setChatHistories(newHistories);
    setInputText('');
    setIsProcessing(true);

    // Call API for each selected agent
    const responses = await Promise.all(
      selectedAgents.map(async agent => {
        const text = await getAgentResponse(agent, inputText);
        return { agentId: agent.id, text };
      })
    );

    const updatedHistories = { ...newHistories };
    responses.forEach(resp => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: resp.agentId,
        text: resp.text,
        timestamp: Date.now(),
        isUser: false
      };
      updatedHistories[resp.agentId] = [...(updatedHistories[resp.agentId] || []), aiMsg];
    });

    setChatHistories(updatedHistories);
    setIsProcessing(false);
  };

  useEffect(() => {
    selectedAgents.forEach(agent => {
      const el = scrollRefs.current[agent.id];
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [chatHistories, selectedAgents]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Agents Selector Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-4 overflow-x-auto">
        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">对比分析:</span>
        <div className="flex space-x-2">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => toggleAgentSelection(agent)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                selectedAgents.find(a => a.id === agent.id)
                  ? 'bg-red-50 border-red-500 text-red-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-red-300'
              }`}
            >
              <img src={agent.avatar} className="w-5 h-5 rounded-full" alt="" />
              <span>{agent.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Agent Chat View */}
      <div className="flex-1 flex overflow-hidden">
        {selectedAgents.map((agent, index) => (
          <div 
            key={agent.id} 
            className={`flex-1 flex flex-col border-r border-gray-200 last:border-r-0 h-full min-w-[300px] bg-white`}
          >
            {/* Agent Info Header */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center space-x-3">
              <img src={agent.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt="" />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-gray-800">{agent.name}</h3>
                  <span className="px-1.5 py-0.5 bg-gray-200 text-[10px] text-gray-500 rounded uppercase tracking-wider">{agent.category}</span>
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-1">{agent.description}</p>
              </div>
            </div>

            {/* Message List */}
            <div 
              ref={el => scrollRefs.current[agent.id] = el}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {(chatHistories[agent.id] || []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                    msg.isUser ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-500 rounded-lg px-3 py-2 text-sm italic">
                    正在思考中...
                  </div>
                </div>
              )}
              {!(chatHistories[agent.id]?.length) && (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-2 opacity-50">
                  <span className="text-4xl">💭</span>
                  <p className="text-xs">我是{agent.name}，想听听我的见解吗？</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="请输入您的问题或想分析的股票名称/代码..."
              className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            <div className="absolute bottom-2 left-3 flex space-x-4">
              <button className="text-gray-400 hover:text-red-500 text-xs flex items-center space-x-1">
                <span>🎤</span>
                <span>语音输入</span>
              </button>
              <button className="text-gray-400 hover:text-red-500 text-xs flex items-center space-x-1">
                <span>📷</span>
                <span>截屏识别</span>
              </button>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
              !inputText.trim() || isProcessing ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isProcessing ? '思考中' : '向 AI 发问'}
          </button>
        </div>
        <div className="mt-2 flex justify-center space-x-6">
          <button className="text-[10px] text-gray-400 hover:text-gray-600">理财知识问答</button>
          <button className="text-[10px] text-gray-400 hover:text-gray-600">个股深度诊股</button>
          <button className="text-[10px] text-gray-400 hover:text-gray-600">宏观政策解读</button>
          <button className="text-[10px] text-gray-400 hover:text-gray-600">主力资金追踪</button>
        </div>
      </div>
    </div>
  );
};

export default AgentSpace;
