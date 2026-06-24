// Enhanced Governorates with Detailed Location Information
export const GOVERNORATES_ENHANCED = [
    {
        id: 'cairo',
        name: 'Cairo',
        name_ar: 'القاهرة',
        xpRequired: 0,
        lat: 30.0444,
        lng: 31.2357,
        description_en: 'The heart of Egypt, home to ancient treasures and modern wonders',
        description_ar: 'قلب مصر، موطن الكنوز القديمة والعجائب الحديثة',
        locations: [
            {
                id: 'cairo_pyramids',
                name: 'Giza Plateau',
                name_ar: 'هضبة الجيزة',
                subtitle: 'Great Pyramids of Egypt',
                image: '/locations/cairo-pyramids.jpg'
            },
            {
                id: 'cairo_museum',
                name: 'Egyptian Museum',
                name_ar: 'المتحف المصري',
                subtitle: 'World\'s finest pharaonic collection',
                image: '/locations/cairo-museum.jpg'
            },
            {
                id: 'cairo_khan',
                name: 'Khan El-Khalili',
                name_ar: 'خان الخليلي',
                subtitle: 'Historic bazaar and cultural hub',
                image: '/locations/cairo-khan.jpg'
            }
        ],
        historicalPeriods: [
            {
                period: 'Ancient (3100-332 BC)',
                period_ar: 'العصر القديم (3100-332 قبل الميلاد)',
                description: 'Capital of powerful pharaonic kingdoms, home to the Great Pyramids and Sphinx'
            },
            {
                period: 'Greek (332-30 BC)',
                period_ar: 'العصر اليوناني (332-30 قبل الميلاد)',
                description: 'Hellenistic influence spreads through Egypt under Ptolemaic rule'
            },
            {
                period: 'Roman (30 BC-395 AD)',
                period_ar: 'العصر الروماني (30 قبل الميلاد - 395 بعد الميلاد)',
                description: 'Roman province with continued pharaonic traditions'
            },
            {
                period: 'Islamic (641 AD-present)',
                period_ar: 'العصر الإسلامي (641 م - الحاضر)',
                description: 'Cairo becomes major Islamic cultural center with magnificent mosques'
            },
            {
                period: 'Modern',
                period_ar: 'العصر الحديث',
                description: 'Capital of modern Egypt, blending ancient heritage with contemporary life'
            }
        ],
        landmarks: [
            'Great Pyramid of Khufu',
            'Pyramid of Khafre',
            'Pyramid of Menkaure',
            'The Great Sphinx',
            'Egyptian Museum',
            'Citadel of Saladin',
            'Muhammad Ali Mosque'
        ],
        facts: [
            'The Great Pyramid was the tallest man-made structure for 3,800 years',
            'Cairo has a population of over 20 million people',
            'The Sphinx has a lion\'s body and a human head, likely representing a pharaoh',
            'The Egyptian Museum houses over 120,000 artifacts',
            'Khan El-Khalili has been a marketplace for nearly 600 years'
        ]
    },
    {
        id: 'alexandria',
        name: 'Alexandria',
        name_ar: 'الإسكندرية',
        xpRequired: 0,
        lat: 31.2001,
        lng: 29.9187,
        description_en: 'Pearl of the Mediterranean, gateway between East and West',
        description_ar: 'لؤلؤة المتوسط، البوابة بين الشرق والغرب',
        locations: [
            {
                id: 'alex_library',
                name: 'Bibliotheca Alexandrina',
                name_ar: 'مكتبة الإسكندرية',
                subtitle: 'Modern reconstruction of ancient library',
                image: '/locations/alex-library.jpg'
            },
            {
                id: 'alex_citadel',
                name: 'Qaitbay Citadel',
                name_ar: 'قلعة قايتباي',
                subtitle: 'Built on ancient lighthouse ruins',
                image: '/locations/alex-citadel.jpg'
            },
            {
                id: 'alex_roman',
                name: 'Roman Amphitheater',
                name_ar: 'الأمفيتياتر الروماني',
                subtitle: 'Rare intact Roman theater',
                image: '/locations/alex-roman.jpg'
            }
        ],
        historicalPeriods: [
            {
                period: 'Greek (332-30 BC)',
                period_ar: 'العصر اليوناني (332-30 قبل الميلاد)',
                description: 'Founded by Alexander the Great, became world\'s greatest library center'
            },
            {
                period: 'Roman (30 BC-395 AD)',
                period_ar: 'العصر الروماني (30 قبل الميلاد - 395 بعد الميلاد)',
                description: 'Roman cultural hub with significant population and influence'
            },
            {
                period: 'Islamic (641 AD-present)',
                period_ar: 'العصر الإسلامي (641 م - الحاضر)',
                description: 'Major Islamic port city, Qaitbay Citadel built to defend against invasions'
            },
            {
                period: 'Ottoman',
                period_ar: 'العصر العثماني',
                description: 'Strategic port city under Ottoman control'
            },
            {
                period: 'Modern',
                period_ar: 'العصر الحديث',
                description: 'Still a major Mediterranean port and cultural destination'
            }
        ],
        landmarks: [
            'Bibliotheca Alexandrina',
            'Qaitbay Citadel',
            'Roman Amphitheater',
            'Pompey\'s Pillar',
            'Catacombs of Kom el-Shoqafa'
        ],
        facts: [
            'Alexandria was home to the Great Library, containing over 700,000 scrolls',
            'The city was founded in 331 BC by Alexander the Great',
            'Pharos of Alexandria was one of the Seven Wonders of the Ancient World',
            'The Citadel of Qaitbay was built using stones from the ancient lighthouse',
            'Alexandria is Egypt\'s primary seaport and largest Mediterranean city'
        ]
    },
    {
        id: 'luxor',
        name: 'Luxor',
        name_ar: 'الأقصر',
        xpRequired: 500,
        lat: 25.6872,
        lng: 32.6396,
        description_en: 'World\'s greatest open-air museum, ancient Thebes',
        description_ar: 'أعظم متحف مفتوح في العالم، طيبة القديمة',
        locations: [
            {
                id: 'luxor_temple',
                name: 'Luxor Temple',
                name_ar: 'معبد الأقصر',
                subtitle: 'Temple built by Amenhotep III',
                image: '/locations/luxor-temple.jpg'
            },
            {
                id: 'karnak_temple',
                name: 'Karnak Temple Complex',
                name_ar: 'معبد الكرنك',
                subtitle: 'Largest temple complex in the world',
                image: '/locations/karnak.jpg'
            },
            {
                id: 'valley_kings',
                name: 'Valley of the Kings',
                name_ar: 'وادي الملوك',
                subtitle: 'Royal burial site of pharaohs',
                image: '/locations/valley-kings.jpg'
            }
        ],
        historicalPeriods: [
            {
                period: 'Ancient (3100-332 BC)',
                period_ar: 'العصر القديم (3100-332 قبل الميلاد)',
                description: 'Thebes was capital of Egypt during New Kingdom, religious and political center'
            },
            {
                period: 'Greek (332-30 BC)',
                period_ar: 'العصر اليوناني (332-30 قبل الميلاد)',
                description: 'Greek rulers honored ancient temples and traditions'
            },
            {
                period: 'Roman (30 BC-395 AD)',
                period_ar: 'العصر الروماني (30 قبل الميلاد - 395 بعد الميلاد)',
                description: 'Maintained as important pilgrimage site for ancient gods'
            },
            {
                period: 'Islamic',
                period_ar: 'العصر الإسلامي',
                description: 'Important city during Islamic Egypt, local Coptic churches'
            },
            {
                period: 'Modern',
                period_ar: 'العصر الحديث',
                description: 'World tourism destination for Egyptology enthusiasts'
            }
        ],
        landmarks: [
            'Luxor Temple',
            'Karnak Temple Complex',
            'Valley of the Kings',
            'Valley of the Queens',
            'Temple of Hatshepsut',
            'Colossi of Memnon'
        ],
        facts: [
            'Karnak is the largest temple complex ever built',
            'Valley of the Kings contains 62 royal tombs including Tutankhamun',
            'Luxor was called Thebes and was capital during the New Kingdom',
            'The Colossi of Memnon are 18-meter statues guarding the temple entrance',
            'Over 30 pharaohs were buried in the Valley of the Kings'
        ]
    },
    {
        id: 'aswan',
        name: 'Aswan',
        name_ar: 'أسوان',
        xpRequired: 1000,
        lat: 24.0889,
        lng: 32.8998,
        description_en: 'Ancient trade hub and gateway to Nubia',
        description_ar: 'مركز تجاري قديم وبوابة النوبة',
        locations: [
            {
                id: 'aswan_abu_simbel',
                name: 'Abu Simbel Temples',
                name_ar: 'معابد أبو سمبل',
                subtitle: 'Massive temples carved into rock',
                image: '/locations/abu-simbel.jpg'
            },
            {
                id: 'aswan_philae',
                name: 'Temple of Philae',
                name_ar: 'معبد فيلة',
                subtitle: 'Island temple dedicated to Isis',
                image: '/locations/philae.jpg'
            },
            {
                id: 'aswan_market',
                name: 'Aswan Market',
                name_ar: 'سوق أسوان',
                subtitle: 'Traditional Nubian marketplace',
                image: '/locations/aswan-market.jpg'
            }
        ],
        historicalPeriods: [
            {
                period: 'Ancient (3100-332 BC)',
                period_ar: 'العصر القديم (3100-332 قبل الميلاد)',
                description: 'Syene was major trade center for ivory, incense, and granite'
            },
            {
                period: 'Greek (332-30 BC)',
                period_ar: 'العصر اليوناني (332-30 قبل الميلاد)',
                description: 'Continued as important port and trade hub'
            },
            {
                period: 'Roman (30 BC-395 AD)',
                period_ar: 'العصر الروماني (30 قبل الميلاد - 395 بعد الميلاد)',
                description: 'Roman military garrison and trade station'
            },
            {
                period: 'Islamic',
                period_ar: 'العصر الإسلامي',
                description: 'Maintained importance as southern Egypt\'s major city'
            },
            {
                period: 'Modern',
                period_ar: 'العصر الحديث',
                description: 'Gateway to Abu Simbel and Nubian culture'
            }
        ],
        landmarks: [
            'Abu Simbel Temples',
            'Temple of Philae',
            'Aswan High Dam',
            'Aswan Low Dam',
            'Nubian Museum',
            'Island of Elephantine'
        ],
        facts: [
            'Abu Simbel temples were relocated 64 meters during Lake Nasser construction',
            'The two statues at Abu Simbel are each 20 meters tall',
            'Philae Temple was dedicated to the goddess Isis',
            'Aswan granite was used to build pyramids and temples',
            'The Aswan High Dam is one of the largest embankment dams in the world'
        ]
    }
];

/**
 * Get enhanced governorate data
 */
export const getGovernorateEnhanced = (govId) => {
    return GOVERNORATES_ENHANCED.find(g => g.id === govId);
};

/**
 * Get all locations across governorates
 */
export const getAllLocations = () => {
    return GOVERNORATES_ENHANCED.reduce((acc, gov) => [
        ...acc,
        ...gov.locations.map(loc => ({ ...loc, governorate_id: gov.id, governorate_name: gov.name }))
    ], []);
};
