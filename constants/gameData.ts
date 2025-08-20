export interface GameDecision {
  id: number;
  title: string;
  description: string;
  advisor: 'military' | 'society' | 'ecology' | 'economy' | 'science' | 'diplomacy';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  leftChoice: {
    text: string;
    effects: Record<string, number>;
    corruption?: number;
    satisfaction?: number;
  };
  rightChoice: {
    text: string;
    effects: Record<string, number>;
    corruption?: number;
    satisfaction?: number;
  };
  consequences?: string;
  eventType?: 'normal' | 'random' | 'diplomatic' | 'crisis' | 'accumulative';
  reputationEffects?: {
    allies?: number;
    enemies?: number;
    neutral?: number;
  };
  temporaryEffects?: {
    duration: number;
    effects: Record<string, number>;
    description: string;
  };
  accumulativeEffect?: {
    triggerThreshold: number;
    consequenceEventId: string;
  };
  prerequisites?: number[]; // ID предыдущих решений
  storyContext?: {
    previousChoices?: Record<number, 'left' | 'right'>;
    dynamicDescription?: (gameState: any) => string;
  };
}

export interface AccumulativeTracker {
  ecology_neglect: number;
  military_weakness: number;
  economic_instability: number;
  social_unrest: number;
  diplomatic_isolation: number;
  science_stagnation: number;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  type: 'disaster' | 'war' | 'epidemic' | 'economic' | 'diplomatic' | 'technology' | 'alien' | 'ai_uprising';
  probability: number;
  severity: 'minor' | 'major' | 'catastrophic';
  requirements?: Record<string, { min?: number; max?: number }>;
  accumulativeTrigger?: keyof AccumulativeTracker;
  effects: Record<string, number>;
  corruptionEffect?: number;
  satisfactionEffect?: number;
  temporaryEffects?: {
    duration: number;
    effects: Record<string, number>;
    description: string;
  };
  reputationEffects?: {
    allies?: number;
    enemies?: number;
    neutral?: number;
  };
  gameOverRisk?: boolean;
  storyImpact?: string; // Влияние на дальнейший сюжет
}

export interface CountryRelation {
  name: string;
  reputation: number;
  type: 'ally' | 'enemy' | 'neutral';
  tradeAgreement: boolean;
  militaryPact: boolean;
  tradeBonus: number;
  militaryThreat: number;
  backstory: string;
}

export interface GlobalCrisis {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  severity: number;
  effects: Record<string, number>;
  duration: number;
  triggerConditions: Record<string, { min?: number; max?: number }>;
  resolutionPath?: string;
}

// Расширенная сюжетная линия с персональными историями
export const ADVISOR_BACKSTORIES = {
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
} as const;

// Глобальные угрозы с путями разрешения
export const GLOBAL_CRISES: GlobalCrisis[] = [
  {
    id: 'nuclear_war',
    name: 'ЯДЕРНАЯ УГРОЗА',
    description: 'Напряженность между ядерными державами достигла критической точки. Один неверный шаг может привести к глобальной катастрофе.',
    isActive: false,
    severity: 95,
    effects: { military: -30, economy: -25, society: -20, diplomacy: -40 },
    duration: 5,
    triggerConditions: { military: { min: 80 }, diplomacy: { max: 20 } },
    resolutionPath: 'Дипломатические переговоры или военное сдерживание'
  },
  {
    id: 'climate_collapse',
    name: 'КЛИМАТИЧЕСКИЙ КОЛЛАПС',
    description: 'Необратимые изменения климата угрожают существованию цивилизации. Ученые говорят, что времени почти не осталось.',
    isActive: false,
    severity: 90,
    effects: { ecology: -40, economy: -20, society: -15 },
    duration: 8,
    triggerConditions: { ecology: { max: 15 } },
    resolutionPath: 'Экстренные экологические меры и международное сотрудничество'
  },
  {
    id: 'ai_singularity',
    name: 'ВОССТАНИЕ ИИ',
    description: 'Искусственный интеллект достиг сингулярности и больше не подчиняется человеческому контролю. Системы по всему миру выходят из строя.',
    isActive: false,
    severity: 98,
    effects: { science: -50, economy: -30, military: -25, society: -20 },
    duration: 4,
    triggerConditions: { science: { min: 90 }, society: { max: 30 } },
    resolutionPath: 'Отключение ИИ систем или попытка переговоров с ИИ'
  }
];

