import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { getSession, onAuthStateChanged, signInAdmin, signOutAdmin } from '../services/authService';
import { createContact, deleteContactById, fetchContacts, updateContactById } from '../services/contactService';
import { createProject, deleteProjectById, fetchProjects, mapProjectRecord, updateProjectById, uploadProjectAttachment } from '../services/projectService';
import { createSkill, deleteSkillById, fetchSkills, updateSkillById } from '../services/skillService';

const ContentContext = createContext(null);

const makeTempId = (prefix) => `temp-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const normalizeContact = (item) => ({ ...item, is_read: Boolean(item?.is_read) });

const sortSkills = (items) =>
  [...items].sort((a, b) => `${a.category || ''}-${a.name || ''}`.localeCompare(`${b.category || ''}-${b.name || ''}`));

const prependOrReplace = (items, nextItem) => {
  const existingIndex = items.findIndex((item) => item.id === nextItem.id);
  if (existingIndex >= 0) {
    return items.map((item) => (item.id === nextItem.id ? nextItem : item));
  }
  return [nextItem, ...items];
};

export const ContentProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [highlightedProjectIds, setHighlightedProjectIds] = useState([]);
  const [highlightedSkillIds, setHighlightedSkillIds] = useState([]);
  const [highlightedSubmissionIds, setHighlightedSubmissionIds] = useState([]);
  const [loading, setLoading] = useState({
    initial: true,
    projects: false,
    skills: false,
    contacts: false,
  });
  const [adminSession, setAdminSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const highlightTimersRef = useRef(new Map());

  const pulseId = useCallback((key, id, setter) => {
    const timerKey = `${key}:${id}`;
    const existingTimer = highlightTimersRef.current.get(timerKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    setter((prev) => (prev.includes(id) ? prev : [...prev, id]));
    const timeoutId = setTimeout(() => {
      setter((prev) => prev.filter((item) => item !== id));
      highlightTimersRef.current.delete(timerKey);
    }, 2200);

    highlightTimersRef.current.set(timerKey, timeoutId);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading((prev) => ({ ...prev, initial: true, projects: true, skills: true, contacts: true }));
    const [projectsResult, skillsResult, contactsResult] = await Promise.allSettled([fetchProjects(), fetchSkills(), fetchContacts()]);

    if (projectsResult.status === 'fulfilled') {
      setProjects(projectsResult.value);
    } else {
      toast.error(projectsResult.reason?.message || 'Failed to load projects.');
    }

    if (skillsResult.status === 'fulfilled') {
      setSkills(sortSkills(skillsResult.value));
    } else {
      toast.error(skillsResult.reason?.message || 'Failed to load skills.');
    }

    if (contactsResult.status === 'fulfilled') {
      setSubmissions((contactsResult.value || []).map(normalizeContact));
    } else {
      setSubmissions([]);
    }

    setLoading({ initial: false, projects: false, skills: false, contacts: false });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading({ initial: false, projects: false, skills: false, contacts: false });
      setAuthLoading(false);
      return undefined;
    }

    loadAll();
    const syncAuth = async () => {
      try {
        setAdminSession(await getSession());
      } catch {
        setAdminSession(null);
      } finally {
        setAuthLoading(false);
      }
    };
    syncAuth();
    const subscription = onAuthStateChanged((session) => setAdminSession(session));
    return () => subscription.unsubscribe();
  }, [loadAll]);

  useEffect(() => {
    return () => {
      highlightTimersRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      highlightTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    const projectsChannel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, (payload) => {
        const next = mapProjectRecord(payload.new);
        setProjects((prev) => prependOrReplace(prev, next));
        pulseId('project', next.id, setHighlightedProjectIds);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
        const next = mapProjectRecord(payload.new);
        setProjects((prev) => prev.map((item) => (item.id === next.id ? next : item)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'projects' }, (payload) => {
        setProjects((prev) => prev.filter((item) => item.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
    };
  }, [pulseId]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    const skillsChannel = supabase
      .channel('skills-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'skills' }, (payload) => {
        setSkills((prev) => sortSkills(prependOrReplace(prev, payload.new)));
        pulseId('skill', payload.new.id, setHighlightedSkillIds);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'skills' }, (payload) => {
        setSkills((prev) => sortSkills(prev.map((item) => (item.id === payload.new.id ? payload.new : item))));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'skills' }, (payload) => {
        setSkills((prev) => prev.filter((item) => item.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(skillsChannel);
    };
  }, [pulseId]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !adminSession) return undefined;

    const syncContacts = async () => {
      setLoading((prev) => ({ ...prev, contacts: true }));
      try {
        setSubmissions((await fetchContacts()).map(normalizeContact));
      } catch (error) {
        toast.error(error.message || 'Failed to load messages.');
      } finally {
        setLoading((prev) => ({ ...prev, contacts: false }));
      }
    };
    syncContacts();

    const subscriptionStartedAt = Date.now();
    const contactsChannel = supabase
      .channel('contacts-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, (payload) => {
        const next = normalizeContact(payload.new);
        setSubmissions((prev) => prependOrReplace(prev, next));
        pulseId('contact', next.id, setHighlightedSubmissionIds);
        const commitTs = payload.commit_timestamp ? new Date(payload.commit_timestamp).getTime() : Date.now();
        if (commitTs >= subscriptionStartedAt - 1500) {
          toast.success('New message received');
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contacts' }, (payload) => {
        const next = normalizeContact(payload.new);
        setSubmissions((prev) => prev.map((item) => (item.id === next.id ? next : item)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'contacts' }, (payload) => {
        setSubmissions((prev) => prev.filter((item) => item.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(contactsChannel);
    };
  }, [adminSession, pulseId]);

  const loginAdmin = useCallback(async ({ email, password }) => {
    const session = await signInAdmin({ email, password });
    setAdminSession(session);
    toast.success('Welcome back.');
  }, []);

  const logoutAdmin = useCallback(async () => {
    await signOutAdmin();
    setAdminSession(null);
    setSubmissions([]);
    toast.success('Logged out.');
  }, []);

  const addProject = useCallback(async (payload) => {
    const tempId = makeTempId('project');
    const optimistic = { ...payload, id: tempId, tags: payload.tags || [], file: undefined };
    setProjects((prev) => [optimistic, ...prev]);

    try {
      const fileUrl = payload.file instanceof File ? await uploadProjectAttachment(payload.file) : payload.fileUrl || '';
      const created = await createProject({ ...payload, fileUrl });
      setProjects((prev) => prev.map((project) => (project.id === tempId ? created : project)));
      toast.success('Project created.');
    } catch (error) {
      setProjects((prev) => prev.filter((project) => project.id !== tempId));
      toast.error(error.message || 'Failed to create project.');
      throw error;
    }
  }, []);

  const updateProject = useCallback(async (id, patch) => {
    let previous = null;
    setProjects((prev) => {
      previous = prev.find((item) => item.id === id) || null;
      if (!previous) return prev;
      const optimistic = { ...previous, ...patch, file: undefined };
      return prev.map((project) => (project.id === id ? optimistic : project));
    });

    if (!previous) return;

    try {
      const fileUrl = patch.file instanceof File ? await uploadProjectAttachment(patch.file) : patch.fileUrl || previous.fileUrl || '';
      const updated = await updateProjectById(id, { ...patch, fileUrl });
      setProjects((prev) => prev.map((project) => (project.id === id ? updated : project)));
      toast.success('Project updated.');
    } catch (error) {
      setProjects((prev) => prev.map((project) => (project.id === id ? previous : project)));
      toast.error(error.message || 'Failed to update project.');
      throw error;
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    let snapshot = [];
    setProjects((prev) => {
      snapshot = prev;
      return prev.filter((item) => item.id !== id);
    });

    try {
      await deleteProjectById(id);
      toast.success('Project deleted.');
    } catch (error) {
      setProjects(snapshot);
      toast.error(error.message || 'Failed to delete project.');
      throw error;
    }
  }, []);

  const addSkill = useCallback(async (payload) => {
    const tempId = makeTempId('skill');
    const optimistic = { id: tempId, ...payload };
    setSkills((prev) => sortSkills([...prev, optimistic]));
    try {
      const created = await createSkill(payload);
      setSkills((prev) => sortSkills(prev.map((item) => (item.id === tempId ? created : item))));
      toast.success('Skill added.');
    } catch (error) {
      setSkills((prev) => prev.filter((item) => item.id !== tempId));
      toast.error(error.message || 'Failed to add skill.');
      throw error;
    }
  }, []);

  const updateSkill = useCallback(async (id, patch) => {
    let previous = null;
    setSkills((prev) => {
      previous = prev.find((item) => item.id === id) || null;
      if (!previous) return prev;
      return sortSkills(prev.map((item) => (item.id === id ? { ...previous, ...patch } : item)));
    });

    if (!previous) return;

    try {
      const updated = await updateSkillById(id, patch);
      setSkills((prev) => sortSkills(prev.map((item) => (item.id === id ? updated : item))));
      toast.success('Skill updated.');
    } catch (error) {
      setSkills((prev) => sortSkills(prev.map((item) => (item.id === id ? previous : item))));
      toast.error(error.message || 'Failed to update skill.');
      throw error;
    }
  }, []);

  const deleteSkill = useCallback(async (id) => {
    let snapshot = [];
    setSkills((prev) => {
      snapshot = prev;
      return prev.filter((item) => item.id !== id);
    });
    try {
      await deleteSkillById(id);
      toast.success('Skill deleted.');
    } catch (error) {
      setSkills(snapshot);
      toast.error(error.message || 'Failed to delete skill.');
      throw error;
    }
  }, []);

  const addSubmission = useCallback(
    async (payload) => {
      try {
        await createContact({ ...payload, is_read: false });
        toast.success('Message sent.');
      } catch (error) {
        toast.error(error.message || 'Failed to send message.');
        throw error;
      }
    },
    []
  );

  const deleteSubmission = useCallback(async (id) => {
    let snapshot = [];
    setSubmissions((prev) => {
      snapshot = prev;
      return prev.filter((item) => item.id !== id);
    });
    try {
      await deleteContactById(id);
      toast.success('Message deleted.');
    } catch (error) {
      setSubmissions(snapshot);
      toast.error(error.message || 'Failed to delete message.');
      throw error;
    }
  }, []);

  const markSubmissionRead = useCallback(async (id, isRead) => {
    let snapshot = [];
    setSubmissions((prev) => {
      snapshot = prev;
      return prev.map((item) => (item.id === id ? { ...item, is_read: isRead } : item));
    });

    try {
      await updateContactById(id, { is_read: isRead });
      toast.success(isRead ? 'Marked as read.' : 'Marked as unread.');
    } catch (error) {
      setSubmissions(snapshot);
      toast.error(error.message || 'Failed to update status.');
      throw error;
    }
  }, []);

  const unreadSubmissions = submissions.filter((item) => !item.is_read).length;

  const value = useMemo(
    () => ({
      projects,
      skills,
      submissions,
      highlightedProjectIds,
      highlightedSkillIds,
      highlightedSubmissionIds,
      unreadSubmissions,
      loading,
      adminSession,
      authLoading,
      loadAll,
      loginAdmin,
      logoutAdmin,
      addProject,
      updateProject,
      deleteProject,
      addSkill,
      updateSkill,
      deleteSkill,
      addSubmission,
      deleteSubmission,
      markSubmissionRead,
    }),
    [
      projects,
      skills,
      submissions,
      highlightedProjectIds,
      highlightedSkillIds,
      highlightedSubmissionIds,
      unreadSubmissions,
      loading,
      adminSession,
      authLoading,
      loadAll,
      loginAdmin,
      logoutAdmin,
      addProject,
      updateProject,
      deleteProject,
      addSkill,
      updateSkill,
      deleteSkill,
      addSubmission,
      deleteSubmission,
      markSubmissionRead,
    ]
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
