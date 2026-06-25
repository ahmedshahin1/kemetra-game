import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const MuteButton = () => {
    const { isMuted, toggleMute } = useAudio();

    return (
        <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[60] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-egypt-gold/25 text-egypt-gold/70 hover:text-egypt-gold hover:border-egypt-gold/50 transition-all touch-manipulation"
            style={{ background: 'rgba(10,10,20,0.7)', backdropFilter: 'blur(12px)' }}
        >
            {isMuted
                ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            }
        </button>
    );
};

export default MuteButton;
