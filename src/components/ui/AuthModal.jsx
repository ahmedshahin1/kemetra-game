import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../services/supabase/client';
import { ensureProfileExists } from '../../services/supabase/database';
import { Lock, Mail, Loader2, Sparkles, X, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';

// ─── Map Supabase error codes / messages to friendly text ───────────
function friendlyError(err) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('invalid login credentials') || msg.includes('invalid credentials'))
        return { text: 'Wrong email or password. Please try again.', hint: 'Check that your email is correct and you\'ve confirmed it via the confirmation link sent to your email.' };
    if (msg.includes('email not confirmed'))
        return { text: 'Please confirm your email first.', hint: 'Check your inbox (and spam folder) for the confirmation link, then try logging in again.' };
    if (msg.includes('user already registered'))
        return { text: 'An account with this email already exists.', hint: 'Switch to Log In below.' };
    if (msg.includes('password should be at least') || msg.includes('password is too short'))
        return { text: 'Password must be at least 6 characters.', hint: null };
    if (msg.includes('rate limit') || msg.includes('too many'))
        return { text: 'Too many attempts. Please wait a moment and try again.', hint: null };
    if (msg.includes('network') || msg.includes('fetch'))
        return { text: 'Connection error. Check your internet and try again.', hint: null };
    return { text: err?.message || 'Something went wrong. Please try again.', hint: null };
}

