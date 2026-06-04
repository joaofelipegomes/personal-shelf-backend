"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.deleteImage = exports.uploadImage = void 0;
const supabase_1 = require("../config/supabase");
const sharp_1 = __importDefault(require("sharp"));
const uploadImage = async (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file uploaded' });
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const file = req.file;
    // Convert standard file extension to .webp
    const fileName = `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '.webp')}`;
    let uploadBuffer = file.buffer;
    let mimeType = file.mimetype;
    // If the file is an image and not a gif, resize to max 400px width and convert to WebP
    if (file.mimetype.startsWith('image/') && !file.mimetype.includes('gif')) {
        try {
            uploadBuffer = await (0, sharp_1.default)(file.buffer)
                .resize({ width: 400, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            mimeType = 'image/webp';
        }
        catch (resizeError) {
            console.error('Error resizing image with sharp, uploading original:', resizeError);
        }
    }
    const { data, error } = await authClient.storage
        .from('shelf-images')
        .upload(fileName, uploadBuffer, {
        contentType: mimeType,
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
const getImage = async (req, res) => {
    const rawPath = req.params.path || req.params[0];
    const imagePath = Array.isArray(rawPath) ? rawPath.join('/') : rawPath;
    const widthStr = req.query.width;
    const width = widthStr ? parseInt(widthStr, 10) : 400; // default to 400px
    if (!imagePath) {
        return res.status(400).json({ error: 'Image path is required' });
    }
    try {
        const adminClient = (0, supabase_1.getAdminClient)();
        // Download using the full relative path (including subfolders)
        const { data, error } = await adminClient.storage
            .from('shelf-images')
            .download(imagePath);
        if (error || !data) {
            console.error(`Error downloading ${imagePath} from Supabase storage:`, error);
            return res.status(404).json({ error: 'Image not found' });
        }
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const extension = imagePath.split('.').pop()?.toLowerCase();
        // Serve non-resizable assets (GIFs, Videos) directly
        if (extension === 'gif' || extension === 'mp4' || extension === 'webm') {
            const mimeTypes = {
                gif: 'image/gif',
                mp4: 'video/mp4',
                webm: 'video/webm',
            };
            res.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
            return res.send(buffer);
        }
        let resizedBuffer = buffer;
        let contentType = 'image/webp';
        try {
            // Resize using sharp
            resizedBuffer = await (0, sharp_1.default)(buffer)
                .resize({ width: width, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
        }
        catch (sharpError) {
            console.error('Error resizing with sharp, returning original:', sharpError);
            const mimeTypes = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                webp: 'image/webp',
            };
            contentType = mimeTypes[extension || ''] || 'image/jpeg';
            resizedBuffer = buffer;
        }
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year in browser
        res.send(resizedBuffer);
    }
    catch (error) {
        console.error('Error in getImage proxy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getImage = getImage;
