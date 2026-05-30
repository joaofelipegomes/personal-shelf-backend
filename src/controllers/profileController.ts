import { Request, Response } from 'express';
import { getAuthClient } from '../config/supabase';

export const getProfile = async (req: Request, res: Response) => {
  const authClient = getAuthClient(req.token!);
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return res.status(401).json({ error: 'User not found' });

  const { data, error } = await authClient.from('profiles').select('*').eq('id', user.id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const updateProfile = async (req: Request, res: Response) => {
  const authClient = getAuthClient(req.token!);
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) return res.status(401).json({ error: 'User not found' });

  const { data, error } = await authClient.from('profiles').update(req.body).eq('id', user.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteAccount = async (req: Request, res: Response) => {
  const authClient = getAuthClient(req.token!);
  const { error } = await authClient.rpc('delete_user_account');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Account deleted' });
};
