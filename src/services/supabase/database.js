import { supabase } from './client';

// ─── Local Fallback Helpers ──────────────────────────────────────────────────
const getLocalProfile = (userId) => {
    try {
        const cached = localStorage.getItem(`kemetra_profile_${userId}`);
        if (cached) return JSON.parse(cached);
    } catch (e) {
        console.error("Local storage error:", e);
    }
    return {
        id: userId,
        username: 'Explorer_' + userId.substring(0, 8),
        total_xp: 0,
        level: 1,
        highest_score: 0
    };
};

const saveLocalProfile = (userId, profile) => {
    try {
        localStorage.setItem(`kemetra_profile_${userId}`, JSON.stringify(profile));
    } catch (e) {
        console.error("Local storage save error:", e);
    }
};

const saveLocalScore = (userId, score, mode, region) => {
    try {
        const scoresKey = `kemetra_scores_${userId}`;
        const existing = JSON.parse(localStorage.getItem(scoresKey) || '[]');
        existing.push({
            player_id: userId,
            score,
            mode,
            region,
            created_at: new Date().toISOString()
        });
        localStorage.setItem(scoresKey, JSON.stringify(existing));
    } catch (e) {
        console.error("Local storage score save error:", e);
    }
};

const DUMMY_LEADERBOARD = [
    { username: 'Ramses II', level: 42, total_xp: 45000, highest_score: 9500 },
    { username: 'Cleopatra VII', level: 38, total_xp: 38500, highest_score: 8900 },
    { username: 'Hatshepsut', level: 35, total_xp: 32000, highest_score: 8200 },
    { username: 'Tutankhamun', level: 25, total_xp: 19500, highest_score: 6500 },
    { username: 'Imhotep', level: 20, total_xp: 15000, highest_score: 5500 },
];


/**
 * Ensures a profile exists for an authenticated user
 */
export const ensureProfileExists = async (userId) => {
    try {
        // Check if profile already exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (existingProfile) return existingProfile;

        // If profile doesn't exist, create one
        if (fetchError && fetchError.code === 'PGRST116') {
            // PGRST116 = no rows found
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{ id: userId, username: 'Explorer_' + userId.substring(0, 8) }])
                .select()
                .single();

            if (insertError) throw insertError;
            return newProfile;
        }

        if (fetchError) throw fetchError;
        return existingProfile;
    } catch (error) {
        console.error('Error ensuring profile exists:', error);
        return null;
    }
};

/**
 * Fetches user profile with a robust localStorage fallback
 */
export const fetchUserProfile = async (userId) => {
    try {
        // Try DB first
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        
        if (data) {
            // Cache locally
            saveLocalProfile(userId, data);
            return data;
        }
    } catch (err) {
        console.warn("Database profile fetch failed. Using local fallback. Error:", err.message || err);
    }
    
    // Fallback to localStorage
    return getLocalProfile(userId);
};

/**
 * Saves a player's score and updates their XP/Level
 */
export const saveGameScore = async (userId, score, mode = 'casual', region = 'Egypt') => {
    const xpGain = score; // 1:1 score-to-XP conversion for better progression feel
    try {
        // 0. Ensure a profile row exists (handles anonymous users & new signups)
        const profileExists = await ensureProfileExists(userId);
        if (!profileExists) {
            throw new Error("Profiles table is missing or inaccessible in database schema");
        }

        // 1. Insert score record
        const { error: scoreError } = await supabase
            .from('scores')
            .insert([{ player_id: userId, score, mode, region }]);

        if (scoreError) throw scoreError;

        // 2. Fetch current profile
        const { data: profile, error: profileFetchError } = await supabase
            .from('profiles')
            .select('total_xp, level, highest_score')
            .eq('id', userId)
            .single();

        if (profileFetchError) throw profileFetchError;

        const newXp = (profile.total_xp || 0) + xpGain;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        const newHighestScore = Math.max(profile.highest_score || 0, score);

        // 3. Update XP, level and highest score
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                total_xp: newXp,
                level: newLevel,
                highest_score: newHighestScore,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        // Cache locally for offline/fallback access
        const updatedProfile = { id: userId, total_xp: newXp, level: newLevel, highest_score: newHighestScore };
        saveLocalProfile(userId, updatedProfile);

        return { success: true, xpGain, newLevel, newXp, savedLocally: false };
    } catch (error) {
        console.warn('Database save failed, using local storage fallback:', error.message || error);
        
        // Local storage fallback
        const localProfile = getLocalProfile(userId);
        const newXp = (localProfile.total_xp || 0) + xpGain;
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        const newHighestScore = Math.max(localProfile.highest_score || 0, score);
        
        const updatedProfile = {
            ...localProfile,
            total_xp: newXp,
            level: newLevel,
            highest_score: newHighestScore
        };
        
        saveLocalProfile(userId, updatedProfile);
        saveLocalScore(userId, score, mode, region);

        return { success: true, xpGain, newLevel, newXp, savedLocally: true };
    }
};

/**
 * Fetches the global leaderboard entries from the source 'scores' table
 */
export const getLeaderboard = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('scores')
            .select(`
                score,
                player_id,
                profiles (
                    username,
                    level,
                    total_xp,
                    avatar_url
                )
            `)
            .order('score', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // Group by player to show each player's personal best only
        const uniquePlayers = [];
        const seenPlayers = new Set();

        for (const item of data) {
            if (!seenPlayers.has(item.player_id)) {
                seenPlayers.add(item.player_id);
                uniquePlayers.push({
                    username: item.profiles?.username || 'Unknown Explorer',
                    level: item.profiles?.level || 1,
                    total_xp: item.profiles?.total_xp || 0,
                    avatar_url: item.profiles?.avatar_url,
                    highest_score: item.score
                });
            }
        }

        return uniquePlayers;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return DUMMY_LEADERBOARD.slice(0, limit);
    }
};

/**
 * Anonymous Login for quick play
 */
export const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data;
};
