// Achievements & Badges System
import { Award, Star, MapPin, Compass, BookOpen, Crown, Zap, Globe } from 'lucide-react';

export const ACHIEVEMENTS = [
    {
        id: 'first_quiz',
        title_en: 'Quiz Master Begins',
        title_ar: 'يبدأ سيد الاختبار',
        description_en: 'Complete your first quiz',
        description_ar: 'أكمل أول اختبار لك',
        icon: Award,
        color: '#60A5FA',
        criteria_type: 'quizzes',
        criteria_value: 1,
        rarity: 'common'
    },
    {
        id: 'hundred_xp',
        title_en: 'Starting Scholar',
        title_ar: 'العالم الناشئ',
        description_en: 'Earn 100 XP',
        description_ar: 'اكسب 100 نقطة خبرة',
        icon: Star,
        color: '#FCD34D',
        criteria_type: 'xp',
        criteria_value: 100,
        rarity: 'common'
    },
    {
        id: 'five_locations',
        title_en: 'Regional Traveler',
        title_ar: 'المسافر الإقليمي',
        description_en: 'Visit 5 governorates',
        description_ar: 'زر 5 محافظات',
        icon: MapPin,
        color: '#34D399',
        criteria_type: 'locations',
        criteria_value: 5,
        rarity: 'uncommon'
    },
    {
        id: 'explorer_rank',
        title_en: 'Rank Explorer',
        title_ar: 'مستكشف الرتبة',
        description_en: 'Reach Explorer rank (500 XP)',
        description_ar: 'اصل إلى رتبة المستكشف (500 XP)',
        icon: Compass,
        color: '#60A5FA',
        criteria_type: 'rank',
        criteria_value: 500,
        rarity: 'uncommon'
    },
    {
        id: 'historian_rank',
        title_en: 'Knowledge Keeper',
        title_ar: 'حافظ المعرفة',
        description_en: 'Reach Historian rank (3,500 XP)',
        description_ar: 'اصل إلى رتبة المؤرخ (3,500 XP)',
        icon: BookOpen,
        color: '#F59E0B',
        criteria_type: 'rank',
        criteria_value: 3500,
        rarity: 'rare'
    },
    {
        id: 'archaeologist_rank',
        title_en: 'Ultimate Master',
        title_ar: 'المعلم الأسمى',
        description_en: 'Reach Archaeologist rank (7,500 XP)',
        description_ar: 'اصل إلى رتبة الآثاري (7,500 XP)',
        icon: Crown,
        color: '#D4AF37',
        criteria_type: 'rank',
        criteria_value: 7500,
        rarity: 'legendary'
    },
    {
        id: 'perfect_score',
        title_en: 'Perfect Mind',
        title_ar: 'العقل المثالي',
        description_en: 'Score 100% on a quiz',
        description_ar: 'احصل على 100% في اختبار',
        icon: Zap,
        color: '#FCD34D',
        criteria_type: 'scores',
        criteria_value: 100,
        rarity: 'rare'
    },
    {
        id: 'explorer_badge',
        title_en: 'Egypt Explorer',
        title_ar: 'مستكشف مصر',
        description_en: 'Explore 10 governorates',
        description_ar: 'استكشف 10 محافظات',
        icon: Globe,
        color: '#34D399',
        criteria_type: 'locations',
        criteria_value: 10,
        rarity: 'epic'
    }
];

/**
 * Check if user has unlocked an achievement based on current stats
 */
export const checkAchievementUnlock = (achievement, userStats) => {
    const { total_xp = 0, highest_score = 0, quiz_count = 0, locations_visited = 0 } = userStats;

    switch (achievement.criteria_type) {
        case 'xp':
            return total_xp >= achievement.criteria_value;
        case 'scores':
            return highest_score >= achievement.criteria_value;
        case 'quizzes':
            return quiz_count >= achievement.criteria_value;
        case 'locations':
            return locations_visited >= achievement.criteria_value;
        case 'rank':
            return total_xp >= achievement.criteria_value;
        default:
            return false;
    }
};

/**
 * Get all achievements filtered by rarity
 */
export const getAchievementsByRarity = (rarity = null) => {
    if (!rarity) return ACHIEVEMENTS;
    return ACHIEVEMENTS.filter(a => a.rarity === rarity);
};

/**
 * Calculate achievement progress percentage
 */
export const getAchievementProgress = (achievement, userStats) => {
    const { total_xp = 0, highest_score = 0, quiz_count = 0, locations_visited = 0 } = userStats;
    let current = 0;
    let target = achievement.criteria_value;

    switch (achievement.criteria_type) {
        case 'xp':
            current = total_xp;
            break;
        case 'scores':
            current = highest_score;
            break;
        case 'quizzes':
            current = quiz_count;
            break;
        case 'locations':
            current = locations_visited;
            break;
        case 'rank':
            current = total_xp;
            break;
        default:
            return 0;
    }

    return Math.min(100, Math.max(0, (current / target) * 100));
};
