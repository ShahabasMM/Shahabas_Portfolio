import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

const TimelineItem = ({ role, company, period, description, icon: Icon, isLast }) => (
  <div className="relative pl-12 pb-12">
    {!isLast && (
      <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 to-transparent"></div>
    )}
    <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="absolute left-0 top-0 w-10 h-10 bg-accent glass border border-primary/40 rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(254,31,25,0.3)]"
    >
      <Icon className="text-primary w-5 h-5" />
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="glass p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xl font-poppins font-bold group-hover:text-primary transition-colors">{role}</h3>
          <p className="text-primary/80 font-inter font-medium">{company}</p>
        </div>
        <div className="px-4 py-1 bg-white/5 rounded-full text-xs font-bold text-gray-400 border border-white/10">
          {period}
        </div>
      </div>
      <p className="text-gray-400 font-inter leading-relaxed">
        {description}
      </p>
    </motion.div>
  </div>
);

const Experience = () => {
  const experiences = [
    {
      role: "Senior AI Developer",
      company: "Innovate AI Solutions",
      period: "2023 - Present",
      description: "Leading the development of generative AI architectures and deploying large-scale automation frameworks for enterprise clients. optimized model inference by 40%.",
      icon: Briefcase
    },
    {
      role: "Full Stack Engineer",
      company: "NextGen Tech",
      period: "2021 - 2023",
      description: "Built high-performance web applications using React and Node.js. Integrated various AI models into customer-facing products, enhancing user interaction.",
      icon: Cpu
    },
    {
      role: "Junior Web Developer",
      company: "Startup Lab",
      period: "2020 - 2021",
      description: "Assisted in building responsive web interfaces and implementing backend APIs. Gained foundational experience in modern JavaScript ecosystems.",
      icon: Briefcase
    },
    {
      role: "B.Tech in Computer Science",
      company: "Technical University",
      period: "2016 - 2020",
      description: "Specialized in Artificial Intelligence and Web Technologies. Awarded 'Best Final Year Project' for an AI-based healthcare diagnostic tool.",
      icon: GraduationCap
    }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 right-0 w-1/4 h-1/2 bg-primary/5 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-16">
          <h2 className="text-4xl font-poppins font-bold">Journey & <span className="text-primary">Experience</span></h2>
          <p className="text-gray-400 mt-4 font-inter">
            A timeline of my professional growth, technical milestones, and educational background.
          </p>
        </div>

        <div className="relative">
          {experiences.map((exp, index) => (
            <TimelineItem key={index} {...exp} isLast={index === experiences.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

import { Cpu as CpuIcon } from 'lucide-react';
const Cpu = CpuIcon; // Reuse consistent icon set

export default Experience;
