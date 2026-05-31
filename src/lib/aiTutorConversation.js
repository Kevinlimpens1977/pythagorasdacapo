const isCompleteAssistantMessage = (content = '') => {
  const text = String(content || '').trim();
  return /[.!?]$/.test(text) && !/(?:,\s*|\b(?:en|of|om|als|want|maar|dat|die|kun je|kun jij|met))$/i.test(text);
};

export const buildAiTutorPreviousMessages = (messages = []) =>
  messages
    .slice(0, -1)
    .filter((message) => {
      if (message?.role !== 'assistant') return true;
      return isCompleteAssistantMessage(message.content);
    })
    .slice(-6)
    .map((message) => ({
      role: message?.role === 'assistant' ? 'assistant' : 'user',
      content: String(message?.content || '').slice(0, 2000)
    }));
