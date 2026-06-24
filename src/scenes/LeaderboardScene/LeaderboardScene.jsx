import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Crown, ArrowLeft, User, TrendingUp, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../data/translations';
import { getLeaderboard } from '../../services/supabase/database';
import { useAudio } from '../../context/AudioContext';

/* ── Single leaderboard row ──────────────────────────────────────── */
const LeaderboardRow = ({ player, rank, isPersonal = false }) => {
    const { language } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.04 }}
            className={`
                flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 rounded-lg border-l-4
                ${isPersonal
                    ? 'bg-egypt-gold/15 border-egypt-gold'
                    : 'bg-egypt-night-light/30 border-egypt-gold/20 hover:bg-egypt-gold/5'
                }
                transition-colors
            `}
        >
            {/* Left: rank + player */}
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                <div className="w-8 sm:w-10 text-center font-egyptian text-base sm:text-xl text-egypt-gold flex-shrink-0">
                    {rank <= 3
                        ? <Medal className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
                        : rank
                    }
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-egypt-gold/10 flex items-center justify-center border border-egypt-gold/30 flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-egypt-gold" />
                </div>
                <div className="min-w-0">
                    <span className="block font-egyptian text-egypt-gold uppercase tracking-widest text-xs sm:text-sm truncate">{player.username}</span>
                    <span className="block text-[9px] sm:text-[10px] text-egypt-papyrus/40 uppercase tracking-tighter">
                        {language === 'ar' ? `المستوى ${player.level || 1}` : `Level ${player.level || 1}`}
                    </span>
                </div>
            </div>

            {/* Right: XP + score */}
            <div className="flex items-center gap-3 sm:gap-8 lg:gap-12 text-right flex-shrink-0">
                <div className="hidden sm:block">
                    <span className="block text-[9px] sm:text-[10px] text-egypt-gold/40 uppercase tracking-widest font-egyptian">
                        {language === 'ar' ? 'XP' : 'Total XP'}
                    </span>
                    <span className="font-egyptian text-egypt-papyrus text-sm tracking-wider">{(player.total_xp || 0).toLocaleString()}</span>
                </div>
                <div className="w-16 sm:w-20 lg:w-24">
                    <span className="block text-[9px] sm:text-[10px] text-egypt-gold/40 uppercase tracking-widest font-egyptian">
                        {language === 'ar' ? 'المجد' : 'Glory'}
                    </span>
                    <span className="text-base sm:text-lg lg:text-xl font-egyptian text-egypt-gold">
                        {(player.highest_score || 0).toLocaleString()}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Leaderboard Scene ───────────────────────────────────────────── */
const LeaderboardScene = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { playSound } = useAudio();
    const t = useTranslation(language);
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard()
            .then(data => setTopPlayers(data))
            .catch(e => console.error('Failed to fetch leaderboard:', e))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="relative w-full h-screen bg-egypt-night flex flex-col overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[200px] sm:h-[300px] bg-egypt-gold/8 blur-[80px] sm:blur-[120px] pointer-events-none" />

            {/* ── Header ──────────────────────────────────── */}
            <div className="relative z-10 flex-shrink-0 px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-4 sm:pb-6">
                <button
                    onClick={() => { playSound('click'); navigate('/'); }}
                    className="mb-4 sm:mb-5 text-egypt-gold/60 hover:text-egypt-gold flex items-center gap-2 transition-colors font-egyptian tracking-widest uppercase text-xs touch-manipulation"
                >
                    <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} /> {t('settings.back')}
                </button>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-egyptian text-egypt-gold glow-text uppercase tracking-tight flex items-center gap-3">
                        <Trophy className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0" />
                        {t('menu.leaderboard')}
                    </h2>
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-egypt-night-light/60 border border-egypt-gold/20 rounded-lg self-start sm:self-auto">
                        <TrendingUp className="w-4 h-4 text-egypt-gold" />
                        <span className="text-[10px] sm:text-xs font-egyptian text-egypt-gold/60 tracking-widest uppercase whitespace-nowrap">
                            {language === 'ar' ? 'الترتيب العالمي: #---' : 'Global Rank: #---'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Column headers ──────────────────────────── */}
            <div className="relative z-10 flex-shrink-0 px-4 sm:px-8 lg:px-12 mb-2">
                <div className="flex items-center justify-between px-3 sm:px-5 text-egypt-gold/40 font-egyptian text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <span className="w-8 sm:w-10 text-center">{language === 'ar' ? '#' : 'Rank'}</span>
                        <span>{language === 'ar' ? 'الباحث' : 'Adept'}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-8 lg:gap-12 text-right">
                        <span className="hidden sm:block">{language === 'ar' ? 'الخبرة' : 'XP'}</span>
                        <span className="w-16 sm:w-20 lg:w-24">{language === 'ar' ? 'المجد' : 'Glory'}</span>
                    </div>
                </div>
            </div>

            {/* ── List ────────────────────────────────────── */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 pb-20">
                <div className="flex flex-col gap-2 sm:gap-3 max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-egypt-gold animate-spin mb-4" />
                            <p className="font-egyptian text-egypt-gold tracking-widest text-xs sm:text-sm">
                                {language === 'ar' ? 'جاري استشارة السجلات...' : 'Consulting the Records...'}
                            </p>
                        </div>
                    ) : topPlayers.length > 0 ? (
                        topPlayers.map((player, idx) => (
                            <LeaderboardRow key={idx} player={player} rank={idx + 1} />
                        ))
                    ) : (
                        <div className="text-center py-16 sm:py-24 text-egypt-papyrus/40 font-egyptian uppercase tracking-widest text-xs sm:text-sm">
                            {language === 'ar' ? 'لم تظهر أي أساطير بعد...' : 'No legends have emerged yet...'}
                        </div>
                    )}

                    {/* Personal standing */}
                    <div className="mt-6 sm:mt-10">
                        <h3 className="font-egyptian text-egypt-gold text-[10px] uppercase tracking-[0.3em] mb-3 opacity-40">
                            {language === 'ar' ? 'مركزك الحالي' : 'Your Current Standing'}
                        </h3>
                        <LeaderboardRow
                            player={{ username: 'Guest_User', score: 4500, level: 3, xp: 120, total_xp: 120, highest_score: 4500 }}
                            rank={124}
                            isPersonal
                        />
                    </div>
                </div>
            </div>

            {/* Fade overlay at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 bg-gradient-to-t from-egypt-night via-egypt-night/80 to-transparent pointer-events-none z-20" />
        </div>
    );
};

export default LeaderboardScene;
