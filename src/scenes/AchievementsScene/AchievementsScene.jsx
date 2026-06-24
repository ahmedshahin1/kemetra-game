import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Award, Star, Shield, Zap, Trophy,
    Flame, BookOpen, Compass, Crown, Lock, CheckCircle2, Loader2
} from 'lucide-react';
import { supabase } from '../../services/supabase/client';
import { fetchUserProfile } from '../../services/supabase/database';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import SandParticles from '../../components/ui/SandParticles';

// ─── Static Badge & Rank definitions ────────────────────────────────────────

const RANKS = [
    { id: 'initiate',   minXp: 0,     title_en: 'Initiate',     title_ar: 'مبتدئ',        color: '#9CA3AF', icon: Star },
    { id: 'scribe',     minXp: 500,   title_en: 'Scribe',       title_ar: 'كاتب',         color: '#60A5FA', icon: BookOpen },
    { id: 'guardian',   minXp: 1500,  title_en: 'Guardian',     title_ar: 'حارس',         color: '#34D399', icon: Shield },
    { id: 'explorer',   minXp: 3000,  title_en: 'Explorer',     title_ar: 'مستكشف',       color: '#F59E0B', icon: Compass },
    { id: 'pharaoh',    minXp: 6000,  title_en: 'Pharaoh',      title_ar: 'فرعون',        color: '#D4AF37', icon: Crown },
    { id: 'legend',     minXp: 12000, title_en: 'Legend of Nile', title_ar: 'أسطورة النيل', color: '#F97316', icon: Flame },
];

const BADGES = [
    { id: 'first_quest',   icon: Star,     color: '#D4AF37', title_en: 'First Steps',     title_ar: 'الخطوة الأولى',    desc_en: 'Complete your first quiz',              desc_ar: 'أكمل أول اختبار لك',                xpRequired: 0,    scoreRequired: 1 },
    { id: 'century',       icon: Trophy,   color: '#F59E0B', title_en: 'Centurion',        title_ar: 'المئوي',           desc_en: 'Score 100+ in a single quiz',           desc_ar: 'احصل على 100+ في اختبار واحد',      xpRequired: 0,    scoreRequired: 100 },
    { id: 'fire_streak',   icon: Flame,    color: '#EF4444', title_en: 'On Fire',          title_ar: 'مشتعل',            desc_en: 'Score 500+ in a single quiz',           desc_ar: 'احصل على 500+ في اختبار واحد',      xpRequired: 0,    scoreRequired: 500 },
    { id: 'scholar',       icon: BookOpen, color: '#60A5FA', title_en: 'Scholar',          title_ar: 'عالِم',             desc_en: 'Reach 1,500 total XP',                 desc_ar: 'احصل على 1500 نقطة خبرة إجمالية',  xpRequired: 1500, scoreRequired: 0 },
    { id: 'guardian_b',    icon: Shield,   color: '#34D399', title_en: 'Guardian',         title_ar: 'الحارس',           desc_en: 'Reach Guardian rank (3,000 XP)',        desc_ar: 'ابلغ رتبة الحارس (3000 XP)',        xpRequired: 3000, scoreRequired: 0 },
    { id: 'nile_legend',   icon: Crown,    color: '#D97706', title_en: 'Nile Legend',      title_ar: 'أسطورة النيل',    desc_en: 'Reach Pharaoh rank (6,000 XP)',         desc_ar: 'ابلغ رتبة الفرعون (6000 XP)',       xpRequired: 6000, scoreRequired: 0 },
    { id: 'explorer_b',    icon: Compass,  color: '#8B5CF6', title_en: 'True Explorer',    title_ar: 'المستكشف الحقيقي', desc_en: 'Score 1,000+ in a single quiz',         desc_ar: 'احصل على 1000+ في اختبار واحد',    xpRequired: 0,    scoreRequired: 1000 },
    { id: 'lightning',     icon: Zap,      color: '#FCD34D', title_en: 'Lightning Mind',   title_ar: 'العقل البرقي',     desc_en: 'Reach 12,000 total XP',                desc_ar: 'احصل على 12000 نقطة خبرة إجمالية', xpRequired: 12000, scoreRequired: 0 },
];

