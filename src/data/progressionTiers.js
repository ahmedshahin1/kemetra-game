// Progression Tiers - Rank system for gamification
export const PROGRESSION_TIERS = [
    {
        id: 'tourist',
        title_en: 'Tourist',
        title_ar: 'سائح',
        description_en: 'Just starting your Egyptian adventure',
        description_ar: 'بدأت للتو مغامرتك المصرية',
        min_xp: 0,
        max_xp: 499,
        icon: 'Compass',
        color: '#9CA3AF',
        next_tier_id: 'explorer'
    },
    {
        id: 'explorer',
        title_en: 'Explorer',
        title_ar: 'مستكشف',
        description_en: 'Discovering Egypt\'s wonders',
        description_ar: 'اكتشاف عجائب مصر',
        min_xp: 500,
        max_xp: 1499,
        icon: 'Map',
        color: '#60A5FA',
        next_tier_id: 'researcher'
    },
    {
        id: 'researcher',
        title_en: 'Researcher',
        title_ar: 'باحث',
        description_en: 'Deep diving into Egyptian history',
        description_ar: 'الغوص العميق في التاريخ المصري',
        min_xp: 1500,
        max_xp: 3499,
        icon: 'BookOpen',
        color: '#34D399',
        next_tier_id: 'historian'
    },
    {
        id: 'historian',
        title_en: 'Historian',
        title_ar: 'المؤرخ',
        description_en: 'Mastering the knowledge of ages',
        description_ar: 'إتقان معرفة العصور',
        min_xp: 3500,
        max_xp: 7499,
        icon: 'ScrollText',
        color: '#F59E0B',
        next_tier_id: 'archaeologist'
    },
    {
        id: 'archaeologist',
        title_en: 'Archaeologist',
        title_ar: 'الآثاري',
        description_en: 'Ultimate keeper of Egyptian heritage',
        description_ar: 'الحارس الأسمى للتراث المصري',
        min_xp: 7500,
        max_xp: null,
        icon: 'Gem',
        color: '#D4AF37',
        next_tier_id: null
    }
];

export const getCurrentTier = (xp) => {
    for (let i = PROGRESSION_TIERS.length - 1; i >= 0; i--) {
        if (xp >= PROGRESSION_TIERS[i].min_xp) {
            return PROGRESSION_TIERS[i];
        }
    }
    return PROGRESSION_TIERS[0];
};

export const getNextTier = (xp) => {
    const current = getCurrentTier(xp);
    if (!current.next_tier_id) return null;
    return PROGRESSION_TIERS.find(t => t.id === current.next_tier_id);
};

export const getTierById = (id) => {
    return PROGRESSION_TIERS.find(t => t.id === id);
};

export const getProgressToNextTier = (xp) => {
    const current = getCurrentTier(xp);
    const next = getNextTier(xp);
    
    if (!next) return 100; // Max tier
    
    const currentXpInTier = xp - current.min_xp;
    const tierWidth = next.min_xp - current.min_xp;
    
    return Math.min(100, Math.max(0, (currentXpInTier / tierWidth) * 100));
};

export const calculateXpForNextLevel = (xp) => {
    const next = getNextTier(xp);
    return next ? next.min_xp : null;
};
