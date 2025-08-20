// Случайные события для игры
const RANDOM_EVENTS = [
    // Экологические катастрофы
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
        id: 'volcanic_eruption',
        title: 'ИЗВЕРЖЕНИЕ ВУЛКАНА',
        description: 'Спящий вулкан проснулся, покрыв пеплом половину страны. Аэропорты закрыты, урожай погиб.',
        type: 'disaster',
        probability: 0.05,
        severity: 'major',
        effects: { ecology: -15, economy: -20, society: -10 },
        temporaryEffects: {
            duration: 3,
            effects: { economy: -5, society: -5 },
            description: 'Очистка от вулканического пепла'
        },
        storyImpact: 'Необходимы экстренные меры по эвакуации'
    },

    {
        id: 'solar_storm',
        title: 'ГЕОМАГНИТНАЯ БУРЯ',
        description: 'Мощная солнечная буря вывела из строя спутники и электросети. Профессор Космос предупреждал об этом.',
        type: 'disaster',
        probability: 0.08,
        severity: 'major',
        requirements: { science: { min: 40 } },
        effects: { science: -10, economy: -15, military: -10 },
        temporaryEffects: {
            duration: 2,
            effects: { science: -5, economy: -10 },
            description: 'Восстановление электронных систем'
        },
        storyImpact: 'Профессор Космос настаивает на защите от космической погоды'
    },

    // Военные конфликты
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
        id: 'border_skirmish',
        title: 'ПОГРАНИЧНЫЙ КОНФЛИКТ',
        description: 'Северная Федерация нарушила границы. Генерал Стратег требует немедленного ответа.',
        type: 'war',
        probability: 0.12,
        severity: 'major',
        requirements: { military: { max: 40 } },
        effects: { military: -15, diplomacy: -10, economy: -5 },
        storyImpact: 'Напряженность с соседями растет'
    },

    {
        id: 'terrorist_attack',
        title: 'ТЕРРОРИСТИЧЕСКАЯ АТАКА',
        description: 'Кибертеррористы атаковали критическую инфраструктуру. Системы безопасности оказались уязвимы.',
        type: 'war',
        probability: 0.1,
        severity: 'major',
        effects: { military: -10, science: -15, society: -15 },
        satisfactionEffect: -15,
        temporaryEffects: {
            duration: 2,
            effects: { military: -5, science: -5 },
            description: 'Усиление мер безопасности'
        },
        storyImpact: 'Требуются экстренные меры по кибербезопасности'
    },

    // Экономические кризисы
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
        id: 'market_crash',
        title: 'ОБВАЛ РЫНКА',
        description: 'Фондовый рынок рухнул за один день. Инвесторы в панике, безработица растет.',
        type: 'economic',
        probability: 0.15,
        severity: 'major',
        requirements: { economy: { max: 35 } },
        effects: { economy: -20, society: -10 },
        temporaryEffects: {
            duration: 4,
            effects: { economy: -5, society: -3 },
            description: 'Восстановление рынка'
        },
        storyImpact: 'Министр Финансов требует экстренных мер'
    },

    {
        id: 'crypto_collapse',
        title: 'КРАХ КРИПТОВАЛЮТ',
        description: 'Квантовый компьютер взломал блокчейн. Цифровая экономика в хаосе.',
        type: 'economic',
        probability: 0.06,
        severity: 'major',
        requirements: { science: { min: 60 }, economy: { min: 30 } },
        effects: { economy: -15, science: -10 },
        corruptionEffect: 10,
        storyImpact: 'Профессор Космос предупреждает о квантовых угрозах'
    },

    // Социальные кризисы
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
        id: 'mass_protests',
        title: 'МАССОВЫЕ ПРОТЕСТЫ',
        description: 'Десятки тысяч людей вышли на улицы. Доктор Социум умоляет о диалоге.',
        type: 'diplomatic',
        probability: 0.18,
        severity: 'major',
        requirements: { society: { max: 30 } },
        effects: { society: -15, economy: -10 },
        satisfactionEffect: -20,
        temporaryEffects: {
            duration: 2,
            effects: { society: -5, economy: -5 },
            description: 'Последствия протестов'
        },
        storyImpact: 'Доктор Социум предлагает реформы'
    },

    {
        id: 'youth_exodus',
        title: 'МАССОВАЯ ЭМИГРАЦИЯ МОЛОДЕЖИ',
        description: 'Молодое поколение массово покидает страну. "Мы теряем будущее", - говорит Доктор Социум.',
        type: 'diplomatic',
        probability: 0.12,
        severity: 'major',
        requirements: { society: { max: 40 }, economy: { max: 35 } },
        effects: { society: -20, science: -15, economy: -10 },
        temporaryEffects: {
            duration: 5,
            effects: { science: -3, economy: -3 },
            description: 'Нехватка квалифицированных кадров'
        },
        storyImpact: 'Необходимы программы для удержания талантов'
    },

    // Технологические события
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
        id: 'ai_breakthrough',
        title: 'ПРОРЫВ В ИСКУССТВЕННОМ ИНТЕЛЛЕКТЕ',
        description: 'Лаборатория Профессора Космоса создала сверхразумный ИИ. Но контролируем ли он?',
        type: 'technology',
        probability: 0.08,
        severity: 'major',
        requirements: { science: { min: 70 } },
        effects: { science: 25, economy: 15, society: -10 },
        temporaryEffects: {
            duration: 3,
            effects: { science: 5, economy: 3 },
            description: 'Внедрение ИИ технологий'
        },
        storyImpact: 'Возникают этические вопросы о контроле ИИ'
    },

    {
        id: 'quantum_computer',
        title: 'СОЗДАНИЕ КВАНТОВОГО КОМПЬЮТЕРА',
        description: 'Прорыв в квантовых вычислениях открывает невиданные возможности, но и угрозы.',
        type: 'technology',
        probability: 0.06,
        severity: 'major',
        requirements: { science: { min: 65 } },
        effects: { science: 20, military: 10, economy: 15 },
        storyImpact: 'Квантовое превосходство меняет баланс сил'
    },

    // Дипломатические кризисы
    {
        id: 'diplomatic_crisis',
        title: 'РАЗРЫВ ДИПЛОМАТИЧЕСКИХ ОТНОШЕНИЙ',
        description: 'Леди Дипломатия не смогла предотвратить кризис. Наши союзники объявили о разрыве отношений и введении санкций.',
        type: 'diplomatic',
        probability: 0.15,
        severity: 'major',
        accumulativeTrigger: 'diplomatic_isolation',
        effects: { diplomacy: -30, economy: -20, military: 10 },
        temporaryEffects: {
            duration: 4,
            effects: { economy: -5, diplomacy: -10 },
            description: 'Последствия санкций'
        },
        storyImpact: 'Леди Дипломатия предлагает свою отставку'
    },

    {
        id: 'embassy_attack',
        title: 'АТАКА НА ПОСОЛЬСТВО',
        description: 'Наше посольство в Северной Федерации подверглось нападению. Есть жертвы.',
        type: 'diplomatic',
        probability: 0.08,
        severity: 'major',
        requirements: { diplomacy: { max: 30 } },
        effects: { diplomacy: -20, military: 5 },
        satisfactionEffect: -15,
        storyImpact: 'Международный инцидент требует ответа'
    },

    {
        id: 'trade_war',
        title: 'ТОРГОВАЯ ВОЙНА',
        description: 'Западная Лига ввела пошлины на наши товары. Экономическая война началась.',
        type: 'economic',
        probability: 0.1,
        severity: 'major',
        requirements: { economy: { min: 40 } },
        effects: { economy: -15, diplomacy: -10 },
        temporaryEffects: {
            duration: 3,
            effects: { economy: -5 },
            description: 'Потери от торговой войны'
        },
        storyImpact: 'Требуются альтернативные торговые партнеры'
    },

    // Экзотические события
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
    },

    {
        id: 'time_anomaly',
        title: 'ВРЕМЕННАЯ АНОМАЛИЯ',
        description: 'Эксперименты с квантовой физикой создали временную петлю. Некоторые события повторяются.',
        type: 'technology',
        probability: 0.01,
        severity: 'major',
        requirements: { science: { min: 80 } },
        effects: { science: -15, society: -20 },
        temporaryEffects: {
            duration: 2,
            effects: { science: -10, society: -10 },
            description: 'Исправление временных парадоксов'
        },
        storyImpact: 'Профессор Космос предупреждает об опасности экспериментов'
    },

    // Эпидемии и катастрофы
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
        id: 'asteroid_threat',
        title: 'УГРОЗА АСТЕРОИДА',
        description: 'Телескопы обнаружили астероид, направляющийся к Земле. У человечества есть 6 месяцев.',
        type: 'disaster',
        probability: 0.01,
        severity: 'catastrophic',
        requirements: { science: { min: 60 } },
        effects: { science: 30, economy: -25, military: 10 },
        temporaryEffects: {
            duration: 3,
            effects: { science: 10 },
            description: 'Разработка системы планетарной защиты'
        },
        storyImpact: 'Профессор Космос возглавляет программу планетарной защиты'
    }
];

// Экспорт для других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RANDOM_EVENTS };
} else {
    window.RANDOM_EVENTS = RANDOM_EVENTS;
}