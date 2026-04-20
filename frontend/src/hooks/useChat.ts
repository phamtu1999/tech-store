import { useState } from 'react';
import { useSelector } from 'react-redux';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Chào bạn! Tôi là trợ lý TECHSTORE AI. Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { token } = useSelector((state: any) => state.auth);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    
    // 2. Prepare for assistant response
    setIsStreaming(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const baseUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api/v1` 
        : '/api/v1';
        
      const response = await fetch(`${baseUrl}/public/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text })
      });

      if (!response.body) throw new Error('No body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunks = decoder.decode(value).split('\n');
        
        chunks.forEach(chunk => {
          if (chunk.startsWith('data:')) {
            const content = chunk.replace('data:', '').trim();
            if (content && content !== '[DONE]') {
              setMessages(prev => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                newMessages[lastIndex] = {
                  ...newMessages[lastIndex],
                  content: newMessages[lastIndex].content + content
                };
                return newMessages;
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = 'Rất tiếc, đã có lỗi xảy ra. Bạn vui lòng thử lại sau.';
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, sendMessage, isStreaming };
}
