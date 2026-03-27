import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, ExternalLink, Github, Layers, X } from 'lucide-react';
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

const ProjectCard = ({ project, delay, isNew, onOpen }) => {
  const { title, description, tags, github, demo, status, fileUrl, fileName } = project;
  const statusMeta = getProjectStatusMeta(status);

  const handleDownload = async (event) => {
    event.stopPropagation();
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

  const openWithKeyboard = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(project);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      role="button"
      tabIndex={0}
      onKeyDown={openWithKeyboard}
      onClick={() => onOpen(project)}
      className={`group relative glass rounded-2xl overflow-hidden red-glow-border flex flex-col h-full w-full max-w-[23rem] mx-auto transition-all text-left ${
        isNew ? 'ring-1 ring-primary/60 shadow-[0_0_34px_rgba(254,31,25,0.28)]' : ''
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
          <Layers className="text-primary/20 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-3 left-3 flex gap-2 flex-wrap max-w-[72%]">
          {tags.map((tag) => (
            <span key={`${title}-${tag}`} className="px-2.5 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded-full text-white">
              {tag}
            </span>
          ))}
        </div>
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusMeta.cardClass} ${status === 'in_progress' ? 'animate-pulse' : ''}`}>
          {statusMeta.label}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-poppins font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 font-inter text-sm leading-relaxed mb-4 flex-grow">{description}</p>

        <div className="flex items-center gap-4 mt-auto">
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors"
          >
            <ExternalLink size={16} /> Live Demo
          </a>
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors"
          >
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

const ProjectDetailsModal = ({ project, onClose }) => {
  if (!project) return null;
  const statusMeta = getProjectStatusMeta(project.status);

  return (
    <AnimatePresence>
      <motion.div
        key={project.id}
        className="fixed inset-0 z-[1200] px-4 py-8 md:py-10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-black/78 backdrop-blur-xl"
          aria-label="Close project details"
        />
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-2xl border border-white/12 bg-[#111]/80 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden"
        >
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/85 mb-2">Project Details</p>
              <h3 className="text-2xl font-poppins font-bold">{project.title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-lg border border-white/20 hover:border-primary/45 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusMeta.cardClass}`}>
                {statusMeta.label}
              </span>
              {project.tags.map((tag) => (
                <span key={`${project.id}-${tag}`} className="px-2.5 py-1 rounded-full text-[11px] border border-white/15 bg-white/[0.03]">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed">{project.description}</p>

            <div className="flex flex-wrap gap-3">
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:shadow-[0_0_26px_rgba(254,31,25,0.45)] transition-all inline-flex items-center gap-2"
              >
                <ExternalLink size={15} /> Live Demo
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-white/18 bg-white/[0.03] text-sm font-semibold hover:border-primary/50 transition-all inline-flex items-center gap-2"
              >
                <Github size={15} /> GitHub
              </a>
              {project.fileUrl ? (
                <a
                  href={project.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border border-white/18 bg-white/[0.03] text-sm font-semibold hover:border-primary/50 transition-all inline-flex items-center gap-2"
                >
                  <Download size={15} /> Download
                </a>
              ) : null}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Projects = () => {
  const { projects, loading, highlightedProjectIds } = useContent();
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (!activeProject) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveProject(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeProject]);

  return (
    <section id="projects" className="py-20 md:py-24 bg-black/40 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4"
          >
            Showcase
          </motion.div>
          <h2 className="section-title text-3xl md:text-4xl font-poppins font-bold">
            Featured <span className="text-primary">Projects</span>
          </h2>
        </div>

        {loading.projects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
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
              <ProjectCard
                key={project.id}
                project={project}
                delay={0.1 + index * 0.1}
                isNew={highlightedProjectIds.includes(project.id)}
                onOpen={setActiveProject}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                delay={0.1 + index * 0.1}
                isNew={highlightedProjectIds.includes(project.id)}
                onOpen={setActiveProject}
              />
            ))}
          </div>
        )}

        <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} className="text-center mt-12 md:mt-16">
          <button className="px-8 md:px-10 py-3.5 md:py-4 glass text-white font-bold rounded-xl hover:border-primary/50 transition-all group">
            Check More Projects <span className="inline-block group-hover:translate-x-1 transition-transform">-&gt;</span>
          </button>
        </motion.div>
      </div>

      <ProjectDetailsModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
};

export default Projects;
