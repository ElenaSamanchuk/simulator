// Game Decisions and Scenario Data
const GAME_DECISIONS = [
    // Срок 1 - Решения 1-10
    {
        id: 1,
        title: 'Военный бюджет',
        description: 'Военное министерство просит увеличить расходы на оборону в связи с международной нестабильностью.',
        advisor: 'military',
        leftChoice: {
            text: 'Сократить военные расходы и направить средства на социальные программы',
            effects: { military: -10, society: +15, economy: +5 }
        },
        rightChoice: {
            text: 'Увеличить военный бюджет для укрепления обороноспособности',
            effects: { military: +15, economy: -5, diplomacy: -5 }
        }
    },
    {
        id: 2,
        title: 'Экологические стандарты',
        description: 'Предприниматели требуют смягчения экологических норм для увеличения прибыли.',
        advisor: 'ecology',
        leftChoice: {
            text: 'Ужесточить экологические стандарты',
            effects: { ecology: +15, economy: -10, society: +5 }
        },
        rightChoice: {
            text: 'Смягчить экологические требования',
            effects: { economy: +15, ecology: -10, society: -5 }
        }
    },
    {
        id: 3,
        title: 'Научные исследования',
        description: 'Академия наук просит финансирование перспективного проекта по космическим технологиям.',
        advisor: 'science',
        leftChoice: {
            text: 'Отклонить проект как слишком дорогостоящий',
            effects: { economy: +5, science: -10, society: +5 }
        },
        rightChoice: {
            text: 'Одобрить финансирование космической программы',
            effects: { science: +15, economy: -10, diplomacy: +5 }
        }
    },
    {
        id: 4,
        title: 'Дипломатические отношения',
        description: 'Соседнее государство предлагает заключить торговое соглашение.',
        advisor: 'diplomacy',
        leftChoice: {
            text: 'Отказаться от соглашения, защищая национальные интересы',
            effects: { diplomacy: -10, economy: -5, military: +10 }
        },
        rightChoice: {
            text: 'Подписать торговое соглашение',
            effects: { diplomacy: +15, economy: +10, military: -5 }
        }
    },
    {
        id: 5,
        title: 'Социальные реформы',
        description: 'Общество требует повышения минимальной заработной платы.',
        advisor: 'society',
        leftChoice: {
            text: 'Отложить повышение зарплат из-за бюджетных ограничений',
            effects: { economy: +10, society: -15, military: +5 }
        },
        rightChoice: {
            text: 'Повысить минимальную заработную плату',
            effects: { society: +15, economy: -10, diplomacy: +5 }
        }
    },
    {
        id: 6,
        title: 'Экономическая политика',
        description: 'Предприниматели просят снизить налоги для стимулирования бизнеса.',
        advisor: 'economy',
        leftChoice: {
            text: 'Сохранить текущие налоги для социальных программ',
            effects: { society: +10, economy: -5, science: +5 }
        },
        rightChoice: {
            text: 'Снизить налоги для поддержки бизнеса',
            effects: { economy: +15, society: -10, diplomacy: +5 }
        }
    },
    {
        id: 7,
        title: 'Военные учения',
        description: 'Генштаб предлагает провести масштабные военные учения.',
        advisor: 'military',
        leftChoice: {
            text: 'Отменить учения для экономии бюджета',
            effects: { military: -10, economy: +10, diplomacy: +5 }
        },
        rightChoice: {
            text: 'Провести военные учения',
            effects: { military: +15, economy: -10, diplomacy: -5 }
        }
    },
    {
        id: 8,
        title: 'Образование',
        description: 'Министерство образования требует средства на модернизацию школ.',
        advisor: 'science',
        leftChoice: {
            text: 'Отложить реформу образования',
            effects: { economy: +5, science: -10, society: -5 }
        },
        rightChoice: {
            text: 'Выделить средства на образование',
            effects: { science: +15, society: +10, economy: -15 }
        }
    },
    {
        id: 9,
        title: 'Природоохранные меры',
        description: 'Экологи требуют создания новых заповедников.',
        advisor: 'ecology',
        leftChoice: {
            text: 'Отклонить инициативу из-за экономических потерь',
            effects: { ecology: -10, economy: +10, society: -5 }
        },
        rightChoice: {
            text: 'Создать новые заповедники',
            effects: { ecology: +15, economy: -10, diplomacy: +5 }
        }
    },
    {
        id: 10,
        title: 'Международное сотрудничество',
        description: 'Международная организация приглашает к участию в гуманитарной миссии.',
        advisor: 'diplomacy',
        leftChoice: {
            text: 'Отказаться от участия в миссии',
            effects: { diplomacy: -15, military: +5, economy: +5 }
        },
        rightChoice: {
            text: 'Принять участие в гуманитарной миссии',
            effects: { diplomacy: +15, society: +10, military: -5 }
        }
    },

    // Срок 2 - Решения 11-20
    {
        id: 11,
        title: 'Кибербезопасность',
        description: 'Участились кибератаки. Нужно решить вопрос защиты государственных систем.',
        advisor: 'science',
        leftChoice: {
            text: 'Ограничиться базовой защитой',
            effects: { science: -5, economy: +5, military: -5 }
        },
        rightChoice: {
            text: 'Создать мощную систему кибербезопасности',
            effects: { science: +15, military: +10, economy: -15 }
        }
    },
    {
        id: 12,
        title: 'Энергетическая независимость',
        description: 'Эксперты предлагают перейти на возобновляемые источники энергии.',
        advisor: 'ecology',
        leftChoice: {
            text: 'Продолжить использовать традиционные источники',
            effects: { economy: +10, ecology: -15, diplomacy: -5 }
        },
        rightChoice: {
            text: 'Инвестировать в "зеленую" энергетику',
            effects: { ecology: +15, science: +10, economy: -10 }
        }
    },
    {
        id: 13,
        title: 'Демографическая политика',
        description: 'Стареющее население требует новых подходов к социальной политике.',
        advisor: 'society',
        leftChoice: {
            text: 'Сократить социальные выплаты',
            effects: { economy: +10, society: -15, diplomacy: -5 }
        },
        rightChoice: {
            text: 'Расширить программы поддержки семей',
            effects: { society: +15, economy: -10, science: +5 }
        }
    },
    {
        id: 14,
        title: 'Торговые войны',
        description: 'Крупная держава вводит торговые санкции. Как реагировать?',
        advisor: 'diplomacy',
        leftChoice: {
            text: 'Ответить симметричными санкциями',
            effects: { diplomacy: -10, military: +10, economy: -10 }
        },
        rightChoice: {
            text: 'Искать компромисс через переговоры',
            effects: { diplomacy: +15, economy: +5, military: -5 }
        }
    },
    {
        id: 15,
        title: 'Цифровизация',
        description: 'Правительство рассматривает план массовой цифровизации госуслуг.',
        advisor: 'science',
        leftChoice: {
            text: 'Отложить цифровизацию',
            effects: { economy: +5, science: -10, society: -5 }
        },
        rightChoice: {
            text: 'Ускорить цифровую трансформацию',
            effects: { science: +15, society: +10, economy: -10 }
        }
    },
    {
        id: 16,
        title: 'Военная промышленность',
        description: 'Оборонные заводы просят государственные заказы для развития.',
        advisor: 'military',
        leftChoice: {
            text: 'Сократить военные заказы',
            effects: { military: -15, economy: -5, diplomacy: +10 }
        },
        rightChoice: {
            text: 'Увеличить производство вооружений',
            effects: { military: +15, economy: +10, diplomacy: -10 }
        }
    },
    {
        id: 17,
        title: 'Культурная политика',
        description: 'Деятели культуры требуют увеличения государственной поддержки искусства.',
        advisor: 'society',
        leftChoice: {
            text: 'Сократить расходы на культуру',
            effects: { economy: +5, society: -10, diplomacy: -5 }
        },
        rightChoice: {
            text: 'Увеличить финансирование культуры',
            effects: { society: +15, diplomacy: +10, economy: -10 }
        }
    },
    {
        id: 18,
        title: 'Изменение климата',
        description: 'Ученые предупреждают об ускорении климатических изменений.',
        advisor: 'ecology',
        leftChoice: {
            text: 'Проигнорировать предупреждения',
            effects: { ecology: -15, economy: +5, science: -5 }
        },
        rightChoice: {
            text: 'Принять срочные меры по климату',
            effects: { ecology: +15, science: +10, economy: -15 }
        }
    },
    {
        id: 19,
        title: 'Космическая программа',
        description: 'Конкуренты запускают амбициозные космические проекты.',
        advisor: 'science',
        leftChoice: {
            text: 'Сосредоточиться на земных проблемах',
            effects: { science: -10, economy: +5, society: +5 }
        },
        rightChoice: {
            text: 'Ускорить космическую программу',
            effects: { science: +15, diplomacy: +10, economy: -15 }
        }
    },
    {
        id: 20,
        title: 'Международные союзы',
        description: 'Несколько стран предлагают создать новый военно-политический блок.',
        advisor: 'diplomacy',
        leftChoice: {
            text: 'Остаться нейтральными',
            effects: { diplomacy: -5, military: -5, economy: +5 }
        },
        rightChoice: {
            text: 'Присоединиться к новому блоку',
            effects: { diplomacy: +15, military: +10, economy: -5 }
        }
    },

    // Срок 3 - Решения 21-30 (продолжение аналогично...)
    {
        id: 21,
        title: 'Искусственный интеллект',
        description: 'ИИ технологии развиваются стремительно. Нужно регулирование.',
        advisor: 'science',
        leftChoice: {
            text: 'Ввести строгое регулирование ИИ',
            effects: { science: -5, society: +10, economy: -5 }
        },
        rightChoice: {
            text: 'Поддержать свободное развитие ИИ',
            effects: { science: +15, economy: +10, society: -10 }
        }
    },
    {
        id: 22,
        title: 'Продовольственная безопасность',
        description: 'Климатические изменения угрожают урожаю. Нужны меры.',
        advisor: 'ecology',
        leftChoice: {
            text: 'Полагаться на импорт продовольствия',
            effects: { economy: -10, diplomacy: +5, ecology: -5 }
        },
        rightChoice: {
            text: 'Развивать собственное сельское хозяйство',
            effects: { ecology: +10, economy: +5, science: +10 }
        }
    },
    // ... (остальные решения для срока 3)

    // Для краткости показываю структуру, полный список должен содержать 50 решений
    // Решения становятся сложнее с каждым сроком, добавляются моральные дилеммы
];

