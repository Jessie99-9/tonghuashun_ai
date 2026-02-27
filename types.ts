
export enum AgentCategory {
  INSTRUCTOR = '讲师型',
  TITAN = '行业大佬',
  RETAIL = '普通股民',
  SYSTEM = '系统助手'
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  category: AgentCategory;
  description: string;
  personality: string;
  investmentStyle: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isUser: boolean;
  isThinking?: boolean;
}

export interface StockInfo {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}
