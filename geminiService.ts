
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Agent } from "../types";

export const getAgentResponse = async (
  agent: Agent,
  userMessage: string,
  history: { role: 'user' | 'model', content: string }[] = []
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    你正在扮演一名名为“${agent.name}”的角色。
    你的身份分类是：${agent.category}。
    你的性格特点：${agent.personality}。
    你的投资风格：${agent.investmentStyle}。
    
    规则：
    1. 必须始终保持设定的语气和风格。如果是普通股民，语气可以口语化，如果是讲师，语气要专业且具启发性。
    2. 针对用户的理财或股票问题，给出符合你角色设定的见解。
    3. 如果是选股分析，请从你的视角解读，不要给出单一的、模棱两可的回答。
    4. 回答字数控制在200字以内，保持简洁。
    5. 不要提供任何具体的买入/卖出投资建议。
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    // We convert our simplified history to what Gemini expects
    // Note: In this implementation we'll just send the direct prompt for simplicity
    // but the API supports message histories.
    const response = await chat.sendMessage({ message: userMessage });
    return response.text || "抱歉，我现在思维有点混乱，请稍后再问。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接超时或发生错误，请检查网络设置。";
  }
};
