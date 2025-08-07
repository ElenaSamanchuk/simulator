// Random Events System
const RANDOM_EVENTS = [
    {
        id: 'economic_crisis',
        title: 'Экономический кризис',
        description: 'Мировой финансовый кризис ударил по экономике страны',
        probability: 0.15,
        effects: {
            economy: -15,
            society: -10,
            diplomacy: -5
        },
        duration: 3,
        triggerConditions: {
            minTurn: 10,
            maxCorruption: 60
        }
    },
    {
        id: 'natural_disaster',
        title: 'Стихийное бедствие',
        description: 'Мощное землетрясение нанесло серьезный ущерб инфраструктуре',
        probability: 0.1,
        effects: {
            economy: -20,
            ecology: -15,
            society: -10
        },
        duration: 2,
        triggerConditions: {
            minTurn: 5
        }
    },
    {
        id: 'scientific_breakthrough',
        title: 'Научный прорыв',
        description: 'Ученые совершили революционное открытие в области медицины',
        probability: 0.12,
        effects: {
            science: +20,
            society: +10,
            diplomacy: +5
        },
        duration: 4,
        triggerConditions: {
            minScience: 60,
            minTurn: 15
        }
    },
    {
        id: 'terrorist_attack',
        title: 'Террористическая угроза',
        description: 'Предотвращен крупный теракт, но обстановка остается напряженной',
        probability: 0.08,
        effects: {
            society: -15,
            military: +10,
            diplomacy: -10
        },
        duration: 3,
        triggerConditions: {
            minTurn: 8,
            maxDiplomacy: 40
        }
    },
    {
        id: 'oil_discovery',
        title: 'Месторождение нефти',
        description: 'Обнаружено крупное месторождение нефти в территориальных водах',
        probability: 0.06,
        effects: {
            economy: +25,
            diplomacy: +10,
            ecology: -10
        },
        duration: 0, // Permanent effect
        triggerConditions: {
            minTurn: 12,
            maxEcology: 70
        }
    },
    {
        id: 'pandemic',
        title: 'Эпидемия',
        description: 'Вспышка опасного заболевания требует экстренных мер',
        probability: 0.1,
        effects: {
            society: -20,
            economy: -15,
            science: +10
        },
        duration: 4,
        triggerConditions: {
            minTurn: 6,
            maxSociety: 70
        }
    },
    {
        id: 'diplomatic_scandal',
        title: 'Дипломатический скандал',
        description: 'Утечка секретных переговоров вызвала международный скандал',
        probability: 0.12,
        effects: {
            diplomacy: -20,
            society: -5,
            military: -5
        },
        duration: 3,
        triggerConditions: {
            minTurn: 10,
            minCorruption: 40
        }
    },
    {
        id: 'space_achievement',
        title: 'Космический успех',
        description: 'Успешный запуск национального спутника укрепил престиж страны',
        probability: 0.08,
        effects: {
            science: +15,
            diplomacy: +15,
            society: +10
        },
        duration: 2,
        triggerConditions: {
            minScience: 70,
            minTurn: 20
        }
    },
    {
        id: 'corruption_exposure',
        title: 'Коррупционный скандал',
        description: 'СМИ раскрыли крупную коррупционную схему в правительстве',
        probability: 0.15,
        effects: {
            society: -15,
            economy: -10,
            diplomacy: -10
        },
        duration: 3,
        triggerConditions: {
            minCorruption: 50,
            minTurn: 8
        }
    },
    {
        id: 'military_success',
        title: 'Военный успех',
        description: 'Успешные военные учения продемонстрировали мощь армии',
        probability: 0.1,
        effects: {
            military: +15,
            diplomacy: +5,
            society: +5
        },
        duration: 2,
        triggerConditions: {
            minMilitary: 60,
            minTurn: 15
        }
    },
    {
        id: 'environmental_crisis',
        title: 'Экологическая катастрофа',
        description: 'Крупная утечка химикатов нанесла серьезный ущерб природе',
        probability: 0.1,
        effects: {
            ecology: -25,
            society: -15,
            economy: -10
        },
        duration: 4,
        triggerConditions: {
            maxEcology: 30,
            minTurn: 12
        }
    },
    {
        id: 'trade_deal',
        title: 'Торговое соглашение',
        description: 'Подписано выгодное торговое соглашение с союзным государством',
        probability: 0.12,
        effects: {
            economy: +20,
            diplomacy: +10,
            society: +5
        },
        duration: 3,
        triggerConditions: {
            minDiplomacy: 60,
            minTurn: 18
        }
    },
    {
        id: 'social_unrest',
        title: 'Социальные волнения',
        description: 'Массовые протесты против правительственной политики',
        probability: 0.15,
        effects: {
            society: -20,
            economy: -10,
            military: -5
        },
        duration: 2,
        triggerConditions: {
            maxSatisfaction: 30,
            minTurn: 10
        }
    },
    {
        id: 'technological_leap',
        title: 'Технологический прорыв',
        description: 'Внедрение новых технологий резко повысило эффективность экономики',
        probability: 0.08,
        effects: {
            science: +20,
            economy: +15,
            diplomacy: +5
        },
        duration: 0, // Permanent effect
        triggerConditions: {
            minScience: 75,
            minEconomy: 50,
            minTurn: 25
        }
    },
    {
        id: 'resource_depletion',
        title: 'Истощение ресурсов',
        description: 'Крупное месторождение полезных ископаемых исчерпано',
        probability: 0.1,
        effects: {
            economy: -15,
            ecology: +10,
            society: -10
        },
        duration: 0, // Permanent effect
        triggerConditions: {
            maxEcology: 40,
            minTurn: 20
        }
    }
];

