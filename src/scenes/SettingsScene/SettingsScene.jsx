import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, Globe, Volume2, Music, ArrowLeft, Info, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../data/translations';
import { useAudio } from '../../context/AudioContext';
import SandParticles from '../../components/ui/SandParticles';

/* ── Setting Toggle Row ──────────────────────────────────────────── */
const SettingToggle = ({ icon: Icon, label, value, onToggle, options }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-egypt-night-light/40 border border-egypt-gold/10 hover:border-egypt-gold/25 rounded-lg transition-all">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-egypt-gold/5 flex items-center justify-center border border-egypt-gold/20 flex-shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-egypt-gold" />
            </div>
            <span className="font-egyptian text-egypt-gold uppercase tracking-widest text-sm">{label}</span>
        </div>
        <div className="flex gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onToggle(opt.value)}
                    className={`
                        flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 border font-egyptian text-xs uppercase tracking-widest
                        transition-all duration-200 rounded sm:rounded-none touch-manipulation min-h-[40px] sm:min-h-0
                        ${value === opt.value
                            ? 'bg-egypt-gold text-egypt-night border-egypt-gold'
                            : 'border-egypt-gold/20 text-egypt-gold/60 hover:border-egypt-gold/40 hover:text-egypt-gold'
                        }
                    `}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

/* ── Settings Scene ──────────────────────────────────────────────── */
const SettingsScene = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();
    const { isMusicEnabled, setIsMusicEnabled, isSoundEnabled, setIsSoundEnabled } = useAudio();
    const t = useTranslation(language);

    return (
        <div className="relative w-full min-h-screen bg-egypt-night flex flex-col items-center overflow-x-hidden">
            <SandParticles />

            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">

                {/* ── Header ──────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start sm:items-center justify-between mb-8 sm:mb-10 gap-4"
                >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-5">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2.5 sm:p-3 border border-egypt-gold/30 rounded text-egypt-gold hover:bg-egypt-gold/10 transition-colors flex-shrink-0 touch-manipulation mt-0.5 sm:mt-0"
                        >
                            <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-egyptian text-egypt-gold tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                                {t('settings.title')}
                            </h2>
                            <div className="h-0.5 w-full bg-gradient-to-r from-egypt-gold to-transparent mt-1.5" />
                        </div>
                    </div>
                    <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-egypt-gold/15 flex-shrink-0 mt-1" style={{ animation: 'spin 10s linear infinite' }} />
                </motion.div>

                {/* ── Panel ───────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="egypt-panel w-full p-1"
                >
                    <div className="bg-egypt-night/80 backdrop-blur-md p-5 sm:p-8 lg:p-10 flex flex-col gap-4 sm:gap-5">

                        <SettingToggle
                            icon={Globe}
                            label={t('settings.language')}
                            value={language}
                            onToggle={setLanguage}
                            options={[{ label: 'English', value: 'en' }, { label: 'العربية', value: 'ar' }]}
                        />

                        <SettingToggle
                            icon={Volume2}
                            label={t('settings.sound')}
                            value={isSoundEnabled ? 'on' : 'off'}
                            onToggle={(val) => setIsSoundEnabled(val === 'on')}
                            options={[{ label: t('settings.on'), value: 'on' }, { label: t('settings.off'), value: 'off' }]}
                        />

                        <SettingToggle
                            icon={Music}
                            label={t('settings.music')}
                            value={isMusicEnabled ? 'on' : 'off'}
                            onToggle={(val) => setIsMusicEnabled(val === 'on')}
                            options={[{ label: t('settings.on'), value: 'on' }, { label: t('settings.off'), value: 'off' }]}
                        />

                        {/* About */}
                        <div className="mt-4 sm:mt-6 pt-5 sm:pt-8 border-t border-egypt-gold/10">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-egypt-gold/40 font-egyptian text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">
                                <div className="flex items-center gap-3">
                                    <Info className="w-3.5 h-3.5 opacity-30 flex-shrink-0" />
                                    <span>{t('settings.developedBy')}</span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <span>{t('settings.version')}</span>
                                    <div className="flex items-center gap-1 text-green-500/60">
                                        <Check className="w-3 h-3" />
                                        <span>Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsScene;
