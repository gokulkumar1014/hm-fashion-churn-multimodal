import { useState, useEffect, useRef } from 'react';

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
  const loadingIntervalRef = useRef(null);

  const TACTICAL_STATUSES = [
    "Scanning 1.3M Style DNA Profiles...",
    "Aggregating 31 Million Transaction Records...",
    "Calibrating Multimodal Visual Embeddings...",
    "Synthesizing Gemini Strategic Narrative...",
    "Computing Persona Probability Vector...",
    "Finalizing Strategic Interventions..."
  ];
  

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    // 1. Detect if this is an ID-based query
    const isIdQuery = /\b[a-fA-F0-9]{40,64}\b/.test(input) || /\b\d{5,15}\b/.test(input);

    // 2. Render User Message immediately
    const userMsg = { id: Date.now(), role: 'user', text: input, type: 'text' };
    const narrativeId = Date.now() + 1;
    
    // 3. Render initial thinking message
    //    ID queries get tactical status text; general queries get dots only (null status)
    const thinkingMsg = { 
      id: narrativeId, 
      role: 'ai', 
      text: '', 
      type: 'text', 
      isThinking: true,
      thinkingStatus: isIdQuery ? TACTICAL_STATUSES[0] : null
    };
    const updatedMessages = [...messages, userMsg, thinkingMsg];
    
    setMessages(updatedMessages);
    setIsLoading(true);

    // Dynamic Thinking Status Cycle — only for ID-based queries
    if (isIdQuery) {
      let statusIndex = 1;
      const cycleStatus = () => {
        setMessages(prev => prev.map(msg => msg.id === narrativeId ? {
          ...msg,
          thinkingStatus: TACTICAL_STATUSES[statusIndex % TACTICAL_STATUSES.length]
        } : msg));
        statusIndex++;
      };
      loadingIntervalRef.current = setInterval(cycleStatus, 3000);
    }

    // Omit thinking from history sent to LLM
    const historySnapshot = updatedMessages
      .filter(msg => !msg.isThinking)
      .map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : msg.role,
        content: msg.text ?? msg.data?.dossier?.customer_id ?? ''
      }));

    try {
      // 3. Request FastAPI Dream View pipeline
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/v1/chat`, {
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
                if (parsed.payload) {
                  setMessages(prev => prev.map(msg => msg.id === narrativeId ? {
                    ...msg,
                    data: parsed.payload
                  } : msg));
                }
              } else if (parsed.type === 'text') {
                const snippet = parsed.payload;
                if (snippet !== null && snippet !== undefined) {
                  accumulatedText += snippet;
                  
                  // Update the exact same narrative bubble: toggle off thinking and inject text
                  setMessages(prev => prev.map(msg => msg.id === narrativeId ? {
                    ...msg,
                    text: accumulatedText,
                    isThinking: false
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
      setMessages(prev => prev.map(msg => msg.id === narrativeId ? {
        ...msg,
        text: 'Error: Unable to locate Customer ID sequence. Please verify the Hex String or integer mapping and ensure localhost:8000 is active.',
        isThinking: false,
        type: 'error'
      } : msg));
    } finally {
      setIsLoading(false);
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    }
  };

  const resetMessages = () => setMessages(defaultMessages);

  return { messages, sendMessage, isLoading, resetMessages };
}
