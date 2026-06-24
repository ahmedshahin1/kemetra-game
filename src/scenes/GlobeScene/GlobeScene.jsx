import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Info, Play, Target, Lock, Unlock,
    Sparkles, MapPin, X, List, ChevronUp, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../data/translations';
import { GOVERNORATES, isUnlocked } from '../../data/governorates';
import { supabase } from '../../services/supabase/client';
import { fetchUserProfile } from '../../services/supabase/database';
import { useAudio } from '../../context/AudioContext';

// ─── Lat/Lng → 3D Vector ─────────────────────────────────────────────────────
const latLngToVector3 = (lat, lng, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
};

// ─── Globe Pin ───────────────────────────────────────────────────────────────
const Pin = ({ gov, isUnlocked, isSelected, onClick }) => {
    const pos = useMemo(() => latLngToVector3(gov.lat, gov.lng, 10.2), [gov]);
    return (
        <Html position={pos} distanceFactor={15} zIndexRange={[100, 0]}>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.25 }}
                onClick={() => onClick(gov)}
                className="cursor-pointer group flex flex-col items-center touch-manipulation"
            >
                <div className={`
                    relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isUnlocked
                        ? isSelected
                            ? 'bg-egypt-gold border-white scale-110'
                            : 'bg-egypt-night/80 border-egypt-gold group-hover:bg-egypt-gold'
                        : 'bg-egypt-night/60 border-egypt-gold/30 grayscale'
                    }
                `}>
                    {isUnlocked
                        ? <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isSelected ? 'bg-egypt-night' : 'bg-egypt-gold group-hover:bg-egypt-night'}`} />
                        : <Lock className="w-2.5 h-2.5 text-egypt-gold/40" />
                    }
                    {isUnlocked && (
                        <div className={`absolute -inset-2 rounded-full border border-egypt-gold/30 animate-ping ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                    )}
                </div>
                <span className={`
                    mt-1 px-1.5 py-0.5 whitespace-nowrap text-[9px] sm:text-[10px] font-egyptian uppercase tracking-widest rounded
                    bg-egypt-night/85 border border-egypt-gold/20
                    ${isUnlocked ? 'text-egypt-gold' : 'text-egypt-gold/40'}
                    ${isSelected ? 'border-egypt-gold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : ''}
                `}>
                    {gov.name}
                </span>
            </motion.div>
        </Html>
    );
};

// ─── Globe 3D Object ─────────────────────────────────────────────────────────
const Globe = ({ onGovClick, selectedGovId, userXp }) => {
    const globeRef = useRef();
    const groupRef = useRef();
    const [introFinished, setIntroFinished] = useState(false);
    const startTime = useRef(Date.now());

    const [colorMap, bumpMap, specMap] = useLoader(THREE.TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    ]);

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y = -Math.PI / 1.8;
            groupRef.current.rotation.x = 0.2;
        }
    }, []);

    useFrame(() => {
        const elapsed = (Date.now() - startTime.current) / 1000;
        if (elapsed < 2) {
            if (groupRef.current) groupRef.current.rotation.y += 0.05;
        } else if (!introFinished) {
            if (groupRef.current) {
                const target = -Math.PI / 1.8;
                groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, target, 0.05);
                if (Math.abs(groupRef.current.rotation.y - target) < 0.01) setIntroFinished(true);
            }
        }
    });

    return (
        <group ref={groupRef}>
            <mesh ref={globeRef}>
                <sphereGeometry args={[10, 64, 64]} />
                <meshPhongMaterial map={colorMap} normalMap={bumpMap} specularMap={specMap} shininess={5} />
            </mesh>
            {/* Atmosphere */}
            <mesh scale={[1.02, 1.02, 1.02]}>
                <sphereGeometry args={[10, 64, 64]} />
                <meshPhongMaterial color="#4ca1af" transparent opacity={0.08} side={THREE.BackSide} />
            </mesh>
            {GOVERNORATES.map(gov => (
                <Pin
                    key={gov.id}
                    gov={gov}
                    isUnlocked={isUnlocked(gov, userXp)}
                    isSelected={selectedGovId === gov.id}
                    onClick={onGovClick}
                />
            ))}
        </group>
    );
};

