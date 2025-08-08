// Countries and International Relations System
const COUNTRIES_DATA = [
    {
        name: 'Северная Федерация',
        type: 'neutral',
        baseReputation: 0,
        backstory: 'Крупная северная держава с богатыми природными ресурсами',
        interests: ['military', 'economy'],
        relationshipFactors: {
            military: 0.3,
            economy: 0.4,
            diplomacy: 0.3
        }
    },
    {
        name: 'Южная Республика',
        type: 'ally',
        baseReputation: 15,
        backstory: 'Демократическое государство с развитой экономикой',
        interests: ['society', 'diplomacy'],
        relationshipFactors: {
            society: 0.4,
            diplomacy: 0.4,
            ecology: 0.2
        }
    },
    {
        name: 'Восточная Империя',
        type: 'rival',
        baseReputation: -10,
        backstory: 'Авторитарное государство с мощной армией',
        interests: ['military', 'science'],
        relationshipFactors: {
            military: 0.5,
            science: 0.3,
            diplomacy: -0.2
        }
    },
    {
        name: 'Западный Союз',
        type: 'ally',
        baseReputation: 10,
        backstory: 'Объединение демократических стран',
        interests: ['ecology', 'society'],
        relationshipFactors: {
            ecology: 0.4,
            society: 0.3,
            diplomacy: 0.3
        }
    },
    {
        name: 'Островное Королевство',
        type: 'neutral',
        baseReputation: 5,
        backstory: 'Морская держава с сильным флотом',
        interests: ['diplomacy', 'economy'],
        relationshipFactors: {
            diplomacy: 0.4,
            economy: 0.3,
            military: 0.3
        }
    },
    {
        name: 'Горная Конфедерация',
        type: 'neutral',
        baseReputation: 0,
        backstory: 'Небольшое но гордое горное государство',
        interests: ['ecology', 'military'],
        relationshipFactors: {
            ecology: 0.4,
            military: 0.3,
            society: 0.3
        }
    },
    {
        name: 'Пустынная Федерация',
        type: 'neutral',
        baseReputation: -5,
        backstory: 'Богатое нефтью государство в пустынном регионе',
        interests: ['economy', 'science'],
        relationshipFactors: {
            economy: 0.5,
            science: 0.3,
            ecology: -0.2
        }
    },
    {
        name: 'Лесная Республика',
        type: 'ally',
        baseReputation: 8,
        backstory: 'Экологически чистое государство с развитой наукой',
        interests: ['ecology', 'science'],
        relationshipFactors: {
            ecology: 0.5,
            science: 0.3,
            society: 0.2
        }
    },
    {
        name: 'Степное Ханство',
        type: 'rival',
        baseReputation: -8,
        backstory: 'Кочевое государство с сильными военными традициями',
        interests: ['military', 'society'],
        relationshipFactors: {
            military: 0.4,
            society: 0.3,
            diplomacy: -0.1
        }
    },
    {
        name: 'Прибрежная Лига',
        type: 'ally',
        baseReputation: 12,
        backstory: 'Союз торговых городов-государств',
        interests: ['economy', 'diplomacy'],
        relationshipFactors: {
            economy: 0.4,
            diplomacy: 0.4,
            science: 0.2
        }
    }
];

// Diplomatic Events based on relationships
const DIPLOMATIC_EVENTS = [
    {
        id: 'trade_embargo',
        title: 'Торговое эмбарго',
        description: 'враждебная страна объявила торговое эмбарго',
        triggerType: 'enemy',
        minReputation: -30,
        effects: {
            economy: -10,
            diplomacy: -5
        },
        probability: 0.2
    },
    {
        id: 'alliance_offer',
        title: 'Предложение союза',
        description: 'дружественная страна предлагает военный союз',
        triggerType: 'ally',
        minReputation: 25,
        effects: {
            military: +10,
            diplomacy: +15
        },
        probability: 0.15
    },
    {
        id: 'technology_sharing',
        title: 'Обмен технологиями',
        description: 'союзники предлагают обмен научными достижениями',
        triggerType: 'ally',
        minReputation: 20,
        effects: {
            science: +15,
            diplomacy: +5
        },
        probability: 0.1
    },
    {
        id: 'border_conflict',
        title: 'Пограничный конфликт',
        description: 'возник спор о границах с соседним государством',
        triggerType: 'rival',
        maxReputation: -15,
        effects: {
            military: -5,
            diplomacy: -10,
            society: -5
        },
        probability: 0.15
    },
    {
        id: 'humanitarian_aid',
        title: 'Гуманитарная помощь',
        description: 'союзники оказывают помощь в трудной ситуации',
        triggerType: 'ally',
        minReputation: 15,
        effects: {
            society: +10,
            economy: +5,
            diplomacy: +10
        },
        probability: 0.12
    },
    {
        id: 'spy_scandal',
        title: 'Шпионский скандал',
        description: 'обнаружена шпионская сеть враждебного государства',
        triggerType: 'enemy',
        maxReputation: -20,
        effects: {
            military: +5,
            diplomacy: -15,
            society: -5
        },
        probability: 0.1
    }
];

