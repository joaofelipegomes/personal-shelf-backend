import { Request, Response } from 'express';
import { getAuthClient } from '../config/supabase';

export const getItems = async (req: Request, res: Response) => {
  const authClient = getAuthClient(req.token!);
  const { data, error } = await authClient.from('shelf_items').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const createItem = async (req: Request, res: Response) => {
  const authClient = getAuthClient(req.token!);
  const { data, error } = await authClient.from('shelf_items').insert([req.body]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const updateItem = async (req: Request, res: Response) => {
  const authClient = getAuthClient(req.token!);
  const { id } = req.params;
  const { data, error } = await authClient.from('shelf_items').update(req.body).eq('id', id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
};

export const deleteItem = async (req: Request, res: Response) => {
  const authClient = getAuthClient(req.token!);
  const { id } = req.params;
  const { error } = await authClient.from('shelf_items').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Deleted successfully' });
};
