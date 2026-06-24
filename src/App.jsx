import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './scenes/MainMenu/MainMenu';
import GlobeScene from './scenes/GlobeScene/GlobeScene';
import QuizScene from './scenes/QuizScene/QuizScene';
import ExploreScene from './scenes/ExploreScene/ExploreScene';
import LeaderboardScene from './scenes/LeaderboardScene/LeaderboardScene';
import SettingsScene from './scenes/SettingsScene/SettingsScene';
import AchievementsScene from './scenes/AchievementsScene/AchievementsScene';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';

function App() {
    return (
        <LanguageProvider>
            <AudioProvider>
                <Router>
                    <div className="relative w-full h-screen bg-egypt-night overflow-hidden">
                        <Routes>
                            <Route path="/" element={<MainMenu />} />
                            <Route path="/globe" element={<GlobeScene />} />
                            <Route path="/quiz" element={<QuizScene />} />
                            <Route path="/explore" element={<ExploreScene />} />
                            <Route path="/achievements" element={<AchievementsScene />} />
                            <Route path="/leaderboard" element={<LeaderboardScene />} />
                            <Route path="/settings" element={<SettingsScene />} />
                        </Routes>
                    </div>
                </Router>
            </AudioProvider>
        </LanguageProvider>
    );
}

export default App;