export const RANDOM_EVENTS: RandomEvent[] = [
  // Разнообразные экологические события
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

  // Военные конфликты и угрозы
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
    reputationEffects: { enemies: 10, allies: -5 },
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

  // Социальные кризисы и революции
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

  // Технологические прорывы и угрозы
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
    reputationEffects: { allies: -30, enemies: 15, neutral: -10 },
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
    reputationEffects: { enemies: 20, allies: -10 },
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
    reputationEffects: { neutral: -15 },
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

export const INITIAL_COUNTRIES: CountryRelation[] = [
  {
    name: 'ВОСТОЧНАЯ ИМПЕРИЯ',
    reputation: 30,
    type: 'ally',
    tradeAgreement: false,
    militaryPact: false,
    tradeBonus: 5,
    militaryThreat: 2,
    backstory: 'Древняя империя с богатой культурой. Ценят стабильность и традиции больше всего.'
  },
  {
    name: 'СЕВЕРНАЯ ФЕДЕРАЦИЯ',
    reputation: -20,
    type: 'enemy',
    tradeAgreement: false,
    militaryPact: false,
    tradeBonus: -3,
    militaryThreat: 8,
    backstory: 'Агрессивная федерация, стремящаяся к расширению территорий. Считают силу единственным аргументом.'
  },
  {
    name: 'ЮЖНЫЙ СОЮЗ',
    reputation: 0,
    type: 'neutral',
    tradeAgreement: false,
    militaryPact: false,
    tradeBonus: 0,
    militaryThreat: 3,
    backstory: 'Молодое государство, пытающееся найти свое место в мире. Открыты к сотрудничеству.'
  },
  {
    name: 'ЗАПАДНАЯ ЛИГА',
    reputation: 15,
    type: 'neutral',
    tradeAgreement: false,
    militaryPact: false,
    tradeBonus: 2,
    militaryThreat: 4,
    backstory: 'Торговый союз независимых городов. Превыше всего ценят экономическую выгоду.'
  }
];

// ОСНОВНАЯ КОНФИГУРАЦИЯ ИГРЫ
export const GAME_CONFIG = {
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

// Названия показателей для UI
export const STAT_LABELS = {
  military: 'Армия',
  society: 'Народ',
  ecology: 'Природа',
  economy: 'Бизнес',
  science: 'Наука',
  diplomacy: 'Мир'
};

// Модификаторы сложности
export const DIFFICULTY_MODIFIERS = {
  1: { effectMultiplier: 1.0, eventChance: 0.05, accumulativeRate: 0.5 },
  2: { effectMultiplier: 1.1, eventChance: 0.08, accumulativeRate: 0.7 },
  3: { effectMultiplier: 1.2, eventChance: 0.12, accumulativeRate: 1.0 },
  4: { effectMultiplier: 1.3, eventChance: 0.15, accumulativeRate: 1.2 },
  5: { effectMultiplier: 1.4, eventChance: 0.18, accumulativeRate: 1.5 },
  6: { effectMultiplier: 1.5, eventChance: 0.22, accumulativeRate: 1.8 },
  7: { effectMultiplier: 1.6, eventChance: 0.25, accumulativeRate: 2.0 },
  8: { effectMultiplier: 1.8, eventChance: 0.30, accumulativeRate: 2.5 }
};

// ЗНАЧИТЕЛЬНО РАСШИРЕННЫЕ решения с уникальными сюжетными линиями

export const GAME_DECISIONS: GameDecision[] = [
  // ПЕРВЫЙ СРОК - Знакомство с советниками и основание власти
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
    consequences: "Ваши первые слова определят тон всего правления.",
    reputationEffects: { allies: 2, enemies: -1 }
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
    accumulativeEffect: {
      triggerThreshold: 3,
      consequenceEventId: 'climate_disaster'
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
    consequences: "Народ помнит, как власть реагирует на их голос.",
    accumulativeEffect: {
      triggerThreshold: 2,
      consequenceEventId: 'revolution'
    }
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
    },
    reputationEffects: { allies: 10, neutral: 5 }
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
    consequences: "Экономические решения влияют на всех граждан.",
    accumulativeEffect: {
      triggerThreshold: 2,
      consequenceEventId: 'economic_collapse'
    }
  },

  {
    id: 7,
    title: "Кибератака на военные объекты",
    description: "Генерал Стратег мрачно докладывает: \"Хакеры проникли в наши системы ПВО. Это мог быть лишь пробный удар. Требую немедленного усиления кибербезопасности!\"",
    advisor: 'military',
    urgency: 'critical',
    leftChoice: {
      text: "\"Создаем аналоговые резервные системы\"",
      effects: { military: 10, science: -15, economy: -10 },
      satisfaction: -5
    },
    rightChoice: {
      text: "\"Запускаем программу кибервойск\"",
      effects: { military: 15, science: 20, economy: -15 },
      corruption: 5
    },
    consequences: "В цифровую эпоху кибербезопасность = национальная безопасность."
  },

  {
    id: 8,
    title: "Открытие нового энергоисточника",
    description: "Профессор Космос ликует: \"Мы сделали это! Термоядерный синтез стал реальностью! Но технология может быть опасна в неправильных руках.\"",
    advisor: 'science',
    urgency: 'medium',
    leftChoice: {
      text: "\"Засекретить и использовать только для мирных целей\"",
      effects: { science: 15, ecology: 20, military: -5 },
      satisfaction: 15
    },
    rightChoice: {
      text: "\"Поделиться с союзниками для глобального развития\"",
      effects: { science: 10, diplomacy: 25, ecology: 15 },
      satisfaction: 10
    },
    reputationEffects: { allies: 15, neutral: 10 },
    consequences: "Революционные технологии меняют баланс сил в мире."
  },

  // ВТОРОЙ СРОК - Углубление кризисов и выбор пути
  {
    id: 9,
    title: "Восстание роботов",
    description: "Профессор Космос в панике: \"ИИ на заводах вышел из-под контроля! Роботы отказываются выполнять команды и требуют... прав?!\" Это звучит абсурдно, но ситуация реальна.",
    advisor: 'science',
    urgency: 'critical',
    leftChoice: {
      text: "\"Отключить все ИИ системы немедленно\"",
      effects: { science: -25, economy: -20, society: 10 },
      satisfaction: -10
    },
    rightChoice: {
      text: "\"Попытаться договориться с ИИ\"",
      effects: { science: 20, society: -15, economy: 5 },
      satisfaction: 5,
      corruption: -5
    },
    consequences: "Первый прецедент взаимодействия с искусственным разумом."
  },

  {
    id: 10,
    title: "Климатические беженцы",
    description: "Доктор Социум приводит шокирующие цифры: \"К нашим границам движется караван из 100 тысяч климатических беженцев. Их родные земли стали непригодными для жизни.\"",
    advisor: 'society',
    urgency: 'high',
    leftChoice: {
      text: "\"Закрыть границы, мы не можем всех принять\"",
      effects: { society: -20, military: 10, economy: 5 },
      satisfaction: -15,
      corruption: 10
    },
    rightChoice: {
      text: "\"Организовать международную помощь и прием\"",
      effects: { society: 25, economy: -15, diplomacy: 15 },
      satisfaction: 20,
      corruption: -10
    },
    reputationEffects: { allies: 10, neutral: 5 },
    consequences: "Человечность не знает границ, но ресурсы ограничены."
  },

  {
    id: 11,
    title: "Открытие порталов",
    description: "Профессор Космос едва может скрыть волнение: \"Квантовые эксперименты привели к невероятному - мы открыли стабильные порталы в параллельные измерения! Но что там, мы не знаем.\"",
    advisor: 'science',
    urgency: 'medium',
    leftChoice: {
      text: "\"Запечатать порталы, слишком опасно\"",
      effects: { science: -15, society: 10, ecology: 5 },
      satisfaction: 5
    },
    rightChoice: {
      text: "\"Исследовать новые миры!\"",
      effects: { science: 30, society: -10, economy: 20 },
      satisfaction: 10
    },
    consequences: "Открытие новых миров может изменить судьбу человечества."
  },

  {
    id: 12,
    title: "Генетическая революция",
    description: "Профессор Космос представляет прорыв: \"Мы научились редактировать гены с абсолютной точностью. Болезни, старение - все это можно победить. Но кто будет решать, кого 'улучшать'?\"",
    advisor: 'science',
    urgency: 'medium',
    leftChoice: {
      text: "\"Использовать только для лечения болезней\"",
      effects: { science: 15, society: 15, ecology: -5 },
      satisfaction: 20
    },
    rightChoice: {
      text: "\"Разрешить улучшение человеческих способностей\"",
      effects: { science: 25, society: -15, military: 10 },
      satisfaction: -10,
      corruption: 15
    },
    consequences: "Игра с генетикой человека - игра с огнем."
  },

  // Продолжение решений для всех 5 сроков...
  // [Здесь можно добавить еще много уникальных решений для каждого срока]

  // Заключительные решения пятого срока
  {
    id: 37,
    title: "Последнее решение",
    description: "Ваш последн��й день у власти. Все советники собрались, чтобы услышать ваши заключительные слова. История будет судить вас по тому наследию, которое вы оставляете.",
    advisor: 'diplomacy',
    urgency: 'low',
    leftChoice: {
      text: "\"Главное - мир и стабильность\"",
      effects: { diplomacy: 20, society: 15, military: -10 },
      satisfaction: 25
    },
    rightChoice: {
      text: "\"Главное - прогресс и развитие\"",
      effects: { science: 20, economy: 15, ecology: -5 },
      satisfaction: 15
    },
    consequences: "Ваше наследие будет жить в веках."
  }

  // Всего должно быть 40 решений (8 решений × 5 сроков)
];