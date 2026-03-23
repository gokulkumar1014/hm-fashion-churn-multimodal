import { useState } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: 'Welcome to the H&M Strategic Engine. Please enter a Customer Hex ID to execute a full multimodal sequence analysis.',
      type: 'text'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    // 1. Render User Message immediately
    const userMsg = { id: Date.now(), role: 'user', text: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Render AI 'Thinking' Message
    const thinkingId = Date.now() + 1;
    setMessages(prev => [...prev, { 
      id: thinkingId, 
      role: 'ai', 
      text: 'Analyzing GCS feature tensors and computing Style Drift distance...', 
      type: 'text', 
      isThinking: true 
    }]);

    try {
      // 3. Request FastAPI Dream View pipeline
      const response = await fetch(`http://localhost:8000/api/v1/customer/${input.trim()}`);
      
      if (!response.ok) {
        throw new Error('Customer ID not found or server error');
      }

      const data = await response.json();

      // 4. Transform Thinking Node into Rich Data Node
      setMessages(prev => prev.map(msg => {
        if (msg.id === thinkingId) {
          return {
            id: thinkingId,
            role: 'ai',
            text: `Analysis finalized. Customer ${data.dossier.customer_id.substring(0,8)}... has a ${data.risk_assessment.churn_probability}% risk of churning. They are exhibiting ${data.style_analysis.trend_summary} style behavior. I am triggering the ${data.strategy.name} logic.`,
            type: 'data',
            data: data
          };
        }
        return msg;
      }));

    } catch (error) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === thinkingId) {
          return {
            id: thinkingId,
            role: 'ai',
            text: 'Error: Unable to locate Customer ID sequence. Please verify the Hex String or integer mapping and ensure localhost:8000 is active.',
            type: 'error'
          };
        }
        return msg;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}