function getCurrentRank(xp) {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.minXp) rank = r;
        else break;
    }
    return rank;
}

function getNextRank(xp) {
    return RANKS.find(r => r.minXp > xp) || null;
}

// ─── Badge Card ──────────────────────────────────────────────────────────────
const BadgeCard = ({ badge, unlocked, language, index }) => {
    const Icon = badge.icon;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 * index }}
            className={`
                relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl border text-center
                transition-all duration-300
                ${unlocked
                    ? 'border-egypt-gold/30 bg-egypt-night-light/40'
                    : 'border-egypt-gold/10 bg-egypt-night/30 opacity-50 grayscale'
                }
            `}
        >
            {/* Icon circle */}
            <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2"
                style={{
                    borderColor: unlocked ? badge.color : 'rgba(212,175,55,0.15)',
                    background: unlocked ? `${badge.color}18` : 'rgba(10,10,20,0.5)',
                    boxShadow: unlocked ? `0 0 20px ${badge.color}30` : 'none',
                }}
            >
                {unlocked
                    ? <Icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: badge.color }} />
                    : <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-egypt-gold/20" />
                }
            </div>

            <div>
                <span className="block font-egyptian text-xs sm:text-sm uppercase tracking-widest text-egypt-gold leading-tight">
                    {language === 'ar' ? badge.title_ar : badge.title_en}
                </span>
                <span className="block font-modern text-[10px] sm:text-xs text-egypt-papyrus/50 mt-1 leading-snug">
                    {language === 'ar' ? badge.desc_ar : badge.desc_en}
                </span>
            </div>

            {unlocked && (
                <CheckCircle2 className="absolute top-2 right-2 sm:top-3 sm:right-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
            )}
        </motion.div>
    );
};

// ─── Rank Row ─────────────────────────────────────────────────────────────────
const RankRow = ({ rank, current, xp, language, index }) => {
    const Icon = rank.icon;
    const isReached = xp >= rank.minXp;
    const isCurrent = current.id === rank.id;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.04 * index }}
            className={`
                flex items-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-xl border transition-all
                ${isCurrent
                    ? 'border-egypt-gold/50 bg-egypt-gold/8'
                    : isReached
                        ? 'border-egypt-gold/15 bg-egypt-night-light/20'
                        : 'border-egypt-gold/8 bg-transparent opacity-45'
                }
            `}
            style={isCurrent ? { boxShadow: `0 0 20px ${rank.color}18` } : {}}
        >
            {/* Icon */}
            <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex-shrink-0 flex items-center justify-center border"
                style={{
                    borderColor: isReached ? rank.color : 'rgba(212,175,55,0.12)',
                    background: isReached ? `${rank.color}18` : 'transparent',
                }}
            >
                <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" style={{ color: isReached ? rank.color : '#4B5563' }} />
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                    <span className="font-egyptian text-xs sm:text-sm uppercase tracking-widest truncate" style={{ color: isReached ? rank.color : '#6B7280' }}>
                        {language === 'ar' ? rank.title_ar : rank.title_en}
                    </span>
                    {isCurrent && (
                        <span className="text-[8px] sm:text-[9px] font-egyptian tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-egypt-gold/20 text-egypt-gold flex-shrink-0">
                            {language === 'ar' ? 'رتبتك الحالية' : 'Current'}
                        </span>
                    )}
                </div>
                <span className="block font-modern text-[10px] sm:text-xs text-egypt-papyrus/40 mt-0.5">
                    {rank.minXp.toLocaleString()} XP {language === 'ar' ? 'مطلوبة' : 'required'}
                </span>
            </div>

            {isReached ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
            ) : (
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-egypt-gold/20 flex-shrink-0" />
            )}
        </motion.div>
    );
};

