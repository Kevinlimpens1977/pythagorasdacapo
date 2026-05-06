import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { askAiTutorCall } from '../../lib/api';

export default function AITutorChat({ onClose, contextHeading }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hallo! Ik zie dat je vastloopt bij "${contextHeading}". Waar kan ik je precies mee helpen?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Stuur alle voorgaande berichten mee (behalve het huidige user bericht)
      const previousMessages = currentMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

      const response = await askAiTutorCall(userMsg.content, contextHeading, previousMessages);
      
      if (response && response.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.content 
        }]);
      } else {
        throw new Error(response?.error || 'Geen geldig antwoord');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Oeps, er ging iets mis met het bereiken van de tutor. Probeer het later nog eens.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-slate-50 border border-slate-200 rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={24} />
          <h3 className="font-semibold text-lg">AI Tutor</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-blue-500 rounded-full transition-colors"
          title="Sluit Tutor"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2 text-slate-500">
              <Loader2 size={16} className="animate-spin" /> Denken...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Stel een vraag aan de tutor..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
