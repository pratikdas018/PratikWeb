import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import {
  Bot,
  Copy,
  ExternalLink,
  Github,
  Loader2,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Minimize2,
  Mic,
  RefreshCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import {
  fetchSuggestions,
  streamPortfolioChat,
  transcribePortfolioVoice
} from '../services/portfolioAssistantApi';

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

const stars = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 23) % 86)}%`,
  top: `${8 + ((index * 31) % 84)}%`,
  delay: `${(index % 7) * 0.3}s`
}));

const createMessage = (role, content, extras = {}) => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
  ...extras
});

const getSupportedMimeType = () => {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/wav'];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
};

const getSpeechRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition || null;

const getOfflinePortfolioAnswer = (question) => {
  const text = question.toLowerCase();

  if (text.includes('snapscroll')) {
    return [
      'SnapScroll is a Windows desktop app by Pratik for capturing seamless long scrolling screenshots.',
      '',
      '- Built with .NET 8, C#, WPF, MVVM, Win32 API, GDI+, and XAML.',
      '- It targets websites, documents, PDFs, chat apps, code editors, and other scrollable content.',
      '- GitHub: https://github.com/pratikdas018/Screenshot_app'
    ].join('\n');
  }

  if (text.includes('project')) {
    return [
      'Pratik has worked on projects including SnapScroll, CodeSight, CineCircle, FoodBridge, and an API Monitoring Platform.',
      '',
      'The portfolio knowledge backend is currently offline, so this is a local fallback answer. Start the assistant backend for full source-backed responses.'
    ].join('\n');
  }

  if (text.includes('skill')) {
    return 'Pratik works across frontend, backend, databases, and tooling, including React, Next.js, Node.js, Express.js, TypeScript, MongoDB, SQL, Git, GitHub, Postman, and VS Code.';
  }

  if (text.includes('experience')) {
    return 'Pratik has experience building production-ready Next.js pages, SEO-friendly UI, performance-focused interfaces, and job-automation tooling for detecting, validating, and auto-filling application fields.';
  }

  if (text.includes('resume')) {
    return 'You can find Pratik\'s resume details in the portfolio resume section. The live assistant backend is offline right now, so I cannot fetch the full resume context from the knowledge API.';
  }

  if (text.includes('contact') || text.includes('email')) {
    return 'You can contact Pratik at developedwithpratik@gmail.com, LinkedIn: https://www.linkedin.com/in/pratik018, GitHub: https://github.com/pratikdas018';
  }

  return [
    'I can help with Pratik\'s portfolio, projects, skills, experience, education, resume, and contact details.',
    '',
    'The assistant backend is not reachable right now, so this is a local fallback response. Restart the dev server with `npm run dev` from the portfolio folder to enable full AI responses.'
  ].join('\n');
};

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
          className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300"
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
        <div key={project.name} className="rounded-lg border border-slate-700 bg-slate-950/80 p-3 text-left">
          <h4 className="text-sm font-semibold text-white">{project.name}</h4>
          {project.description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{project.description}</p>
          )}
          {project.techStack?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 6).map((tech) => (
                <span key={tech} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300">
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
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
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
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500"
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
        <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline underline-offset-2" />
      ),
      p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0" />,
      ul: ({ ...props }) => <ul {...props} className="mb-2 list-disc space-y-1 pl-4" />,
      ol: ({ ...props }) => <ol {...props} className="mb-2 list-decimal space-y-1 pl-4" />,
      code: ({ ...props }) => <code {...props} className="rounded bg-slate-800 px-1 py-0.5 text-[11px]" />
    }}
  >
    {content}
  </ReactMarkdown>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-2 text-xs text-slate-400">
    <Loader2 className="animate-spin text-blue-400" size={14} />
    <span>Pratik's assistant is typing</span>
  </div>
);

const RobotStage = ({ isRecording, isTranscribing, isStreaming }) => (
  <div className="relative flex min-h-[278px] items-center justify-center overflow-hidden border-b border-white/30 bg-[#151514]">
    {stars.map((star) => (
      <span
        key={star.id}
        className="absolute h-1 w-1 animate-pulse rounded-full bg-blue-300/70"
        style={{ left: star.left, top: star.top, animationDelay: star.delay }}
      />
    ))}

    <motion.div
      className="relative h-[180px] w-[180px]"
      animate={{ y: isRecording ? [-4, 4, -4] : [0, -8, 0] }}
      transition={{ duration: isRecording ? 0.8 : 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute left-1/2 top-0 h-16 w-4 -translate-x-1/2 rounded-full bg-blue-600 shadow-[0_0_18px_rgba(59,130,246,0.7)]" />
      <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.8)]" />
      <div className="absolute left-2 top-[84px] h-14 w-6 rounded-full bg-blue-700" />
      <div className="absolute right-2 top-[84px] h-14 w-6 rounded-full bg-blue-700" />
      <div className="absolute bottom-0 left-1/2 h-[142px] w-[142px] -translate-x-1/2 rounded-[32px] bg-gradient-to-b from-blue-600 to-blue-900 shadow-[0_22px_45px_rgba(0,0,0,0.55)]">
        <div className="absolute left-5 top-8 h-[72px] w-[102px] rounded-2xl border border-blue-950 bg-slate-950 shadow-inner">
          <div className="absolute left-5 top-5 h-9 w-9 rounded-full bg-slate-300 shadow-inner">
            <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-black" />
            <div className="absolute left-2 top-1 h-2 w-2 rounded-full bg-white" />
          </div>
          <div className="absolute right-5 top-5 h-9 w-9 rounded-full bg-slate-300 shadow-inner">
            <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-black" />
            <div className="absolute left-2 top-1 h-2 w-2 rounded-full bg-white" />
          </div>
          <div className="absolute bottom-5 left-1/2 h-1.5 w-5 -translate-x-1/2 rounded-full bg-slate-400" />
        </div>
      </div>
      {(isRecording || isTranscribing || isStreaming) && (
        <span className="absolute bottom-2 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border border-red-400/40 animate-ping" />
      )}
    </motion.div>
  </div>
);

const PortfolioAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState('voice');
  const dragControls = useDragControls();
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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Ready');
  const [lastTranscript, setLastTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);
  const voiceAbortRef = useRef(null);
  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionTranscriptRef = useRef('');
  const recognitionHadErrorRef = useRef(false);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const visibleMessages = useMemo(() => messages.slice(-20), [messages]);

  const speak = useCallback((text) => {
    if (!voiceEnabled || !text.trim() || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const stopMediaTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

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
  }, [messages, isStreaming, activeMode]);

  useEffect(() => () => {
    abortRef.current?.abort();
    voiceAbortRef.current?.abort();
    recognitionRef.current?.abort();
    recorderRef.current?.state === 'recording' && recorderRef.current.stop();
    stopMediaTracks();
    window.speechSynthesis?.cancel();
  }, [stopMediaTracks]);

  const submitMessage = async (value = input, options = {}) => {
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
    let assistantText = '';

    setError('');
    setInput('');
    setVoiceStatus(options.fromVoice ? 'Thinking...' : voiceStatus);
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    try {
      await streamPortfolioChat({
        message: text,
        history,
        signal: abortRef.current.signal,
        onDelta: (delta) => {
          assistantText += delta;
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
          assistantText = '';
          setMessages((current) => current.map((chatMessage) => (
            chatMessage.id === assistantMessage.id
              ? { ...chatMessage, content: message, isError: true }
              : chatMessage
          )));
        }
      });

      if (options.speakResponse) {
        speak(assistantText);
      }
      setVoiceStatus(options.fromVoice ? 'Ready' : voiceStatus);
    } catch (streamError) {
      if (streamError.name !== 'AbortError') {
        const message = getOfflinePortfolioAnswer(text);
        setMessages((current) => current.map((chatMessage) => (
          chatMessage.id === assistantMessage.id
            ? { ...chatMessage, content: message, isOffline: true }
            : chatMessage
        )));
        if (options.speakResponse) {
          speak(message);
        }
        setVoiceStatus(options.fromVoice ? 'Ready' : voiceStatus);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const finishRecording = async () => {
    const mimeType = recorderRef.current?.mimeType || 'audio/webm';
    const audioBlob = new Blob(chunksRef.current, { type: mimeType });
    chunksRef.current = [];
    stopMediaTracks();

    if (!audioBlob.size) {
      setVoiceStatus('No speech detected');
      return;
    }

    setIsTranscribing(true);
    setVoiceStatus('Listening...');
    voiceAbortRef.current = new AbortController();

    try {
      const transcript = await transcribePortfolioVoice({
        audioBlob,
        signal: voiceAbortRef.current.signal
      });
      setLastTranscript(transcript);
      setVoiceStatus('Thinking...');
      await submitMessage(transcript, { fromVoice: true, speakResponse: voiceEnabled });
    } catch (voiceError) {
      if (voiceError.name !== 'AbortError') {
        setError(voiceError.message);
        setVoiceStatus('Try again');
      }
    } finally {
      setIsTranscribing(false);
      voiceAbortRef.current = null;
    }
  };

  const startBrowserSpeechRecognition = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      return false;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognitionTranscriptRef.current = '';
    recognitionHadErrorRef.current = false;

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let index = 0; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript || '';

        if (event.results[index].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const transcript = (finalTranscript || interimTranscript).trim();
      recognitionTranscriptRef.current = transcript;
      setLastTranscript(transcript);
    };

    recognition.onerror = (event) => {
      recognitionHadErrorRef.current = true;
      recognitionRef.current = null;
      setIsRecording(false);
      setError(event.error === 'not-allowed'
        ? 'Microphone permission is required for voice chat.'
        : 'Voice recognition failed. Please try again.');
      setVoiceStatus(event.error === 'not-allowed' ? 'Mic blocked' : 'Try again');
    };

    recognition.onend = async () => {
      if (recognitionHadErrorRef.current) {
        recognitionHadErrorRef.current = false;
        return;
      }

      const transcript = recognitionTranscriptRef.current.trim();
      recognitionRef.current = null;
      setIsRecording(false);

      if (!transcript) {
        setVoiceStatus('No speech detected');
        return;
      }

      setVoiceStatus('Thinking...');
      await submitMessage(transcript, { fromVoice: true, speakResponse: voiceEnabled });
    };

    try {
      setError('');
      recognition.start();
      setIsRecording(true);
      setVoiceStatus('Listening...');
      return true;
    } catch {
      recognitionRef.current = null;
      return false;
    }
  };

  const startRecording = async () => {
    if (startBrowserSpeechRecognition()) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Voice recording is not supported in this browser.');
      setVoiceStatus('Unsupported');
      return;
    }

    try {
      setError('');
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = finishRecording;
      recorder.start();
      setIsRecording(true);
      setVoiceStatus('Listening...');
    } catch {
      stopMediaTracks();
      setError('Microphone permission is required for voice chat.');
      setVoiceStatus('Mic blocked');
    }
  };

  const toggleRecording = () => {
    if (isStreaming || isTranscribing) {
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      setVoiceStatus('Processing...');
      recognitionRef.current?.stop();
      recorderRef.current?.stop();
      return;
    }

    startRecording();
  };

  const clearChat = () => {
    abortRef.current?.abort();
    voiceAbortRef.current?.abort();
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setMessages([]);
    setError('');
    setLastTranscript('');
    setVoiceStatus('Ready');
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

  const busy = isRecording || isTranscribing || isStreaming;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            className={`fixed right-3 z-[70] flex w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border-2 border-white/90 bg-[#121211] text-slate-100 shadow-2xl shadow-black/45 sm:right-6 ${
              isExpanded
                ? 'bottom-4 h-[calc(100vh-2rem)] max-w-[760px]'
                : 'bottom-24 h-[min(512px,calc(100vh-7rem))] max-w-[400px]'
            }`}
            aria-label="Pratik portfolio assistant"
          >
            <header
              className="flex h-[66px] cursor-move touch-none items-center justify-between border-b border-white/30 bg-[#202123] px-4"
              onPointerDown={(event) => dragControls.start(event)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-red-500/70 bg-slate-900">
                  <img src="/logo.jpg" alt="" className="h-full w-full object-cover opacity-80" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#202123] bg-emerald-400" />
                </span>
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-white">Pratik's Assistant</h3>
                    <span className="shrink-0 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-400">
                      In Development
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setIsExpanded((current) => !current)}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                  aria-label={isExpanded ? 'Collapse assistant' : 'Expand assistant'}
                  title={isExpanded ? 'Collapse assistant' : 'Expand assistant'}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                  aria-label="Close assistant"
                  title="Close assistant"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="grid h-[42px] grid-cols-2 border-b border-white/30 bg-[#1a1a19]">
              <button
                type="button"
                onClick={() => setActiveMode('voice')}
                className={`inline-flex items-center justify-center gap-2 border-b-2 text-sm font-semibold transition-colors ${
                  activeMode === 'voice'
                    ? 'border-red-500 bg-red-500/5 text-red-500'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Mic size={16} />
                Voice
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('text')}
                className={`inline-flex items-center justify-center gap-2 border-b-2 text-sm font-semibold transition-colors ${
                  activeMode === 'text'
                    ? 'border-blue-500 bg-blue-500/5 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare size={16} />
                Text
              </button>
            </div>

            {activeMode === 'voice' ? (
              <>
                <RobotStage isRecording={isRecording} isTranscribing={isTranscribing} isStreaming={isStreaming} />
                <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[#151514] px-5 pb-4 pt-3">
                  <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="text-right text-sm text-slate-500">{voiceStatus}</div>
                    <button
                      type="button"
                      onClick={toggleRecording}
                      disabled={isTranscribing || isStreaming}
                      className={`flex h-[70px] w-[70px] items-center justify-center rounded-full border-[3px] border-white text-white shadow-xl transition-all ${
                        isRecording
                          ? 'bg-red-600 shadow-red-500/35'
                          : 'bg-red-500 shadow-red-500/25 hover:bg-red-600'
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                      aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
                      title={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                      {isTranscribing || isStreaming ? <Loader2 className="animate-spin" size={22} /> : <Mic size={22} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.speechSynthesis?.cancel();
                        setVoiceEnabled((current) => !current);
                      }}
                      className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                        voiceEnabled ? 'text-red-500' : 'text-slate-500'
                      }`}
                      aria-label="Toggle voice replies"
                      title="Toggle voice replies"
                    >
                      {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      {voiceEnabled ? 'Voice On' : 'Voice Off'}
                    </button>
                  </div>
                  <p className="h-5 max-w-full truncate text-xs text-slate-500">
                    {lastTranscript || 'Tap the microphone to start talking'}
                  </p>
                  {error && <p className="max-w-full truncate text-xs text-red-400">{error}</p>}
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {visibleMessages.length === 0 && (
                    <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                        <Sparkles size={16} className="text-blue-400" />
                        <span>Ask about Pratik</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => submitMessage(suggestion)}
                            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-blue-400 hover:text-blue-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {visibleMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : message.isError
                                ? 'border border-red-500/40 bg-red-950/30 text-red-200'
                                : 'border border-slate-800 bg-slate-900/90 text-slate-200'
                          }`}
                        >
                          {message.content ? <MarkdownMessage content={message.content} /> : <TypingIndicator />}
                          {message.role === 'assistant' && message.content && (
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => copyMessage(message.content)}
                                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-slate-400 transition-colors hover:bg-slate-800 hover:text-blue-300"
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
                    <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs text-red-300">
                      {error}
                    </p>
                  )}

                  <div ref={scrollRef} />
                </div>

                <form
                  className="border-t border-white/20 bg-[#111827] p-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitMessage();
                  }}
                >
                  <div className="flex items-end gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2 focus-within:border-blue-400">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder="Ask about Pratik..."
                      className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isStreaming}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Send message"
                      title="Send message"
                    >
                      {isStreaming ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                  </div>
                </form>
              </>
            )}

            <button
              type="button"
              onClick={clearChat}
              className="absolute right-[54px] top-[17px] rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <RefreshCcw size={16} />
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-24 right-6 z-[69] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/30 transition-colors hover:bg-blue-500"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open Pratik AI Assistant"
        title="Pratik AI Assistant"
      >
        {isOpen ? <X size={24} /> : busy ? <Bot size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
};

export default PortfolioAssistant;
