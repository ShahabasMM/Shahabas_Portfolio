import { supabase } from '../lib/supabaseClient';

const SKILLS_TABLE = 'skills';

export const fetchSkills = async () => {
  const { data, error } = await supabase.from(SKILLS_TABLE).select('*').order('category').order('name');
  if (error) throw error;
  return data || [];
};

export const createSkill = async (payload) => {
  const { data, error } = await supabase.from(SKILLS_TABLE).insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateSkillById = async (id, payload) => {
  const { data, error } = await supabase.from(SKILLS_TABLE).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteSkillById = async (id) => {
  const { error } = await supabase.from(SKILLS_TABLE).delete().eq('id', id);
  if (error) throw error;
};
