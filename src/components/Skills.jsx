import React from 'react';
import { motion } from 'framer-motion';
import { Braces, Cpu, Database, Wrench } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const iconForCategory = (category) => {
  const value = (category || '').toLowerCase();
  if (value.includes('front')) return Braces;
  if (value.includes('back') || value.includes('database')) return Database;
  if (value.includes('tool') || value.includes('devops')) return Wrench;
  return Cpu;
};

const SkillColumn = ({ title, skills, delay, highlightedSkillIds }) => {
  const Icon = iconForCategory(title);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 md:p-6"
    >
      <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-1">Category</p>
          <h3 className="text-xl font-poppins font-semibold">{title}</h3>
        </div>
        <div className="h-11 w-11 rounded-xl border border-primary/30 bg-primary/10 text-primary flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            layout
            whileHover={{ y: -2 }}
            className={`px-3.5 py-2 rounded-xl border text-sm font-inter bg-black/30 transition-all ${
              highlightedSkillIds.includes(skill.id)
                ? 'border-primary/70 text-white shadow-[0_0_16px_rgba(254,31,25,0.35)]'
                : 'border-white/12 text-gray-200 hover:border-primary/45'
            }`}
          >
            {skill.name}
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
};

const Skills = () => {
  const { skills, loading, highlightedSkillIds } = useContent();

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const skillGroups = Object.entries(groupedSkills).map(([title, values], index) => ({
    id: `${title}-${index}`,
    title,
    skills: values,
  }));

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[42rem] h-[20rem] bg-primary/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/5 blur-[130px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4"
          >
            Capabilities
          </motion.p>
          <h2 className="section-title text-3xl md:text-4xl font-poppins font-bold mb-3">
            Technical <span className="text-primary">Skills</span>
          </h2>
          <p className="text-gray-400 font-inter max-w-2xl mx-auto text-sm md:text-base">
            Core technologies I use to deliver fast, scalable, and production-ready products.
          </p>
        </div>

        {loading.skills ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6 animate-pulse">
                <div className="h-5 w-48 bg-white/10 rounded mb-5" />
                <div className="flex flex-wrap gap-2.5">
                  {[...Array(8)].map((__, chip) => (
                    <div key={chip} className="h-9 w-24 rounded-xl bg-white/10" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : skillGroups.length === 1 ? (
          <div className="flex justify-center">
            {skillGroups.map((group, index) => (
              <div key={group.id} className="w-full max-w-3xl">
                <SkillColumn {...group} delay={0.08 + index * 0.08} highlightedSkillIds={highlightedSkillIds} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {skillGroups.map((group, index) => (
              <SkillColumn key={group.id} {...group} delay={0.08 + index * 0.08} highlightedSkillIds={highlightedSkillIds} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
