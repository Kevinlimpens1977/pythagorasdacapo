import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, User, X } from 'lucide-react';
import { askAiTutorCall } from '../../lib/api';

export default function AITutorChat({
  onClose,
  contextHeading,
  hints = [],
  initialMessage = '',
  onUserMessageSent
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: initialMessage || `Hallo! Je hebt een fout antwoord gegeven bij "${contextHeading}". Ik help je het zelf te bedenken, zonder het antwoord direct te geven. Vertel me: waar ben je nu?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHints, setShowHints] = useState(hints.length > 0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);
    onUserMessageSent?.(userMsg.content);

    try {
      const previousMessages = currentMessages
        .slice(0, -1)
        .map((message) => ({ role: message.role, content: message.content }));
      const response = await askAiTutorCall(userMsg.content, contextHeading, previousMessages, hints);

      if (response?.success) {
        setMessages((current) => [...current, { role: 'assistant', content: response.content }]);
      } else {
        throw new Error(response?.error || 'Geen geldig antwoord');
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'Oeps, er ging iets mis met het bereiken van P-AI-co. Probeer het later nog eens.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[500px] w-full flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
      <div className="flex items-center justify-between bg-[var(--helix-navy)] p-4 text-white">
        <div className="flex items-center gap-2">
          <Bot size={24} />
          <h3 className="text-lg font-semibold">P-AI-co</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 transition-colors hover:bg-white/10"
          title="Sluit P-AI-co"
        >
          <X size={20} />
        </button>
      </div>

      {hints.length > 0 && (
        <div className="border-b border-fuchsia-100 bg-[var(--helix-soft-lavender)] p-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full text-left text-sm font-semibold text-[var(--helix-purple)] transition-colors hover:text-[var(--helix-navy)]"
          >
            {showHints ? 'v' : '>'} Beschikbare hints ({hints.length})
          </button>
          {showHints && (
            <div className="mt-3 space-y-2">
              {hints.map((hint, index) => (
                <div key={index} className="rounded-lg border border-fuchsia-100 bg-white p-2 text-sm text-slate-700">
                  <span className="font-semibold text-[var(--helix-purple)]">Hint {index + 1}:</span> {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
              message.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
            }`}>
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'rounded-tr-none bg-slate-800 text-white'
                : 'rounded-tl-none border border-slate-200 bg-white text-slate-700 shadow-sm'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm">
              <Loader2 size={16} className="animate-spin" /> Denken...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 bg-white p-4">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Stel een vraag aan P-AI-co..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--helix-purple)]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="rounded-xl bg-[var(--helix-navy)] p-3 text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
