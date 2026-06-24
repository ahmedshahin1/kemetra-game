export const translations = {
    en: {
        menu: {
            start: "Start Quest",
            continue: "Continue Journey",
            ranked: "Ranked Mode",
            explore: "Explore World",
            leaderboard: "Leaderboard",
            settings: "Settings",
            signOut: "Relinquish Throne (Sign Out)",
            scribe: "Logged Scribe",
            legacy: "Legacy of the Nile",
            tagline: "Journey through time and space. Master the geography of our world through the wisdom of the ancients."
        },
        settings: {
            title: "Settings & Preferences",
            language: "Language",
            sound: "Sound Effects",
            music: "Background Music",
            on: "On",
            off: "Off",
            back: "Back to Menu",
            credits: "Credits",
            version: "v1.0.0",
            developedBy: "Developed by Kemetra Expedition"
        },
        globe: {
            unlocked: "Unlocked",
            locked: "Locked",
            xpToUnlock: "XP to Unlock",
            explore: "Explore",
            quiz: "Quiz",
            back: "Back",
            legend: "Province Legend"
        },
        explore: {
            chronicle: "Region Chronicle",
            records: "Temporal Records",
            landmarks: "Key Landmarks",
            culture: "Cultural Essence",
            nexus: "Modern Nexus",
            challenge: "Challenge Quiz",
            back: "Back",
            ancientProvince: "Ancient Province"
        },
        quiz: {
            quit: "Quit Quest",
            step: "Step",
            questComplete: "Quest Complete",
            finalScore: "Final Score",
            xpGained: "XP Gained",
            newRank: "New Rank Confirmed",
            level: "Level",
            initiate: "Initiate",
            exploreFurther: "Explore Further",
            archiving: "Accessing the Kemetra Archives for"
        }
    },
    ar: {
        menu: {
            start: "ابدأ الرحلة",
            continue: "واصل المسيرة",
            ranked: "وضع التحدي",
            explore: "استكشف العالم",
            leaderboard: "لوحة الشرف",
            settings: "الإعدادات",
            signOut: "تنازل عن العرش (تسجيل الخروج)",
            scribe: "كاتب مسجل",
            legacy: "إرث النيل",
            tagline: "رحلة عبر الزمان والمكان. أتقن جغرافيا عالمنا من خلال حكمة القدماء."
        },
        settings: {
            title: "الإعدادات والتفضيلات",
            language: "اللغة",
            sound: "المؤثرات الصوتية",
            music: "الموسيقى الخلفية",
            on: "تشغيل",
            off: "إيقاف",
            back: "العودة للقائمة",
            credits: "الحقوق",
            version: "الإصدار 1.0.0",
            developedBy: "تطوير بعثة كميترا"
        },
        globe: {
            unlocked: "مفتوح",
            locked: "مغلق",
            xpToUnlock: "الخبرة المطلوبة للفتح",
            explore: "استكشاف",
            quiz: "اختبار",
            back: "عودة",
            legend: "دليل الأقاليم"
        },
        explore: {
            chronicle: "سجل الإقليم",
            records: "السجلات الزمنية",
            landmarks: "أبرز المعالم",
            culture: "الجوهر الثقافي",
            nexus: "الربط الحديث",
            challenge: "اختبار التحدي",
            back: "عودة",
            ancientProvince: "إقليم قديم"
        },
        quiz: {
            quit: "إنهاء المهمة",
            step: "خطوة",
            questComplete: "اكتملت المهمة",
            finalScore: "النتيجة النهائية",
            xpGained: "الخبرة المكتسبة",
            newRank: "تم تأكيد الرتبة الجديدة",
            level: "مستوى",
            initiate: "مبتدئ",
            exploreFurther: "استكشف المزيد",
            archiving: "جاري استرجاع أرشيف كميترا لـ"
        }
    }
};

export const useTranslation = (lang) => {
    return (path) => {
        const keys = path.split('.');
        let result = translations[lang];
        for (const key of keys) {
            if (result[key]) {
                result = result[key];
            } else {
                return path; // Fallback to path string if not found
            }
        }
        return result;
    };
};
