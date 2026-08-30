const API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || '/api';

const parseSsePayload = (line) => {
  if (!line.startsWith('data: ')) {
    return null;
  }

  try {
    return JSON.parse(line.slice(6));
  } catch {
    return null;
  }
};

const handleSseEvent = (rawEvent, handlers) => {
  const lines = rawEvent.split('\n');
  const eventName = lines.find((line) => line.startsWith('event: '))?.slice(7);
  const payload = parseSsePayload(lines.find((line) => line.startsWith('data: ')) || '');

  if (!eventName || !payload) {
    return;
  }

  if (eventName === 'delta') {
    handlers.onDelta(payload.text || '');
  } else if (eventName === 'metadata') {
    handlers.onMetadata(payload);
  } else if (eventName === 'done') {
    handlers.onDone(payload);
  } else if (eventName === 'error') {
    handlers.onError(payload.message || 'Assistant error');
  }
};

export const fetchSuggestions = async () => {
  const response = await fetch(`${API_BASE_URL}/suggestions`);

  if (!response.ok) {
    throw new Error('Unable to load suggestions');
  }

  const data = await response.json();
  return data.suggestions || [];
};

export const streamPortfolioChat = async ({ message, history, onDelta, onMetadata, onDone, onError, signal }) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, history }),
    signal
  });

  if (!response.ok || !response.body) {
    throw new Error('Unable to connect to portfolio assistant');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const handlers = { onDelta, onMetadata, onDone, onError };

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() || '';

    for (const rawEvent of events) {
      handleSseEvent(rawEvent, handlers);
    }
  }

  if (buffer.trim()) {
    handleSseEvent(buffer, handlers);
  }
};

export const transcribePortfolioVoice = async ({ audioBlob, signal }) => {
  const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
    method: 'POST',
    headers: {
      'Content-Type': audioBlob.type || 'audio/webm'
    },
    body: audioBlob,
    signal
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Unable to transcribe voice');
  }

  return data.transcript || '';
};