// ─── Region Info Panel (slides in from right on desktop, up from bottom on mobile) ──
const InfoPanel = ({ gov, profile, language, t, onClose, onQuiz, onExplore }) => {
    const unlocked = isUnlocked(gov, profile?.total_xp || 0);
    const xp = profile?.total_xp || 0;
    const pct = gov.xpRequired > 0 ? Math.min((xp / gov.xpRequired) * 100, 100) : 100;

    return (
        <>
            {/* Desktop: slide from right */}
            <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                className="hidden lg:block absolute right-6 xl:right-8 top-1/2 -translate-y-1/2 z-20 w-72 xl:w-80"
                style={{
                    background: 'linear-gradient(160deg,rgba(10,10,20,0.95)0%,rgba(15,10,5,0.95)100%)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 0 40px rgba(212,175,55,0.12)',
                }}
            >
                <div className="h-px bg-gradient-to-r from-transparent via-egypt-gold/50 to-transparent" />
                <div className="p-6 xl:p-8">
                    <PanelContent gov={gov} unlocked={unlocked} pct={pct} language={language} t={t} onClose={onClose} onQuiz={onQuiz} onExplore={onExplore} />
                </div>
            </motion.div>

            {/* Mobile/Tablet: slide up from bottom */}
            <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-30 rounded-t-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(160deg,rgba(10,10,20,0.98)0%,rgba(15,10,5,0.98)100%)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    borderBottom: 'none',
                    boxShadow: '0 -8px 40px rgba(212,175,55,0.15)',
                }}
            >
                <div className="h-px bg-gradient-to-r from-transparent via-egypt-gold/50 to-transparent" />
                {/* Drag handle */}
                <div className="flex justify-center pt-2.5">
                    <div className="w-8 h-1 rounded-full bg-egypt-gold/30" />
                </div>
                <div className="p-5 sm:p-6">
                    <PanelContent gov={gov} unlocked={unlocked} pct={pct} language={language} t={t} onClose={onClose} onQuiz={onQuiz} onExplore={onExplore} />
                </div>
            </motion.div>
        </>
    );
};

const PanelContent = ({ gov, unlocked, pct, language, t, onClose, onQuiz, onExplore }) => (
    <div>
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-egypt-gold/40 hover:text-egypt-gold rounded-full hover:bg-egypt-gold/10 transition-all touch-manipulation">
            <X className="w-4 h-4" />
        </button>

        {!unlocked ? (
            <div className="text-center pt-2 pb-2">
                <Lock className="w-10 h-10 text-egypt-red mx-auto mb-3 opacity-50" />
                <h3 className="text-xl sm:text-2xl font-egyptian text-egypt-red uppercase mb-3">{gov.name}</h3>
                <p className="text-egypt-papyrus/60 text-xs sm:text-sm mb-5 font-modern leading-relaxed">
                    {language === 'ar'
                        ? `رمال الزمن تحجب هذا الإقليم. اجمع ${gov.xpRequired} XP لتكشف عن تراثه.`
                        : `The sands shroud this region. Accumulate ${gov.xpRequired.toLocaleString()} XP to reveal its legacy.`
                    }
                </p>
                <div className="h-1.5 bg-egypt-night rounded-full overflow-hidden mb-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-egypt-gold/60 to-egypt-gold rounded-full"
                    />
                </div>
                <span className="text-[10px] text-egypt-gold/40 font-egyptian uppercase tracking-widest">
                    {Math.round(pct)}% unlocked
                </span>
            </div>
        ) : (
            <>
                <div className="flex items-center gap-3 mb-3 pr-6">
                    <div className="p-2 bg-egypt-gold/15 rounded-lg flex-shrink-0">
                        <Target className="w-5 h-5 text-egypt-gold" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-egyptian text-egypt-gold uppercase tracking-tight">
                        {gov.name}
                    </h3>
                </div>

                <p className="text-egypt-papyrus/70 mb-5 font-modern leading-relaxed italic text-xs sm:text-sm border-l-2 border-egypt-gold/30 pl-3">
                    {language === 'ar'
                        ? `"عبر النيل الخالد، تنتظر سجلات ${gov.name} حكمتك."`
                        : `"Across the eternal Nile, the records of ${gov.name} await your wisdom."`
                    }
                </p>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-3">
                    <button
                        onClick={onQuiz}
                        className="flex-1 py-3 sm:py-3.5 bg-egypt-gold text-egypt-night font-egyptian flex items-center justify-center gap-2 hover:bg-egypt-gold-light transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)] rounded-sm touch-manipulation min-h-[48px] text-sm uppercase tracking-widest"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        {t('globe.quiz')}
                    </button>
                    <button
                        onClick={onExplore}
                        className="flex-1 py-3 sm:py-3.5 border border-egypt-gold/40 text-egypt-gold font-egyptian flex items-center justify-center gap-2 hover:bg-egypt-gold/10 transition-colors rounded-sm touch-manipulation min-h-[48px] text-sm uppercase tracking-widest"
                    >
                        <Info className="w-4 h-4" />
                        {t('globe.explore')}
                    </button>
                </div>
            </>
        )}
    </div>
);

