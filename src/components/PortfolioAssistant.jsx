import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Copy,
  ExternalLink,
  Github,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { fetchSuggestions, streamPortfolioChat } from '../services/portfolioAssistantApi';

const STORAGE_KEY = 'pratik-portfolio-assistant-history';

const fallbackSuggestions = [
  'Tell me about yourself',
  'Projects',
  'Skills',
  'Experience',
  'Resume',
  'Contact',
  'Explain CodeSight',
  'Explain SnapScroll'
];

const createMessage = (role, content, extras = {}) => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
  ...extras
});

const SourceList = ({ sources = [] }) => {
  const uniqueSources = [...new Map(sources.map((source) => [source.source, source])).values()];

  if (uniqueSources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {uniqueSources.map((source) => (
        <span
          key={source.source}
          className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
        >
          Source: {source.source}
        </span>
      ))}
    </div>
  );
};

const ProjectCards = ({ cards = [] }) => {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 grid gap-3">
      {cards.map((project) => (
        <div
          key={project.name}
          className="rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
        >
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{project.name}</h4>
          {project.description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{project.description}</p>
          )}
          {project.techStack?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-900 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                <Github size={13} />
                GitHub
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
              >
                <ExternalLink size={13} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const MarkdownMessage = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      a: ({ ...props }) => (
        <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2" />
      ),
      p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0" />,
      ul: ({ ...props }) => <ul {...props} className="mb-2 list-disc space-y-1 pl-4" />,
      ol: ({ ...props }) => <ol {...props} className="mb-2 list-decimal space-y-1 pl-4" />,
      code: ({ ...props }) => (
        <code {...props} className="rounded bg-slate-200 px-1 py-0.5 text-[11px] dark:bg-slate-700" />
      )
    }}
  >
    {content}
  </ReactMarkdown>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
    <Loader2 className="animate-spin text-primary" size={14} />
    <span>Pratik's assistant is typing</span>
  </div>
);

const PortfolioAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState(fallbackSuggestions);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  const visibleMessages = useMemo(() => messages.slice(-20), [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    fetchSuggestions()
      .then((items) => setSuggestions(items.length ? items : fallbackSuggestions))
      .catch(() => setSuggestions(fallbackSuggestions));
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isStreaming]);

  const submitMessage = async (value = input) => {
    const text = value.trim();

    if (!text || isStreaming) {
      return;
    }

    const userMessage = createMessage('user', text);
    const assistantMessage = createMessage('assistant', '', {
      sources: [],
      projectCards: []
    });
    const history = messages
      .filter((message) => message.content.trim())
      .slice(-10)
      .map(({ role, content }) => ({ role, content }));

    setError('');
    setInput('');
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    try {
      await streamPortfolioChat({
        message: text,
        history,
        signal: abortRef.current.signal,
        onDelta: (delta) => {
          setMessages((current) => current.map((message) => (
            message.id === assistantMessage.id
              ? { ...message, content: `${message.content}${delta}` }
              : message
          )));
        },
        onMetadata: (metadata) => {
          setMessages((current) => current.map((message) => (
            message.id === assistantMessage.id
              ? {
                  ...message,
                  sources: metadata.sources || [],
                  projectCards: metadata.projectCards || []
                }
              : message
          )));
        },
        onDone: (metadata) => {
          setMessages((current) => current.map((message) => (
            message.id === assistantMessage.id
              ? {
                  ...message,
                  sources: metadata.sources || message.sources || [],
                  projectCards: metadata.projectCards || message.projectCards || []
                }
              : message
          )));
        },
        onError: (message) => {
          setMessages((current) => current.map((chatMessage) => (
            chatMessage.id === assistantMessage.id
              ? { ...chatMessage, content: message, isError: true }
              : chatMessage
          )));
        }
      });
    } catch (streamError) {
      if (streamError.name !== 'AbortError') {
        const message = 'Unable to reach the portfolio assistant. Please try again later.';
        setMessages((current) => current.map((chatMessage) => (
          chatMessage.id === assistantMessage.id
            ? { ...chatMessage, content: message, isError: true }
            : chatMessage
        )));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError('');
    setIsStreaming(false);
  };

  const copyMessage = async (content) => {
    await navigator.clipboard.writeText(content);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-4 z-[70] flex h-[min(680px,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/40 sm:right-6"
            aria-label="Pratik portfolio assistant"
          >
            <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/25">
                  <Bot size={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">Pratik AI Assistant</h3>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">Portfolio, projects, skills, resume</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <RefreshCcw size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Close assistant"
                  title="Close assistant"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {visibleMessages.length === 0 && (
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Sparkles size={16} className="text-primary" />
                    <span>Ask about Pratik</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => submitMessage(suggestion)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {visibleMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : message.isError
                            ? 'border border-red-500/40 bg-red-950/30 text-red-200'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200'
                      }`}
                    >
                      {message.content ? <MarkdownMessage content={message.content} /> : <TypingIndicator />}
                      {message.role === 'assistant' && message.content && (
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => copyMessage(message.content)}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-slate-500 transition-colors hover:bg-slate-200 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                          >
                            <Copy size={12} />
                            Copy
                          </button>
                        </div>
                      )}
                      {message.role === 'assistant' && <ProjectCards cards={message.projectCards} />}
                      {message.role === 'assistant' && <SourceList sources={message.sources} />}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <div ref={scrollRef} />
            </div>

            <form
              className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
              onSubmit={(event) => {
                event.preventDefault();
                submitMessage();
              }}
            >
              <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-primary dark:border-slate-700 dark:bg-slate-900/70">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about Pratik..."
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                  title="Send message"
                >
                  {isStreaming ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-24 right-6 z-[69] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/30 transition-colors hover:bg-blue-600"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open Pratik AI Assistant"
        title="Pratik AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
};

export default PortfolioAssistant;
