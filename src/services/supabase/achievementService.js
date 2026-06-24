import { supabase } from './client';
import { ACHIEVEMENTS, checkAchievementUnlock } from '../../data/achievements';

/**
 * Achievement Service - Manages badges and achievements
 */

/**
 * Get all achievements with unlock status for user
 */
export const getUserAchievements = async (userId) => {
    try {
        // Get user stats
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('total_xp, highest_score')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        // Get quiz stats
        const { data: quizzes, error: quizError } = await supabase
            .from('quiz_attempts')
            .select('score')
            .eq('user_id', userId);

        if (quizError) throw quizError;

        // Get location progress
        const { data: locations, error: locError } = await supabase
            .from('location_progress')
            .select('location_id')
            .eq('user_id', userId)
            .distinct();

        if (locError) throw locError;

        // Get unlocked achievements
        const { data: unlockedAchievements, error: unlockedError } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', userId);

        if (unlockedError) throw unlockedError;

        const unlockedIds = new Set(unlockedAchievements.map(a => a.achievement_id));

        // Prepare user stats
        const userStats = {
            total_xp: profile.total_xp || 0,
            highest_score: profile.highest_score || 0,
            quiz_count: quizzes.length,
            locations_visited: locations.length
        };

        // Enrich achievements with unlock status
        return ACHIEVEMENTS.map(achievement => ({
            ...achievement,
            unlocked: unlockedIds.has(achievement.id),
            progress: calculateProgress(achievement, userStats)
        }));
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        return ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, progress: 0 }));
    }
};

/**
 * Check and unlock achievements for user
 */
export const checkAndUnlockAchievements = async (userId) => {
    try {
        // Get user stats
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('total_xp, highest_score')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        // Get quiz stats
        const { data: quizzes, error: quizError } = await supabase
            .from('quiz_attempts')
            .select('score')
            .eq('user_id', userId);

        if (quizError) throw quizError;

        // Get location progress
        const { data: locations, error: locError } = await supabase
            .from('location_progress')
            .select('location_id')
            .eq('user_id', userId)
            .distinct();

        if (locError) throw locError;

        // Get already unlocked achievements
        const { data: unlockedAchievements, error: unlockedError } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', userId);

        if (unlockedError) throw unlockedError;

        const unlockedIds = new Set(unlockedAchievements.map(a => a.achievement_id));

        // Prepare user stats
        const userStats = {
            total_xp: profile.total_xp || 0,
            highest_score: profile.highest_score || 0,
            quiz_count: quizzes.length,
            locations_visited: locations.length
        };

        // Check each achievement
        const newUnlocks = [];
        for (const achievement of ACHIEVEMENTS) {
            if (!unlockedIds.has(achievement.id) && checkAchievementUnlock(achievement, userStats)) {
                // Unlock achievement
                const { error: insertError } = await supabase
                    .from('user_achievements')
                    .insert([{
                        user_id: userId,
                        achievement_id: achievement.id,
                        unlocked_at: new Date().toISOString()
                    }]);

                if (!insertError) {
                    newUnlocks.push(achievement);
                }
            }
        }

        return newUnlocks;
    } catch (error) {
        console.error('Error checking achievements:', error);
        return [];
    }
};

/**
 * Calculate progress toward achievement
 */
const calculateProgress = (achievement, userStats) => {
    const { total_xp = 0, highest_score = 0, quiz_count = 0, locations_visited = 0 } = userStats;

    switch (achievement.criteria_type) {
        case 'xp':
            return Math.min(100, (total_xp / achievement.criteria_value) * 100);
        case 'scores':
            return Math.min(100, (highest_score / achievement.criteria_value) * 100);
        case 'quizzes':
            return Math.min(100, (quiz_count / achievement.criteria_value) * 100);
        case 'locations':
            return Math.min(100, (locations_visited / achievement.criteria_value) * 100);
        case 'rank':
            return Math.min(100, (total_xp / achievement.criteria_value) * 100);
        default:
            return 0;
    }
};

/**
 * Get achievement by ID
 */
export const getAchievementById = async (achievementId) => {
    try {
        const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('id', achievementId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching achievement:', error);
        return null;
    }
};

/**
 * Get achievement statistics
 */
export const getAchievementStats = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('user_achievements')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        const unlockedCount = data.length;
        const totalCount = ACHIEVEMENTS.length;
        const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

        return {
            unlocked: unlockedCount,
            total: totalCount,
            completion_percentage: completionPercentage,
            rarity_breakdown: calculateRarityBreakdown(data)
        };
    } catch (error) {
        console.error('Error fetching achievement stats:', error);
        return { unlocked: 0, total: 0, completion_percentage: 0 };
    }
};

/**
 * Calculate rarity breakdown of unlocked achievements
 */
const calculateRarityBreakdown = (unlockedAchievements) => {
    const rarities = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };

    unlockedAchievements.forEach(ua => {
        const achievement = ACHIEVEMENTS.find(a => a.id === ua.achievement_id);
        if (achievement && rarities.hasOwnProperty(achievement.rarity)) {
            rarities[achievement.rarity]++;
        }
    });

    return rarities;
};
