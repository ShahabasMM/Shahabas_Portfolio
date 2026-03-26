import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Github, Layers } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { getProjectStatusMeta } from '../utils/projectStatus';

const getDownloadName = (fileUrl, fileName, title) => {
  if (fileName?.trim()) return fileName.trim();
  try {
    const pathname = new URL(fileUrl).pathname;
    const fromUrl = pathname.split('/').pop();
    if (fromUrl) return decodeURIComponent(fromUrl);
  } catch {
    // no-op
  }
  return `${title.replace(/\s+/g, '-').toLowerCase()}-attachment`;
};

const ProjectCard = ({ title, description, tags, github, demo, status, fileUrl, fileName, delay, isNew }) => {
  const statusMeta = getProjectStatusMeta(status);

  const handleDownload = async () => {
    if (!fileUrl) return;
    const name = getDownloadName(fileUrl, fileName, title);
    const anchor = document.createElement('a');
    anchor.style.display = 'none';

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('download_failed');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      anchor.href = objectUrl;
      anchor.download = name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`group relative glass rounded-2xl overflow-hidden red-glow-border flex flex-col h-full w-full max-w-[23rem] mx-auto transition-all ${
        isNew ? 'ring-1 ring-primary/60 shadow-[0_0_34px_rgba(254,31,25,0.28)]' : ''
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
          <Layers className="text-primary/20 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-4 left-4 flex gap-2">
          {tags.map((tag) => (
            <span key={`${title}-${tag}`} className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded-full text-white">
              {tag}
            </span>
          ))}
        </div>
        <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusMeta.cardClass} ${status === 'in_progress' ? 'animate-pulse' : ''}`}>
          {statusMeta.label}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-poppins font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 font-inter text-sm leading-relaxed mb-4 flex-grow">{description}</p>

        <div className="flex items-center gap-4 mt-auto">
          <a href={demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors">
            <ExternalLink size={16} /> Live Demo
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors">
            <Github size={16} /> GitHub
          </a>
        </div>
      </div>
      {fileUrl ? (
        <button
          type="button"
          onClick={handleDownload}
          title="Download"
          className="absolute bottom-4 right-4 h-9 w-9 rounded-lg bg-black/45 border border-white/15 flex items-center justify-center text-white/90 hover:text-white hover:border-primary/45 hover:shadow-[0_0_16px_rgba(254,31,25,0.45)] transition-all"
        >
          <Download size={16} />
        </button>
      ) : null}
    </motion.div>
  );
};

const Projects = () => {
  const { projects, loading, highlightedProjectIds } = useContent();

  return (
    <section id="projects" className="py-24 bg-black/40 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-[0.3em] text-sm mb-4"
          >
            Showcase
          </motion.div>
          <h2 className="section-title text-4xl font-poppins font-bold">
            Featured <span className="text-primary">Projects</span>
          </h2>
        </div>

        {loading.projects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="glass rounded-2xl border border-white/10 animate-pulse">
                <div className="aspect-video bg-white/10 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/10 rounded w-2/3" />
                  <div className="h-4 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 1 ? (
          <div className="flex justify-center max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} {...project} delay={0.1 + index * 0.1} isNew={highlightedProjectIds.includes(project.id)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} {...project} delay={0.1 + index * 0.1} isNew={highlightedProjectIds.includes(project.id)} />
            ))}
          </div>
        )}

        <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} className="text-center mt-16">
          <button className="px-10 py-4 glass text-white font-bold rounded-xl hover:border-primary/50 transition-all group">
            Check More Projects <span className="inline-block group-hover:translate-x-1 transition-transform">-&gt;</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
