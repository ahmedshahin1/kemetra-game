import { supabase } from './client';

/**
 * Journey Service - Manages user journeys and progression
 */

/**
 * Create a new journey for the user
 */
export const createJourney = async (userId, title, description = '') => {
    try {
        // First, mark any existing active journey as inactive
        await supabase
            .from('journeys')
            .update({ is_active: false })
            .eq('user_id', userId)
            .eq('is_active', true);

        // Create new journey
        const { data, error } = await supabase
            .from('journeys')
            .insert([{
                user_id: userId,
                title,
                description,
                tier_id: 'tourist',
                is_active: true
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating journey:', error);
        throw error;
    }
};

/**
 * Get active journey for user
 */
export const getActiveJourney = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('journeys')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single();

        if (error && error.code === 'PGRST116') {
            return null; // No active journey
        }
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error getting active journey:', error);
        return null;
    }
};

/**
 * Get all journeys for user
 */
export const getUserJourneys = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('journeys')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching journeys:', error);
        return [];
    }
};

/**
 * Update journey tier
 */
export const updateJourneyTier = async (journeyId, newTierId) => {
    try {
        const { data, error } = await supabase
            .from('journeys')
            .update({ tier_id: newTierId })
            .eq('id', journeyId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating journey tier:', error);
        throw error;
    }
};

/**
 * Complete a journey
 */
export const completeJourney = async (journeyId) => {
    try {
        const { data, error } = await supabase
            .from('journeys')
            .update({
                is_active: false,
                completed_at: new Date().toISOString()
            })
            .eq('id', journeyId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error completing journey:', error);
        throw error;
    }
};

/**
 * Get journey statistics
 */
export const getJourneyStats = async (journeyId) => {
    try {
        const { data: quizzes, error: quizError } = await supabase
            .from('quiz_attempts')
            .select('score, xp_earned')
            .eq('journey_id', journeyId);

        if (quizError) throw quizError;

        const totalScore = quizzes.reduce((sum, q) => sum + (q.score || 0), 0);
        const totalXp = quizzes.reduce((sum, q) => sum + (q.xp_earned || 0), 0);

        return {
            quiz_count: quizzes.length,
            total_score: totalScore,
            total_xp: totalXp,
            average_score: quizzes.length > 0 ? totalScore / quizzes.length : 0
        };
    } catch (error) {
        console.error('Error fetching journey stats:', error);
        return { quiz_count: 0, total_score: 0, total_xp: 0, average_score: 0 };
    }
};
