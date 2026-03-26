import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Zap, Globe, Database, User } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[160px] pointer-events-none rounded-full z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-[0.4em] text-sm mb-6"
          >
            Philosophy
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-poppins font-extrabold mb-8 tracking-tight"
          >
            Digital Craftsmanship & <br />
            <span className="text-primary">Intelligent Innovation</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 font-inter leading-relaxed"
          >
            I'm a developer who bridges the gap between high-performance systems and human-centric design. My work revolves around creating experiences that are not only efficient but also intuitive and visually striking.
          </motion.p>
        </div>

        {/* Spread Layout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-3xl red-glow-border group hover:bg-white/[0.03] transition-colors"
          >
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500">
               <span className="text-primary text-2xl font-bold">01</span>
            </div>
            <h3 className="text-2xl font-poppins font-bold text-white mb-4">Performance First</h3>
            <p className="text-gray-400 font-inter leading-relaxed">
              Every millisecond counts. I optimize applications for speed, scalability, and seamless user interaction across all platforms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-3xl red-glow-border scale-105 bg-white/[0.02] border-primary/30 relative z-10"
          >
            <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(254,31,25,0.3)]">
               <span className="text-primary text-2xl font-bold">02</span>
            </div>
            <h3 className="text-2xl font-poppins font-bold text-white mb-4">Scalable Systems</h3>
            <p className="text-gray-400 font-inter leading-relaxed">
              Building for today, architecting for tomorrow. I design modular, maintainable codebases that grow with your user base.
            </p>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 blur-[60px] pointer-events-none rounded-full -z-10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-3xl red-glow-border group hover:bg-white/[0.03] transition-colors"
          >
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500">
               <span className="text-primary text-2xl font-bold">03</span>
            </div>
            <h3 className="text-2xl font-poppins font-bold text-white mb-4">Innovative Design</h3>
            <p className="text-gray-400 font-inter leading-relaxed">
              Design is more than look. It's functionality. I merge cutting-edge aesthetics with practical usability to create lasting value.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