// ─── Achievements Scene ───────────────────────────────────────────────────────
const AchievementsScene = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { playSound } = useAudio();
    const [tab, setTab] = useState('badges'); // 'badges' | 'ranks'
    const [profile, setProfile] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) { 
                    setIsGuest(true);
                    setProfile({ total_xp: 0, level: 1, highest_score: 0, username: 'Guest' });
                    return; 
                }

                setIsGuest(session.user.is_anonymous);
                const userProfile = await fetchUserProfile(session.user.id);
                setProfile(userProfile);
            } catch (err) {
                console.error("Error loading achievements profile:", err);
                setProfile({ total_xp: 0, level: 1, highest_score: 0, username: 'Explorer' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const xp = profile?.total_xp || 0;
    const highScore = profile?.highest_score || 0;
    const currentRank = getCurrentRank(xp);
    const nextRank = getNextRank(xp);
    const progressPct = nextRank
        ? Math.min(100, ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100)
        : 100;

    const isBadgeUnlocked = (badge) => {
        if (badge.xpRequired > 0 && xp < badge.xpRequired) return false;
        if (badge.scoreRequired > 0 && highScore < badge.scoreRequired) return false;
        return xp > 0 || highScore > 0; // needs at least one play
    };

    const unlockedCount = BADGES.filter(isBadgeUnlocked).length;

    return (
        <div
            className="relative w-full h-screen overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 20% 40%, rgba(12,10,5,1) 0%, rgba(5,5,15,1) 100%)' }}
        >
            <SandParticles />

            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => { playSound('click'); navigate('/'); }}
                className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30 flex items-center gap-2 text-egypt-gold/60 hover:text-egypt-gold transition-colors font-egyptian text-xs sm:text-sm tracking-widest uppercase"
            >
                <ArrowLeft className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                {language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
            </motion.button>

            <div className="relative z-10 h-full overflow-y-auto py-12 sm:py-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto mt-6 sm:mt-0">

                    {/* ── Header ── */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-egypt-gold/30 bg-egypt-gold/8 mb-4">
                            <Award className="w-10 h-10 text-egypt-gold" />
                        </div>
                        <h1 className="text-4xl font-egyptian text-egypt-gold tracking-[0.2em] uppercase glow-text">
                            {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                        </h1>
                        <p className="text-egypt-papyrus/50 font-modern text-sm mt-2">
                            {language === 'ar' ? 'شاراتك ورتبتك في رحلة كميترا' : 'Your badges & rank in the Kemetra journey'}
                        </p>
                    </motion.div>

                    {/* ── XP / Rank progress card ── */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-egypt-gold animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* ── Guest Warning Banner ── */}
                            {isGuest && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-6 rounded-xl border border-egypt-gold/20 bg-egypt-gold/5 text-center sm:text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-egypt-gold flex-shrink-0" />
                                        <p className="text-egypt-papyrus/80 font-modern text-xs sm:text-sm">
                                            {language === 'ar' 
                                                ? 'أنت تلعب كضيف. أنشئ حسابًا لحفظ إنجازاتك بشكل دائم!' 
                                                : 'Playing as guest. Create an account to permanently save your achievements!'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { playSound('click'); navigate('/'); }}
                                        className="px-4 py-1.5 rounded-lg bg-egypt-gold text-egypt-night hover:bg-egypt-gold/85 text-xs font-egyptian tracking-widest uppercase transition-colors flex-shrink-0"
                                    >
                                        {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                                    </button>
                                </motion.div>
                            )}

                            {/* ── XP / Rank progress card ── */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-egypt-gold/25 p-5 sm:p-7 mb-8 relative overflow-hidden"
                                style={{ background: 'rgba(10,10,20,0.6)', backdropFilter: 'blur(12px)' }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-egypt-gold/40 to-transparent" />
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    {/* Current rank badge */}
                                    <div className="flex items-center gap-4">
                                        {React.createElement(currentRank.icon, {
                                            className: 'w-12 h-12',
                                            style: { color: currentRank.color },
                                        })}
                                        <div>
                                            <span className="block font-modern text-xs text-egypt-papyrus/40 uppercase tracking-widest">
                                                {language === 'ar' ? 'رتبتك الحالية' : 'Current Rank'}
                                            </span>
                                            <span className="block font-egyptian text-2xl" style={{ color: currentRank.color }}>
                                                {language === 'ar' ? currentRank.title_ar : currentRank.title_en}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6 sm:ml-auto w-full sm:w-auto mt-4 sm:mt-0">
                                        <div className="text-center sm:text-right">
                                            <span className="block font-egyptian text-xl sm:text-2xl text-egypt-gold">{xp.toLocaleString()}</span>
                                            <span className="block font-modern text-[10px] sm:text-xs text-egypt-papyrus/40 uppercase tracking-wider mt-0.5">Total XP</span>
                                        </div>
                                        <div className="text-center sm:text-right">
                                            <span className="block font-egyptian text-xl sm:text-2xl text-egypt-gold">{highScore.toLocaleString()}</span>
                                            <span className="block font-modern text-[10px] sm:text-xs text-egypt-papyrus/40 uppercase tracking-wider mt-0.5">Best Score</span>
                                        </div>
                                        <div className="text-center sm:text-right">
                                            <span className="block font-egyptian text-xl sm:text-2xl text-egypt-gold">{unlockedCount}/{BADGES.length}</span>
                                            <span className="block font-modern text-[10px] sm:text-xs text-egypt-papyrus/40 uppercase tracking-wider mt-0.5">Badges</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rank progress bar */}
                                {nextRank && (
                                    <div className="mt-6">
                                        <div className="flex justify-between font-modern text-xs text-egypt-papyrus/40 mb-2">
                                            <span>{language === 'ar' ? currentRank.title_ar : currentRank.title_en}</span>
                                            <span>{language === 'ar' ? nextRank.title_ar : nextRank.title_en} — {nextRank.minXp.toLocaleString()} XP</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-egypt-night overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPct}%` }}
                                                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                                className="h-full rounded-full"
                                                style={{ background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* ── Tabs ── */}
                            <div className="flex gap-2 mb-6 p-1 rounded-xl bg-egypt-night-light/30 border border-egypt-gold/15 w-fit">
                                {[
                                    { id: 'badges', label_en: 'Badges', label_ar: 'الشارات', icon: Award },
                                    { id: 'ranks',  label_en: 'Ranks',  label_ar: 'الرتب',   icon: Shield },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTab(t.id)}
                                        className={`
                                            flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg font-egyptian text-xs sm:text-sm uppercase tracking-widest transition-all duration-200
                                            ${tab === t.id
                                                ? 'bg-egypt-gold text-egypt-night shadow-sm'
                                                : 'text-egypt-gold/50 hover:text-egypt-gold'
                                            }
                                        `}
                                    >
                                        <t.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {language === 'ar' ? t.label_ar : t.label_en}
                                    </button>
                                ))}
                            </div>

                            {/* ── Content ── */}
                            <AnimatePresence mode="wait">
                                {tab === 'badges' ? (
                                    <motion.div
                                        key="badges"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                                    >
                                        {BADGES.map((badge, i) => (
                                            <BadgeCard
                                                key={badge.id}
                                                badge={badge}
                                                unlocked={isBadgeUnlocked(badge)}
                                                language={language}
                                                index={i}
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="ranks"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col gap-3"
                                    >
                                        {RANKS.map((rank, i) => (
                                            <RankRow
                                                key={rank.id}
                                                rank={rank}
                                                current={currentRank}
                                                xp={xp}
                                                language={language}
                                                index={i}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AchievementsScene;
