// Game Configuration and Constants
const GAME_CONFIG = {
    maxTerms: 5,
    decisionsPerTerm: 10,
    baseStats: {
        military: 50,
        economy: 50,
        society: 50,
        science: 50,
        ecology: 50,
        diplomacy: 50
    },
    baseMetrics: {
        corruption: 30,
        satisfaction: 50
    }
};

// Stat Labels for UI
const STAT_LABELS = {
    military: 'Армия',
    society: 'Народ',
    ecology: 'Природа',
    economy: 'Бизнес',
    science: 'Наука',
    diplomacy: 'Мир'
};

// Advisor Information
const ADVISOR_BACKSTORIES = {
    military: {
        name: 'Генерал Железнов',
        catchPhrase: 'Сила — основа порядка',
        avatar: '⚔️',
        color: 'red'
    },
    economy: {
        name: 'Министр Златов',
        catchPhrase: 'Экономика решает всё',
        avatar: '💰',
        color: 'amber'
    },
    society: {
        name: 'Социолог Народова',
        catchPhrase: 'Народ — источник власти',
        avatar: '👥',
        color: 'pink'
    },
    science: {
        name: 'Академик Знаев',
        catchPhrase: 'Знание — сила будущего',
        avatar: '🔬',
        color: 'purple'
    },
    ecology: {
        name: 'Эколог Зеленова',
        catchPhrase: 'Природа — наш дом',
        avatar: '🌱',
        color: 'green'
    },
    diplomacy: {
        name: 'Посол Миров',
        catchPhrase: 'Мир через диалог',
        avatar: '🤝',
        color: 'cyan'
    }
};

// Animation and UI Constants
const UI_CONSTANTS = {
    ANIMATION_DURATION: 150,
    NOTIFICATION_DURATION: 2000,
    STREAK_THRESHOLD: 3,
    CARD_ROTATION_FACTOR: 0.03,
    CARD_SCALE_FACTOR: 0.0002,
    MIN_CARD_SCALE: 0.9,
    SWIPE_THRESHOLD: 60,
    CARD_TRANSLATE_DISTANCE: 300,
    CARD_ROTATION_DEGREES: 15
};

// Difficulty Names
const DIFFICULTY_NAMES = [
    'Стабильность', 'Стабильность', 
    'Напряжение', 'Напряжение', 
    'Кризис', 'Кризис', 
    'Хаос', 'Хаос'
];

// Color schemes for stats
const STAT_COLORS = {
    military: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        hover: 'hover:bg-red-500/20'
    },
    society: {
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        text: 'text-pink-400',
        hover: 'hover:bg-pink-500/20'
    },
    ecology: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        hover: 'hover:bg-green-500/20'
    },
    economy: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        hover: 'hover:bg-amber-500/20'
    },
    science: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        hover: 'hover:bg-purple-500/20'
    },
    diplomacy: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        hover: 'hover:bg-cyan-500/20'
    }
};

// Icon mappings for stats
const STAT_ICONS = {
    military: '⚔️',
    society: '👥',
    ecology: '🌱',
    economy: '💰',
    science: '🔬',
    diplomacy: '🤝'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_CONFIG,
        STAT_LABELS,
        ADVISOR_BACKSTORIES,
        UI_CONSTANTS,
        DIFFICULTY_NAMES,
        STAT_COLORS,
        STAT_ICONS
    };
}