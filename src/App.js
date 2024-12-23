import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { FaGithub, FaDiscord, FaExternalLinkAlt } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import contents from './contents.json';

const { theme, skills, projects, ...portfolioContent } = contents;

const SkillsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  const extendedSkills = [...skills, ...skills, ...skills];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % skills.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: -currentIndex * (128 + 32),
        transition: {
          duration: 0.5,
          ease: "easeInOut"
        }
      });
    }
  }, [controls, isInView, currentIndex]);

  return (
    <div ref={ref} className="py-12">
      <motion.h2
        className="text-3xl font-bold text-center mb-12"
        style={{ 
          color: theme.text,
          textShadow: theme.glow
        }}
      >
        Skills
      </motion.h2>
      <div className="relative overflow-hidden mx-auto max-w-3xl">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a1f] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a1f] to-transparent z-10" />
        <div className="overflow-hidden">
          <motion.div
            className="flex space-x-8"
            animate={controls}
            style={{ x: 0 }}
          >
            {extendedSkills.map((skill, index) => {
              const Icon = FaIcons[skill.icon] || SiIcons[skill.icon];
              return (
                <motion.div
                  key={`${skill.name}-${index}`}
                  className="flex flex-col items-center justify-center w-32 h-32 rounded-lg p-4 flex-shrink-0"
                  style={{
                    backgroundColor: theme.card,
                    boxShadow: theme.cardGlow,
                  }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: theme.glow,
                  }}
                >
                  <Icon 
                    className="w-12 h-12 mb-2" 
                    style={{ 
                      color: theme.highlight,
                      filter: `drop-shadow(0 0 8px ${theme.highlight})`
                    }} 
                  />
                  <span 
                    className="text-center"
                    style={{ 
                      color: theme.text,
                      textShadow: theme.glow
                    }}
                  >
                    {skill.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full h-64 perspective-1000">
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="absolute w-full h-full rounded-lg p-6"
          style={{
            backgroundColor: theme.card,
            boxShadow: theme.cardGlow,
            backfaceVisibility: "hidden",
          }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
            {project.name}
          </h3>
          <p className="mb-2" style={{ color: theme.subtext }}>
            {project.description}
          </p>
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: theme.bg,
                  color: theme.highlight,
                  boxShadow: theme.glow
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="absolute w-full h-full rounded-lg p-6"
          style={{
            backgroundColor: theme.card,
            boxShadow: theme.cardGlow,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
            {project.name}
          </h3>
          <p className="mb-4" style={{ color: theme.subtext }}>
            {project.details}
          </p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-6 p-2 rounded-full transition-transform hover:scale-110"
            style={{ color: theme.highlight }}
            onClick={(e) => e.stopPropagation()}
          >
            <FaExternalLinkAlt className="w-6 h-6" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: theme.highlight,
            boxShadow: theme.glow,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default function Component() {
  const [active, setActive] = useState('home');
  const sections = useMemo(() => ['home', 'about', 'skills', 'projects', 'contact'], []);
  const sectionRefs = useRef(sections.map(() => React.createRef()));

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.pageYOffset;
      let newActive = sections[0];

      sectionRefs.current.forEach((ref, index) => {
        const element = ref.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (pageYOffset >= offsetTop - 100 && pageYOffset < offsetTop + offsetHeight - 100) {
            newActive = sections[index];
          }
        }
      });

      setActive(newActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    setActive('home');

    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;

    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: ${theme.scrollTrack};
      }
      ::-webkit-scrollbar-thumb {
        background: ${theme.scrollThumb};
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.scrollThumbHover};
      }
      * {
        scrollbar-width: thin;
        scrollbar-color: ${theme.scrollThumb} ${theme.scrollTrack};
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyDiscord = () => {
    navigator.clipboard.writeText(portfolioContent.discordUsername);
    toast.success('Discord username copied!', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: theme.bg }}>
      <FloatingParticles />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-80 backdrop-blur-md" style={{ backgroundColor: theme.bg }}>
        <div className="container mx-auto px-4 py-4">
          <ul className="flex justify-center space-x-6">
            {sections.map((section) => (
              <motion.li key={section}>
                <motion.button
                  onClick={() => scrollToSection(section)}
                  className="text-lg font-medium"
                  style={{
                    color: active === section ? theme.highlight : theme.subtext,
                    textShadow: active === section ? theme.glow : 'none',
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    color: theme.highlight,
                    textShadow: theme.glow
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        {sections.map((section, index) => (
          <section
            key={section}
            id={section}
            ref={sectionRefs.current[index]}
            className="min-h-screen flex items-center justify-center"
          >
            <AnimatePresence>
              {active === section && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  {section === 'home' && (
                    <div className="text-center">
                      <motion.h1 
                        className="text-6xl font-bold mb-4" 
                        style={{ 
                          color: theme.text,
                          textShadow: theme.glow
                        }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {portfolioContent.name}
                      </motion.h1>
                      <motion.h2 
                        className="text-2xl mb-8" 
                        style={{ color: theme.subtext }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        {portfolioContent.title}
                      </motion.h2>
                      <motion.div 
                        className="flex justify-center gap-6"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <motion.a
                          href={`https://github.com/${portfolioContent.githubUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full"
                          whileHover={{ scale: 1.1, boxShadow: theme.glow }}
                          style={{ 
                            backgroundColor: theme.card,
                            color: theme.highlight,
                            boxShadow: theme.cardGlow
                          }}
                        >
                          <FaGithub className="w-8 h-8" />
                        </motion.a>
                        <motion.button
                          onClick={copyDiscord}
                          className="p-3 rounded-full"
                          whileHover={{ scale: 1.1, boxShadow: theme.glow }}
                          style={{ 
                            backgroundColor: theme.card,
                            color: theme.highlight,
                            boxShadow: theme.cardGlow
                          }}
                        >
                          <FaDiscord className="w-8 h-8" />
                        </motion.button>
                      </motion.div>
                    </div>
                  )}
                  {section === 'about' && (
                    <div className="max-w-2xl mx-auto">
                      <h2 
                        className="text-4xl font-bold mb-8" 
                        style={{ 
                          color: theme.text,
                          textShadow: theme.glow
                        }}
                      >
                        About Me
                      </h2>
                      {portfolioContent.about.map((paragraph, index) => (
                        <p key={index} className="text-lg mb-6" style={{ color: theme.subtext }}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                  {section === 'skills' && <SkillsCarousel />}
                  {section === 'projects' && (
                    <div className="w-full max-w-4xl mx-auto">
                      <h2 
                        className="text-4xl font-bold mb-12 text-center" 
                        style={{ 
                          color: theme.text,
                          textShadow: theme.glow
                        }}
                      >
                        Featured Projects
                      </h2>
                      <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                          <ProjectCard key={project.name} project={project} />
                        ))}
                      </div>
                    </div>
                  )}
                  {section === 'contact' && (
                    <div className="text-center max-w-2xl mx-auto">
                      <h2 
                        className="text-4xl font-bold mb-8" 
                        style={{ 
                          color: theme.text,
                          textShadow: theme.glow
                        }}
                      >
                        Let's Connect
                      </h2>
                      <p className="text-lg mb-12" style={{ color: theme.subtext }}>
                        Whether you're interested in collaboration, have a project in mind, or just want to chat about technology, I'm always open to new opportunities and connections.
                      </p>
                      <div className="flex justify-center gap-6">
                        <motion.button
                          className="px-8 py-3 rounded-lg font-bold text-lg"
                          whileHover={{ scale: 1.05, boxShadow: theme.glow }}
                          style={{ 
                            backgroundColor: theme.highlight,
                            color: theme.bg,
                            boxShadow: theme.cardGlow
                          }}
                          onClick={copyDiscord}
                        >
                          Discord
                        </motion.button>
                        <motion.button
                          className="px-8 py-3 rounded-lg font-bold text-lg"
                          whileHover={{ scale: 1.05, boxShadow: theme.glow }}
                          style={{ 
                            backgroundColor: theme.card,
                            color: theme.text,
                            boxShadow: theme.cardGlow
                          }}
                          onClick={() => window.open(`https://github.com/${portfolioContent.githubUsername}`, '_blank')}
                        >
                          GitHub
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ))}
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}