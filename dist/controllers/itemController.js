"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.getItems = void 0;
const supabase_1 = require("../config/supabase");
const getItems = async (req, res) => {
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const { data, error } = await authClient.from('shelf_items').select('*');
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};
exports.getItems = getItems;
const createItem = async (req, res) => {
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const { data, error } = await authClient.from('shelf_items').insert([req.body]).select();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};
exports.createItem = createItem;
const updateItem = async (req, res) => {
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const { id } = req.params;
    const { data, error } = await authClient.from('shelf_items').update(req.body).eq('id', id).select();
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    const authClient = (0, supabase_1.getAuthClient)(req.token);
    const { id } = req.params;
    const { error } = await authClient.from('shelf_items').delete().eq('id', id);
    if (error)
        return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Deleted successfully' });
};
exports.deleteItem = deleteItem;
