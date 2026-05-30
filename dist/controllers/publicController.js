"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.searchProfiles = exports.toggleFavorite = exports.toggleLike = exports.getShelfData = exports.getPublicProfile = void 0;
const supabase_1 = require("../config/supabase");
// Obter perfil público pelo username
const getPublicProfile = async (req, res) => {
    const username = req.params.username;
    const adminClient = (0, supabase_1.getAdminClient)();
    const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('id, username, full_name, bg_color, avatar_url')
        .eq('username', username.toLowerCase())
        .single();
    if (profileError)
        return res.status(404).json({ error: 'Profile not found' });
    res.status(200).json(profile);
};
exports.getPublicProfile = getPublicProfile;
// Obter os itens da prateleira de um perfil público e likes e favoritos
const getShelfData = async (req, res) => {
    const username = req.params.username;
    const adminClient = (0, supabase_1.getAdminClient)();
    // 1. Pegar o profile
    const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('id, username, full_name, bg_color, avatar_url')
        .eq('username', username.toLowerCase())
        .single();
    if (profileError || !profile)
        return res.status(404).json({ error: 'Profile not found' });
    // 2. Pegar os itens desse profile
    const { data: shelfItems } = await adminClient
        .from('shelf_items')
        .select('*')
        .eq('user_id', profile.id);
    // 3. Pegar os likes dos itens
    let itemLikes = {};
    if (shelfItems && shelfItems.length > 0) {
        const itemIds = shelfItems.map(i => i.id);
        const { data: allLikes } = await adminClient
            .from('likes')
            .select('item_id')
            .in('item_id', itemIds);
        allLikes?.forEach(l => {
            itemLikes[l.item_id] = (itemLikes[l.item_id] || 0) + 1;
        });
    }
    // 4. Se tiver token, pegar os likes/favoritos do usuário atual logado
    let userLikedItems = [];
    let isFavorited = false;
    let currentUserUsername = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token && token !== 'null' && token !== 'undefined') {
        const authClient = (0, supabase_1.getAuthClient)(token);
        const { data: { user } } = await authClient.auth.getUser();
        if (user) {
            // Likes do user atual
            const { data: likes } = await adminClient
                .from('likes')
                .select('item_id')
                .eq('user_id', user.id);
            if (likes)
                userLikedItems = likes.map(l => l.item_id);
            // Favoritou esse perfil?
            const { data: fav } = await adminClient
                .from('favorites')
                .select('id')
                .eq('user_id', user.id)
                .eq('favorite_profile_id', profile.id)
                .maybeSingle();
            isFavorited = !!fav;
            // Username do user atual
            const { data: me } = await adminClient.from('profiles').select('username').eq('id', user.id).single();
            currentUserUsername = me?.username;
        }
    }
    res.status(200).json({
        profile,
        items: shelfItems?.map(item => ({
            ...item,
            likesCount: itemLikes[item.id] || 0
        })) || [],
        userContext: {
            likedItems: userLikedItems,
            isFavorited,
            currentUserUsername
        }
    });
};
exports.getShelfData = getShelfData;
const toggleLike = async (req, res) => {
    const token = req.token;
    const authClient = (0, supabase_1.getAuthClient)(token);
    const { itemId } = req.body;
    const { data: { user } } = await authClient.auth.getUser();
    if (!user)
        return res.status(401).json({ error: 'Unauthorized' });
    const adminClient = (0, supabase_1.getAdminClient)();
    const { data: existingLike } = await adminClient
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .maybeSingle();
    if (existingLike) {
        await adminClient.from('likes').delete().eq('id', existingLike.id);
        res.json({ liked: false });
    }
    else {
        await adminClient.from('likes').insert([{ user_id: user.id, item_id: itemId }]);
        res.json({ liked: true });
    }
};
exports.toggleLike = toggleLike;
const toggleFavorite = async (req, res) => {
    const token = req.token;
    const authClient = (0, supabase_1.getAuthClient)(token);
    const { profileId } = req.body;
    const { data: { user } } = await authClient.auth.getUser();
    if (!user)
        return res.status(401).json({ error: 'Unauthorized' });
    const adminClient = (0, supabase_1.getAdminClient)();
    const { data: existingFav } = await adminClient
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('favorite_profile_id', profileId)
        .maybeSingle();
    if (existingFav) {
        await adminClient.from('favorites').delete().eq('id', existingFav.id);
        res.json({ favorited: false });
    }
    else {
        await adminClient.from('favorites').insert([{ user_id: user.id, favorite_profile_id: profileId }]);
        res.json({ favorited: true });
    }
};
exports.toggleFavorite = toggleFavorite;
const searchProfiles = async (req, res) => {
    const { q } = req.query;
    const adminClient = (0, supabase_1.getAdminClient)();
    const { data } = await adminClient
        .from('profiles')
        .select('id, username, full_name, avatar_url, bg_color')
        .or(`username.ilike.%${q}%,full_name.ilike.%${q}%`)
        .limit(10);
    res.json(data || []);
};
exports.searchProfiles = searchProfiles;
const getFavorites = async (req, res) => {
    const token = req.token;
    const authClient = (0, supabase_1.getAuthClient)(token);
    const { data: { user } } = await authClient.auth.getUser();
    if (!user)
        return res.status(401).json({ error: 'Unauthorized' });
    const adminClient = (0, supabase_1.getAdminClient)();
    const { data } = await adminClient
        .from('favorites')
        .select(`
      favorite_profile_id,
      profile:profiles!favorites_favorite_profile_id_fkey (
        id, username, full_name, avatar_url, bg_color
      )
    `)
        .eq('user_id', user.id);
    if (data) {
        const formatted = data.map((f) => f.profile).filter(Boolean);
        return res.json(formatted);
    }
    // fallback logic
    const { data: simpleData } = await adminClient
        .from('favorites')
        .select(`
      favorite_profile_id,
      profiles:favorite_profile_id (
        id, username, full_name, avatar_url, bg_color
      )
    `)
        .eq('user_id', user.id);
    if (simpleData) {
        const formatted = simpleData.map((f) => f.profiles).filter(Boolean);
        return res.json(formatted);
    }
    return res.json([]);
};
exports.getFavorites = getFavorites;
