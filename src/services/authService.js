import { assertSupabase } from '../lib/supabaseClient';

export const getSession = async () => {
  const supabase = assertSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const signInAdmin = async ({ email, password }) => {
  const supabase = assertSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
};

export const signOutAdmin = async () => {
  const supabase = assertSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const onAuthStateChanged = (callback) => {
  const supabase = assertSupabase();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return data.subscription;
};
