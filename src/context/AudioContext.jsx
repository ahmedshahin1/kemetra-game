import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
        const saved = localStorage.getItem('kemetra_music');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('kemetra_sounds');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const musicRef = useRef(null);

    useEffect(() => {
        // Initialize background music
        musicRef.current = new Audio('/audio/background.mp3');
        musicRef.current.loop = true;
        musicRef.current.volume = 0.4;

        if (isMusicEnabled) {
            // Browsers often block auto-play without user interaction
            const playMusic = () => {
                musicRef.current.play().catch(e => console.log("Autoplay prevented:", e));
                window.removeEventListener('click', playMusic);
            };
            window.addEventListener('click', playMusic);
        }

        return () => {
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!musicRef.current) return;

        if (isMusicEnabled) {
            musicRef.current.play().catch(e => console.log("Playback error:", e));
        } else {
            musicRef.current.pause();
        }
        localStorage.setItem('kemetra_music', JSON.stringify(isMusicEnabled));
    }, [isMusicEnabled]);

    useEffect(() => {
        localStorage.setItem('kemetra_sounds', JSON.stringify(isSoundEnabled));
    }, [isSoundEnabled]);

    const playSound = (soundType) => {
        if (!isSoundEnabled) return;

        const audio = new Audio(`/audio/${soundType}.mp3`);
        audio.volume = 0.6;
        audio.play().catch(e => console.log("Sound effect error:", e));
    };

    return (
        <AudioContext.Provider value={{
            isMusicEnabled,
            setIsMusicEnabled,
            isSoundEnabled,
            setIsSoundEnabled,
            playSound
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