// ─── Input Field ─────────────────────────────────────────────────────
const AuthInput = ({ type: initialType, placeholder, value, onChange, icon: Icon, id }) => {
    const [showPwd, setShowPwd] = useState(false);
    const isPassword = initialType === 'password';
    const type = isPassword ? (showPwd ? 'text' : 'password') : initialType;

    return (
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-egypt-gold/40 pointer-events-none" />
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                required
                value={value}
                onChange={onChange}
                autoComplete={isPassword ? 'current-password' : 'email'}
                className="w-full bg-egypt-night/60 border border-egypt-gold/20 focus:border-egypt-gold/60 p-3.5 sm:p-4 pl-11 pr-11 text-egypt-papyrus outline-none transition-all duration-200 text-sm rounded-sm placeholder:text-egypt-papyrus/30"
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-egypt-gold/30 hover:text-egypt-gold/70 transition-colors touch-manipulation"
                    tabIndex={-1}
                >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
};

// ─── Auth Modal ───────────────────────────────────────────────────────
const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'confirm'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   // { text, hint }

    const switchMode = (m) => { setMode(m); setError(null); };

    const NOT_CONFIGURED_ERROR = { text: 'The app is not connected to a database yet.', hint: 'The site owner needs to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the hosting provider\'s environment variables and redeploy.' };

    // ── Login ──────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isSupabaseConfigured) { setError(NOT_CONFIGURED_ERROR); return; }
        setLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
            if (err) throw err;
            if (!data.user) throw new Error('Login failed. Please try again.');
            
            // Ensure profile exists for this user
            await ensureProfileExists(data.user.id);
            
            onAuthSuccess(data.user);
            onClose();
        } catch (err) {
            setError(friendlyError(err));
        } finally {
            setLoading(false);
        }
    };

    // ── Sign Up ────────────────────────────────────────────────────
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!isSupabaseConfigured) { setError(NOT_CONFIGURED_ERROR); return; }
        if (password.length < 6) {
            setError({ text: 'Password must be at least 6 characters.', hint: null });
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase.auth.signUp({ email, password });
            if (err) throw err;

            // Email confirmation required — Supabase returns user but no session
            if (data.user && !data.session) {
                setMode('confirm');
                return;
            }

            // Confirmation disabled — logged in immediately
            if (data.user && data.session) {
                // Ensure profile exists for this user
                await ensureProfileExists(data.user.id);
                
                onAuthSuccess(data.user);
                onClose();
            }
        } catch (err) {
            setError(friendlyError(err));
        } finally {
            setLoading(false);
        }
    };

    // ── Guest ──────────────────────────────────────────────────────
    const handleGuest = async () => {
        if (!isSupabaseConfigured) { setError(NOT_CONFIGURED_ERROR); return; }
        setLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase.auth.signInAnonymously();
            if (err) throw err;
            onAuthSuccess(data.user);
            onClose();
        } catch (err) {
            setError(friendlyError(err));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-egypt-night/92 backdrop-blur-md p-0 sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="relative w-full sm:max-w-md overflow-hidden"
                style={{
                    background: 'linear-gradient(160deg, rgba(12,10,4,0.98) 0%, rgba(5,5,15,0.98) 100%)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: '1rem 1rem 0 0',
                    boxShadow: '0 -8px 60px rgba(212,175,55,0.12)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Gold accent top bar */}
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-egypt-gold/60 to-transparent" />

                {/* Drag handle (mobile) */}
                <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
                    <div className="w-8 h-1 rounded-full bg-egypt-gold/25" />
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-egypt-gold/35 hover:text-egypt-gold rounded-full hover:bg-egypt-gold/10 transition-all touch-manipulation z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Decorative sparkle */}
                <div className="absolute top-0 right-0 p-5 opacity-10 pointer-events-none">
                    <Sparkles className="w-14 h-14 text-egypt-gold" />
                </div>

                <div className="px-6 sm:px-10 pt-4 pb-8 sm:pb-10">
                    <AnimatePresence mode="wait">

                        {/* ── Email Confirmation screen ── */}
                        {mode === 'confirm' ? (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-4 sm:py-6"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-5">
                                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-egyptian text-egypt-gold uppercase tracking-wider mb-3">
                                    Confirm Your Email
                                </h2>
                                <p className="text-egypt-papyrus/70 font-modern text-sm leading-relaxed mb-2">
                                    We sent a confirmation link to
                                </p>
                                <p className="text-egypt-gold font-modern text-sm font-semibold mb-6 truncate">{email}</p>
                                <p className="text-egypt-papyrus/50 font-modern text-xs leading-relaxed mb-8">
                                    <span className="block mb-3">Click the link in the email to activate your account.</span>
                                    <span className="text-egypt-papyrus/35">Don't see it? Check your spam folder or wait a moment to try again.</span>
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => switchMode('login')}
                                        className="egypt-button w-full min-h-[48px] touch-manipulation text-sm"
                                    >
                                        Already Confirmed? Go to Login
                                    </button>
                                    <button
                                        onClick={() => { setEmail(''); setPassword(''); switchMode('login'); }}
                                        className="w-full py-3 border border-egypt-gold/20 text-egypt-gold/55 text-xs uppercase tracking-[0.2em] font-egyptian hover:bg-egypt-gold/5 transition-all rounded-sm touch-manipulation min-h-[44px]"
                                    >
                                        Use a Different Email
                                    </button>
                                    <button
                                        onClick={handleGuest}
                                        disabled={loading}
                                        className="mt-2 w-full py-3 border border-egypt-gold/10 text-egypt-gold/45 text-xs uppercase tracking-[0.2em] font-egyptian hover:bg-egypt-gold/5 transition-all rounded-sm touch-manipulation min-h-[44px]"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Continue as Guest · No Rank'}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key={mode} initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>

                                {/* Header */}
                                <div className="text-center mb-5 sm:mb-7">
                                    <h2 className="text-2xl sm:text-3xl font-egyptian text-egypt-gold uppercase tracking-[0.1em]">
                                        {mode === 'login' ? 'Enter Kemetra' : 'Join the Quest'}
                                    </h2>
                                    <p className="text-egypt-papyrus/45 font-modern text-[10px] sm:text-xs uppercase tracking-widest mt-1">
                                        {mode === 'login' ? 'Sign in to your account' : 'Create your scribe account'}
                                    </p>
                                </div>

                                {/* Error Banner */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-4 overflow-hidden"
                                        >
                                            <div className="p-3 sm:p-4 bg-egypt-red/8 border border-egypt-red/30 rounded-sm">
                                                <div className="flex items-start gap-2.5">
                                                    <AlertCircle className="w-4 h-4 text-egypt-red flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-egypt-red text-xs sm:text-sm font-modern leading-snug">{error.text}</p>
                                                        {error.hint && (
                                                            <p className="text-egypt-papyrus/50 text-[10px] sm:text-xs font-modern mt-1">{error.hint}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Form */}
                                <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="flex flex-col gap-3 sm:gap-4">
                                    <AuthInput
                                        id="kemetra-email"
                                        type="email"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(null); }}
                                        icon={Mail}
                                    />
                                    <AuthInput
                                        id="kemetra-password"
                                        type="password"
                                        placeholder={mode === 'signup' ? 'Create a password (6+ chars)' : 'Your password'}
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setError(null); }}
                                        icon={Lock}
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full egypt-button flex items-center justify-center gap-2 min-h-[48px] touch-manipulation mt-1"
                                    >
                                        {loading
                                            ? <Loader2 className="w-5 h-5 animate-spin" />
                                            : (mode === 'login' ? 'Sign In' : 'Create Account')
                                        }
                                    </button>
                                </form>

                                {/* Switch mode */}
                                <div className="mt-5 flex flex-col gap-3">
                                    <button
                                        onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                                        className="text-egypt-gold/55 text-xs uppercase tracking-widest hover:text-egypt-gold transition-colors font-egyptian py-1 touch-manipulation"
                                    >
                                        {mode === 'login'
                                            ? "No account? → Sign Up"
                                            : "Already registered? → Sign In"
                                        }
                                    </button>

                                    <div className="flex items-center gap-3 text-egypt-gold/20">
                                        <div className="h-px flex-1 bg-current" />
                                        <span className="text-[10px] uppercase font-egyptian">or</span>
                                        <div className="h-px flex-1 bg-current" />
                                    </div>

                                    <button
                                        onClick={handleGuest}
                                        disabled={loading}
                                        className="w-full py-3 border border-egypt-gold/20 text-egypt-gold/55 text-xs uppercase tracking-[0.18em] font-egyptian hover:bg-egypt-gold/5 hover:text-egypt-gold/80 hover:border-egypt-gold/35 transition-all rounded-sm touch-manipulation min-h-[44px]"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Continue as Guest · No Rank'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthModal;