// International Relations Manager
class InternationalRelations {
    constructor() {
        this.countries = this.initializeCountries();
        this.recentEvents = [];
    }

    initializeCountries() {
        return COUNTRIES_DATA.map(country => ({
            ...country,
            reputation: country.baseReputation,
            history: []
        }));
    }

    updateRelationships(statChanges, currentTurn) {
        this.countries.forEach(country => {
            let reputationChange = 0;

            // Calculate reputation change based on stat changes and country interests
            Object.entries(statChanges).forEach(([stat, change]) => {
                if (country.relationshipFactors[stat]) {
                    reputationChange += change * country.relationshipFactors[stat];
                }
            });

            // Apply reputation change
            if (Math.abs(reputationChange) > 0.5) {
                country.reputation += Math.round(reputationChange);
                country.reputation = Math.max(-50, Math.min(50, country.reputation));

                // Record significant changes
                if (Math.abs(reputationChange) > 2) {
                    country.history.push({
                        turn: currentTurn,
                        change: Math.round(reputationChange),
                        reason: this.getChangeReason(statChanges)
                    });
                }
            }
        });

        // Update country types based on reputation
        this.updateCountryTypes();
    }

    updateCountryTypes() {
        this.countries.forEach(country => {
            if (country.reputation > 20) {
                country.type = 'ally';
            } else if (country.reputation < -20) {
                country.type = 'enemy';
            } else {
                country.type = 'neutral';
            }
        });
    }

    getChangeReason(statChanges) {
        const maxChange = Object.entries(statChanges).reduce((max, [stat, change]) => {
            return Math.abs(change) > Math.abs(max[1]) ? [stat, change] : max;
        }, ['', 0]);

        const reasonMap = {
            military: maxChange[1] > 0 ? 'военное усиление' : 'сокращение армии',
            economy: maxChange[1] > 0 ? 'экономический рост' : 'экономический спад',
            society: maxChange[1] > 0 ? 'социальные реформы' : 'социальные проблемы',
            science: maxChange[1] > 0 ? 'научный прогресс' : 'снижение финансирования науки',
            ecology: maxChange[1] > 0 ? 'экологическая политика' : 'экологические проблемы',
            diplomacy: maxChange[1] > 0 ? 'дипломатические успехи' : 'дипломатические неудачи'
        };

        return reasonMap[maxChange[0]] || 'изменения в политике';
    }

    checkDiplomaticEvents(currentTurn) {
        const triggeredEvents = [];

        this.countries.forEach(country => {
            DIPLOMATIC_EVENTS.forEach(event => {
                if (this.shouldTriggerEvent(event, country)) {
                    const eventInstance = {
                        ...event,
                        country: country.name,
                        turn: currentTurn,
                        id: `${event.id}_${country.name}_${currentTurn}`
                    };
                    
                    triggeredEvents.push(eventInstance);
                    this.recentEvents.push(eventInstance);

                    // Keep only recent events
                    this.recentEvents = this.recentEvents.slice(-5);
                }
            });
        });

        return triggeredEvents;
    }

    shouldTriggerEvent(event, country) {
        // Check if country type matches
        const typeMatch = {
            ally: country.type === 'ally',
            enemy: country.type === 'enemy',
            rival: country.type === 'enemy',
            neutral: country.type === 'neutral'
        };

        if (!typeMatch[event.triggerType]) return false;

        // Check reputation requirements
        if (event.minReputation && country.reputation < event.minReputation) return false;
        if (event.maxReputation && country.reputation > event.maxReputation) return false;

        // Check probability
        return Math.random() < event.probability;
    }

    getCountriesByType() {
        return {
            allies: this.countries.filter(c => c.type === 'ally'),
            enemies: this.countries.filter(c => c.type === 'enemy'),
            neutral: this.countries.filter(c => c.type === 'neutral')
        };
    }

    getTopCountries(limit = 5) {
        return this.countries
            .sort((a, b) => Math.abs(b.reputation) - Math.abs(a.reputation))
            .slice(0, limit);
    }

    reset() {
        this.countries = this.initializeCountries();
        this.recentEvents = [];
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COUNTRIES_DATA,
        DIPLOMATIC_EVENTS,
        InternationalRelations
    };
}