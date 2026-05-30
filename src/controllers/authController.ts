import { Request, Response } from 'express';
import { supabase, getAuthClient } from '../config/supabase';

export const signUp = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: data.user.id, username: username.toLowerCase() }
    ]);
    if (profileError) return res.status(400).json({ error: profileError.message });
  }
  
  res.status(200).json(data);
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const signOut = async (req: Request, res: Response) => {
  // O token vem no Header. Precisamos do client autenticado.
  const token = req.token;
  if (!token) return res.status(401).json({ error: 'Token missing' });
  
  const authClient = getAuthClient(token);
  const { error } = await authClient.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Signed out successfully' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5173/', // URL do Frontend
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Password reset email sent' });
};

export const getSession = async (req: Request, res: Response) => {
  const token = req.token;
  if (!token) return res.status(401).json({ error: 'Token missing' });
  
  const authClient = getAuthClient(token);
  const { data, error } = await authClient.auth.getUser();
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ user: data.user });
};

export const checkUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .maybeSingle();
    
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ available: !data });
};

export const updatePassword = async (req: Request, res: Response) => {
  const token = req.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const authClient = getAuthClient(token);
  const { password } = req.body;

  const { data, error } = await authClient.auth.updateUser({ password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'Password updated successfully' });
};
