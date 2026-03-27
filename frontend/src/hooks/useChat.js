import { useState, useEffect } from 'react';

export function useChat() {
  const STORAGE_KEY = 'hm-playground-chat';
  const defaultMessages = [
    {
      id: 1,
      role: 'ai',
      text: 'Welcome to the H&M Strategic Engine. Please enter a Customer Hex ID to execute a full multimodal sequence analysis.',
      type: 'text'
    }
  ];

  const loadMessages = () => {
    if (typeof window === 'undefined') return defaultMessages;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultMessages;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse persisted chat", e);
    }
    return defaultMessages;
  };

  const [messages, setMessages] = useState(loadMessages);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    // 1. Render User Message immediately
    const userMsg = { id: Date.now(), role: 'user', text: input, type: 'text' };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    let narrativeId = null;
    const historySnapshot = updatedMessages.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : msg.role,
      content: msg.text ?? msg.data?.dossier?.customer_id ?? ''
    }));

    try {
      // 3. Request FastAPI Dream View pipeline
      const response = await fetch(`http://localhost:8000/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input, history: historySnapshot })
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
                setMessages(prev => [...prev, {
                  id: Date.now(),
                  role: 'ai',
                  type: 'data',
                  data: crmData
                }]);
              } else if (parsed.type === 'text') {
                const snippet = parsed.payload?.trim();
                if (!snippet) {
                  accumulatedText += parsed.payload;
                  continue;
                }
                accumulatedText += parsed.payload;
                if (narrativeId === null) {
                  narrativeId = Date.now() + 2;
                  setMessages(prev => [...prev, {
                    id: narrativeId,
                    role: 'ai',
                    text: accumulatedText,
                    type: 'text'
                  }]);
                } else {
                  setMessages(prev => prev.map(msg => msg.id === narrativeId ? {
                    ...msg,
                    text: accumulatedText
                  } : msg));
                }
              }
            } catch (e) {
              console.error("Stream parse error", e);
            }
          }
          boundary = buffer.indexOf('\n\n');
        }
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'ai',
        text: 'Error: Unable to locate Customer ID sequence. Please verify the Hex String or integer mapping and ensure localhost:8000 is active.',
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetMessages = () => setMessages(defaultMessages);

  return { messages, sendMessage, isLoading, resetMessages };
}
