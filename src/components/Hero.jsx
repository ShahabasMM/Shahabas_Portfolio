import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Cpu } from 'lucide-react';

const Hero = () => {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x, y });
  };

  const resetParallax = () => {
    setParallax({ x: 0, y: 0 });
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      onMouseMove={handlePointerMove}
      onMouseLeave={resetParallax}
    >
      {/* Background visual elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative flex items-center justify-center min-h-[calc(100vh-5rem)]">
        {/* Keep Center Circle / Ring System Intact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex justify-center items-center opacity-35 md:opacity-45 lg:opacity-60 pointer-events-none z-[5]"
        >
          <div className="relative w-full max-w-[24rem] sm:max-w-[28rem] md:max-w-[31.375rem] aspect-square scale-75 sm:scale-90 md:scale-100">
            <div className="absolute inset-0 rounded-full border border-white/35 animate-[spin_16s_linear_infinite]"></div>
            {/* Background Rings */}
            <div className="absolute inset-0 border-[40px] border-primary/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-10 border-[1px] border-primary/20 border-dashed rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
          </div>
        </motion.div>

        {/* Floating Glass Cards Spread Across Hero */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            x: parallax.x * -20,
            y: parallax.y * -12,
          }}
          className="hidden md:block absolute left-4 md:left-10 lg:left-20 top-1/4 md:top-[22%] w-48 sm:w-56 md:w-64 h-56 sm:h-64 md:h-72 glass rounded-2xl p-5 border-primary/30 shadow-[0_0_50px_rgba(254,31,25,0.2)] rotate-[-7deg] z-10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="h-2 w-24 bg-white/20 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div className="text-[10px] font-mono text-primary/85 tracking-wider uppercase">terminal.sh</div>
            <div className="h-24 w-full bg-black/40 rounded-xl border border-primary/20 px-3 py-2 font-mono text-[10px] text-gray-300 leading-relaxed">
              <div><span className="text-primary">$</span> npm run dev</div>
              <div className="text-primary/80">&gt; vite v8.0.2 ready</div>
              <div><span className="text-primary">$</span> git commit -m "deploy"</div>
              <div className="text-white/70">3 files changed</div>
            </div>
            <div className="h-12 w-full bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center gap-2">
              <Cpu className="text-primary w-6 h-6 animate-pulse" />
              <span className="font-mono text-[10px] text-primary/75">build:success</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], rotate: [7, 9, 7] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          style={{
            x: parallax.x * 24,
            y: parallax.y * -10,
          }}
          className="hidden sm:flex absolute right-3 md:right-10 lg:right-20 top-1/3 md:top-[30%] w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 glass rounded-xl p-4 border-primary/20 shadow-xl rotate-[7deg] z-10 justify-center items-center blur-[0.5px]"
        >
          <Code className="text-primary w-8 h-8" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{
            x: parallax.x * -14,
            y: parallax.y * 18,
          }}
          className="hidden sm:flex terminal absolute bottom-16 md:bottom-20 right-8 md:right-16 lg:right-24 w-32 sm:w-36 md:w-40 h-20 sm:h-24 glass rounded-xl p-4 border-primary/20 shadow-xl z-10 flex-col justify-center items-center blur-[1px]"
        >
          <Terminal className="text-white w-7 h-7" />
          <span className="font-mono text-[9px] text-primary/80 mt-1">$ echo live</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="md:hidden absolute bottom-20 left-4 w-36 h-20 glass rounded-xl border border-primary/25 shadow-[0_0_24px_rgba(254,31,25,0.22)] z-10 flex flex-col justify-center items-center backdrop-blur-xl"
        >
          <Terminal className="text-white w-5 h-5" />
          <span className="font-mono text-[8px] text-primary/80 mt-1">$ mobile-live</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 7, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
          className="md:hidden absolute top-28 right-4 w-24 h-24 glass rounded-xl border border-primary/20 shadow-[0_0_18px_rgba(254,31,25,0.2)] z-10 flex items-center justify-center"
        >
          <Code className="text-primary w-6 h-6" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="md:hidden absolute top-[36%] left-4 w-28 h-14 glass rounded-lg border border-primary/20 shadow-[0_0_16px_rgba(254,31,25,0.18)] z-10 flex items-center justify-center"
        >
          <span className="font-mono text-[8px] text-primary/80">$ build ok</span>
        </motion.div>

        {/* Foreground Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-30 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-2"
        >
          {/* Badge */}
          <div className="badge inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 group cursor-default shadow-[0_0_20px_rgba(254,31,25,0.1)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
            </span>
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white group-hover:text-white/90 transition-colors">Available for new projects</span>
          </div>

          <div className="hero-image-wrap mb-8 sm:mb-10">
            <img
              src="/spotlight-name.png"
              alt="Shahabas"
              className="hero-name-image"
              draggable="false"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-2 w-full sm:w-auto">
            <button
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 bg-primary text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(254,31,25,0.6)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 text-base sm:text-lg"
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 glass text-white font-bold rounded-xl hover:border-primary/50 hover:shadow-[0_0_28px_rgba(254,31,25,0.28)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 text-base sm:text-lg"
            >
              Contact Me
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
