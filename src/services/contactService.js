import { supabase } from '../lib/supabaseClient';

const CONTACTS_TABLE = 'contacts';

export const fetchContacts = async () => {
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createContact = async (payload) => {
  const { error } = await supabase.from(CONTACTS_TABLE).insert(payload);
  if (error) throw error;
};

export const updateContactById = async (id, payload) => {
  const { data, error } = await supabase
    .from(CONTACTS_TABLE)
    .update(payload)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    throw new Error('Contact status update was not persisted. Check contacts UPDATE RLS policy.');
  }
};

export const deleteContactById = async (id) => {
  const { error } = await supabase.from(CONTACTS_TABLE).delete().eq('id', id);
  if (error) throw error;
};
