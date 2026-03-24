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
      text: 'Accessing GCS Vault... Running ONNX Churn Inference...', 
      type: 'text', 
      isThinking: true 
    }]);

    try {
      // 3. Request FastAPI Dream View pipeline
      const response = await fetch(`http://localhost:8000/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });
      
      if (!response.ok) {
        throw new Error('Customer ID not found or server error');
      }

      // 4. Stream consumption
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let accumulatedText = "";
      let buffer = "";
      let crmData = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let boundary = buffer.indexOf('\n\n');
        while (boundary !== -1) {
          const eventStr = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          
          if (eventStr.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(eventStr.slice(6));
              
              if (parsed.type === 'data') {
                crmData = parsed.payload;
                setMessages(prev => prev.map(msg => msg.id === thinkingId ? {
                  ...msg,
                  type: crmData ? 'data' : 'text',
                  data: crmData,
                  isThinking: false
                } : msg));
              } else if (parsed.type === 'text') {
                accumulatedText += parsed.payload;
                setMessages(prev => prev.map(msg => msg.id === thinkingId ? {
                  ...msg,
                  text: accumulatedText,
                  isThinking: false
                } : msg));
              }
            } catch (e) {
              console.error("Stream parse error", e);
            }
          }
          boundary = buffer.indexOf('\n\n');
        }
      }

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
