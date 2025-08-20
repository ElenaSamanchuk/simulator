import React, { useEffect, useState, useCallback } from 'react';
import { GameHeader } from './GameHeader';
import { StatsPanel, OverallBalance } from './StatsPanel';
import { GameCard } from './GameCard';
import { GameEndDialog } from './GameEndDialog';
import { AchievementSystem } from './AchievementSystem';
import { EffectBadges, BadgeData } from './EffectBadges';
import { AdvisorAvatar } from './AdvisorAvatar';
import { SoundSystem } from './SoundSystem';
import { useGameState } from '../hooks/useGameState';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { GAME_CONFIG, ADVISOR_BACKSTORIES, STAT_LABELS } from '../constants/gameData';

// Типы для достижений - выносим в отдельный интерфейс
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
}

// Константы для избежания магических чисел
const CONSTANTS = {
  ANIMATION_DURATION: 150,
  NOTIFICATION_DURATION: 2000,
  STREAK_THRESHOLD: 3,
  CARD_ROTATION_FACTOR: 0.03,
  CARD_SCALE_FACTOR: 0.0002,
  MIN_CARD_SCALE: 0.9,
  SWIPE_THRESHOLD: 60,
  CARD_TRANSLATE_DISTANCE: 300,
  CARD_ROTATION_DEGREES: 15
} as const;

// Хук для управления локальным состоянием игры
const useLocalGameState = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // По умолчанию темная тема, если ничего не сохранено
    const saved = localStorage.getItem('game-theme');
    return saved ? saved === 'dark' : true;
  });
  
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [cardTransform, setCardTransform] = useState('');
  const [swipeIndicator, setSwipeIndicator] = useState<'left' | 'right' | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [lastChoiceTime, setLastChoiceTime] = useState(Date.now());
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [randomEventNotification, setRandomEventNotification] = useState<string | null>(null);

  return {
    isDarkTheme, setIsDarkTheme,
    isSoundEnabled, setIsSoundEnabled,
    showEndDialog, setShowEndDialog,
    cardTransform, setCardTransform,
    swipeIndicator, setSwipeIndicator,
    achievements, setAchievements,
    streakCount, setStreakCount,
    lastChoiceTime, setLastChoiceTime,
    isAnimating, setIsAnimating,
    animationKey, setAnimationKey,
    showMobileStats, setShowMobileStats,
    randomEventNotification, setRandomEventNotification
  };
};

// Хук для управления достижениями
const useAchievements = (gameState: any, achievements: Achievement[], setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>, isSoundEnabled: boolean) => {
  const checkAchievements = useCallback(() => {
    const newAchievements: Achievement[] = [];

    // Массив проверок достижений для лучшей читаемости
    const achievementChecks = [
      {
        condition: gameState.gameStats.totalDecisions === 1,
        id: 'first_decision',
        achievement: {
          id: 'first_decision',
          name: 'ПЕРВЫЙ ШАГ',
          description: 'Примите своё первое решение как правитель.',
          icon: '👑',
          rarity: 'common' as const,
          unlocked: true,
          unlockedAt: new Date()
        }
      },
      {
        condition: gameState.currentTerm >= 2 && Object.values(gameState.stats).every((v: number) => v >= 30 && v <= 70),
        id: 'balanced_ruler',
        achievement: {
          id: 'balanced_ruler',
          name: 'МАСТЕР БАЛАНСА',
          description: 'Сохраняйте все показатели между 30-70% в течение целого срока.',
          icon: '⚖️',
          rarity: 'epic' as const,
          unlocked: true,
          unlockedAt: new Date()
        }
      },
      {
        condition: gameState.gameStats.randomEventsTriggered >= 3,
        id: 'crisis_manager',
        achievement: {
          id: 'crisis_manager',
          name: 'КРИЗИС-МЕНЕДЖЕР',
          description: 'Переживите 3+ случайных события.',
          icon: '⚡',
          rarity: 'epic' as const,
          unlocked: true,
          unlockedAt: new Date()
        }
      },
      {
        condition: gameState.stats.diplomacy >= 80,
        id: 'diplomat',
        achievement: {
          id: 'diplomat',
          name: 'ВЕЛИКИЙ ДИПЛОМАТ',
          description: 'Достигните 80+ пунктов дипломатии.',
          icon: '🕊️',
          rarity: 'rare' as const,
          unlocked: true,
          unlockedAt: new Date()
        }
      },
      {
        condition: gameState.stats.science >= 85,
        id: 'technocrat',
        achievement: {
          id: 'technocrat',
          name: 'ПОКОРИТЕЛЬ КОСМОСА',
          description: 'Достигните 85+ пунктов науки.',
          icon: '🚀',
          rarity: 'rare' as const,
          unlocked: true,
          unlockedAt: new Date()
        }
      },
      {
        condition: gameState.metrics.corruption <= 15 && gameState.currentTerm >= 3,
        id: 'clean_hands',
        achievement: {
          id: 'clean_hands',
          name: 'ЧИСТЫЕ РУКИ',
          description: 'Держите коррупцию ниже 15% в течение 3 сроков.',
          icon: '✨',
          rarity: 'epic' as const,
          unlocked: true,
          unlockedAt: new Date()
        }
      },
      {
        condition: gameState.gameWon,
        id: 'victory',
        achievement: {
          id: 'victory',
          name: 'ВЕЛИКИЙ ПРАВИТЕЛЬ',
          description: 'Успешно завершите все 5 сроков правления.',
          icon: '🏆',
          rarity: 'legendary' as const,
          unlocked: true,
          unlockedAt: new Date()
        }
      }
    ];

    achievementChecks.forEach(({ condition, id, achievement }) => {
      if (condition && !achievements.find(a => a.id === id)) {
        newAchievements.push(achievement);
      }
    });

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      if (isSoundEnabled) {
        SoundSystem.achievement();
      }
    }
  }, [gameState, achievements, isSoundEnabled, setAchievements]);

  return { checkAchievements };
};

