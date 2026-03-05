import React, { useState, useEffect, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Database,
  Layout,
  Server,
  Menu,
  X,
  ArrowUp,
  ChevronDown,
  Sun,
  Moon,
  Download,
  Eye,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

// --- Data Configuration ---

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

const SKILLS = {
  "Programming & Frontend": ["C", "JavaScript (ES6+)", "TypeScript (Basic)", "React.js", "HTML5", "CSS3"],
  "Backend & APIs": ["Node.js", "Express.js", "REST API", "Auth Workflows", "API Debugging"],
  "Databases": ["MongoDB", "SQL"],
  "Tools & Platforms": ["Git", "GitHub", "Postman", "VS Code", "Firebase", "Vercel", "Expo"]
};

const EDUCATION = [
  {
    degree: "B.Tech in CSE",
    institute: "Greater Kolkata College of Engineering and Management",
    score: "CGPA: 7.54/10",
    duration: "2022 - 2026"
  },
  {
    degree: "WBCHSE (Higher Secondary)",
    institute: "Shyamnagar Sri Ramkrishna Vidyamandir",
    score: "66.20/100",
    duration: "2019 - 2021"
  },
  {
    degree: "WBBSE (Secondary)",
    institute: "Shyamnagar Sri Ramkrishna Vidyamandir",
    score: "52.2/100",
    duration: "2018 - 2019"
  }
];

const PROJECTS = [
  {
    title: "CineCircle - Movie Gossip & Social Platform",
    description: "A social platform for movie enthusiasts to post reviews, comment on films, and stay updated with movie gossip. Features include real-time chat, friend management, and a social feed to track friends' activities.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
    link: "https://cine-circle-ten.vercel.app/",
    github: "https://github.com/pratikdas018/CineCircle",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    caseStudy: {
      challenge: "Movie communities needed one place for reviews, social updates, and instant discussion.",
      approach: "Developed a MERN social platform with live features powered by Socket.io.",
      impact: "Created a more engaging experience by combining feed interactions with real-time chat.",
      highlights: [
        "Real-time chat and activity updates",
        "Review posting and comment threads",
        "Responsive social feed experience"
      ]
    }
  },
  {
    title: "API Monitoring & Incident Response Platform",
    description: "A distributed API monitoring platform that continuously tracks service health, latency, and uptime for multiple endpoints with automated incident lifecycle handling.",
    tech: ["Next.js", "Node.js", "MongoDB", "Redis", "BullMQ", "Tailwind CSS", "Nodemailer"],
    link: "https://api-monitoritor.vercel.app",
    github: "https://github.com/pratikdas018/api_monitoritor",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    caseStudy: {
      challenge: "Teams needed proactive API health monitoring, fast incident response, and clear public visibility into service reliability.",
      approach: "Built a full-stack monitoring SaaS with Redis + BullMQ workers for asynchronous health checks, automated incident creation and resolution, and real-time dashboards.",
      impact: "Improved operational awareness with faster outage detection, instant email alerts, and transparent uptime reporting.",
      highlights: [
        "Distributed background monitoring workers using BullMQ and Redis queues",
        "Automated incident detection on endpoint failure and auto-resolution on recovery",
        "Instant email alerting pipeline using Nodemailer",
        "SaaS-style dashboard with real-time status, latency charts, and incident timelines",
        "Public status page with uptime percentage and incident history",
        "Uptime calculation and SLA compliance reporting",
        "Multi-endpoint health tracking without blocking main application requests"
      ]
    }
  },
  {
    title: "FoodieFly Real-time Food-delivery-App",
    description: "A full-stack food delivery platform with real-time tracking, restaurant listings, and a responsive UI. Built with React.js, Node.js, Express, and MongoDB.",
    tech: ["React", "Express", "Node.js", "Socket.io", "JWT", "MongoDB"],
    link: "https://pratik-foodie-fly.vercel.app/",
    github: "https://github.com/pratikdas018/FoodieFly",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
    caseStudy: {
      challenge: "Users needed reliable order updates and a simple mobile-first ordering journey.",
      approach: "Built a full-stack ordering flow with live status changes and secure authentication.",
      impact: "Improved order confidence and reduced friction from menu browsing to checkout.",
      highlights: [
        "Live order tracking updates",
        "JWT-based auth and protected flows",
        "Restaurant browsing with cart checkout"
      ]
    }
  },
  {
    title: "NeuroChat – AI Chatbot SaaS",
    description: "A full-stack AI-powered chatbot SaaS application that enables users to engage in real-time intelligent conversations with secure authentication, persistent chat history, and streaming AI responses.",
    tech: ["Next.js 14", "TypeScript", "Gemini API", "Firebase", "NextAuth", "Tailwind CSS"],
    link: "https://ai-chat-bot-neuro.vercel.app/",
    github: "https://github.com/pratikdas018/Ai-ChatBot",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2274&auto=format&fit=crop",
    caseStudy: {
      challenge: "Users needed an intelligent conversational system capable of handling real-time queries with secure access and persistent chat memory.",
      approach: "Developed a scalable AI chatbot using Next.js and Gemini API with streaming responses, multi-conversation support, and Firebase for real-time database management.",
      impact: "Enabled users to interact with an AI assistant in real-time with improved response speed and seamless conversation tracking.",
      highlights: [
        "Real-time streaming AI responses using Gemini API",
        "Multi-conversation chat support",
        "Secure user authentication with NextAuth",
        "Persistent chat history using Firebase",
        "Modern SaaS UI with Tailwind CSS"
      ]
    }
  },
  {
    title: "FoodBridge – Food Waste Donation Platform",
    description: "A full-stack AI-powered food donation platform that connects restaurants with NGOs to reduce food waste through real-time pickup scheduling, donation lifecycle tracking, and admin broadcast notifications.",
    tech: ["Next.js", "TypeScript", "Firebase", "Gemini API", "Tailwind CSS"],
    link: "https://foodbridge-liard.vercel.app/",
    github: "https://github.com/pratikdas018/foodbridge",
    image: "https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg",
    caseStudy: {
      challenge: "Restaurants frequently waste surplus food due to lack of real-time coordination with NGOs for timely pickup and distribution.",
      approach: "Built a role-based platform for Restaurants, NGOs, and Admins with real-time donation tracking, pickup scheduling, AI-powered email announcements, and professional receipt generation using Firebase and Gemini API.",
      impact: "Enabled seamless coordination between food donors and NGOs, improving donation efficiency and reducing food wastage through verified pickup workflows.",
      highlights: [
        "Role-based NGO, Restaurant and Admin dashboards",
        "Real-time donation claim and pickup scheduling system",
        "AI-generated broadcast emails using Gemini API",
        "Professional pickup receipt PDF generation",
        "Admin verification and notification system"
      ]
    }
  },
  {
    title: "LMS – Learning Management System",
    description: "A full-stack Learning Management System that supports role-based access for students and admins, task assignment, progress tracking, and secure authentication.",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    link: "https://codelms-net.vercel.app/",
    github: "https://github.com/pratikdas018/LMS",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2274&auto=format&fit=crop",
    caseStudy: {
      challenge: "Academic operations needed role-based access and trackable learning outcomes.",
      approach: "Built role-specific modules for tasks, progress, and secure learning workflows.",
      impact: "Improved teaching and monitoring efficiency with clear student progress data.",
      highlights: [
        "Role-based student and admin experiences",
        "Task assignment and progress tracking",
        "Secure authentication and API design"
      ]
    }
  },
  {
    title: "CollabTrack",
    description: "A comprehensive real-time collaboration platform designed for student teams to track contributions, manage tasks, and monitor project progress. Built with React, Node.js, and Socket.io to ensure seamless live updates and efficient teamwork.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
    link: "https://collab-track.vercel.app/",
    github: "https://github.com/pratikdas018/CollabTrack",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    caseStudy: {
      challenge: "Student teams lacked transparency around ownership, deadlines, and contribution quality.",
      approach: "Built collaboration dashboards with task tracking and real-time project state updates.",
      impact: "Helped teams coordinate faster with clearer accountability and progress visibility.",
      highlights: [
        "Real-time team activity sync",
        "Task and contribution tracking",
        "Collaboration-focused dashboard UX"
      ]
    }
  },
  {
    title: "TalkSy - Real-time Chat Application",
    description: "Designed and developed a full-stack real-time chat application featuring WebSocket-based communication, secure authentication with JWT and Google OAuth, multimedia messaging, scalable chat rooms, user presence indicators, and real-time typing status.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    link: "https://realtimetalk-frontend.onrender.com/",
    github: "https://github.com/pratikdas018/RealTimeTalk",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=2274&auto=format&fit=crop",
    caseStudy: {
      challenge: "Messaging needed low latency, room-based scaling, and secure multi-provider login.",
      approach: "Implemented Socket.io chat architecture with JWT and Google OAuth authentication.",
      impact: "Delivered responsive communication with reliable identity and presence signals.",
      highlights: [
        "Typing status and online presence",
        "Room-based scalable chat model",
        "Secure auth via JWT and OAuth"
      ]
    }
  },
  {
    title: "Resume Shortlister (ATS Skill Match Analyzer)",
    description: "A resume analysis tool that compares user skills with job descriptions and calculates an exact match percentage, highlighting missing and matched skills.",
    tech: ["React", "JavaScript", "Text Analysis", "ATS Logic"],
    link: "https://pratik-resume-shortlister.vercel.app",
    github: "https://github.com/pratikdas018/resume-shortlister",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2340&auto=format&fit=crop",
    caseStudy: {
      challenge: "Applicants needed fast feedback on resume fit against job descriptions.",
      approach: "Built a text-analysis tool that calculates match score and skills gap.",
      impact: "Provided actionable recommendations for stronger application readiness.",
      highlights: [
        "Exact match scoring between resume and JD",
        "Missing and matched skill breakdown",
        "Simple UI for quick resume evaluation"
      ]
    }
  },
  {
    title: "TalkNex - AI Voice Assistant",
    description: "An AI-based voice assistant similar to Google Assistant that allows users to talk via voice commands, set a custom assistant name and image, and interact naturally.",
    tech: ["React", "Web Speech API", "JavaScript", "AI Logic"],
    link: "#",
    github: "https://github.com/pratikdas018/talkNex",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2340&auto=format&fit=crop",
    caseStudy: {
      challenge: "Users wanted a browser-based assistant with natural voice-driven interaction.",
      approach: "Integrated speech recognition with configurable assistant settings and commands.",
      impact: "Enabled hands-free interaction in a lightweight, front-end focused application.",
      highlights: [
        "Voice command processing via Web Speech API",
        "Custom assistant profile configuration",
        "Extensible command interpretation logic"
      ]
    }
  }
];

const INTERNSHIP_DETAILS_URL = "https://drive.google.com/drive/folders/1vQ2rTmOmw692DxreyN2wRw-f-LR9QC0S";

const EMAILJS_SERVICE_ID = "service_df3o81k";
const EMAILJS_VISITOR_TEMPLATE_ID = "template_visitor_alert";
const EMAILJS_CONTACT_TEMPLATE_ID = "template_3cl97i5";
const EMAILJS_PUBLIC_KEY = "EIAbfqJCZvoUsPzeX";

// --- Animation Variants ---

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// --- Components ---

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-dark/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
        {/* Top Left: Resume & View Project Buttons */}
        <div className="flex items-center gap-4">
          <a href="/pratik's Resume.pdf" download className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm">
            <Download size={16} />
            <span>Resume</span>
          </a>
          <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium hover:bg-slate-700 dark:hover:bg-slate-200 transition-all text-sm shadow-lg shadow-slate-900/20 dark:shadow-white/20">
            <Eye size={16} />
            <span>View Projects</span>
          </a>
          {/* Mobile Logo Fallback */}
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="md:hidden text-xl font-bold text-slate-900 dark:text-white tracking-tighter">
            Pratik<span className="text-primary">Portfolio</span>.
          </a>
        </div>

        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-colors ${activeSection === link.href.substring(1) ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Top Right: Github, Linkedin, Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-4 mr-1">
            <a href="https://github.com/pratikdas018" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/pratik018" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="pratikdassonu@gmail.com" onClick={(e) => handleNavClick(e, '#contact')} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <Mail size={20} />
            </a>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-slate-900 dark:text-white hover:text-primary transition-colors p-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col p-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-lg font-medium ${activeSection === link.href.substring(1) ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-4 pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
              <a href="/pratik's Resume.pdf" download onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm">
                <Download size={16} />
                <span>Resume</span>
              </a>
              <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium hover:bg-slate-700 dark:hover:bg-slate-200 transition-all text-sm shadow-lg shadow-slate-900/20 dark:shadow-white/20">
                <Eye size={16} />
                <span>View Projects</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`; // Indigo-500
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth / 15);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30" />;
};

const CursorFollower = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 280, damping: 28 });
  const ringY = useSpring(dotY, { stiffness: 280, damping: 28 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    setEnabled(finePointer);
    if (!finePointer) return;

    const handleMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setVisible(true);
    };
    const handleEnter = () => setVisible(true);
    const handleLeave = () => setVisible(false);
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseenter', handleEnter);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseenter', handleEnter);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[60] h-2.5 w-2.5 rounded-full bg-primary pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[59] h-9 w-9 rounded-full border border-primary/70 pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%', opacity: visible ? 0.35 : 0 }}
        animate={{ scale: pressed ? 0.82 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

const Typewriter = ({ text, speed = 100, delay = 0, onComplete }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return (
    <span className="inline-flex items-center">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block ml-1 w-0.5 h-4 bg-primary"
      />
    </span>
  );
};

const Hero = () => {
  const [showScrollDown, setShowScrollDown] = useState(false);

  const line1 = "Building Robust Web Systems".split(" ");
  const line2 = "scalable solutions that matter.".split(" ");

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-dark to-dark -z-10" />
      <ParticleBackground />

      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          {/* Picture with Badge */}
          <motion.div variants={fadeInUp} className="relative mb-8">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative z-10">
              {/* Place your image in the public folder as 'profile.jpg' */}
              <img src="/profile.jpg" alt="Pratik Das" className="w-full h-full object-cover bg-slate-100" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-xl z-20">
              <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs md:text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
                Full Stack • Problem Solver
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-primary font-semibold mb-4 tracking-wide uppercase text-sm h-6 flex items-center">
            <Typewriter text="Hi, I'm Pratik Das" speed={100} delay={500} onComplete={() => setShowScrollDown(true)} />
          </motion.div>
          <motion.h1
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.2,
                  staggerChildren: 0.1
                }
              }
            }}
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors leading-tight"
          >
            {line1.map((word, i) => (
              <motion.span key={i} variants={fadeInUp} className={`inline-block ${i === line1.length - 1 ? '' : 'mr-4'}`}>{word}</motion.span>
            ))}
            <br />
            <span className="text-slate-500 dark:text-slate-400">
              {line2.map((word, i) => (
                <motion.span key={i} variants={fadeInUp} className={`inline-block ${i === line2.length - 1 ? '' : 'mr-4'}`}>{word}</motion.span>
              ))}
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-colors">
            I'm a Full-stack Developer specializing in the MERN stack. Currently focused on building scalable, high-performance web applications using MongoDB, Express, React, and Node.js.
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {showScrollDown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 flex flex-col items-center gap-2"
            >
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ChevronDown className="text-primary" size={24} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-10 bg-white dark:bg-dark transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-slate-800 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop"
                alt="Coding Setup"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 transition-colors">
              About Me
              <span className="w-20 h-1 bg-primary rounded-full"></span>
            </h2>
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
              <p>
                I am a <span className="font-semibold text-slate-900 dark:text-white">Full Stack Developer</span> and <span className="font-semibold text-slate-900 dark:text-white">Computer Science Engineer</span> committed to building high-performance web applications. With a strong foundation in the MERN stack, I transform complex requirements into scalable, user-centric digital solutions.
              </p>
              <p>
                My development philosophy centers on writing clean, maintainable code and optimizing system performance. Whether architecting secure backend APIs or crafting pixel-perfect user interfaces, I am driven by a passion for continuous learning and engineering excellence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-primary shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white">Engineering Excellence</h4>
                <p className="text-sm text-slate-500">Scalable & efficient solutions</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-slate-500 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white">Full Stack Expertise</h4>
                <p className="text-sm text-slate-500">Seamless end-to-end execution</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Skills = () => {
  const iconMap = {
    "Programming & Frontend": <Layout className="w-6 h-6 mb-2 text-primary" />,
    "Backend & APIs": <Server className="w-6 h-6 mb-2 text-primary" />,
    "Databases": <Database className="w-6 h-6 mb-2 text-primary" />,
    "Tools & Platforms": <Code2 className="w-6 h-6 mb-2 text-primary" />
  };

  return (
    <section id="skills" className="py-12 bg-slate-50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
            Skills
          </h2>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">Programming, frontend, backend, database, and tooling skills I use across projects.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(SKILLS).map(([category, items], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors shadow-sm dark:shadow-none"
            >
              {iconMap[category]}
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 transition-colors">{category}</h3>
              <ul className="space-y-2">
                {items.map((skill) => (
                  <li key={skill} className="flex items-center text-slate-600 dark:text-slate-400 text-sm transition-colors">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCaseStudyModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const caseStudy = project.caseStudy || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm p-4 md:p-8 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">Case Study</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
            aria-label="Close case study"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Challenge</h4>
            <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">{caseStudy.challenge || project.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Approach</h4>
            <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">{caseStudy.approach || project.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Impact</h4>
            <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">{caseStudy.impact || "Production-ready implementation focused on reliability and user experience."}</p>
          </div>

          {Array.isArray(caseStudy.highlights) && caseStudy.highlights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Highlights</h4>
              <ul className="mt-2 space-y-2">
                {caseStudy.highlights.map((highlight) => (
                  <li key={highlight} className="text-slate-700 dark:text-slate-300 text-sm flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 shrink-0"></span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tech Stack</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((item) => (
                <span key={item} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              <Github size={18} />
              View Code
            </a>
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <ExternalLink size={18} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectCard = ({ project, index, onOpenCaseStudy }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors shadow-sm dark:shadow-none flex flex-col h-full"
      >
        <div style={{ transform: "translateZ(50px)" }} className="h-48 overflow-hidden relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {project.link && project.link !== '#' && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full font-medium hover:bg-primary hover:text-white shadow-lg">
                <ExternalLink size={18} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <div style={{ transform: "translateZ(20px)" }} className="p-6 flex flex-col flex-grow bg-slate-50 dark:bg-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{project.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed transition-colors flex-grow">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((t) => (
              <span key={t} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-3 mt-auto">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium ${project.link && project.link !== '#' ? 'flex-1' : 'w-full'}`}
            >
              <Github size={18} />
              Code
            </a>
            {project.link && project.link !== '#' && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors text-sm font-medium">
                <ExternalLink size={18} />
                Live Demo
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenCaseStudy(project)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors text-sm font-medium"
          >
            <Eye size={18} />
            Case Study
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const techFilters = useMemo(() => {
    return ['All', ...new Set(PROJECTS.flatMap((project) => project.tech))];
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchesTech = selectedTech === 'All' || project.tech.includes(selectedTech);
      if (!normalizedQuery) {
        return matchesTech;
      }

      const searchableText = `${project.title} ${project.description} ${project.tech.join(' ')}`.toLowerCase();
      return matchesTech && searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery, selectedTech]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTech('All');
  };

  return (
    <section id="projects" className="py-12 bg-white dark:bg-dark transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
            Featured Projects
          </h2>
        </motion.div>

        <div className="mb-10">
          <div className="relative max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project title, stack, or keyword..."
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {techFilters.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => setSelectedTech(tech)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedTech === tech ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary'}`}
              >
                {tech}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredProjects.length} of {PROJECTS.length} projects
            </p>
            {(searchQuery || selectedTech !== 'All') && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                onOpenCaseStudy={setSelectedProject}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">No projects found</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Try a different keyword or reset the current filter.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectCaseStudyModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-12 bg-slate-50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-slate-900 dark:text-white mb-12 flex items-center gap-2 transition-colors"
        >
          Work Experience
        </motion.h2>

        <div className="grid grid-cols-1 gap-6">
          <motion.div
            className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-md"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Full-Stack Web Developer Intern</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">AIKING SOLUTIONS</p>
            <p className="mt-2 text-sm font-medium text-primary">Mar 2025 - Present</p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Worked on production-oriented full-stack modules, collaborated with mentors on clean architecture decisions, and delivered performance-focused features across frontend and backend workflows.
            </p>
            <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
              <li>Built and shipped reusable React UI components with responsive behavior.</li>
              <li>Integrated secure APIs and database flows for real-world application use cases.</li>
              <li>Improved debugging, optimization, and deployment reliability during development cycles.</li>
            </ul>
            <a
              href={INTERNSHIP_DETAILS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-primary text-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              View Details
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
const Education = () => {
  return (
    <section id="education" className="py-12 bg-white dark:bg-dark transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-slate-900 dark:text-white mb-12 transition-colors"
        >
          Education
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATION.map((item, index) => (
            <motion.div
              key={item.degree}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-md"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.degree}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.institute}</p>
              <p className="mt-3 text-sm text-primary font-medium">{item.score}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.duration}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ showToast }) => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const email = formData.get('user_email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);

    emailjs
      .sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONTACT_TEMPLATE_ID,
        form.current,
        EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          showToast('Message sent successfully!', 'success');

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Play notification sound
          try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
          } catch (e) {
            console.log('Audio error', e);
          }

          form.current.reset();
        },
        () => {
          showToast('Failed to send message. Please try again.', 'error');
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section id="contact" className="py-12 bg-white dark:bg-dark transition-colors">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Get In Touch</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto mb-12 transition-colors">
            I’m open to internships, freelance projects and collaboration. Drop a message and I’ll respond promptly.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left transition-colors shadow-sm dark:shadow-none">
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 transition-colors">Name</label>
                <input required name="user_name" type="text" className="w-full bg-white dark:bg-dark border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 transition-colors">Email</label>
                <input required name="user_email" type="email" className="w-full bg-white dark:bg-dark border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 transition-colors">Message</label>
                <textarea required name="message" rows="4" className="w-full bg-white dark:bg-dark border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors"></textarea>
              </div>
              <button disabled={isSubmitting} className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Sending...</span>
                  </>
                ) : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="mt-16 flex justify-center gap-8">
            <a href="https://github.com/pratikdas018" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"><Github size={24} /></a>
            <a href="https://www.linkedin.com/in/pratik018" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"><Linkedin size={24} /></a>
            <a href="mailto:pratikdassonu@gmail.com" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"><Mail size={24} /></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: 20, x: '-50%' }}
    className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
  >
    {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100"><X size={18} /></button>
  </motion.div>
);

const Footer = () => (
  <footer className="py-8 bg-white dark:bg-dark text-center text-slate-500 dark:text-slate-600 text-sm transition-colors">
    <p>Designed & Built by Pratik Das</p>
  </footer>
);

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    const trackVisitor = async () => {
      if (sessionStorage.getItem('visitor_alert_sent')) return;

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to fetch IP data');

        const data = await response.json();

        const visitorInfo = {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          isp: data.org,
          browser: navigator.userAgent,
          platform: navigator.platform,
          screen: `${window.screen.width}x${window.screen.height}`,
          referrer: document.referrer || 'Direct',
          timestamp: new Date().toLocaleString()
        };

        const formattedMessage = `
          🚀 New Visitor Alert!
          
          📍 Location: ${visitorInfo.city}, ${visitorInfo.region}, ${visitorInfo.country}
          🌐 IP: ${visitorInfo.ip}
          🏢 ISP: ${visitorInfo.isp}
          
          💻 Device:
          OS: ${visitorInfo.platform}
          Screen: ${visitorInfo.screen}
          Browser: ${visitorInfo.browser}
          
          🕒 Time: ${visitorInfo.timestamp}
          🔗 Referrer: ${visitorInfo.referrer}
        `;

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_VISITOR_TEMPLATE_ID, {
          message: formattedMessage,
          subject: `New Visitor from ${visitorInfo.city}, ${visitorInfo.country}`,
          ...visitorInfo
        }, EMAILJS_PUBLIC_KEY);

        sessionStorage.setItem('visitor_alert_sent', 'true');
      } catch (error) {
        console.error('Visitor tracking error:', error);
      }
    };

    trackVisitor();
  }, []);

  // SEO: Inject Structured Data (JSON-LD)
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Pratik Das",
      "alternateName": "Pratik Das Sonu",
      "url": window.location.origin,
      "jobTitle": "Full Stack Developer",
      "description": "Full Stack Developer specializing in MERN stack and Computer Science Engineering.",
      "sameAs": [
        "https://github.com/pratikdas018",
        "https://www.linkedin.com/in/pratik018"
      ]
    });
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-dark min-h-screen transition-colors duration-300">
      <CursorFollower />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-dark"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 dark:text-slate-400 font-medium text-sm tracking-widest uppercase"
              >
                Loading
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main>
              <Hero />
              <About />
              <Experience />
              <Skills />
              <Projects />
              <Education />
              <Contact showToast={showToast} />
            </main>
            <Footer />

            <AnimatePresence>
              {toast.show && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
              )}
            </AnimatePresence>

            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp size={24} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

