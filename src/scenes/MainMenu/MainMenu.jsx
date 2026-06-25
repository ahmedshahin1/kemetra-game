import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Swords, Compass, Award, Trophy, Settings,
    LogOut, User as UserIcon, Shield, X,
    Star, ChevronRight, Menu
} from 'lucide-react';
import { supabase } from '../../services/supabase/client';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../data/translations';
import { useAudio } from '../../context/AudioContext';
import SandParticles from '../../components/ui/SandParticles';
import AuthModal from '../../components/ui/AuthModal';
import PharaohModel from '../../components/ui/PharaohModel';

/* ── Floating ambient orbs (desktop only) ─────────────────────────── */
const FloatingOrbs = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                    width: `${80 + i * 40}px`,
                    height: `${80 + i * 40}px`,
                    left: `${10 + i * 16}%`,
                    top: `${15 + (i % 3) * 25}%`,
                    background: `radial-gradient(circle, rgba(212,175,55,${0.04 + i * 0.01}) 0%, transparent 70%)`,
                    border: `1px solid rgba(212,175,55,${0.06 + i * 0.01})`,
                }}
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
            />
        ))}
    </div>
);

/* ── Play sub-menu modal ──────────────────────────────────────────── */
const PlayModal = ({ onClose, onQuest, onRanked, language }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
    >
        <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden border border-egypt-gold/30"
            style={{ background: 'linear-gradient(135deg,rgba(10,10,20,0.97)0%,rgba(20,15,5,0.97)100%)', boxShadow: '0 0 60px rgba(212,175,55,0.2)' }}
            onClick={e => e.stopPropagation()}
        >
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-egypt-gold to-transparent" />
            {/* drag handle on mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-egypt-gold/30" />
            </div>
            <div className="p-6 sm:p-10">
                <div className="text-center mb-6 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-egypt-gold/10 border border-egypt-gold/30 mb-3">
                        <Swords className="w-6 h-6 sm:w-8 sm:h-8 text-egypt-gold" />
                    </div>
                    <h2 className="text-xl sm:text-3xl font-egyptian text-egypt-gold tracking-[0.2em] uppercase">
                        {language === 'ar' ? 'اختر وضع اللعب' : 'Choose Your Mode'}
                    </h2>
                    <p className="text-egypt-papyrus/50 font-modern text-xs sm:text-sm mt-1">
                        {language === 'ar' ? 'كيف تريد أن تبدأ رحلتك؟' : 'How will you begin your journey?'}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                    {[
                        { icon: Compass, titleEn: 'The Quest', titleAr: 'المهمة', descEn: 'Free Explore · Learn', descAr: 'استكشاف حر · تعلّم', onClick: onQuest },
                        { icon: Shield, titleEn: 'Ranked', titleAr: 'التحدي', descEn: 'Compete · Earn XP', descAr: 'تنافس · اكسب XP', onClick: onRanked },
                    ].map(({ icon: Icon, titleEn, titleAr, descEn, descAr, onClick }) => (
                        <motion.button
                            key={titleEn}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onClick}
                            className="group relative flex flex-col items-center gap-3 p-5 sm:p-7 rounded-xl border border-egypt-gold/20 hover:border-egypt-gold/60 transition-all duration-300 min-h-[120px] sm:min-h-[160px]"
                            style={{ background: 'rgba(212,175,55,0.05)' }}
                        >
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-egypt-gold/10 border border-egypt-gold/30 flex items-center justify-center group-hover:bg-egypt-gold/20 transition-all">
                                <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-egypt-gold" />
                            </div>
                            <div>
                                <span className="block font-egyptian text-egypt-gold text-sm sm:text-lg uppercase tracking-widest">
                                    {language === 'ar' ? titleAr : titleEn}
                                </span>
                                <span className="block text-egypt-papyrus/60 font-modern text-[10px] sm:text-xs mt-0.5">
                                    {language === 'ar' ? descAr : descEn}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-egypt-gold/40 hover:text-egypt-gold transition-colors rounded-full hover:bg-egypt-gold/10"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    </motion.div>
);

/* ── Single nav card ──────────────────────────────────────────────── */
const NavCard = ({ icon: Icon, title, subtitle, onClick, accent = false, index = 0 }) => (
    <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 + index * 0.07 }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`
            group relative flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 lg:p-6 rounded-xl border text-left
            transition-all duration-300 overflow-hidden w-full
            ${accent
                ? 'bg-egypt-gold text-egypt-night border-egypt-gold shadow-[0_0_30px_rgba(212,175,55,0.35)]'
                : 'border-egypt-gold/20 hover:border-egypt-gold/60 text-egypt-gold'
            }
        `}
        style={accent ? {} : { background: 'rgba(15,12,5,0.5)', backdropFilter: 'blur(10px)' }}
    >
        {!accent && (
            <div className="absolute inset-0 bg-gradient-to-br from-egypt-gold/0 to-egypt-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
            ${accent ? 'bg-egypt-night/20 text-egypt-night' : 'bg-egypt-gold/10 group-hover:bg-egypt-gold/20 text-egypt-gold'}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
            <span className={`block font-egyptian text-sm sm:text-base lg:text-lg uppercase tracking-widest leading-tight ${accent ? 'text-egypt-night' : 'text-egypt-gold'}`}>
                {title}
            </span>
            {subtitle && (
                <span className={`block font-modern text-[10px] sm:text-xs mt-0.5 leading-snug ${accent ? 'text-egypt-night/70' : 'text-egypt-papyrus/50'}`}>
                    {subtitle}
                </span>
            )}
        </div>
        <ChevronRight className={`w-4 h-4 absolute bottom-4 right-4 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0
            ${accent ? 'text-egypt-night/40 group-hover:text-egypt-night' : 'text-egypt-gold/30 group-hover:text-egypt-gold'}`} />
    </motion.button>
);

/* ── Main Menu ────────────────────────────────────────────────────── */
const MainMenu = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { playSound } = useAudio();
    const t = useTranslation(language);
    const [showAuth, setShowAuth] = useState(false);
    const [showPlay, setShowPlay] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
        return () => subscription.unsubscribe();
    }, []);

    const requireAuth = (cb) => { if (user) cb(); else setShowAuth(true); };

    const menuItems = [
        { icon: Swords,   title: language === 'ar' ? 'العب' : 'Play',         subtitle: language === 'ar' ? 'المهمة · وضع التحدي' : 'The Quest · Ranked Mode', accent: true,  onClick: () => { playSound('click'); requireAuth(() => setShowPlay(true)); } },
        { icon: Compass,  title: language === 'ar' ? 'استكشف مصر' : 'Explore Egypt',   subtitle: language === 'ar' ? 'اكتشف المحافظات والتاريخ' : 'Discover governorates & history',  onClick: () => { playSound('click'); navigate('/explore'); } },
        { icon: Award,    title: language === 'ar' ? 'الإنجازات' : 'Achievements',  subtitle: language === 'ar' ? 'الشارات والرتب' : 'Badges & Ranks',          onClick: () => { playSound('click'); navigate('/achievements'); } },
        { icon: Trophy,   title: language === 'ar' ? 'لوحة الشرف' : 'Leaderboard',   subtitle: language === 'ar' ? 'رتبتك وأفضل اللاعبين' : 'Your rank & top players',             onClick: () => { playSound('click'); navigate('/leaderboard'); } },
        { icon: Settings, title: language === 'ar' ? 'الإعدادات' : 'Settings',     subtitle: language === 'ar' ? 'اللغة والصوت والتفضيلات' : 'Language, audio & preferences',       onClick: () => { playSound('click'); navigate('/settings'); } },
    ];

    return (
        <div
            className="relative w-full min-h-screen overflow-x-hidden flex items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(15,12,5,1) 0%, rgba(5,5,15,1) 100%)' }}
        >
            <SandParticles />
            <FloatingOrbs />

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onAuthSuccess={(u) => { setUser(u); setShowPlay(true); }} />
            <AnimatePresence>{showPlay && <PlayModal language={language} onClose={() => setShowPlay(false)} onQuest={() => { playSound('click'); setShowPlay(false); navigate('/globe'); }} onRanked={() => { playSound('click'); setShowPlay(false); navigate('/quiz'); }} />}</AnimatePresence>

            {/* ── User badge (top-right) ─────────────────── */}
            <AnimatePresence>
                {user && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="absolute top-3 right-16 sm:top-4 sm:right-20 z-30 flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-egypt-gold/20 max-w-[160px] sm:max-w-none" style={{ background: 'rgba(10,10,20,0.7)', backdropFilter: 'blur(12px)' }}>
                            <div className="w-6 h-6 rounded-full bg-egypt-gold/10 border border-egypt-gold/30 flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-3 h-3 text-egypt-gold" />
                            </div>
                            <span className="text-egypt-papyrus/80 font-modern text-xs truncate hidden sm:block">{user.email}</span>
                        </div>
                        <button onClick={() => { playSound('click'); supabase.auth.signOut(); }} className="w-8 h-8 rounded-full flex items-center justify-center border border-egypt-red/20 text-egypt-red/50 hover:text-egypt-red hover:border-egypt-red/50 transition-all" style={{ background: 'rgba(10,10,20,0.7)' }}>
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main content ──────────────────────────── */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-24">

                {/* LEFT — Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.85 }}
                    className="flex-shrink-0 text-center lg:text-left w-full lg:w-auto"
                >
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                        <div className="h-px w-8 bg-egypt-gold/60" />
                        <span className="font-egyptian text-egypt-gold/60 text-[10px] sm:text-xs tracking-[0.3em] uppercase">{t('menu.legacy')}</span>
                    </div>

                    <h1
                        className="font-egyptian text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-egypt-gold leading-none mb-4"
                        style={{ textShadow: '0 0 30px rgba(212,175,55,0.5)' }}
                    >
                        KEMETRA
                    </h1>

                    <p className="font-modern text-egypt-papyrus/60 text-xs sm:text-sm leading-relaxed mb-5 max-w-xs mx-auto lg:mx-0">
                        {t('menu.tagline')}
                    </p>

                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}>
                                <Star className="w-3 h-3 text-egypt-gold/50 fill-egypt-gold/30" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Pharaoh (desktop only) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.4, delay: 0.3 }}
                        className="hidden lg:block relative w-52 xl:w-64 h-56 xl:h-72 mx-auto lg:mx-0"
                    >
                        <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />
                        <div className="relative w-full h-full flex items-center justify-center">
                            <PharaohModel />
                        </div>
                    </motion.div>
                </motion.div>

                {/* RIGHT — Navigation grid */}
                {/* Mobile: 1-col | sm-md: 2-col | lg: 2-col taller */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {menuItems.map((item, i) => (
                        <NavCard key={i} index={i} {...item} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 sm:gap-8 text-egypt-gold/25 font-egyptian text-[9px] sm:text-xs tracking-widest pointer-events-none px-4 text-center"
            >
                <span>{t('settings.credits')}</span>
                <span>·</span>
                <span className="hidden sm:inline">KEMETRA EXPEDITION</span>
                <span className="hidden sm:inline">·</span>
                <span>{t('settings.version')}</span>
            </motion.div>
        </div>
    );
};

export default MainMenu;