export default function SwipeGame() {
  const { gameState, getCurrentDecision, applyEffects, resetGame } = useGameState();
  const localState = useLocalGameState();
  const { checkAchievements } = useAchievements(gameState, localState.achievements, localState.setAchievements, localState.isSoundEnabled);

  // Инициализация темы
  useEffect(() => {
    const savedTheme = localStorage.getItem('game-theme') || 'dark';
    localState.setIsDarkTheme(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Обработка окончания игры - ИСПРАВЛЕНО: не показываем диалог сразу
  useEffect(() => {
    if ((gameState.gameOver || gameState.gameWon) && gameState.gameStats.totalDecisions > 0) {
      if (localState.isSoundEnabled) {
        setTimeout(() => {
          gameState.gameWon ? SoundSystem.victory() : SoundSystem.defeat();
        }, 500);
      }

      const timer = setTimeout(() => {
        localState.setShowEndDialog(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameOver, gameState.gameWon, gameState.gameStats.totalDecisions, localState.isSoundEnabled]);

  // Обработка случайных событий
  useEffect(() => {
    if (gameState.lastRandomEvent && !localState.randomEventNotification) {
      const getEventDescription = (event: any): string => {
        if (typeof event === 'string') return event;
        if (typeof event === 'object' && event !== null) {
          return event.description || event.title || event.name || 'Случайное событие';
        }
        return 'Случайное событие';
      };

      const eventDescription = getEventDescription(gameState.lastRandomEvent);
      localState.setRandomEventNotification(eventDescription);
      
      if (localState.isSoundEnabled) {
        SoundSystem.randomEvent();
      }
      
      setTimeout(() => {
        localState.setRandomEventNotification(null);
      }, CONSTANTS.NOTIFICATION_DURATION);
    }
  }, [gameState.lastRandomEvent, localState.randomEventNotification, localState.isSoundEnabled]);

  // Проверка достижений
  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  // Обработка выбора с оптимизацией
  const handleChoice = useCallback(async (isLeftChoice: boolean) => {
    if (gameState.gameOver || gameState.gameWon || localState.isAnimating) return;
    
    localState.setIsAnimating(true);
    
    try {
      const decision = getCurrentDecision();
      const effects = isLeftChoice ? decision.leftChoice.effects : decision.rightChoice.effects;
      
      // Обновляем streak
      const now = Date.now();
      if (now - localState.lastChoiceTime < CONSTANTS.NOTIFICATION_DURATION) {
        localState.setStreakCount(prev => prev + 1);
      } else {
        localState.setStreakCount(1);
      }
      localState.setLastChoiceTime(now);
      
      // Звуковые эффекты
      if (localState.isSoundEnabled) {
        isLeftChoice ? SoundSystem.swipeLeft() : SoundSystem.swipeRight();
        
        if (localState.streakCount >= CONSTANTS.STREAK_THRESHOLD) {
          setTimeout(() => SoundSystem.notification(), 100);
        }
      }

      // Анимация карточки
      const direction = isLeftChoice ? -1 : 1;
      localState.setCardTransform(
        `translateX(${direction * CONSTANTS.CARD_TRANSLATE_DISTANCE}px) rotate(${direction * CONSTANTS.CARD_ROTATION_DEGREES}deg) scale(${CONSTANTS.MIN_CARD_SCALE})`
      );
      localState.setSwipeIndicator(isLeftChoice ? 'left' : 'right');
      
      // Применяем эффекты
      applyEffects(effects, isLeftChoice);
      
      // Сброс анимации
      setTimeout(() => {
        localState.setCardTransform('');
        localState.setSwipeIndicator(null);
        localState.setAnimationKey(prev => prev + 1);
        localState.setIsAnimating(false);
      }, CONSTANTS.ANIMATION_DURATION);
      
    } catch (error) {
      console.error('Ошибка при обработке выбора:', error);
      // Сброс состояния при ошибке
      localState.setCardTransform('');
      localState.setSwipeIndicator(null);
      localState.setAnimationKey(prev => prev + 1);
      localState.setIsAnimating(false);
    }
  }, [gameState.gameOver, gameState.gameWon, localState.isAnimating, getCurrentDecision, applyEffects, localState.isSoundEnabled, localState.streakCount, localState.lastChoiceTime]);

  // Drag & Drop обработка
  const { handlers } = useDragAndDrop({
    onSwipeLeft: () => !localState.isAnimating && handleChoice(true),
    onSwipeRight: () => !localState.isAnimating && handleChoice(false),
    onDragStart: () => {
      if (gameState.gameOver || gameState.gameWon || localState.isAnimating) return;
      if (localState.isSoundEnabled) SoundSystem.cardFlip();
    },
    onDragMove: (offset) => {
      if (gameState.gameOver || gameState.gameWon || localState.isAnimating) return;
      
      const rotation = offset.x * CONSTANTS.CARD_ROTATION_FACTOR;
      const scale = 1 - Math.abs(offset.x) * CONSTANTS.CARD_SCALE_FACTOR;
      
      localState.setCardTransform(
        `translateX(${offset.x}px) rotate(${rotation}deg) scale(${Math.max(CONSTANTS.MIN_CARD_SCALE, scale)})`
      );
      
      if (Math.abs(offset.x) > CONSTANTS.SWIPE_THRESHOLD) {
        localState.setSwipeIndicator(offset.x > 0 ? 'right' : 'left');
      } else {
        localState.setSwipeIndicator(null);
      }
    },
    onDragEnd: () => {
      if (!localState.isAnimating) {
        localState.setCardTransform('');
        localState.setSwipeIndicator(null);
      }
    }
  }, GAME_CONFIG.minSwipeDistance);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver || gameState.gameWon || localState.showEndDialog || localState.isAnimating) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const keyActions: Record<string, () => void> = {
        'ArrowLeft': () => handleChoice(true),
        'a': () => handleChoice(true),
        'A': () => handleChoice(true),
        'ArrowRight': () => handleChoice(false),
        'd': () => handleChoice(false),
        'D': () => handleChoice(false),
        'Escape': () => localState.showEndDialog && localState.setShowEndDialog(false),
        'r': () => (gameState.gameOver || gameState.gameWon) && handleRestart(),
        'R': () => (gameState.gameOver || gameState.gameWon) && handleRestart()
      };

      const action = keyActions[e.key];
      if (action) {
        e.preventDefault();
        action();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, gameState.gameWon, localState.showEndDialog, localState.isAnimating, handleChoice]);

  // Обработчики интерфейса
  const handleToggleTheme = useCallback(() => {
    const newTheme = !localState.isDarkTheme;
    localState.setIsDarkTheme(newTheme);
    localStorage.setItem('game-theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
    
    if (localState.isSoundEnabled) {
      SoundSystem.buttonClick();
    }
  }, [localState.isDarkTheme, localState.isSoundEnabled]);

  const handleToggleSound = useCallback(() => {
    const newSoundState = !localState.isSoundEnabled;
    localState.setIsSoundEnabled(newSoundState);
    SoundSystem.setEnabled(newSoundState);
    
    if (newSoundState) {
      SoundSystem.buttonClick();
    }
  }, [localState.isSoundEnabled]);

  const handleRestart = useCallback(() => {
    resetGame();
    // Сброс всех локальных состояний
    Object.entries({
      showEndDialog: false,
      cardTransform: '',
      swipeIndicator: null,
      achievements: [],
      streakCount: 0,
      lastChoiceTime: Date.now(),
      isAnimating: false,
      animationKey: 0,
      showMobileStats: false,
      randomEventNotification: null
    }).forEach(([key, value]) => {
      const setter = localState[`set${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof localState] as any;
      if (setter) setter(value);
    });
    
    if (localState.isSoundEnabled) {
      SoundSystem.buttonClick();
    }
  }, [resetGame, localState.isSoundEnabled]);

  // Вычисления прогресса
  const termProgress = ((gameState.currentDecisionIndex % GAME_CONFIG.decisionsPerTerm) / GAME_CONFIG.decisionsPerTerm) * 100;
  const overallProgress = (gameState.currentDecisionIndex / (GAME_CONFIG.maxTerms * GAME_CONFIG.decisionsPerTerm)) * 100;
  
  const difficultyNames = ['Стабильность', 'Стабильность', 'Напряжение', 'Напряжение', 'Кризис', 'Кризис', 'Хаос', 'Хаос'];
  const difficultyName = difficultyNames[gameState.difficulty - 1] || 'Хаос';

  const currentDecision = getCurrentDecision();
  const currentAdvisor = ADVISOR_BACKSTORIES[currentDecision.advisor];

  // Создаем бейджики для временных эффектов
  const effectBadges: BadgeData[] = gameState.temporaryEffects.map((effect: any) => {
    const hasPositiveEffects = Object.values(effect.effects).some((val: any) => val > 0);
    const hasNegativeEffects = Object.values(effect.effects).some((val: any) => val < 0);
    
    let type: BadgeData['type'] = 'neutral';
    let intensity: 'low' | 'medium' | 'high' = 'medium';
    
    if (hasPositiveEffects && !hasNegativeEffects) {
      type = 'positive';
    } else if (hasNegativeEffects && !hasPositiveEffects) {
      type = 'negative';
      intensity = 'high';
    }

    // Выбираем подходящую иконку
    let icon = '🔄';
    if (effect.description.includes('восстановление')) icon = '🔧';
    if (effect.description.includes('кризис')) icon = '⚠️';
    if (effect.description.includes('бонус')) icon = '⬆️';
    if (effect.description.includes('штраф')) icon = '⬇️';
    if (effect.description.includes('военн')) icon = '⚔️';
    if (effect.description.includes('эконом')) icon = '💰';
    if (effect.description.includes('наук')) icon = '🔬';
    if (effect.description.includes('эколог')) icon = '🌱';
    if (effect.description.includes('общество')) icon = '👥';
    if (effect.description.includes('дипломат')) icon = '🤝';
    
    return {
      id: effect.id,
      type,
      icon,
      title: effect.description,
      description: `${effect.description}. Действует ${effect.duration} ходов. Эффекты: ${Object.entries(effect.effects).map(([stat, value]) => `${STAT_LABELS[stat as keyof typeof STAT_LABELS]}: ${value > 0 ? '+' : ''}${value}`).join(', ')}`,
      duration: effect.duration,
      intensity
    };
  });

  // Создаем бейджики для достижений
  const achievementBadges: BadgeData[] = localState.achievements
    .filter(achievement => achievement.unlocked)
    .slice(-5) // Показываем только последние 5
    .map(achievement => ({
      id: achievement.id,
      type: 'achievement' as const,
      icon: achievement.icon,
      title: achievement.name,
      description: achievement.description,
      intensity: 'high' as const
    }));

  const allBadges = [...effectBadges, ...achievementBadges];

  // Компактные компоненты мобильного интерфейса
  const MobileStatsToggle = () => (
    <button
      onClick={() => localState.setShowMobileStats(!localState.showMobileStats)}
      className="w-full mb-2 p-2 bg-card/60 backdrop-blur-sm border border-border/30 rounded-lg flex items-center justify-between text-sm font-mono hover:bg-card/80 transition-colors relative z-30"
    >
      <span className="text-primary font-bold">ПОКАЗАТЕЛИ</span>
      <span className={`transform transition-transform ${localState.showMobileStats ? 'rotate-180' : ''}`}>
        ⬇️
      </span>
    </button>
  );

  const MobileStats = () => (
    <div className="mb-4 p-3 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg space-y-4 relative z-40 shadow-xl">
      {/* Показатели государства с понятными названиями */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(gameState.stats).map(([key, value]) => {
          const colors: Record<string, string> = {
            military: 'text-red-400 border-red-500/30 bg-red-500/10',
            society: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
            ecology: 'text-green-400 border-green-500/30 bg-green-500/10',
            economy: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
            science: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
            diplomacy: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
          };
          
          // Понятные названия показателей
          const readableLabels: Record<string, string> = {
            military: 'Армия',
            society: 'Народ', 
            ecology: 'Природа',
            economy: 'Бизнес',
            science: 'Наука',
            diplomacy: 'Мир'
          };
          
          return (
            <div key={key} className={`text-center p-3 border rounded-lg ${colors[key]} transition-colors`}>
              <div className="text-xs font-mono font-bold mb-1">{readableLabels[key]}</div>
              <div className="text-lg font-bold">{value}%</div>
            </div>
          );
        })}
      </div>
      
      {/* Общий баланс */}
      <OverallBalance stats={gameState.stats} />
      
      {/* Коррупция и популярность */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/20">
          <span className="text-muted-foreground text-xs mb-1">Коррупция:</span>
          <span className={`font-bold text-base ${
            gameState.metrics.corruption > 70 ? 'text-red-400' : 
            gameState.metrics.corruption > 40 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {gameState.metrics.corruption}%
          </span>
        </div>
        <div className="flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/20">
          <span className="text-muted-foreground text-xs mb-1">Популярность:</span>
          <span className={`font-bold text-base ${
            gameState.metrics.satisfaction > 70 ? 'text-green-400' : 
            gameState.metrics.satisfaction > 40 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {gameState.metrics.satisfaction}%
          </span>
        </div>
      </div>

      {/* Активные эффекты в мобильной версии */}
      {allBadges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/30">
            <div className="w-4 h-4 text-primary">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-sm font-mono font-bold text-primary uppercase tracking-wide">
              Активные эффекты
            </h3>
          </div>
          <div className="p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg">
            <EffectBadges 
              badges={allBadges} 
              iconOnlyMode={false}
              compactMode={true}
              maxVisible={4}
            />
          </div>
        </div>
      )}

      {/* Статистика игры */}
      <div className="space-y-2">
        <h3 className="text-sm font-mono font-bold text-primary uppercase tracking-wide">Статистика</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between p-2 bg-secondary/20 rounded border border-border/10">
            <span className="text-muted-foreground">Решений:</span>
            <span className="font-bold text-primary">{gameState.gameStats.totalDecisions}</span>
          </div>
          <div className="flex justify-between p-2 bg-secondary/20 rounded border border-border/10">
            <span className="text-muted-foreground">События:</span>
            <span className="font-bold text-primary">{gameState.gameStats.randomEventsTriggered}</span>
          </div>
        </div>
      </div>

      {/* Международная репутация (если есть) */}
      {gameState.countries && gameState.countries.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-mono font-bold text-primary uppercase tracking-wide">Репутация</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {gameState.countries.slice(0, 3).map((country: any) => (
              <div key={country.name} className="flex items-center justify-between p-2 bg-secondary/20 rounded-md border border-border/10">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    country.type === 'ally' ? 'bg-green-400' : 
                    country.type === 'enemy' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                  <span className={`text-xs font-mono truncate ${
                    country.type === 'ally' ? 'text-green-400' : 
                    country.type === 'enemy' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {country.name}
                  </span>
                </div>
                <span className={`text-xs font-mono font-bold flex-shrink-0 ${
                  country.reputation > 0 ? 'text-green-400' : 
                  country.reputation < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {country.reputation > 0 ? '+' : ''}{country.reputation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden max-w-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <AchievementSystem achievements={localState.achievements} />
      
      <GameHeader
        currentTerm={gameState.currentTerm}
        maxTerms={GAME_CONFIG.maxTerms}
        currentDecision={gameState.currentDecisionIndex + 1}
        totalDecisions={GAME_CONFIG.maxTerms * GAME_CONFIG.decisionsPerTerm}
        difficulty={difficultyName}
        termProgress={termProgress}
        overallProgress={overallProgress}
        isDarkTheme={localState.isDarkTheme}
        isSoundEnabled={localState.isSoundEnabled}
        showRestartButton={gameState.gameOver || gameState.gameWon}
        onToggleTheme={handleToggleTheme}
        onToggleSound={handleToggleSound}
        onRestart={handleRestart}
      />
      
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-[280px_1fr_280px] gap-2 lg:gap-6 p-2 lg:p-6 min-h-0 overflow-hidden max-w-full">
        
        {/* Мобильная панель статистик с высоким z-index */}
        <div className="lg:hidden relative z-30">
          <MobileStatsToggle />
          {localState.showMobileStats && <MobileStats />}
        </div>

        {/* Левая панель - только показатели */}
        <div className="hidden lg:block lg:col-start-1">
          <StatsPanel stats={gameState.stats} />
        </div>
        
        {/* Центральная область с карточкой */}
        <div className="flex-1 flex flex-col gap-2 lg:gap-4 min-h-0 lg:col-start-2 relative z-10">
          {/* Контекст советника */}
          {currentAdvisor && (
            <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-lg p-2 lg:p-3 flex items-center gap-2 lg:gap-3">
              <AdvisorAvatar 
                advisor={currentDecision.advisor} 
                size="md" 
                showGlow={true}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs lg:text-sm font-mono text-primary font-bold truncate">
                  {currentAdvisor.name}
                </div>
                <div className="text-xs text-muted-foreground italic leading-tight break-words">
                  "{currentAdvisor.catchPhrase}"
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex items-center justify-center relative min-h-0 max-w-full">
            <GameCard
              key={localState.animationKey}
              decision={getCurrentDecision()}
              transform={localState.cardTransform}
              swipeIndicator={localState.swipeIndicator}
              dragHandlers={handlers}
              onChoiceClick={handleChoice}
              disabled={gameState.gameOver || gameState.gameWon || localState.isAnimating}
              className="w-full max-w-sm lg:max-w-md"
            />
            
            {/* Streak индикатор */}
            {localState.streakCount >= CONSTANTS.STREAK_THRESHOLD && (
              <div className="absolute top-2 lg:top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-2xl font-mono font-bold text-sm lg:text-base shadow-lg animate-pulse z-10 max-w-[90vw] text-center whitespace-nowrap">
                🔥 STREAK x{localState.streakCount}
              </div>
            )}

            {/* Уведомление о случайном событии */}
            {localState.randomEventNotification && typeof localState.randomEventNotification === 'string' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 lg:px-6 lg:py-3 rounded-2xl font-mono font-bold text-sm lg:text-base shadow-lg animate-bounce z-20 max-w-[90vw] lg:max-w-md text-center leading-tight break-words">
                <span className="block">⚠️</span>
                <span className="block mt-1">{localState.randomEventNotification}</span>
              </div>
            )}
          </div>
          
          {/* Подсказки управления */}
          <div className="flex flex-col gap-2 lg:gap-3 items-center">
            <div className="flex gap-2 lg:gap-4 flex-wrap justify-center">
              {[
                { key: '←', label: 'Отклонить', color: 'red' },
                { key: '→', label: 'Принять', color: 'green' },
                ...(gameState.gameOver || gameState.gameWon ? [{ key: 'R', label: 'Перезапуск', color: 'blue' }] : [])
              ].map(({ key, label, color }) => (
                <div key={key} className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-2 bg-${color}-500/10 border border-${color}-500/20 rounded-lg text-${color}-500 font-mono text-xs lg:text-sm`}>
                  <kbd className={`bg-${color}-500/20 text-${color}-500 px-1 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-semibold border border-${color}-500/30 min-w-4 lg:min-w-6 text-center`}>{key}</kbd>
                  <span className="hidden sm:inline whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* ПРАВАЯ ПАНЕЛЬ с активными эффектами, статистикой и странами - БЕЗ overflow ограничений */}
        <div className="hidden lg:block bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 lg:col-start-3 space-y-4 max-h-full">
          
          {/* Скроллируемый контент с сохранением возможности выхода tooltips за границы */}
          <div className="space-y-4 h-full overflow-y-auto overflow-x-visible">
            
            {/* Общий баланс */}
            <OverallBalance stats={gameState.stats} />
            
            {/* Активные эффекты */}
            {allBadges.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <div className="w-4 h-4 text-primary">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-mono font-bold text-primary uppercase tracking-wide">
                    Активные эффекты
                  </h3>
                </div>
                <div className="p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg">
                  <EffectBadges 
                    badges={allBadges} 
                    iconOnlyMode={true}
                  />
                </div>
              </div>
            )}
            
            {/* Статистика игры */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/30">
              <div className="w-4 h-4 text-primary">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.87653 6.85425 4.02405 7.04 4.21L7.1 4.27C7.33568 4.50054 7.63502 4.65519 7.95941 4.714C8.28381 4.77282 8.61838 4.73312 8.92 4.6H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.29C19.896 4.47575 20.0435 4.69632 20.1441 4.93912C20.2448 5.18192 20.2966 5.44217 20.2966 5.705C20.2966 5.96783 20.2448 6.22808 20.1441 6.47088C20.0435 6.71368 19.896 6.93425 19.71 7.12L19.65 7.18C19.4195 7.41568 19.2648 7.71502 19.206 8.03941C19.1472 8.36381 19.1869 8.69838 19.32 9V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground font-mono text-sm">СТАТИСТИКА</h3>
                <span className="text-muted-foreground text-xs">игры</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Решений:', value: gameState.gameStats.totalDecisions },
                { label: 'События:', value: gameState.gameStats.randomEventsTriggered },
                { 
                  label: 'Коррупция:', 
                  value: `${gameState.metrics.corruption}%`,
                  color: gameState.metrics.corruption > 70 ? 'text-red-400' : 
                         gameState.metrics.corruption > 40 ? 'text-yellow-400' : 'text-green-400'
                },
                { 
                  label: 'Популярность:', 
                  value: `${gameState.metrics.satisfaction}%`,
                  color: gameState.metrics.satisfaction > 70 ? 'text-green-400' : 
                         gameState.metrics.satisfaction > 40 ? 'text-yellow-400' : 'text-red-400'
                }
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center p-2 bg-secondary/30 rounded-lg border border-border/20">
                  <span className="text-muted-foreground text-xs">{label}</span>
                  <span className={`font-semibold font-mono text-xs ${color || 'text-primary'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Международная репутация */}
            {gameState.countries && gameState.countries.length > 0 && (
              <div className="pt-3 border-t border-border/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 text-primary">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L13.09 8.26L19 7L14.64 12.5L21 14L12 18L3 14L9.36 12.5L5 7L10.91 8.26L12 2Z" 
                            stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                  <h3 className="text-xs font-semibold text-foreground font-mono uppercase tracking-wide">
                    Репутация
                  </h3>
                </div>
                <div className="space-y-2">
                  {gameState.countries.slice(0, 4).map((country: any) => (
                    <div key={country.name} className="group">
                      <div className="p-2 bg-secondary/20 rounded-md border border-border/10 hover:bg-secondary/30 transition-colors duration-200">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                              country.type === 'ally' ? 'bg-green-400' : 
                              country.type === 'enemy' ? 'bg-red-400' : 'bg-yellow-400'
                            }`} />
                            <div 
                              className={`text-xs font-mono flex-1 leading-tight break-words ${
                                country.type === 'ally' ? 'text-green-400' : 
                                country.type === 'enemy' ? 'text-red-400' : 'text-yellow-400'
                              }`}
                              title={country.backstory}
                            >
                              {country.name}
                            </div>
                          </div>
                          <span className={`text-xs font-mono font-bold flex-shrink-0 ${
                            country.reputation > 0 ? 'text-green-400' : 
                            country.reputation < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {country.reputation > 0 ? '+' : ''}{country.reputation}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* ИСПРАВЛЕНО: Диалог окончания игры показывается только когда игра действительно закончена */}
      {(gameState.gameOver || gameState.gameWon) && (
        <GameEndDialog
          open={localState.showEndDialog}
          onOpenChange={localState.setShowEndDialog}
          gameStats={gameState.gameStats}
          finalStats={gameState.stats}
          isVictory={gameState.gameWon}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}