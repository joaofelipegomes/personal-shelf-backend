"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const supabase_1 = require("../config/supabase");
const uploadImage = async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file uploaded' });
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await authClient.storage
        .from('shelf-images')
        .upload(fileName, file.buffer, {
        contentType: file.mimetype,
    });
    if (error)
        return res.status(400).json({ error: error.message });
    const { data: { publicUrl } } = authClient.storage
        .from('shelf-images')
        .getPublicUrl(fileName);
    res.status(200).json({ url: publicUrl, path: fileName });
};
exports.uploadImage = uploadImage;
const deleteImage = async (req, res) => {
    const { path } = req.body;
    if (!path)
        return res.status(400).json({ error: 'Path is required' });
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const { error } = await authClient.storage.from('shelf-images').remove([path]);
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Image deleted' });
};
exports.deleteImage = deleteImage;
