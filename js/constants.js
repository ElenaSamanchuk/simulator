// Константы игры - точная копия из constants/gameData.ts
const GAME_CONFIG = {
    maxTerms: 5,
    decisionsPerTerm: 10,
    initialStats: {
        military: 50,
        society: 50,
        ecology: 50,
        economy: 50,
        science: 50,
        diplomacy: 50
    },
    initialMetrics: {
        corruption: 30,
        satisfaction: 50
    },
    minSwipeDistance: 100,
    accumulativeThreshold: 5
};

const STAT_LABELS = {
    military: 'Армия',
    society: 'Народ',
    ecology: 'Природа',
    economy: 'Бизнес',
    science: 'Наука',
    diplomacy: 'Мир'
};

const DIFFICULTY_MODIFIERS = {
    1: { effectMultiplier: 1.0, eventChance: 0.05, accumulativeRate: 0.5 },
    2: { effectMultiplier: 1.1, eventChance: 0.08, accumulativeRate: 0.7 },
    3: { effectMultiplier: 1.2, eventChance: 0.12, accumulativeRate: 1.0 },
    4: { effectMultiplier: 1.3, eventChance: 0.15, accumulativeRate: 1.2 },
    5: { effectMultiplier: 1.4, eventChance: 0.18, accumulativeRate: 1.5 },
    6: { effectMultiplier: 1.5, eventChance: 0.22, accumulativeRate: 1.8 },
    7: { effectMultiplier: 1.6, eventChance: 0.25, accumulativeRate: 2.0 },
    8: { effectMultiplier: 1.8, eventChance: 0.30, accumulativeRate: 2.5 }
};

const ADVISOR_BACKSTORIES = {
    military: {
        name: 'ГЕНЕРАЛ СТРАТЕГ',
        fullName: 'Маркус "Железный Кулак" Стратег',
        background: 'Ветеран трех войн, потерял левую руку в битве за Восточные рубежи. Верит, что только сильная армия может защитить нацию от хаоса.',
        motivation: 'Предотвратить повторение войны, которая унесла жизни его солдат',
        catchPhrase: 'Лучше быть готовым к войне и не воевать, чем быть мирным и беззащитным.',
        loyaltyTrigger: { military: 70 }
    },
    society: {
        name: 'ДИРЕКТОР СОЦИУМ',
        fullName: 'Доктор Анна Социум',
        background: 'Выросла в бедном районе, стала социологом благодаря государственным программам. Посвятила жизнь улучшению жизни простых людей.',
        motivation: 'Создать справедливое общество, где каждый имеет равные возможности',
        catchPhrase: 'Народ - это не статистика, это живые люди с надеждами и мечтами.',
        loyaltyTrigger: { society: 70 }
    },
    ecology: {
        name: 'МИНИСТР ЭКО',
        fullName: 'Профессор Верн Эко',
        background: 'Климатолог, который предсказал последние природные катастрофы. Его предупреждения игнорировались до тех пор, пока не стало слишком поздно.',
        motivation: 'Спасти планету для будущих поколений, пока есть время',
        catchPhrase: 'Природа не прощает ошибок - у нас есть только один шанс.',
        loyaltyTrigger: { ecology: 70 }
    },
    economy: {
        name: 'МИНИСТР ФИНАНСОВ',
        fullName: 'Олигарх Богдан Финансов',
        background: 'Бывший торговец, который построил финансовую империю с нуля. Понимает, что без стабильной экономики рухнет вся страна.',
        motivation: 'Создать процветающую экономику, которая обеспечит всех работой',
        catchPhrase: 'Деньги - это кровь государства. Без кровообращения организм умирает.',
        loyaltyTrigger: { economy: 70 }
    },
    science: {
        name: 'ПРОФЕССОР КОСМОС',
        fullName: 'Доктор Альберт "Звездный" Космос',
        background: 'Гениальный физик, который работал над секретными космическими проектами. Верит, что будущее человечества - среди звезд.',
        motivation: 'Вывести человечество на новый уровень развития через науку',
        catchPhrase: 'Вселенная бесконечна, и наши возможности тоже должны быть бесконечными.',
        loyaltyTrigger: { science: 70 }
    },
    diplomacy: {
        name: 'МИНИСТР ДИПЛОМАТИИ',
        fullName: 'Леди Элеонора Дипломатия',
        background: 'Наследница дипломатической династии, владеет 7 языками. Считает, что любой конфликт можно решить переговорами.',
        motivation: 'Достичь мира через взаимопонимание и сотрудничество',
        catchPhrase: 'Слово сильнее меча, если знать, как им пользоваться.',
        loyaltyTrigger: { diplomacy: 70 }
    }
};