// Ending scenarios based on player choices
const ENDING_SCENARIOS = {
    military_dominance: {
        condition: (stats) => stats.military > 80,
        title: 'ВОЕННАЯ ДИКТАТУРА',
        description: 'Ваша страна стала милитаризованным государством. Армия контролирует все сферы жизни.',
        icon: '⚔️'
    },
    economic_powerhouse: {
        condition: (stats) => stats.economy > 80,
        title: 'ЭКОНОМИЧЕСКАЯ СВЕРХДЕРЖАВА',
        description: 'Ваша страна достигла невиданного экономического процветания.',
        icon: '💰'
    },
    social_utopia: {
        condition: (stats) => stats.society > 80,
        title: 'СОЦИАЛЬНЫЙ РАЙ',
        description: 'Вы создали общество равенства и справедливости.',
        icon: '👥'
    },
    scientific_leader: {
        condition: (stats) => stats.science > 80,
        title: 'ТЕХНОЛОГИЧЕСКИЙ ЛИДЕР',
        description: 'Ваша страна стала центром мировых научных достижений.',
        icon: '🔬'
    },
    ecological_paradise: {
        condition: (stats) => stats.ecology > 80,
        title: 'ЭКОЛОГИЧЕСКИЙ РАЙ',
        description: 'Вы создали экологически чистое и устойчивое общество.',
        icon: '🌱'
    },
    diplomatic_success: {
        condition: (stats) => stats.diplomacy > 80,
        title: 'МИРОВОЙ МИРОТВОРЕЦ',
        description: 'Ваша страна стала центром международного сотрудничества.',
        icon: '🤝'
    },
    balanced_rule: {
        condition: (stats) => Object.values(stats).every(v => v >= 40 && v <= 70),
        title: 'МУДРЫЙ ПРАВИТЕЛЬ',
        description: 'Вы достигли идеального баланса во всех сферах государства.',
        icon: '⚖️'
    },
    corruption_empire: {
        condition: (stats, metrics) => metrics.corruption > 70,
        title: 'КОРРУМПИРОВАННАЯ ИМПЕРИЯ',
        description: 'Коррупция разъела основы государства.',
        icon: '💀'
    },
    failed_state: {
        condition: (stats) => Object.values(stats).some(v => v < 10),
        title: 'НЕСОСТОЯВШЕЕСЯ ГОСУДАРСТВО',
        description: 'Страна находится на грани краха.',
        icon: '💥'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_DECISIONS,
        ENDING_SCENARIOS
    };
}