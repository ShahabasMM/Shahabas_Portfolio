import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ContentContext = createContext(null);

const SKILLS_KEY = 'portfolio_skills_v1';
const PROJECTS_KEY = 'portfolio_projects_v1';
const SUBMISSIONS_KEY = 'portfolio_submissions_v1';

const defaultSkills = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    skills: ['React.js', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Three.js'],
  },
  {
    id: 'backend',
    title: 'Backend & Database',
    skills: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase'],
  },
  {
    id: 'devops',
    title: 'Tools & DevOps',
    skills: ['Docker', 'Git', 'AWS', 'Google Cloud', 'CI/CD', 'Linux', 'VS Code'],
  },
];

const defaultProjects = [
  {
    id: 'ai-vision-system',
    title: 'AI Vision System',
    description:
      'A real-time object detection and tracking system built with TensorFlow and OpenCV, featuring a high-performance React dashboard.',
    tags: ['Python', 'TensorFlow', 'React', 'OpenCV'],
    github: '#',
    demo: '#',
    status: 'completed',
    fileUrl: '',
    fileName: '',
  },
  {
    id: 'autonomous-agent-os',
    title: 'Autonomous Agent OS',
    description:
      'A framework for building autonomous AI agents that can interact with web browsers and perform complex multi-step tasks.',
    tags: ['Node.js', 'GPT-4', 'Puppeteer', 'Redis'],
    github: '#',
    demo: '#',
    status: 'in_progress',
    fileUrl: '',
    fileName: '',
  },
  {
    id: 'fintech-quantum',
    title: 'FinTech Quantum',
    description:
      'Predictive financial analysis platform utilizing machine learning for market trend forecasting and portfolio optimization.',
    tags: ['React', 'Python', 'FastAPI', 'PostgreSQL'],
    github: '#',
    demo: '#',
    status: 'not_started',
    fileUrl: '',
    fileName: '',
  },
  {
    id: 'nexus-core-automation',
    title: 'Nexus Core Automation',
    description:
      'Enterprise-level workflow automation engine that integrates disparate SaaS tools into a unified, AI-driven pipeline.',
    tags: ['Go', 'Next.js', 'GraphQL', 'Docker'],
    github: '#',
    demo: '#',
    status: 'completed',
    fileUrl: '',
    fileName: '',
  },
];

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const ContentProvider = ({ children }) => {
  const [skills, setSkills] = useState(() => readStorage(SKILLS_KEY, defaultSkills));
  const [projects, setProjects] = useState(() => readStorage(PROJECTS_KEY, defaultProjects));
  const [submissions, setSubmissions] = useState(() => readStorage(SUBMISSIONS_KEY, []));

  useEffect(() => {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  }, [submissions]);

  const addSkillGroup = (payload) => {
    setSkills((prev) => [
      ...prev,
      {
        id: makeId('skills'),
        title: payload?.title || 'New Category',
        skills: payload?.skills || ['New Skill'],
      },
    ]);
  };

  const updateSkillGroup = (id, patch) => {
    setSkills((prev) => prev.map((group) => (group.id === id ? { ...group, ...patch } : group)));
  };

  const deleteSkillGroup = (id) => {
    setSkills((prev) => prev.filter((group) => group.id !== id));
  };

  const addProject = (payload) => {
    setProjects((prev) => [
      ...prev,
      {
        id: makeId('project'),
        title: payload?.title || 'New Project',
        description: payload?.description || 'Project description',
        tags: payload?.tags || ['React'],
        github: payload?.github || '#',
        demo: payload?.demo || '#',
        status: payload?.status || 'not_started',
        fileUrl: payload?.fileUrl || '',
        fileName: payload?.fileName || '',
      },
    ]);
  };

  const updateProject = (id, patch) => {
    setProjects((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const addSubmission = (payload) => {
    setSubmissions((prev) => [
      {
        id: makeId('submission'),
        isRead: false,
        createdAt: new Date().toISOString(),
        ...payload,
      },
      ...prev,
    ]);
  };

  const markSubmissionRead = (id, isRead) => {
    setSubmissions((prev) => prev.map((item) => (item.id === id ? { ...item, isRead } : item)));
  };

  const deleteSubmission = (id) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
  };

  const unreadSubmissions = submissions.filter((item) => !item.isRead).length;

  const value = useMemo(
    () => ({
      skills,
      projects,
      submissions,
      unreadSubmissions,
      addSkillGroup,
      updateSkillGroup,
      deleteSkillGroup,
      addProject,
      updateProject,
      deleteProject,
      addSubmission,
      markSubmissionRead,
      deleteSubmission,
    }),
    [skills, projects, submissions, unreadSubmissions]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
};
