/**
 * Kemetra Historical Archives
 * Ground truth for all regional data and quiz questions.
 * Supports English (en) and Arabic (ar).
 */

export const KEMETRA_KNOWLEDGE_BASE = {
    'Cairo': {
        en: {
            summary: "The heart of Egypt, where Memphis meets medieval splendor. Known in antiquity as 'Mennufer' (the Beautiful).",
            landmarks: ["Step Pyramid of Djoser", "Memphis Museum", "Bent Pyramid", "Saladin Citadel"],
            culture: "A layering of Pharaonic, Coptic, and Islamic heritage.",
            economy: "Administration, tourism, and traditional artisan crafts.",
            eras: [
                { id: 'OldKingdom', era: '2686–2181 BCE', title: 'Old Kingdom (Memphis)', content: 'Memphis was the first capital of unified Egypt. The Step Pyramid at Saqqara revolutionized stone architecture.' },
                { id: 'MiddleKingdom', era: '2055–1650 BCE', title: 'Middle Kingdom', content: 'Remained the strategic center for trade and religious worship of the god Ptah.' },
                { id: 'NewKingdom', era: '1550–1069 BCE', title: 'New Kingdom', content: 'Primary military headquarters for the empire; site of massive royal villas.' },
                { id: 'GrecoRoman', era: '332 BCE–641 CE', title: 'Greco-Roman', content: 'Administrative base for Roman legions in the north.' },
                { id: 'Islamic', era: '641 CE–Present', title: 'Islamic (Founding)', content: 'Birth of Fustat and later Al-Qahira, becoming the center of the Islamic world.' }
            ],
            quizzes: [
                { question: "What was the name of the first capital of unified Egypt, located near modern Cairo?", options: ["Thebes", "Memphis", "Alexandria", "Avaris"], correct: 1, fact: "Memphis was known as 'The White Walls' and served as the capital during the Old Kingdom." },
                { question: "Which architect designed the Step Pyramid at Saqqara for King Djoser?", options: ["Hemiunu", "Senenmut", "Imhotep", "Khaemwaset"], correct: 2, fact: "Imhotep was later deified as a god of medicine and wisdom." },
                { question: "What does the Arabic name 'Al-Qahira' mean?", options: ["The Victorious", "The Beautiful", "The Ancient", "The Great"], correct: 0, fact: "The city was named Al-Qahira by the Fatimids in 969 CE." }
            ]
        },
        ar: {
            summary: "قلب مصر، حيث تلتقي منف بالأمجاد الإسلامية. عُرفت قديماً باسم 'من-نفر' أي (الجميلة).",
            landmarks: ["هرم زوسر المدرج", "متحف ميت رهينة", "الهرم المنحني", "قلعة صلاح الدين"],
            culture: "مزيج من التراث الفرعوني والقبطي والإسلامي.",
            economy: "الإدارة، السياحة، والحرف اليدوية التقليدية.",
            eras: [
                { id: 'OldKingdom', era: '2686–2181 ق.م', title: 'الدولة القديمة (منف)', content: 'كانت منف العاصمة الأولى لمصر الموحدة. أحدث هرم سقارة المدرج ثورة في العمارة الحجرية.' },
                { id: 'MiddleKingdom', era: '2055–1650 ق.م', title: 'الدولة الوسطى', content: 'ظلت المركز الاستراتيجي للتجارة وعبادة الإله بتاح.' },
                { id: 'NewKingdom', era: '1550–1069 ق.م', title: 'الدولة الحديثة', content: 'المقر العسكري الرئيسي للإمبراطورية؛ وموقع القصور الملكية الضخمة.' },
                { id: 'GrecoRoman', era: '332 ق.م–641 م', title: 'العصر اليوناني الروماني', content: 'قاعدة إدارية للفيلق الروماني في الشمال.' },
                { id: 'Islamic', era: '641 م–الآن', title: 'العصر الإسلامي (التأسيس)', content: 'نشأة الفسطاط ولاحقاً القاهرة، لتصبح مركز العالم الإسلامي.' }
            ],
            quizzes: [
                { question: "ما هو اسم العاصمة الأولى لمصر الموحدة، الواقعة قرب القاهرة الحالية؟", options: ["طيبة", "منف", "الإسكندرية", "أواريس"], correct: 1, fact: "عُرفت منف باسم 'الجدار الأبيض' وكانت عاصمة الدولة القديمة." },
                { question: "من هو المهندس الذي صمم هرم سقارة المدرج للملك زوسر؟", options: ["حميونو", "سننموت", "إيمتحتب", "خعمواس"], correct: 2, fact: "تم تأليه إيمتحتب لاحقاً كإله للطب والحكمة." },
                { question: "ماذا يعني اسم 'القاهرة' باللغة العربية؟", options: ["المنتصرة/القوية", "الجميلة", "القديمة", "العظيمة"], correct: 0, fact: "سمى الفاطميون المدينة بالقاهرة عند تأسيسها عام 969م." }
            ]
        }
    },
    'Alexandria': {
        en: {
            summary: "The Pearl of the Mediterranean, founded by Alexander the Great. A fusion of Greek and Egyptian wisdom.",
            landmarks: ["Lighthouse site", "Qaitbay Citadel", "Kom El Shoqafa", "Pompey's Pillar"],
            culture: "Intellectual cosmopolitan center of the ancient world.",
            eras: [
                { id: 'GrecoRoman', era: '332 BCE-30 BCE', title: 'Ptolemaic Era', content: 'Capital of the world for centuries. Home to the legendary Great Library and Pharos Lighthouse.' },
                { id: 'Islamic', era: 'Post-642 CE', title: 'Islamic Era', content: 'Transformed into a vital naval base to defend the Mediterranean coast.' }
            ],
            quizzes: [
                { question: "In what year was Alexandria founded by Alexander the Great?", options: ["500 BC", "331 BC", "150 BC", "30 BC"], correct: 1, fact: "Alexander founded it on the site of a small village named Rakhotis." },
                { question: "Which ancient wonder once stood in Alexandria's harbor?", options: ["Hanging Gardens", "Pharos Lighthouse", "Temple of Artemis", "Colossus of Rhodes"], correct: 1, fact: "It was one of the tallest man-made structures in the ancient world for centuries." }
            ]
        },
        ar: {
            summary: "عروس البحر المتوسط، أسسها الإسكندر الأكبر. انصهار للحكمة اليونانية والمصرية.",
            landmarks: ["موقع الفنار", "قلعة قايتباي", "كوم الشقافة", "عمود السواري"],
            culture: "مركز فكري عالمي في العالم القديم.",
            eras: [
                { id: 'GrecoRoman', era: '332 ق.م-30 ق.م', title: 'العصر البطلمي', content: 'عاصمة العالم لقرون. موطن المكتبة الكبرى ومنارة الإسكندرية الأسطورية.' },
                { id: 'Islamic', era: 'بعد 642 م', title: 'العصر الإسلامي', content: 'تحولت إلى قاعدة بحرية حيوية للدفاع عن ساحل البحر المتوسط.' }
            ],
            quizzes: [
                { question: "في أي عام أسس الإسكندر الأكبر مدينة الإسكندرية؟", options: ["500 ق.م", "331 ق.م", "150 ق.م", "30 ق.م"], correct: 1, fact: "أسسها الإسكندر على موقع قرية صغيرة تسمى راقودة." },
                { question: "أي من عجائب العالم القديم كانت تقع في ميناء الإسكندرية؟", options: ["حدائق بابل", "منارة الإسكندرية", "معبد أرتميس", "عملاق رودس"], correct: 1, fact: "كانت واحدة من أطول المنشآت التي بناها الإنسان في العالم القديم." }
            ]
        }
    },
    'Luxor': {
        en: {
            summary: "Ancient Thebes, the 'City of a Hundred Gates'. The world's largest open-air museum.",
            landmarks: ["Karnak", "Valley of the Kings", "Luxor Temple", "Hatshepsut Temple"],
            eras: [
                { id: 'NewKingdom', era: 'Golden Age', title: 'New Kingdom', content: 'The peak of Egyptian power. Every major pharaoh added to the temples of Karnak.' }
            ],
            quizzes: [
                { question: "What was the ancient name for Luxor when it was the capital?", options: ["Memphis", "Thebes", "Avaris", "Tanis"], correct: 1, fact: "The ancient Egyptians called it 'Waset', while the Greeks called it 'Thebes'." },
                { question: "In which valley were New Kingdom pharaohs buried?", options: ["Valley of Queens", "Valley of Nobles", "Valley of the Kings", "Valley of the Sun"], correct: 2, fact: "Over 60 tombs have been discovered there, including Tutankhamun." }
            ]
        },
        ar: {
            summary: "طيبة القديمة، 'مدينة المائة باب'. أكبر متحف مفتوح في العالم.",
            landmarks: ["الكرنك", "وادي الملوك", "معبد الأقصر", "معبد حتشبسوت"],
            eras: [
                { id: 'NewKingdom', era: 'العصر الذهبي', title: 'الدولة الحديثة', content: 'ذروة القوة المصرية. ساهم كل فرعون عظيم في توسيع معابد الكرنك.' }
            ],
            quizzes: [
                { question: "ما هو الاسم القديم لمحافظة الأقصر عندما كانت العاصمة؟", options: ["منف", "طيبة", "أواريس", "تانيس"], correct: 1, fact: "أطلق عليها المصريون القدماء (واست)، بينما سماها اليونانيون (طيبة)." },
                { question: "في أي وادي دُفن ملوك الدولة الحديثة؟", options: ["وادي الملكات", "وادي النبلاء", "وادي الملوك", "وادي الشمس"], correct: 2, fact: "تم اكتشاف أكثر من 60 مقبرة هناك، منها مقبرة توت عنخ آمون." }
            ]
        }
    }
    // Additional governorates will be migrated into this dual-language format iteratively.
};

export const getKemetraFactSheet = (region, lang = 'en') => {
    const normalized = region.toLowerCase().trim();
    const key = Object.keys(KEMETRA_KNOWLEDGE_BASE).find(k => k.toLowerCase() === normalized);
    const regionObj = KEMETRA_KNOWLEDGE_BASE[key] || KEMETRA_KNOWLEDGE_BASE['Cairo'];
    return regionObj[lang] || regionObj['en'];
};

export const getKemetraQuestions = (region, lang = 'en') => {
    const sheet = getKemetraFactSheet(region, lang);
    return sheet.quizzes || getKemetraFactSheet('Cairo', lang).quizzes;
};
