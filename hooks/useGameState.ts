import { useState, useCallback } from 'react';
import { 
  GAME_CONFIG, 
  GAME_DECISIONS, 
  RANDOM_EVENTS, 
  INITIAL_COUNTRIES, 
  GLOBAL_CRISES,
  DIFFICULTY_MODIFIERS,
  RandomEvent, 
  CountryRelation, 
  AccumulativeTracker,
  GlobalCrisis
} from '../constants/gameData';

export interface GameStats {
  military: number;
  society: number;
  ecology: number;
  economy: number;
  science: number;
  diplomacy: number;
}

export interface GameMetrics {
  corruption: number;
  satisfaction: number;
}

export interface TemporaryEffect {
  id: string;
  effects: Record<string, number>;
  duration: number;
  description: string;
}

export interface GameState {
  stats: GameStats;
  metrics: GameMetrics;
  currentDecisionIndex: number;
  currentTerm: number;
  difficulty: number;
  completedDecisions: number[];
  gameOver: boolean;
  gameWon: boolean;
  totalDecisions: number;
  swipesLeft: number;
  swipesRight: number;
  temporaryEffects: TemporaryEffect[];
  countries: CountryRelation[];
  globalCrises: GlobalCrisis[];
  accumulativeTrackers: AccumulativeTracker;
  lastRandomEvent: RandomEvent | null;
  gameStats: {
    totalDecisions: number;
    swipesLeft: number;
    swipesRight: number;
    maxStats: GameStats;
    minStats: GameStats;
    completedTerms: number;
    highestDifficulty: number;
    advisorInteractions: Record<string, number>;
    criticalDecisions: number;
    balancedDecisions: number;
    extremeDecisions: number;
    randomEventsTriggered: number;
    globalCrisesTriggered: number;
    accumulativeEventsTriggered: number;
    gameEndType: 'ongoing' | 'victory' | 'defeat';
    defeatReason?: string;
    finalStats: GameStats;
    finalMetrics: GameMetrics;
    playStyle: string;
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    stats: { ...GAME_CONFIG.initialStats },
    metrics: { ...GAME_CONFIG.initialMetrics },
    currentDecisionIndex: 0,
    currentTerm: 1,
    difficulty: 1,
    completedDecisions: [],
    gameOver: false,
    gameWon: false,
    totalDecisions: 0,
    swipesLeft: 0,
    swipesRight: 0,
    temporaryEffects: [],
    countries: INITIAL_COUNTRIES.map(country => ({ ...country })),
    globalCrises: GLOBAL_CRISES.map(crisis => ({ ...crisis })),
    accumulativeTrackers: {
      ecology_neglect: 0,
      military_weakness: 0,
      economic_instability: 0,
      social_unrest: 0,
      diplomatic_isolation: 0,
      science_stagnation: 0
    },
    lastRandomEvent: null,
    gameStats: {
      totalDecisions: 0,
      swipesLeft: 0,
      swipesRight: 0,
      maxStats: { ...GAME_CONFIG.initialStats },
      minStats: { ...GAME_CONFIG.initialStats },
      completedTerms: 0,
      highestDifficulty: 1,
      advisorInteractions: { 
        military: 0, society: 0, ecology: 0, 
        economy: 0, science: 0, diplomacy: 0 
      },
      criticalDecisions: 0,
      balancedDecisions: 0,
      extremeDecisions: 0,
      randomEventsTriggered: 0,
      globalCrisesTriggered: 0,
      accumulativeEventsTriggered: 0,
      gameEndType: 'ongoing',
      finalStats: { ...GAME_CONFIG.initialStats },
      finalMetrics: { ...GAME_CONFIG.initialMetrics },
      playStyle: 'balanced'
    }
  }));

  // Проверка накопительных эффектов
  const checkAccumulativeEvents = useCallback((stats: GameStats, trackers: AccumulativeTracker): RandomEvent | null => {
    // Проверяем каждый трекер
    if (trackers.ecology_neglect >= GAME_CONFIG.accumulativeThreshold && stats.ecology < 30) {
      return RANDOM_EVENTS.find(event => event.id === 'climate_disaster') || null;
    }
    
    if (trackers.military_weakness >= GAME_CONFIG.accumulativeThreshold && stats.military < 25) {
      return RANDOM_EVENTS.find(event => event.id === 'military_coup') || null;
    }
    
    if (trackers.economic_instability >= GAME_CONFIG.accumulativeThreshold && stats.economy < 25) {
      return RANDOM_EVENTS.find(event => event.id === 'economic_collapse') || null;
    }
    
    if (trackers.social_unrest >= GAME_CONFIG.accumulativeThreshold && stats.society < 25) {
      return RANDOM_EVENTS.find(event => event.id === 'revolution') || null;
    }
    
    return null;
  }, []);

  // Проверка глобальных кризисов - менее агрессивная
  const checkGlobalCrises = useCallback((stats: GameStats): GlobalCrisis | null => {
    for (const crisis of GLOBAL_CRISES) {
      if (crisis.isActive) continue;
      
      const conditionsMet = Object.entries(crisis.triggerConditions).every(([key, condition]) => {
        const statValue = stats[key as keyof GameStats] || 0;
        if (condition.min !== undefined && statValue < condition.min) return false;
        if (condition.max !== undefined && statValue > condition.max) return false;
        return true;
      });
      
      // Уменьшаем шанс до 2% для предотвращения частых кризисов
      if (conditionsMet && Math.random() < 0.02) {
        return crisis;
      }
    }
    return null;
  }, []);

  // Проверка случайного события - менее агрессивная
  const checkRandomEvent = useCallback((currentStats: GameStats, difficulty: number): RandomEvent | null => {
    const difficultyMod = DIFFICULTY_MODIFIERS[difficulty as keyof typeof DIFFICULTY_MODIFIERS] || DIFFICULTY_MODIFIERS[8];
    
    // Уменьшаем базовую частоту событий
    const adjustedEventChance = difficultyMod.eventChance * 0.5; // Половина от оригинального шанса
    
    if (Math.random() > adjustedEventChance) return null;

    const eligibleEvents = RANDOM_EVENTS.filter(event => {
      if (!event.requirements) return true;
      
      return Object.entries(event.requirements).every(([key, requirement]) => {
        const statValue = currentStats[key as keyof GameStats] || 0;
        if (requirement.min !== undefined && statValue < requirement.min) return false;
        if (requirement.max !== undefined && statValue > requirement.max) return false;
        return true;
      });
    });

    if (eligibleEvents.length === 0) return null;

    const totalProbability = eligibleEvents.reduce((sum, event) => sum + event.probability, 0);
    let randomValue = Math.random() * totalProbability;
    
    for (const event of eligibleEvents) {
      randomValue -= event.probability;
      if (randomValue <= 0) return event;
    }

    return null;
  }, []);

  const getCurrentDecision = useCallback(() => {
    // Если есть случайное событие, показываем его
    if (gameState.lastRandomEvent) {
      return {
        id: -1,
        title: gameState.lastRandomEvent.title,
        description: gameState.lastRandomEvent.description,
        advisor: 'military' as const,
        urgency: 'critical' as const,
        leftChoice: {
          text: "Минимальные меры",
          effects: Object.fromEntries(
            Object.entries(gameState.lastRandomEvent.effects).map(([key, value]) => 
              [key, Math.floor(value * 0.5)]
            )
          ),
          corruption: (gameState.lastRandomEvent.corruptionEffect || 0) * 0.5,
          satisfaction: (gameState.lastRandomEvent.satisfactionEffect || 0) * 0.5
        },
        rightChoice: {
          text: "Решительные действия", 
          effects: gameState.lastRandomEvent.effects,
          corruption: gameState.lastRandomEvent.corruptionEffect || 0,
          satisfaction: gameState.lastRandomEvent.satisfactionEffect || 0
        },
        eventType: 'random' as const,
        temporaryEffects: gameState.lastRandomEvent.temporaryEffects,
        reputationEffects: gameState.lastRandomEvent.reputationEffects
      };
    }

    const availableDecisions = GAME_DECISIONS.filter(decision => 
      !gameState.completedDecisions.includes(decision.id)
    );
    
    if (availableDecisions.length === 0) {
      return GAME_DECISIONS[gameState.currentDecisionIndex % GAME_DECISIONS.length];
    }
    
    return availableDecisions[gameState.currentDecisionIndex % availableDecisions.length];
  }, [gameState.currentDecisionIndex, gameState.completedDecisions, gameState.lastRandomEvent]);

  const applyEffects = useCallback((effects: Record<string, number>, isLeftChoice: boolean) => {
    const currentDecision = getCurrentDecision();
    
    setGameState(prevState => {
      let newStats = { ...prevState.stats };
      let newMetrics = { ...prevState.metrics };
      
      // Получаем модификаторы сложности
      const difficultyMod = DIFFICULTY_MODIFIERS[prevState.difficulty as keyof typeof DIFFICULTY_MODIFIERS] || DIFFICULTY_MODIFIERS[8];
      
      // Применяем временные эффекты
      prevState.temporaryEffects.forEach(tempEffect => {
        Object.entries(tempEffect.effects).forEach(([key, value]) => {
          if (newStats.hasOwnProperty(key)) {
            newStats[key as keyof GameStats] = Math.max(0, Math.min(100, 
              newStats[key as keyof GameStats] + value
            ));
          }
        });
      });
      
      // ИСПРАВЛЕННАЯ ЛОГИКА: применяем эффекты коррупции и удовлетворенности
      const corruptionPenalty = (newMetrics.corruption - 50) * 0.01; // От -50% до +50%
      const satisfactionBonus = (newMetrics.satisfaction - 50) * 0.005; // От -25% до +25%
      
      // Применяем эффекты решения с модификаторами
      Object.entries(effects).forEach(([key, value]) => {
        if (newStats.hasOwnProperty(key)) {
          let adjustedValue = value * difficultyMod.effectMultiplier;
          
          // Применяем штрафы/бонусы только для значительных эффектов
          if (Math.abs(value) >= 5) {
            if (value > 0) {
              adjustedValue *= (1 + satisfactionBonus);
            } else {
              adjustedValue *= (1 + corruptionPenalty);
            }
          }
          
          adjustedValue = Math.round(adjustedValue);
          newStats[key as keyof GameStats] = Math.max(0, Math.min(100, 
            newStats[key as keyof GameStats] + adjustedValue
          ));
        }
      });

      // Обновляем метрики
      const choice = isLeftChoice ? currentDecision.leftChoice : currentDecision.rightChoice;
      if (choice.corruption !== undefined) {
        newMetrics.corruption = Math.max(0, Math.min(100, newMetrics.corruption + choice.corruption));
      }
      if (choice.satisfaction !== undefined) {
        newMetrics.satisfaction = Math.max(0, Math.min(100, newMetrics.satisfaction + choice.satisfaction));
      }

      // Обновляем накопительные трекеры
      let newTrackers = { ...prevState.accumulativeTrackers };
      
      // Проверяем игнорирование проблем
      if (newStats.ecology < 30) newTrackers.ecology_neglect += difficultyMod.accumulativeRate;
      if (newStats.military < 30) newTrackers.military_weakness += difficultyMod.accumulativeRate;
      if (newStats.economy < 30) newTrackers.economic_instability += difficultyMod.accumulativeRate;
      if (newStats.society < 30) newTrackers.social_unrest += difficultyMod.accumulativeRate;
      if (newStats.diplomacy < 30) newTrackers.diplomatic_isolation += difficultyMod.accumulativeRate;
      if (newStats.science < 30) newTrackers.science_stagnation += difficultyMod.accumulativeRate;

      // Проверяем накопительные события
      const accumulativeEvent = checkAccumulativeEvents(newStats, newTrackers);
      let newRandomEvent = accumulativeEvent;
      
      // Если нет накопительного события, проверяем обычные
      if (!newRandomEvent) {
        newRandomEvent = checkRandomEvent(newStats, prevState.difficulty);
      }
      
      // Если только что обработали случайное событие, убираем его
      if (prevState.lastRandomEvent && currentDecision.id === -1) {
        newRandomEvent = null;
        
        // Сбрасываем соответствующий накопительный трекер
        if (prevState.lastRandomEvent.accumulativeTrigger) {
          newTrackers[prevState.lastRandomEvent.accumulativeTrigger] = 0;
        }
      }

      // Проверяем глобальные кризисы
      const globalCrisis = checkGlobalCrises(newStats);
      let newGlobalCrises = [...prevState.globalCrises];
      if (globalCrisis) {
        newGlobalCrises = newGlobalCrises.map(crisis => 
          crisis.id === globalCrisis.id ? { ...crisis, isActive: true } : crisis
        );
      }

      // Обновляем временные эффекты
      let newTemporaryEffects = prevState.temporaryEffects
        .map(effect => ({ ...effect, duration: effect.duration - 1 }))
        .filter(effect => effect.duration > 0);

      // Добавляем новый временный эффект если есть
      if (currentDecision.temporaryEffects) {
        newTemporaryEffects.push({
          id: `temp_${Date.now()}`,
          effects: currentDecision.temporaryEffects.effects,
          duration: currentDecision.temporaryEffects.duration,
          description: currentDecision.temporaryEffects.description
        });
      }

      // Обновляем репутацию с другими странами
      let newCountries = [...prevState.countries];
      if (currentDecision.reputationEffects) {
        newCountries = newCountries.map(country => {
          const reputationChange = 
            (country.type === 'ally' ? (currentDecision.reputationEffects?.allies || 0) : 0) +
            (country.type === 'enemy' ? (currentDecision.reputationEffects?.enemies || 0) : 0) +
            (country.type === 'neutral' ? (currentDecision.reputationEffects?.neutral || 0) : 0);
          
          return {
            ...country,
            reputation: Math.max(-100, Math.min(100, country.reputation + reputationChange))
          };
        });
      }

      // Обновляем игровую статистику
      const newGameStats = { ...prevState.gameStats };
      newGameStats.totalDecisions++;
      if (isLeftChoice) newGameStats.swipesLeft++;
      else newGameStats.swipesRight++;
      
      if (newRandomEvent) {
        if (newRandomEvent.accumulativeTrigger) {
          newGameStats.accumulativeEventsTriggered++;
        } else {
          newGameStats.randomEventsTriggered++;
        }
      }
      
      if (globalCrisis) {
        newGameStats.globalCrisesTriggered++;
      }

      // Обновляем статистики
      Object.keys(newStats).forEach(key => {
        const statKey = key as keyof GameStats;
        if (newStats[statKey] > newGameStats.maxStats[statKey]) {
          newGameStats.maxStats[statKey] = newStats[statKey];
        }
        if (newStats[statKey] < newGameStats.minStats[statKey]) {
          newGameStats.minStats[statKey] = newStats[statKey];
        }
      });

      if (currentDecision.id !== -1 && currentDecision.advisor) {
        newGameStats.advisorInteractions[currentDecision.advisor]++;
      }

      const effectValues = Object.values(effects);
      const maxEffect = Math.max(...effectValues.map(Math.abs));
      if (maxEffect >= 20) newGameStats.extremeDecisions++;
      else if (maxEffect <= 5) newGameStats.balancedDecisions++;

      if (currentDecision.urgency === 'critical') newGameStats.criticalDecisions++;

      newGameStats.highestDifficulty = Math.max(newGameStats.highestDifficulty, prevState.difficulty);
      newGameStats.finalStats = { ...newStats };
      newGameStats.finalMetrics = { ...newMetrics };

      // Проверяем условия окончания игры
      const values = Object.values(newStats);
      let gameOver = values.some(val => val <= 0 || val >= 100);
      let defeatReason = '';
      
      // Проверяем критические значения метрик
      if (newMetrics.corruption >= 90) {
        gameOver = true;
        defeatReason = 'Коррупция достигла критического уровня';
      }
      
      if (newMetrics.satisfaction <= 10) {
        gameOver = true;
        defeatReason = 'Народ полностью потерял доверие к власти';
      }
      
      // Проверяем активные глобальные кризисы
      const activeCrises = newGlobalCrises.filter(crisis => crisis.isActive);
      if (activeCrises.length >= 2) {
        gameOver = true;
        defeatReason = 'Множественные глобальные кризисы привели к коллапсу';
      }
      
      const newDecisionIndex = prevState.currentDecisionIndex + 1;
      const newTerm = Math.ceil(newDecisionIndex / GAME_CONFIG.decisionsPerTerm) + 1;
      const newDifficulty = Math.min(8, Math.ceil(newDecisionIndex / 5));
      const gameWon = newTerm > GAME_CONFIG.maxTerms && !gameOver;

      newGameStats.completedTerms = newTerm - 1;
      
      if (gameOver) {
        newGameStats.gameEndType = 'defeat';
        newGameStats.defeatReason = defeatReason;
      } else if (gameWon) {
        newGameStats.gameEndType = 'victory';
      }

      return {
        ...prevState,
        stats: newStats,
        metrics: newMetrics,
        currentDecisionIndex: newDecisionIndex,
        currentTerm: Math.min(newTerm, GAME_CONFIG.maxTerms),
        difficulty: newDifficulty,
        completedDecisions: currentDecision.id === -1 
          ? prevState.completedDecisions 
          : [...prevState.completedDecisions, currentDecision.id],
        gameOver,
        gameWon,
        totalDecisions: newGameStats.totalDecisions,
        swipesLeft: newGameStats.swipesLeft,
        swipesRight: newGameStats.swipesRight,
        temporaryEffects: newTemporaryEffects,
        countries: newCountries,
        globalCrises: newGlobalCrises,
        accumulativeTrackers: newTrackers,
        lastRandomEvent: newRandomEvent,
        gameStats: newGameStats
      };
    });
  }, [getCurrentDecision, checkRandomEvent, checkAccumulativeEvents, checkGlobalCrises]);

  const resetGame = useCallback(() => {
    setGameState({
      stats: { ...GAME_CONFIG.initialStats },
      metrics: { ...GAME_CONFIG.initialMetrics },
      currentDecisionIndex: 0,
      currentTerm: 1,
      difficulty: 1,
      completedDecisions: [],
      gameOver: false,
      gameWon: false,
      totalDecisions: 0,
      swipesLeft: 0,
      swipesRight: 0,
      temporaryEffects: [],
      countries: INITIAL_COUNTRIES.map(country => ({ ...country })),
      globalCrises: GLOBAL_CRISES.map(crisis => ({ ...crisis, isActive: false })),
      accumulativeTrackers: {
        ecology_neglect: 0,
        military_weakness: 0,
        economic_instability: 0,
        social_unrest: 0,
        diplomatic_isolation: 0,
        science_stagnation: 0
      },
      lastRandomEvent: null,
      gameStats: {
        totalDecisions: 0,
        swipesLeft: 0,
        swipesRight: 0,
        maxStats: { ...GAME_CONFIG.initialStats },
        minStats: { ...GAME_CONFIG.initialStats },
        completedTerms: 0,
        highestDifficulty: 1,
        advisorInteractions: { 
          military: 0, society: 0, ecology: 0, 
          economy: 0, science: 0, diplomacy: 0 
        },
        criticalDecisions: 0,
        balancedDecisions: 0,
        extremeDecisions: 0,
        randomEventsTriggered: 0,
        globalCrisesTriggered: 0,
        accumulativeEventsTriggered: 0,
        gameEndType: 'ongoing',
        finalStats: { ...GAME_CONFIG.initialStats },
        finalMetrics: { ...GAME_CONFIG.initialMetrics },
        playStyle: 'balanced'
      }
    });
  }, []);

  return {
    gameState,
    getCurrentDecision,
    applyEffects,
    resetGame
  };
}