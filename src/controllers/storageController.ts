import { Request, Response } from 'express';
import { getAuthClient } from '../config/supabase';

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const authClient = getAuthClient(req.token!);
  const file = req.file;
  const fileName = `${Date.now()}-${file.originalname}`;
  
  const { data, error } = await authClient.storage
    .from('shelf-images')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) return res.status(400).json({ error: error.message });

  const { data: { publicUrl } } = authClient.storage
    .from('shelf-images')
    .getPublicUrl(fileName);

  res.status(200).json({ url: publicUrl, path: fileName });
};

export const deleteImage = async (req: Request, res: Response) => {
  const { path } = req.body;
  if (!path) return res.status(400).json({ error: 'Path is required' });

  const authClient = getAuthClient(req.token!);
  const { error } = await authClient.storage.from('shelf-images').remove([path]);
  
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'Image deleted' });
};
