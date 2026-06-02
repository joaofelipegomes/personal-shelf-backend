"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.updateProfile = exports.getProfile = void 0;
const supabase_1 = require("../config/supabase");
const getProfile = async (req, res) => {
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const user = req.user;
    const { data, error } = await authClient.from('profiles').select('*').eq('id', user.id).single();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const user = req.user;
    const { data, error } = await authClient.from('profiles').update(req.body).eq('id', user.id).select();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};
exports.updateProfile = updateProfile;
const deleteAccount = async (req, res) => {
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const { error } = await authClient.rpc('delete_user_account');
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Account deleted' });
};
exports.deleteAccount = deleteAccount;