// Random Event Generator
class RandomEventGenerator {
    constructor() {
        this.lastEventTurn = 0;
        this.activeEvents = [];
        this.triggeredEvents = new Set();
    }

    shouldTriggerEvent(currentTurn, gameState) {
        // Don't trigger events too frequently
        if (currentTurn - this.lastEventTurn < 3) return false;
        
        // Base probability increases with difficulty
        const baseProbability = 0.15 + (gameState.difficulty - 1) * 0.05;
        
        return Math.random() < baseProbability;
    }

    selectRandomEvent(gameState) {
        const availableEvents = RANDOM_EVENTS.filter(event => {
            // Check if event can be triggered
            if (this.triggeredEvents.has(event.id) && event.duration === 0) {
                return false; // Don't repeat permanent events
            }

            const conditions = event.triggerConditions;
            
            // Check minimum turn
            if (conditions.minTurn && gameState.currentDecisionIndex < conditions.minTurn) {
                return false;
            }

            // Check stat conditions
            if (conditions.minScience && gameState.stats.science < conditions.minScience) return false;
            if (conditions.minMilitary && gameState.stats.military < conditions.minMilitary) return false;
            if (conditions.minEconomy && gameState.stats.economy < conditions.minEconomy) return false;
            if (conditions.minDiplomacy && gameState.stats.diplomacy < conditions.minDiplomacy) return false;
            if (conditions.minSociety && gameState.stats.society < conditions.minSociety) return false;
            if (conditions.minEcology && gameState.stats.ecology < conditions.minEcology) return false;

            if (conditions.maxEcology && gameState.stats.ecology > conditions.maxEcology) return false;
            if (conditions.maxDiplomacy && gameState.stats.diplomacy > conditions.maxDiplomacy) return false;
            if (conditions.maxSociety && gameState.stats.society > conditions.maxSociety) return false;

            // Check metric conditions
            if (conditions.minCorruption && gameState.metrics.corruption < conditions.minCorruption) return false;
            if (conditions.maxCorruption && gameState.metrics.corruption > conditions.maxCorruption) return false;
            if (conditions.maxSatisfaction && gameState.metrics.satisfaction > conditions.maxSatisfaction) return false;

            return true;
        });

        if (availableEvents.length === 0) return null;

        // Weight by probability
        const totalWeight = availableEvents.reduce((sum, event) => sum + event.probability, 0);
        let random = Math.random() * totalWeight;

        for (const event of availableEvents) {
            random -= event.probability;
            if (random <= 0) {
                return event;
            }
        }

        return availableEvents[0]; // Fallback
    }

    triggerEvent(event, currentTurn) {
        this.lastEventTurn = currentTurn;
        this.triggeredEvents.add(event.id);

        if (event.duration > 0) {
            // Add temporary effect
            const temporaryEffect = {
                id: `event_${event.id}_${Date.now()}`,
                description: event.title,
                effects: event.effects,
                duration: event.duration,
                source: 'random_event'
            };

            this.activeEvents.push(temporaryEffect);
            return { event, temporaryEffect };
        } else {
            // Permanent effect - apply immediately
            return { event, temporaryEffect: null };
        }
    }

    updateActiveEvents() {
        // Decrease duration of active events
        this.activeEvents = this.activeEvents.filter(effect => {
            effect.duration--;
            return effect.duration > 0;
        });
    }

    getActiveEvents() {
        return this.activeEvents;
    }

    reset() {
        this.lastEventTurn = 0;
        this.activeEvents = [];
        this.triggeredEvents.clear();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RANDOM_EVENTS,
        RandomEventGenerator
    };
}