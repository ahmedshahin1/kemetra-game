import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Compass, BookOpen, Clock, MapPin, ArrowLeft,
    Scroll, Landmark, Users, Coins, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../data/translations';
import { getKemetraFactSheet } from '../../data/historyKnowledgeBase';

/* ── Info card ───────────────────────────────────────────────────── */
const InfoCard = ({ icon: Icon, title, content, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-egypt-night/40 border border-egypt-gold/20 p-4 sm:p-5 backdrop-blur-sm rounded-lg"
    >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Icon className="w-4 h-4 text-egypt-gold flex-shrink-0" />
            <h4 className="font-egyptian text-egypt-gold uppercase tracking-widest text-xs sm:text-sm">{title}</h4>
        </div>
        <p className="text-egypt-papyrus/80 text-xs sm:text-sm font-modern leading-relaxed">{content}</p>
    </motion.div>
);

/* ── Era accordion item ──────────────────────────────────────────── */
const HistoryEra = ({ era, title, content, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
            relative w-full p-4 sm:p-5 text-left border-2 rounded-lg transition-all duration-300
            ${isActive
                ? 'border-egypt-gold bg-egypt-gold/10'
                : 'border-egypt-gold/15 bg-egypt-night/30 hover:border-egypt-gold/40 active:bg-egypt-gold/5'
            }
        `}
    >
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
                <Clock className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? 'text-egypt-gold' : 'text-egypt-gold/40'}`} />
                <div>
                    <span className="block text-[9px] sm:text-[10px] text-egypt-gold uppercase tracking-[0.25em] font-egyptian">{era}</span>
                    <h3 className={`text-base sm:text-lg font-egyptian uppercase tracking-tight leading-tight mt-0.5
                        ${isActive ? 'text-egypt-gold' : 'text-egypt-gold/60'}`}>{title}</h3>
                </div>
            </div>
            <ChevronDown className={`w-4 h-4 flex-shrink-0 mt-1 text-egypt-gold/50 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
        </div>
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <p className="text-egypt-papyrus/80 text-xs sm:text-sm leading-relaxed mt-3 pl-8">
                        {content}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </button>
);

/* ── Explore Scene ───────────────────────────────────────────────── */
const ExploreScene = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useLanguage();
    const t = useTranslation(language);
    const regionName = location.state?.region || localStorage.getItem('kemetra_last_region') || 'Cairo';

    useEffect(() => {
        if (location.state?.region) localStorage.setItem('kemetra_last_region', location.state.region);
    }, [location.state?.region]);

    const regionData = getKemetraFactSheet(regionName, language);
    const [activeEra, setActiveEra] = useState(regionData.eras[0]?.id || 'OldKingdom');
    const [activeTab, setActiveTab] = useState('info'); // mobile tab: 'info' | 'timeline'

    return (
        <div className="relative w-full h-screen bg-egypt-night flex flex-col overflow-hidden">

            {/* ── Header ──────────────────────────────────── */}
            <div className="relative z-20 px-4 sm:px-8 lg:px-12 py-4 sm:py-5 flex justify-between items-center bg-egypt-night-light/40 border-b border-egypt-gold/10 flex-shrink-0">
                <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                    <button
                        onClick={() => navigate('/globe')}
                        className="p-2 sm:p-2.5 border border-egypt-gold/30 rounded text-egypt-gold hover:bg-egypt-gold/10 transition-colors flex-shrink-0 touch-manipulation"
                    >
                        <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-egyptian text-egypt-gold uppercase tracking-[0.15em] truncate">{regionName}</h2>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-egypt-gold font-egyptian tracking-widest opacity-60">
                            <MapPin className="w-3 h-3 flex-shrink-0" /> {t('explore.ancientProvince')}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/quiz', { state: { region: regionName } })}
                    className="egypt-button text-[10px] sm:text-xs py-2 px-4 sm:px-6 flex-shrink-0 touch-manipulation"
                >
                    <span className="hidden sm:inline">{t('explore.challenge')}</span>
                    <span className="sm:hidden">Quiz</span>
                </button>
            </div>

            {/* ── Mobile tab switcher ──────────────────── */}
            <div className="flex lg:hidden border-b border-egypt-gold/10 flex-shrink-0">
                {[{ id: 'info', label: language === 'ar' ? 'المعلومات' : 'Info' }, { id: 'timeline', label: language === 'ar' ? 'التاريخ' : 'Timeline' }].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2.5 font-egyptian text-xs uppercase tracking-widest transition-colors touch-manipulation
                            ${activeTab === tab.id ? 'text-egypt-gold border-b-2 border-egypt-gold bg-egypt-gold/5' : 'text-egypt-gold/40 hover:text-egypt-gold/70'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Body ────────────────────────────────────── */}
            <div className="relative z-10 flex-1 flex overflow-hidden">

                {/* LEFT — Info (full-width on mobile when tab=info, 1/3 on lg+) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                        flex flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:p-8
                        ${activeTab === 'info' ? 'flex w-full' : 'hidden'}
                        lg:flex lg:w-1/3 lg:border-r lg:border-egypt-gold/10
                    `}
                >
                    {/* Summary */}
                    <div className="relative p-5 sm:p-7 bg-egypt-papyrus/5 border border-egypt-gold/10 rounded-lg">
                        <Scroll className={`absolute -top-3 ${language === 'ar' ? '-right-3' : '-left-3'} w-7 h-7 text-egypt-gold/40`} />
                        <h3 className="font-egyptian text-egypt-gold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Landmark className="w-4 h-4" /> {t('explore.chronicle')}
                        </h3>
                        <p className="text-egypt-papyrus text-sm sm:text-base font-modern leading-relaxed italic mb-5">
                            "{regionData.summary}"
                        </p>
                        <div className="flex flex-col gap-3">
                            <InfoCard icon={Landmark} title={t('explore.landmarks')} content={regionData.landmarks?.join(', ')} delay={0.1} />
                            <InfoCard icon={Users} title={t('explore.culture')} content={regionData.culture} delay={0.2} />
                            {regionData.economy && <InfoCard icon={Coins} title={t('explore.nexus')} content={regionData.economy} delay={0.3} />}
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT — Era timeline (full-width on mobile when tab=timeline, flex-1 on lg+) */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                        flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 lg:flex-1
                        ${activeTab === 'timeline' ? 'flex w-full' : 'hidden'}
                        lg:flex
                    `}
                >
                    <h3 className="font-egyptian text-egypt-gold text-xs uppercase tracking-[0.25em] mb-5 text-center flex items-center justify-center gap-3 flex-shrink-0">
                        <div className="h-px w-12 sm:w-20 bg-egypt-gold/20" />
                        {t('explore.records')}
                        <div className="h-px w-12 sm:w-20 bg-egypt-gold/20" />
                    </h3>

                    <div className="flex flex-col gap-3">
                        {regionData.eras.map((era) => (
                            <HistoryEra
                                key={era.id}
                                era={era.era}
                                title={era.title}
                                content={era.content}
                                isActive={activeEra === era.id}
                                onClick={() => setActiveEra(activeEra === era.id ? null : era.id)}
                            />
                        ))}
                    </div>

                    <div className="mt-6 p-4 sm:p-5 border border-dashed border-egypt-gold/20 rounded-lg flex items-center justify-between text-egypt-gold/40 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-6 h-6 opacity-30 flex-shrink-0" />
                            <p className="text-[10px] sm:text-xs font-egyptian tracking-widest uppercase">
                                {language === 'ar' ? 'استكشف مزيدًا من الأقاليم لتبني مجدك' : 'Explore more regions to build your Glory'}
                            </p>
                        </div>
                        <Compass className="w-8 h-8 opacity-10 animate-spin hidden sm:block" style={{ animationDuration: '8s' }} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ExploreScene;