// ─── Legend Sheet (mobile) ────────────────────────────────────────────────────
const LegendSheet = ({ governorates, profile, selectedGov, onSelect, onClose, language, t }) => (
    <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-x-0 bottom-0 z-40 rounded-t-2xl overflow-hidden"
        style={{ background: 'rgba(8,8,18,0.98)', border: '1px solid rgba(212,175,55,0.2)', maxHeight: '60vh' }}
    >
        <div className="h-px bg-gradient-to-r from-transparent via-egypt-gold/40 to-transparent" />
        <div className="flex justify-center pt-2.5 mb-1">
            <div className="w-8 h-1 rounded-full bg-egypt-gold/30" />
        </div>
        <div className="flex items-center justify-between px-5 pb-3">
            <h4 className="text-xs font-egyptian text-egypt-gold uppercase tracking-widest">{t('globe.legend')}</h4>
            <button onClick={onClose} className="p-1.5 text-egypt-gold/40 hover:text-egypt-gold touch-manipulation">
                <X className="w-4 h-4" />
            </button>
        </div>
        <div className="overflow-y-auto px-4 pb-6" style={{ maxHeight: 'calc(60vh - 80px)' }}>
            {governorates.map(g => {
                const unlocked = isUnlocked(g, profile?.total_xp || 0);
                return (
                    <button
                        key={g.id}
                        onClick={() => { onSelect(g); onClose(); }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg mb-1 transition-all touch-manipulation
                            ${unlocked ? 'hover:bg-egypt-gold/8' : 'opacity-40'}
                            ${selectedGov?.id === g.id ? 'bg-egypt-gold/10 border border-egypt-gold/30' : 'border border-transparent'}`}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className={`w-1.5 h-1.5 rotate-45 flex-shrink-0 ${unlocked ? 'bg-egypt-gold' : 'bg-white/20'}`} />
                            <span className="text-xs font-egyptian text-egypt-gold uppercase tracking-tight">{g.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {!unlocked && (
                                <span className="text-[9px] font-egyptian text-egypt-gold/40 tracking-widest">
                                    {g.xpRequired.toLocaleString()} XP
                                </span>
                            )}
                            {unlocked
                                ? <Unlock className="w-3 h-3 text-egypt-gold/50" />
                                : <Lock className="w-3 h-3 text-egypt-gold/25" />
                            }
                        </div>
                    </button>
                );
            })}
        </div>
    </motion.div>
);

// ─── Globe Scene ─────────────────────────────────────────────────────────────
const GlobeScene = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { playSound } = useAudio();
    const t = useTranslation(language);
    const [selectedGov, setSelectedGov] = useState(null);
    const [profile, setProfile] = useState(null);
    const [showLegend, setShowLegend] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { navigate('/'); return; }

            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
        };
        fetchProfile();
    }, [navigate]);

    const handleGovClick = (gov) => {
        playSound?.('click');
        setSelectedGov(gov);
        setShowLegend(false);
    };

    const handleQuiz = () => {
        playSound?.('click');
        navigate('/quiz', { state: { region: selectedGov.name } });
    };

    const handleExplore = () => {
        playSound?.('click');
        navigate('/explore', { state: { region: selectedGov.name } });
    };

    const unlockedCount = GOVERNORATES.filter(g => isUnlocked(g, profile?.total_xp || 0)).length;

    return (
        <div className="relative w-full h-screen bg-egypt-night overflow-hidden">

            {/* ── Top-left UI bar ──────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 z-20 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-start justify-between gap-3">

                {/* Left: Back + Title */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => navigate('/')}
                            className="p-2 sm:p-2.5 bg-egypt-night-light/80 border border-egypt-gold/40 rounded-full text-egypt-gold backdrop-blur-md touch-manipulation flex-shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                        <h2 className="text-lg sm:text-2xl lg:text-3xl font-egyptian text-egypt-gold glow-text truncate">
                            Kemetra Expedition
                        </h2>
                    </div>

                    {/* XP badge */}
                    <div className="flex items-center gap-3 bg-egypt-gold/8 border-l-2 border-egypt-gold px-3 py-1 self-start ml-10 sm:ml-14">
                        <Zap className="w-3 h-3 text-egypt-gold opacity-70" />
                        <span className="text-[9px] sm:text-[10px] font-egyptian text-egypt-gold uppercase tracking-widest">
                            XP: {(profile?.total_xp || 0).toLocaleString()}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-egyptian text-egypt-gold/60 uppercase tracking-widest hidden sm:inline">
                            · Lv {profile?.level || 1}
                        </span>
                    </div>
                </div>

                {/* Right: Legend toggle (mobile) + progress (sm+) */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Unlocked counter (sm+) */}
                    <div className="hidden sm:flex items-center gap-2 bg-egypt-night-light/70 border border-egypt-gold/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-egypt-gold" />
                        <span className="text-[10px] font-egyptian text-egypt-gold uppercase tracking-widest">
                            {unlockedCount}/{GOVERNORATES.length} {language === 'ar' ? 'مفتوح' : 'Unlocked'}
                        </span>
                    </div>

                    {/* Legend toggle button (mobile) */}
                    <button
                        onClick={() => { setShowLegend(v => !v); setSelectedGov(null); }}
                        className="lg:hidden p-2 sm:p-2.5 bg-egypt-night-light/80 border border-egypt-gold/20 rounded-full text-egypt-gold backdrop-blur-md touch-manipulation"
                    >
                        <List className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* ── 3D Canvas ────────────────────────────────── */}
            <div className="absolute inset-0 z-10">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 30]} />
                    <OrbitControls
                        enablePan={false}
                        minDistance={12}
                        maxDistance={40}
                        autoRotate={!selectedGov}
                        autoRotateSpeed={0.5}
                        dampingFactor={0.05}
                    />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[100, 100, 100]} intensity={1.5} color="#F5DEB3" />
                    <pointLight position={[-100, -100, -100]} intensity={0.5} color="#003366" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Globe
                        onGovClick={handleGovClick}
                        selectedGovId={selectedGov?.id}
                        userXp={profile?.total_xp || 0}
                    />
                </Canvas>
            </div>

            {/* ── Info Panel (desktop right / mobile bottom sheet) ── */}
            <AnimatePresence>
                {selectedGov && (
                    <InfoPanel
                        key={selectedGov.id}
                        gov={selectedGov}
                        profile={profile}
                        language={language}
                        t={t}
                        onClose={() => setSelectedGov(null)}
                        onQuiz={handleQuiz}
                        onExplore={handleExplore}
                    />
                )}
            </AnimatePresence>

            {/* ── Legend Sheet (mobile bottom sheet) ────── */}
            <AnimatePresence>
                {showLegend && (
                    <LegendSheet
                        governorates={GOVERNORATES}
                        profile={profile}
                        selectedGov={selectedGov}
                        onSelect={handleGovClick}
                        onClose={() => setShowLegend(false)}
                        language={language}
                        t={t}
                    />
                )}
            </AnimatePresence>

            {/* ── Desktop sidebar legend ────────────────── */}
            <div className="hidden lg:flex absolute left-6 xl:left-8 bottom-8 z-20 flex-col gap-1 max-h-[40vh] overflow-y-auto pr-2">
                <h4 className="text-[10px] font-egyptian text-egypt-gold/40 uppercase tracking-[0.2em] mb-2 flex-shrink-0">
                    {t('globe.legend')}
                </h4>
                {GOVERNORATES.map(g => {
                    const unlocked = isUnlocked(g, profile?.total_xp || 0);
                    return (
                        <div
                            key={g.id}
                            onClick={() => handleGovClick(g)}
                            className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded transition-all cursor-pointer border border-transparent
                                ${unlocked ? 'opacity-70 hover:opacity-100 hover:bg-egypt-gold/5' : 'opacity-30 hover:opacity-50'}
                                ${selectedGov?.id === g.id ? 'border-egypt-gold/40 bg-egypt-gold/5 opacity-100' : ''}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-1 h-1 rotate-45 flex-shrink-0 ${unlocked ? 'bg-egypt-gold' : 'bg-white/20'}`} />
                                <span className="text-[10px] font-egyptian text-egypt-gold uppercase tracking-tighter">{g.name}</span>
                                {selectedGov?.id === g.id && <Sparkles className="w-2 h-2 text-egypt-gold animate-pulse" />}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {!unlocked && (
                                    <span className="text-[8px] font-egyptian text-egypt-gold/40 tracking-widest bg-egypt-night/50 px-1 py-0.5 border border-egypt-gold/10">
                                        {g.xpRequired.toLocaleString()} XP
                                    </span>
                                )}
                                {unlocked
                                    ? <Unlock className="w-2.5 h-2.5 text-egypt-gold/40" />
                                    : <Lock className="w-2.5 h-2.5 text-egypt-gold/20" />
                                }
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Bottom hint bar ───────────────────────── */}
            {!selectedGov && !showLegend && (
                <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 sm:gap-8 opacity-40 pointer-events-none">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-egypt-gold" />
                        <span className="text-[7px] sm:text-[8px] font-egyptian text-egypt-gold uppercase tracking-[0.2em]">
                            {language === 'ar' ? 'إرث مفتوح' : 'Unlocked'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-egypt-night border border-egypt-gold/30" />
                        <span className="text-[7px] sm:text-[8px] font-egyptian text-egypt-gold uppercase tracking-[0.2em]">
                            {language === 'ar' ? 'منطقة محجوبة' : 'Locked'}
                        </span>
                    </div>
                </div>
            )}

            {/* ── Backdrop for mobile overlays ─────────── */}
            <AnimatePresence>
                {(showLegend) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 lg:hidden"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setShowLegend(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GlobeScene;
