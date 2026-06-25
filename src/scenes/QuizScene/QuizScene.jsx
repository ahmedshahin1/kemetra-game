import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Timer, Trophy, ArrowRight, RefreshCw, X, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { signInAnonymously, saveGameScore } from '../../services/supabase/database';
import { supabase } from '../../services/supabase/client';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../data/translations';
import { useAudio } from '../../context/AudioContext';
import { getKemetraQuestions } from '../../data/historyKnowledgeBase';
import { generateAIQuestions } from '../../services/ai/aiService';

const QuizScene = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useLanguage();
    const { playSound } = useAudio();
    const t = useTranslation(language);

    // Recovery mechanism for lost state
    const [region, setRegion] = useState(() => {
        const stateRegion = location.state?.region;
        if (stateRegion) {
            localStorage.setItem('kemetra_last_region', stateRegion);
            return stateRegion;
        }
        return localStorage.getItem('kemetra_last_region') || 'Cairo';
    });

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [xpData, setXpData] = useState(null);
    const [finalScore, setFinalScore] = useState(0); // tracked separately to avoid closure stale-state

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUser(session.user);

            try {
                // Primary: Fetch AI-generated questions from local backend / OpenRouter
                const aiQuestions = await generateAIQuestions(region, language, 10);
                const shuffled = [...aiQuestions].sort(() => Math.random() - 0.5);
                setQuestions(shuffled);
            } catch (aiErr) {
                console.warn("[Kemetra] AI generation failed, using static archive:", aiErr.message);
                try {
                    // Fallback: static Knowledge Base
                    const archiveQuestions = getKemetraQuestions(region, language);
                    const shuffled = [...archiveQuestions]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 10);
                    setQuestions(shuffled);
                } catch (err) {
                    console.error("[Kemetra] Knowledge Base Error:", err);
                }
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [region, language]);

    useEffect(() => {
        if (timeLeft > 0 && !showResults && selectedAnswer === null && !loading) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && selectedAnswer === null) {
            handleAnswer(null);
        }
    }, [timeLeft, showResults, selectedAnswer, loading]);

    const handleAnswer = (index) => {
        if (selectedAnswer !== null || questions.length === 0) return;

        setSelectedAnswer(index);
        const correct = index !== null && index === questions[currentQuestion].correct;
        setIsCorrect(correct);

        if (!correct) {
            playSound('failure');
        }

        if (correct) {
            setScore(prev => prev + 100 + timeLeft * 10);
            playSound('success');
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#D4AF37', '#F5DEB3', '#FFFFFF']
            });
        }

        setTimeout(async () => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setTimeLeft(15);
            } else {
                // ── Calculate the true final score ──────────────────────────
                const computedFinalScore = score + (correct ? 100 + timeLeft * 10 : 0);
                const clientXpGain = computedFinalScore;

                // Show results immediately with client-side XP
                setFinalScore(computedFinalScore);
                setXpData({ xpGain: clientXpGain, source: 'client' });
                setShowResults(true);

                // ── Persist to DB if logged in ──────────────────────────────
                if (user) {
                    setIsSaving(true);
                    try {
                        const result = await saveGameScore(user.id, computedFinalScore, 'ranked', region);
                        // Use server-confirmed xpGain if available, keep client value as fallback
                        setXpData({
                            xpGain: result.xpGain ?? clientXpGain,
                            newLevel: result.newLevel,
                            newXp: result.newXp,
                            saved: result.success,
                            source: 'server',
                        });
                    } catch (e) {
                        console.error('Unexpected Save Error:', e);
                        // Keep client-calculated XP shown
                    } finally {
                        setIsSaving(false);
                    }
                }
            }
        }, 2500);
    };

    if (loading) return (
        <div className="h-screen w-full bg-egypt-night flex flex-col items-center justify-center p-6">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-egypt-gold animate-spin mb-4" />
            <p className="font-egyptian text-egypt-gold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-sm sm:text-base text-center">{t('quiz.archiving')} {region}...</p>
        </div>
    );

    if (questions.length === 0) return (
        <div className="h-screen w-full bg-egypt-night flex flex-col items-center justify-center p-6">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-egypt-red mb-4" />
            <p className="font-egyptian text-egypt-gold tracking-[0.2em] uppercase text-sm sm:text-base text-center">The Oracles are silent. Try again later.</p>
            <button onClick={() => navigate('/globe')} className="mt-6 egypt-button text-sm">Return to Globe</button>
        </div>
    );

    return (
        <div className="relative w-full h-screen bg-egypt-night flex flex-col items-center justify-center px-3 sm:px-6 py-4 overflow-hidden">

            {/* ── Header ─────────────────────────────────── */}
            <div className="absolute top-0 left-0 w-full px-3 sm:px-8 lg:px-12 py-3 sm:py-5 flex justify-between items-center z-20 gap-2">
                <button
                    onClick={() => { playSound('click'); navigate('/globe'); }}
                    className="text-egypt-gold/60 hover:text-egypt-gold flex items-center gap-1.5 transition-colors font-egyptian tracking-widest uppercase text-[10px] sm:text-sm touch-manipulation"
                >
                    <ArrowLeft className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    <span className="hidden sm:inline">{t('quiz.quit')}</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-5">
                    <div className="flex items-center gap-1.5 sm:gap-3 bg-egypt-night-light/80 border border-egypt-gold/20 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full backdrop-blur-md">
                        <Timer className={`w-4 h-4 sm:w-5 sm:h-5 ${timeLeft < 5 ? 'text-egypt-red animate-pulse' : 'text-egypt-gold'}`} />
                        <span className={`font-egyptian text-base sm:text-xl ${timeLeft < 5 ? 'text-egypt-red' : 'text-egypt-gold'}`}>{timeLeft}s</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-3 bg-egypt-night-light/80 border border-egypt-gold/20 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full backdrop-blur-md">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-egypt-gold" />
                        <span className="font-egyptian text-base sm:text-xl text-egypt-gold">{score}</span>
                    </div>
                </div>

                <div className="text-egypt-gold/60 font-egyptian tracking-widest uppercase text-[10px] sm:text-sm mr-10 sm:mr-12">
                    {currentQuestion + 1}/{questions.length}
                </div>
            </div>

            {/* ── Quiz / Results ─────────────────────────── */}
            <AnimatePresence mode="wait">
                {!showResults ? (
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 w-full max-w-4xl mt-14 sm:mt-16"
                    >
                        {/* Question card */}
                        <div className="egypt-panel p-5 sm:p-8 lg:p-12 mb-4 sm:mb-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full bg-egypt-gold" />
                            <h2 className="text-base sm:text-xl lg:text-3xl font-egyptian text-egypt-gold mb-4 leading-tight pl-2">
                                {questions[currentQuestion].question}
                            </h2>
                            {selectedAnswer !== null && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={`p-3 sm:p-4 rounded border text-xs sm:text-sm ${isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-egypt-red/10 border-egypt-red/30 text-egypt-papyrus'}`}
                                >
                                    <p className="opacity-80 italic">{questions[currentQuestion].fact}</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Answer grid: 1 col on mobile, 2 on sm+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
                            {questions[currentQuestion].options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrectOption = index === questions[currentQuestion].correct;
                                const showWrong = isSelected && !isCorrect;
                                const showCorrect = selectedAnswer !== null && isCorrectOption;
                                return (
                                    <button
                                        key={index}
                                        disabled={selectedAnswer !== null}
                                        onClick={() => handleAnswer(index)}
                                        className={`
                                            relative p-4 sm:p-5 lg:p-6 text-left border-2 transition-all duration-300
                                            font-modern text-sm sm:text-base lg:text-lg rounded-sm touch-manipulation min-h-[52px] sm:min-h-[64px]
                                            ${selectedAnswer === null ? 'border-egypt-gold/20 hover:border-egypt-gold text-egypt-papyrus hover:bg-egypt-gold/5 active:bg-egypt-gold/10' : ''}
                                            ${showCorrect ? 'bg-green-600/30 border-green-500 text-white' : ''}
                                            ${showWrong ? 'bg-egypt-red/30 border-egypt-red text-white' : ''}
                                            ${selectedAnswer !== null && !showCorrect && !showWrong ? 'opacity-20' : ''}
                                        `}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="egypt-panel p-6 sm:p-10 lg:p-16 text-center max-w-2xl w-full"
                    >
                        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-egypt-gold mx-auto mb-4 sm:mb-6" />
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-egyptian text-egypt-gold mb-4 uppercase">{t('quiz.questComplete')}</h2>

                        <div className="space-y-5 sm:space-y-8">
                            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
                                {/* Final Score */}
                                <div className="bg-egypt-night/50 p-4 sm:p-6 border border-egypt-gold/10 rounded-sm">
                                    <span className="block text-[9px] sm:text-[10px] text-egypt-gold/40 uppercase mb-1 sm:mb-2">{t('quiz.finalScore')}</span>
                                    <span className="text-2xl sm:text-3xl font-egyptian text-egypt-gold">{finalScore}</span>
                                </div>

                                {/* XP Gained */}
                                <div className="bg-egypt-night/50 p-4 sm:p-6 border border-egypt-gold/10 rounded-sm relative">
                                    <span className="block text-[9px] sm:text-[10px] text-egypt-gold/40 uppercase mb-1 sm:mb-2">{t('quiz.xpGained')}</span>
                                    <span className="text-2xl sm:text-3xl font-egyptian text-egypt-gold">+{xpData?.xpGain ?? 0}</span>
                                    {/* Save status indicator */}
                                    {isSaving && (
                                        <div className="absolute top-2 right-2">
                                            <Loader2 className="w-3 h-3 text-egypt-gold/40 animate-spin" />
                                        </div>
                                    )}
                                    {!isSaving && xpData?.source === 'server' && (
                                        <div className="mt-1">
                                            {xpData.saved
                                                ? <span className="text-[8px] sm:text-[9px] text-green-400/70 font-modern uppercase tracking-widest">✓ Saved</span>
                                                : <span className="text-[8px] sm:text-[9px] text-yellow-400/60 font-modern uppercase tracking-widest">⚠ Sync pending</span>
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Level up notice */}
                            {xpData?.newLevel && xpData.newLevel > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-2 px-4 bg-egypt-gold/10 border border-egypt-gold/30 rounded-sm"
                                >
                                    <span className="font-egyptian text-egypt-gold text-xs sm:text-sm uppercase tracking-widest">
                                        ✦ Level {xpData.newLevel} Reached!
                                    </span>
                                </motion.div>
                            )}

                            {/* Guest notice */}
                            {!user && (
                                <p className="text-egypt-papyrus/35 text-[10px] sm:text-xs font-modern">
                                    {language === 'ar' ? '⚠ الضيوف لا يحتفظون بالـ XP. سجّل دخولك لحفظ تقدّمك.' : '⚠ Guest scores are not saved. Sign in to track your progress.'}
                                </p>
                            )}

                            <div className="flex gap-3 sm:gap-4">
                                <button onClick={() => navigate('/globe')} className="flex-1 egypt-button text-xs sm:text-sm">
                                    {t('quiz.exploreFurther')}
                                </button>
                                <button onClick={() => window.location.reload()} className="p-3 sm:p-4 border border-egypt-gold/20 text-egypt-gold hover:bg-egypt-gold/5 transition-all touch-manipulation">
                                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizScene;