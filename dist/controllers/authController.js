"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.checkUsername = exports.getSession = exports.resetPassword = exports.signOut = exports.refreshToken = exports.signIn = exports.signUp = void 0;
const supabase_1 = require("../config/supabase");
const signUp = async (req, res) => {
    const { email, password, username } = req.body;
    const { data, error } = await supabase_1.supabase.auth.signUp({ email, password });
    if (error)
        return res.status(400).json({ error: error.message });
    if (data.user) {
        const { error: profileError } = await supabase_1.supabase.from('profiles').insert([
            { id: data.user.id, username: username.toLowerCase() }
        ]);
        if (profileError)
            return res.status(400).json({ error: profileError.message });
    }
    res.status(200).json(data);
};
exports.signUp = signUp;
const signIn = async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase_1.supabase.auth.signInWithPassword({ email, password });
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};
exports.signIn = signIn;
const refreshToken = async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token)
        return res.status(400).json({ error: 'Refresh token is required' });
    const { data, error } = await supabase_1.supabase.auth.refreshSession({ refresh_token });
    if (error)
        return res.status(401).json({ error: error.message });
    res.status(200).json(data);
};
exports.refreshToken = refreshToken;
const signOut = async (req, res) => {
    // O token vem no Header. Precisamos do client autenticado.
    const token = req.token;
    if (!token)
        return res.status(401).json({ error: 'Token missing' });
    const authClient = (0, supabase_1.getAuthClient)(token);
    const { error } = await authClient.auth.signOut();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Signed out successfully' });
};
exports.signOut = signOut;
const resetPassword = async (req, res) => {
    const { email } = req.body;
    const { error } = await supabase_1.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://colagem.app/', // URL do Frontend
    });
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Password reset email sent' });
};
exports.resetPassword = resetPassword;
const getSession = async (req, res) => {
    const token = req.token;
    if (!token)
        return res.status(401).json({ error: 'Token missing' });
    const authClient = (0, supabase_1.getAuthClient)(token);
    const { data, error } = await authClient.auth.getUser();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json({ user: data.user });
};
exports.getSession = getSession;
const checkUsername = async (req, res) => {
    const username = req.params.username;
    const { data, error } = await supabase_1.supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json({ available: !data });
};
exports.checkUsername = checkUsername;
const updatePassword = async (req, res) => {
    const token = req.token;
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    const authClient = (0, supabase_1.getAuthClient)(token);
    const { password } = req.body;
    const { data, error } = await authClient.auth.updateUser({ password });
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ message: 'Password updated successfully' });
};
exports.updatePassword = updatePassword;
