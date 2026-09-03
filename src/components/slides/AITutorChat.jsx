import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, User, X } from 'lucide-react';
import { askAiTutorCall } from '../../lib/api';
import { buildAiTutorPreviousMessages } from '../../lib/aiTutorConversation';

export default function AITutorChat({
  onClose,
  contextHeading,
  hints = [],
  initialMessage = '',
  studentAnswer = '',
  blockId = '',
  lessonContext = '',
  // Alleen bij de herkansing van een toets- of quizvraag: de server haalt er
  // de foutdiagnose bij (zie askAiTutorCall).
  retryItem = null,
  messages,
  onMessagesChange,
  onUserMessageSent,
  draftInput,
  onDraftInputChange
}) {
  const initialMessages = [
    {
      role: 'assistant',
      content: initialMessage || `Hallo! Je hebt een fout antwoord gegeven bij "${contextHeading}". Ik help je het zelf te bedenken, zonder het antwoord direct te geven. Vertel me: waar ben je nu?`
    }
  ];
  const hasControlledMessages = Array.isArray(messages);
  const [localMessages, setLocalMessages] = useState(initialMessages);
  const chatMessages = hasControlledMessages && messages.length ? messages : localMessages;
  const hasControlledDraftInput = typeof draftInput === 'string';
  const [localInput, setLocalInput] = useState('');
  const input = hasControlledDraftInput ? draftInput : localInput;
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const commitMessages = (nextMessages) => {
    if (hasControlledMessages) {
      onMessagesChange?.(nextMessages);
    } else {
      setLocalMessages(nextMessages);
    }
  };

  const commitInput = (nextInput) => {
    if (hasControlledDraftInput) {
      onDraftInputChange?.(nextInput);
    } else {
      setLocalInput(nextInput);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const currentMessages = [...chatMessages, userMsg];
    commitMessages(currentMessages);
    commitInput('');
    setIsLoading(true);

    try {
      const previousMessages = buildAiTutorPreviousMessages(currentMessages);
      const response = await askAiTutorCall(userMsg.content, contextHeading, previousMessages, hints, studentAnswer, blockId, lessonContext, retryItem);

      if (response?.success) {
        commitMessages([...currentMessages, { role: 'assistant', content: response.content }]);
        if (response.helpCounted !== false) {
          onUserMessageSent?.(userMsg.content, response);
        }
      } else {
        throw new Error(response?.error || 'Geen geldig antwoord');
      }
    } catch {
      commitMessages([
        ...currentMessages,
        {
          role: 'assistant',
          content: 'Oeps, er ging iets mis met het bereiken van Digidocent. Probeer het later nog eens.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[min(500px,60dvh)] w-full flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
      <div className="flex items-center justify-between bg-[var(--helix-navy)] p-4 text-white">
        <div className="flex items-center gap-2">
          <Bot size={24} />
          <h3 className="text-lg font-semibold">Digidocent</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 transition-colors hover:bg-white/10"
          title="Sluit Digidocent"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {chatMessages.map((message, index) => (
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
          onChange={(event) => commitInput(event.target.value)}
          placeholder="Stel een vraag aan Digidocent..."
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
