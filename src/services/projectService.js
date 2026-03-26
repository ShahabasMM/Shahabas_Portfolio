import { supabase } from '../lib/supabaseClient';

const PROJECTS_TABLE = 'projects';
const STORAGE_BUCKET = 'project-files';

export const mapProjectRecord = (record) => ({
  id: record.id,
  title: record.title,
  description: record.description,
  tags: record.tech_stack || [],
  github: record.github_url || '#',
  demo: record.live_url || '#',
  status: record.status || 'not_started',
  fileUrl: record.attachment_url || '',
  createdAt: record.created_at,
});

const toDbPayload = (project) => ({
  title: project.title,
  description: project.description,
  tech_stack: project.tags || [],
  github_url: project.github || '',
  live_url: project.demo || '',
  status: project.status || 'not_started',
  attachment_url: project.fileUrl || null,
});

const buildStoragePath = (fileName) => `files/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;

export const uploadProjectAttachment = async (file) => {
  const storagePath = buildStoragePath(file.name);
  const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, file, {
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
  return publicData.publicUrl;
};

export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapProjectRecord);
};

export const createProject = async (payload) => {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .insert(toDbPayload(payload))
    .select()
    .single();
  if (error) throw error;
  return mapProjectRecord(data);
};

export const updateProjectById = async (id, payload) => {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .update(toDbPayload(payload))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapProjectRecord(data);
};

export const deleteProjectById = async (id) => {
  const { error } = await supabase.from(PROJECTS_TABLE).delete().eq('id', id);
  if (error) throw error;
};