const RANDOM_EVENTS = [
    {
        id: 'climate_disaster',
        title: 'КЛИМАТИЧЕСКАЯ КАТАСТРОФА',
        description: 'Профессор Эко был прав. Годы пренебрежения экологией привели к серии разрушительных природных катастроф.',
        type: 'disaster',
        probability: 0.2,
        severity: 'catastrophic',
        accumulativeTrigger: 'ecology_neglect',
        effects: { ecology: -25, economy: -15, society: -10 },
        satisfactionEffect: -20,
        gameOverRisk: true,
        storyImpact: 'Профессор Эко теряет доверие к правительству'
    },
    {
        id: 'military_coup',
        title: 'ВОЕННЫЙ ПЕРЕВОРОТ',
        description: 'Генерал Стратег не смог больше терпеть слабость армии. Военные захватили ключевые объекты и требуют отставки правительства.',
        type: 'war',
        probability: 0.15,
        severity: 'catastrophic',
        accumulativeTrigger: 'military_weakness',
        effects: { military: -40, society: -30, diplomacy: -20 },
        satisfactionEffect: -30,
        gameOverRisk: true,
        storyImpact: 'Генерал Стратег становится военным диктатором'
    },
    {
        id: 'economic_collapse',
        title: 'ЭКОНОМИЧЕСКИЙ КОЛЛАПС',
        description: 'Предупреждения Министра Финансов оказались пророческими. Финансовая система рухнула, началась гиперинфляция.',
        type: 'economic',
        probability: 0.18,
        severity: 'catastrophic',
        accumulativeTrigger: 'economic_instability',
        effects: { economy: -35, society: -25, diplomacy: -15 },
        corruptionEffect: 25,
        satisfactionEffect: -40,
        gameOverRisk: true,
        storyImpact: 'Министр Финансов уходит в отставку в знак протеста'
    },
    {
        id: 'revolution',
        title: 'НАРОДНАЯ РЕВОЛЮЦИЯ',
        description: 'Доктор Социум пыталась предупредить, но было слишком поздно. Народное недовольство переросло в полномасштабную революцию.',
        type: 'diplomatic',
        probability: 0.2,
        severity: 'catastrophic',
        accumulativeTrigger: 'social_unrest',
        effects: { society: -40, economy: -20, military: -15 },
        satisfactionEffect: -50,
        gameOverRisk: true,
        storyImpact: 'Доктор Социум присоединяется к революционерам'
    },
    {
        id: 'cyber_attack',
        title: 'КИБЕРАТАКА НОВОГО ПОКОЛЕНИЯ',
        description: 'Профессор Космос предупреждал об уязвимостях в квантовых сетях. Хакеры использовали ИИ для массированной атаки.',
        type: 'technology',
        probability: 0.12,
        severity: 'major',
        requirements: { science: { min: 50 } },
        effects: { science: -20, economy: -15, military: -10 },
        corruptionEffect: 15,
        temporaryEffects: {
            duration: 2,
            effects: { science: -10, economy: -5 },
            description: 'Восстановление систем'
        },
        storyImpact: 'Профессор Космос требует ужесточения кибербезопасности'
    },
    {
        id: 'pandemic',
        title: 'НОВАЯ ПАНДЕМИЯ',
        description: 'Неизвестный вирус начал распространяться. Медицинская система на грани коллапса.',
        type: 'epidemic',
        probability: 0.07,
        severity: 'major',
        effects: { society: -25, economy: -20, science: 10 },
        satisfactionEffect: -20,
        temporaryEffects: {
            duration: 4,
            effects: { society: -5, economy: -10 },
            description: 'Борьба с эпидемией'
        },
        storyImpact: 'Требуются экстренные медицинские меры'
    },
    {
        id: 'alien_contact',
        title: 'ПЕРВЫЙ КОНТАКТ С ВНЕЗЕМНОЙ ЦИВИЛИЗАЦИЕЙ',
        description: 'Мечта Профессора Космоса осуществилась! Но человечество оказалось не готово к контакту с высшей цивилизацией.',
        type: 'alien',
        probability: 0.02,
        severity: 'major',
        requirements: { science: { min: 70 } },
        effects: { science: 20, society: -15, diplomacy: 10 },
        satisfactionEffect: -10,
        temporaryEffects: {
            duration: 5,
            effects: { science: 5 },
            description: 'Изучение внеземных технологий'
        },
        storyImpact: 'Профессор Космос становится главным переговорщиком с пришельцами'
    }
];

