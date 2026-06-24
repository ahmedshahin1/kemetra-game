import { supabase } from './client';
import { getCurrentTier, getNextTier } from '../../data/progressionTiers';

/**
 * Progression Service - Manages user progression and XP
 */

/**
 * Record a quiz attempt and award XP
 */
export const recordQuizAttempt = async (userId, quizData) => {
    try {
        const {
            governorate_id,
            score,
            questions_answered,
            correct_answers,
            time_taken_seconds = 0,
            mode = 'casual',
            difficulty_level = 1
        } = quizData;

        // Calculate XP based on score and difficulty
        const xp_earned = Math.ceil((score / 100) * difficulty_level * 10);

        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert([{
                user_id: userId,
                governorate_id,
                score,
                questions_answered,
                correct_answers,
                time_taken_seconds,
                xp_earned,
                mode,
                difficulty_level,
                completed_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // Update user profile with new XP
        await updateUserXP(userId, xp_earned);

        return data;
    } catch (error) {
        console.error('Error recording quiz attempt:', error);
        throw error;
    }
};

/**
 * Update user XP and tier
 */
export const updateUserXP = async (userId, xpGain) => {
    try {
        // Get current profile
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('total_xp, level')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const newXp = (profile.total_xp || 0) + xpGain;
        const currentTier = getCurrentTier(newXp);
        const newLevel = parseInt(currentTier.id.match(/\d+/)?.[0] || '1');

        // Update profile
        const { data, error } = await supabase
            .from('profiles')
            .update({
                total_xp: newXp,
                level: newLevel,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating user XP:', error);
        throw error;
    }
};

/**
 * Get user progression stats
 */
export const getUserProgressionStats = async (userId) => {
    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('total_xp, level')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const totalXp = profile.total_xp || 0;
        const currentTier = getCurrentTier(totalXp);
        const nextTier = getNextTier(totalXp);

        // Calculate progress to next tier
        let progressPercentage = 100;
        let xpToNextTier = 0;
        if (nextTier) {
            xpToNextTier = nextTier.min_xp - totalXp;
            const tierWidth = nextTier.min_xp - currentTier.min_xp;
            const currentProgress = totalXp - currentTier.min_xp;
            progressPercentage = Math.min(100, Math.max(0, (currentProgress / tierWidth) * 100));
        }

        return {
            total_xp: totalXp,
            level: profile.level,
            current_tier: currentTier,
            next_tier: nextTier,
            progress_to_next_tier: progressPercentage,
            xp_to_next_tier: xpToNextTier
        };
    } catch (error) {
        console.error('Error fetching progression stats:', error);
        return null;
    }
};

/**
 * Track location visit
 */
export const trackLocationVisit = async (userId, locationId, governorateId, timeSpent = 0) => {
    try {
        // Check if location progress exists
        const { data: existing, error: existingError } = await supabase
            .from('location_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('location_id', locationId)
            .single();

        let result;
        if (existing) {
            // Update existing record
            const { data, error } = await supabase
                .from('location_progress')
                .update({
                    visited_count: (existing.visited_count || 0) + 1,
                    completion_percentage: Math.min(100, (existing.visited_count + 1) * 25), // 25% per visit
                    last_visited: new Date().toISOString(),
                    time_spent_seconds: (existing.time_spent_seconds || 0) + timeSpent
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Create new record
            const { data, error } = await supabase
                .from('location_progress')
                .insert([{
                    user_id: userId,
                    location_id: locationId,
                    governorate_id: governorateId,
                    visited_count: 1,
                    completion_percentage: 25,
                    last_visited: new Date().toISOString(),
                    time_spent_seconds: timeSpent
                }])
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return result;
    } catch (error) {
        console.error('Error tracking location visit:', error);
        throw error;
    }
};

/**
 * Get location progress for user
 */
export const getUserLocationProgress = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('location_progress')
            .select('*')
            .eq('user_id', userId)
            .order('last_visited', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching location progress:', error);
        return [];
    }
};
