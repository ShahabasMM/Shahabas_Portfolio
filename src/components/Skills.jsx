import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const SkillCategory = ({ title, skills, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="glass rounded-2xl border border-white/10 p-5 md:p-6"
  >
    <h3 className="text-lg font-poppins font-bold mb-4 flex items-center gap-3">
      <span className="w-6 h-[2px] bg-primary"></span>
      {title}
    </h3>
    <div className="flex flex-wrap gap-2.5">
      {skills.map((skill, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(254, 31, 25, 0.14)' }}
          className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] cursor-default transition-all duration-300 hover:shadow-[0_0_16px_rgba(254,31,25,0.22)] hover:text-primary font-inter text-sm font-medium"
        >
          {skill}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Skills = () => {
  const { skills: skillGroups } = useContent();

  return (
    <section id="skills" className="py-20 relative">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="section-title text-3xl md:text-4xl font-poppins font-bold mb-3">Technical <span className="text-primary">Skills</span></h2>
          <p className="text-gray-400 font-inter max-w-2xl mx-auto text-sm md:text-base">
            My toolkit includes a wide range of technologies focused on building intelligent, scalable, and visually stunning digital products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {skillGroups.map((group, index) => (
            <SkillCategory key={group.id} {...group} delay={0.1 + index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