// Основные игровые решения
const GAME_DECISIONS = [
    {
        id: 1,
        title: "Первый день у власти",
        description: "Вы заняли пост лидера нации в период кризиса. За столом ожидания сидят ваши советники, каждый готов изложить свое видение будущего страны. Генерал Стратег первым встает и салютует.",
        advisor: 'military',
        urgency: 'medium',
        leftChoice: {
            text: "\"Мирное время требует мирных решений\"",
            effects: { military: -15, economy: 10, society: 5, diplomacy: 10 },
            satisfaction: 10
        },
        rightChoice: {
            text: "\"Сильная армия - основа сильного государства\"",
            effects: { military: 20, economy: -10, society: -5, diplomacy: -5 },
            satisfaction: -5
        },
        consequences: "Ваши первые слова определят тон всего правления."
    },
    {
        id: 2,
        title: "Экологическая катастрофа на горизонте",
        description: "Профессор Эко входит в кабинет с тревожным выражением лица. На экране - спутниковые снимки, показывающие критическое загрязнение. \"Мы на краю пропасти,\" - говорит он.",
        advisor: 'ecology',
        urgency: 'high',
        leftChoice: {
            text: "\"Нужно действовать постепенно, не разрушая экономику\"",
            effects: { ecology: 5, economy: 5 },
            corruption: 5
        },
        rightChoice: {
            text: "\"Объявляем экологическое чрезвычайное положение!\"",
            effects: { ecology: 25, economy: -20, science: 10 },
            satisfaction: 10,
            corruption: -10
        },
        consequences: "Природа не ждет - каждый день промедления усугубляет кризис.",
        temporaryEffects: {
            duration: 3,
            effects: { ecology: 5 },
            description: 'Экологические программы'
        }
    },
    {
        id: 3,
        title: "Космические амбиции",
        description: "Профессор Космос разворачивает чертежи новой космической станции. Его глаза горят энтузиазмом: \"Это наш шанс войти в историю! Представьте - первая колония на Марсе!\"",
        advisor: 'science',
        urgency: 'low',
        leftChoice: {
            text: "\"Сначала решим проблемы на Земле\"",
            effects: { science: -10, economy: 15, society: 5 }
        },
        rightChoice: {
            text: "\"К звездам! Запускаем космическую программу\"",
            effects: { science: 25, economy: -20, diplomacy: 10 },
            satisfaction: 15
        },
        temporaryEffects: {
            duration: 3,
            effects: { science: 5 },
            description: 'Развитие космических технологий'
        }
    },
    {
        id: 4,
        title: "Народные волнения",
        description: "Доктор Социум спешно входит в ваш кабинет. За окном слышны крики протестующих. \"Люди выходят на улицы,\" - говорит она, - \"Им нужна надежда.\"",
        advisor: 'society',
        urgency: 'critical',
        leftChoice: {
            text: "\"Развернуть войска, навести порядок\"",
            effects: { society: -20, military: 10 },
            satisfaction: -25,
            corruption: 15
        },
        rightChoice: {
            text: "\"Выйти к народу, выслушать требования\"",
            effects: { society: 25, economy: -10, diplomacy: 5 },
            satisfaction: 20,
            corruption: -5
        },
        consequences: "Народ помнит, как власть реагирует на их голос."
    },
    {
        id: 5,
        title: "Международный саммит",
        description: "Леди Дипломатия в парадном костюме готовится к отъезду. \"Саммит определит наше место в мире,\" - говорит она. - \"Но они будут судить нас не по словам, а по делам.\"",
        advisor: 'diplomacy',
        urgency: 'medium',
        leftChoice: {
            text: "\"Займем жесткую позицию, покажем силу\"",
            effects: { diplomacy: -10, military: 5 }
        },
        rightChoice: {
            text: "\"Будем искать компромиссы и союзы\"",
            effects: { diplomacy: 20, economy: 10, military: -5 },
            satisfaction: 10
        }
    },
    {
        id: 6,
        title: "Экономический кризис",
        description: "Министр Финансов врывается в кабинет с графиками и диаграммами. \"Ситуация критическая! Бюджетный дефицит растет, инфляция зашкаливает. Нужны радикальные меры!\"",
        advisor: 'economy',
        urgency: 'high',
        leftChoice: {
            text: "\"Сократим государственные расходы\"",
            effects: { economy: 15, society: -15, military: -10 },
            satisfaction: -20
        },
        rightChoice: {
            text: "\"Увеличим инвестиции в инфраструктуру\"",
            effects: { economy: -10, society: 15, science: 5 },
            satisfaction: 15,
            corruption: 10
        },
        consequences: "Экономические решения влияют на всех граждан."
    }
];

// Экспорт глобальных переменных
if (typeof window !== 'undefined') {
    window.GAME_CONFIG = GAME_CONFIG;
    window.STAT_LABELS = STAT_LABELS;
    window.DIFFICULTY_MODIFIERS = DIFFICULTY_MODIFIERS;
    window.ADVISOR_BACKSTORIES = ADVISOR_BACKSTORIES;
    window.RANDOM_EVENTS = RANDOM_EVENTS;
    window.GAME_DECISIONS = GAME_DECISIONS;
}