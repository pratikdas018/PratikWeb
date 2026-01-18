import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

// --- Data Configuration ---

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const SKILLS = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "Express", "Python", "Go", "GraphQL"],
  Database: ["PostgreSQL", "MongoDB", "Redis", "Prisma"],
  Tools: ["Docker", "AWS", "Git", "CI/CD", "Figma"]
};

const PROJECTS = [
  {
    title: "TalkSy - Real-time Chat Application",
    description: "Designed and developed a full-stack real-time chat application featuring WebSocket-based communication, secure authentication with JWT and Google OAuth, multimedia messaging, scalable chat rooms, user presence indicators, and real-time typing status.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    link: "https://realtimetalk-frontend.onrender.com/",
    github: "https://github.com/pratikdas018/RealTimeTalk",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=2274&auto=format&fit=crop"
  },
  {
    title: "LMS – Learning Management System",
    description: "A full-stack Learning Management System that supports role-based access for students and admins, task assignment, progress tracking, and secure authentication.",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    link: "https://codelms-net.vercel.app/",
    github: "https://github.com/pratikdas018/LMS",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2274&auto=format&fit=crop"
  },
  {
    title: "Vingo Real-time Food-delivery-App",
    description: "A full-stack food delivery platform with real-time tracking, restaurant listings, and a responsive UI. Built with React.js, Node.js, Express, and MongoDB.",
    tech: ["React", "Express", "Node.js", "Socket.io", "JWT", "MongoDB"],
    link: "https://food-delivery-vingo-frontend.onrender.com/",
    github: "https://github.com/pratikdas018/Food-Delivery",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
  },
  {
    title: "TalkNex - AI Voice Assistant",
    description: "An AI-based voice assistant similar to Google Assistant that allows users to talk via voice commands, set a custom assistant name and image, and interact naturally.",
    tech: ["React", "Web Speech API", "JavaScript", "AI Logic"],
    link: "#",
    github: "https://github.com/pratikdas018/talkNex",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2340&auto=format&fit=crop"
  },
  {
    title: "Resume Shortlister (ATS Skill Match Analyzer)",
    description: "A resume analysis tool that compares user skills with job descriptions and calculates an exact match percentage, highlighting missing and matched skills.",
    tech: ["React", "JavaScript", "Text Analysis", "ATS Logic"],
    link: "#",
    github: "https://github.com/pratikdas018/resume-shortlister",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2340&auto=format&fit=crop"
  }
];

const OFFER_LETTER_DRIVE_URL = "https://drive.google.com/drive/folders/1vQ2rTmOmw692DxreyN2wRw-f-LR9QC0S";

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
            Dev<span className="text-primary">Portfolio</span>.
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
            <a href="https://www.linkedin.com/in/pratik-das-sonu-7201a328b/" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
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
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-4">
          <button className="text-slate-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
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
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
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
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
    <section id="about" className="py-12 bg-white dark:bg-dark transition-colors">
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
    Frontend: <Layout className="w-6 h-6 mb-2 text-primary" />,
    Backend: <Server className="w-6 h-6 mb-2 text-primary" />,
    Database: <Database className="w-6 h-6 mb-2 text-primary" />,
    Tools: <Code2 className="w-6 h-6 mb-2 text-primary" />
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
            Tech Stack
          </h2>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">Technologies I work with on a daily basis.</p>
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

const ProjectCard = ({ project, index }) => {
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

          <div className="flex gap-4 mt-auto">
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
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
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saiket Systems */}
            <motion.div 
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-md"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Web Development Intern</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Saiket Systems • Internship
              </p>

              <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
                <li>Worked on real-world web development projects using React and modern UI practices</li>
                <li>Built responsive and user-friendly interfaces following industry standards</li>
                <li>Collaborated with mentors and followed structured task-based development</li>
                <li>Improved debugging, code optimization, and deployment skills</li>
              </ul>
              <a
                href={OFFER_LETTER_DRIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-primary text-primary hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >
                View Details
              </a>
            </motion.div>

            {/* Dynamix Networks */}
            <motion.div
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-md"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Web Development Intern</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Dynamix Networks • Internship
              </p>

              <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
                <li>Developed full-stack features using MERN stack</li>
                <li>Worked on authentication, REST APIs, and database integration</li>
                <li>Implemented real-time and interactive components</li>
                <li>Maintained GitHub repositories and shared progress on LinkedIn</li>
              </ul>
              <a
                href={OFFER_LETTER_DRIVE_URL}
                target="_blank"
                rel="noreferrer"
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
    className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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
              <Skills />
              <Experience />
              <Projects />
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
