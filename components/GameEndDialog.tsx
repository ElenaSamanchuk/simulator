import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ControlIcons } from './VectorIcons';
import { STAT_LABELS } from '../constants/gameData';
import type { GameStats } from '../hooks/useGameState';

interface GameEndDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameStats: any;
  finalStats: GameStats;
  isVictory: boolean;
  onRestart: () => void;
}

interface EndingResult {
  type: string;
  title: string;
  description: string;
  flavor: string;
  icon: string;
  color: string;
}

interface PlayerProfile {
  dominantStat: string;
  playStyle: string;
  moralAlignment: string;
}

function analyzePlayerProfile(stats: GameStats): PlayerProfile {
  const dominantStat = Object.entries(stats).reduce((a, b) => stats[a[0] as keyof GameStats] > stats[b[0] as keyof GameStats] ? a : b)[0];
  
  const statValues = Object.values(stats);
  const average = statValues.reduce((a, b) => a + b, 0) / statValues.length;
  const variance = statValues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / statValues.length;
  
  let playStyle = 'balanced';
  if (variance < 100) playStyle = 'balanced';
  else if (variance > 400) playStyle = 'extremist';
  else if (average < 40) playStyle = 'cautious';
  else if (average > 70) playStyle = 'aggressive';
  else playStyle = 'chaotic';
  
  if (stats.science > 75) playStyle = 'technocrat';
  if (stats.society > 75 && stats.science < 40) playStyle = 'traditionalist';
  if (stats.diplomacy > 75) playStyle = 'diplomat';
  
  let moralAlignment = 'neutral';
  if (stats.society > 70 && stats.ecology > 60) moralAlignment = 'good';
  else if (stats.society < 30 || stats.military > 80) moralAlignment = 'evil';
  
  return {
    dominantStat,
    playStyle,
    moralAlignment
  };
}

function generateEnding(profile: PlayerProfile, stats: GameStats, isVictory: boolean): EndingResult {
  if (!isVictory) {
    const lowestStat = Object.entries(stats).reduce((a, b) => stats[a[0] as keyof GameStats] < stats[b[0] as keyof GameStats] ? a : b);
    const [statName] = lowestStat;
    
    const defeatReasons: Record<string, EndingResult> = {
      military: {
        type: 'MILITARY_COLLAPSE',
        title: 'ВОЕННЫЙ КОЛЛАПС',
        description: 'Ослабленная армия не смогла защитить государство от внешних угроз.',
        flavor: 'Мир - это хорошо, но не тогда, когда враги у ворот.',
        icon: '⚔️',
        color: 'text-red-400'
      },
      society: {
        type: 'SOCIAL_CRISIS',
        title: 'СОЦИАЛЬНЫЙ КРИЗИС',
        description: 'Потеря доверия народа привела к анархии и распаду общества.',
        flavor: 'Без народа нет государства.',
        icon: '💫',
        color: 'text-purple-400'
      },
      ecology: {
        type: 'ECOLOGICAL_DISASTER',
        title: 'ЭКОЛОГИЧЕСКАЯ КАТАСТРОФА',
        description: 'Планета больше не может поддерживать жизнь из-за экологических разрушений.',
        flavor: 'Прогресс без заботы о природе - путь к самоуничтожению.',
        icon: '🌍',
        color: 'text-green-400'
      }
    };
    
    return defeatReasons[statName] || {
      type: 'GENERAL_COLLAPSE',
      title: 'ВСЕОБЩИЙ КОЛЛАПС',
      description: 'Государство рухнуло под грузом накопившихся проблем.',
      flavor: 'Иногда даже лучшие намерения приводят к худшим результатам.',
      icon: '💀',
      color: 'text-foreground'
    };
  }
  
  if (profile.playStyle === 'diplomat') {
    return {
      type: 'PEACEFUL_EMPIRE',
      title: 'МИРНАЯ ИМПЕРИЯ',
      description: 'Вы создали процветающее государство, где конфликты решаются словом, а не мечом.',
      flavor: 'Истинная сила в умении договариваться.',
      icon: '🕊️',
      color: 'text-cyan-400'
    };
  }
  
  if (profile.playStyle === 'balanced' && profile.moralAlignment === 'good') {
    return {
      type: 'GOLDEN_AGE',
      title: 'ЗОЛОТОЙ ВЕК',
      description: 'Под вашим мудрым правлением началась новая эра процветания. Нация достигла идеального баланса между прогрессом и традициями.',
      flavor: 'История будет помнить вас как величайшего правителя всех времён.',
      icon: '👑',
      color: 'text-yellow-400'
    };
  }
  
  return {
    type: 'STABLE_DEMOCRACY',
    title: 'СТАБИЛЬНАЯ ДЕМОКРАТИЯ',
    description: 'Ваше сбалансированное правление создало устойчивое демократическое государство.',
    flavor: 'Мудрость в балансе - залог долгой жизни нации.',
    icon: '⚖️',
    color: 'text-blue-400'
  };
}

export function GameEndDialog({
  open,
  onOpenChange,
  gameStats,
  finalStats,
  isVictory,
  onRestart
}: GameEndDialogProps) {
  const profile = analyzePlayerProfile(finalStats);
  const ending = generateEnding(profile, finalStats, isVictory);

  const getPlayStyleName = (style: string) => {
    const names: Record<string, string> = {
      'balanced': 'СБАЛАНСИРОВАННЫЙ',
      'extremist': 'ЭКСТРЕМИСТ',
      'cautious': 'ОСТОРОЖНЫЙ',
      'aggressive': 'АГРЕССИВНЫЙ',
      'chaotic': 'ХАОТИЧНЫЙ',
      'technocrat': 'ТЕХНОКРАТ',
      'traditionalist': 'ТРАДИЦИОНАЛИСТ',
      'diplomat': 'ДИПЛОМАТ'
    };
    return names[style] || 'НЕИЗВЕСТНЫЙ';
  };

  const getAlignmentName = (alignment: string) => {
    const names: Record<string, string> = {
      'good': 'ДОБРО',
      'evil': 'ЗЛО',
      'neutral': 'НЕЙТРАЛЬ'
    };
    return names[alignment] || 'НЕЙТРАЛЬ';
  };

  const getStatColor = (value: number) => {
    if (value <= 10) return 'text-red-400';
    if (value <= 30) return 'text-yellow-400';
    if (value >= 90) return 'text-red-400';
    if (value >= 70) return 'text-green-400';
    return 'text-foreground';
  };

  const getStatBarColor = (statKey: string) => {
    const colors: Record<string, string> = {
      military: 'bg-red-500',
      ecology: 'bg-green-500',
      society: 'bg-pink-500',
      economy: 'bg-amber-500',
      science: 'bg-purple-500',
      diplomacy: 'bg-cyan-500'
    };
    return colors[statKey] || 'bg-foreground';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        hideCloseButton={true}
        className="w-[98vw] sm:w-[95vw] max-w-4xl h-[98vh] sm:h-[95vh] max-h-[98vh] overflow-hidden p-0 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl flex flex-col"
        aria-describedby={undefined}
      >
        {/* Компактный заголовок */}
        <DialogHeader className="text-center pb-3 border-b border-border/30 bg-gradient-to-r from-transparent via-primary/5 to-transparent p-3 sm:p-4 relative flex-shrink-0">
          <div className="text-3xl sm:text-5xl mb-2 animate-bounce mx-auto">{ending.icon}</div>
          <DialogTitle className={`text-lg sm:text-2xl font-bold ${ending.color} font-mono tracking-wide text-center`}>
            {ending.title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl mx-auto text-center">
            {isVictory ? 'Ваше правление завершилось успешно' : 'Ваше правление завершилось поражением'}
          </DialogDescription>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors z-10"
            onClick={() => onOpenChange(false)}
          >
            <ControlIcons.close />
          </Button>
        </DialogHeader>

        {/* Контент без скролла */}
        <div className="flex-1 p-3 sm:p-4 space-y-4 overflow-hidden">
          {/* Краткое описание */}
          <div className="text-center space-y-2 max-w-4xl mx-auto">
            <p className="text-sm sm:text-base text-foreground leading-tight">
              {ending.description}
            </p>
            <p className="italic text-primary font-mono text-xs sm:text-sm bg-primary/5 p-2 rounded-lg border border-primary/20">
              "{ending.flavor}"
            </p>
          </div>

          {/* Компактный анализ */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-lg text-primary text-center font-mono font-bold uppercase tracking-wider">
              Анализ правления
            </h3>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-secondary/30 border border-border/40 rounded-lg p-2 text-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M16 4L20 12H28L22 16L24 24L16 20L8 24L10 16L4 12H12L16 4Z" fill="currentColor"/>
                  </svg>
                </div>
                <h4 className="text-primary text-xs font-mono font-bold uppercase mb-1 tracking-wide">
                  Стиль
                </h4>
                <div className="text-foreground font-bold text-xs sm:text-sm">
                  {getPlayStyleName(profile.playStyle).slice(0, 12)}
                </div>
              </div>
              
              <div className="bg-secondary/30 border border-border/40 rounded-lg p-2 text-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="16" width="4" height="10" fill="currentColor" rx="2"/>
                    <rect x="14" y="8" width="4" height="18" fill="currentColor" rx="2"/>
                    <rect x="22" y="12" width="4" height="14" fill="currentColor" rx="2"/>
                  </svg>
                </div>
                <h4 className="text-primary text-xs font-mono font-bold uppercase mb-1 tracking-wide">
                  Приоритет
                </h4>
                <div className="text-foreground font-bold text-xs sm:text-sm">
                  {STAT_LABELS[profile.dominantStat as keyof typeof STAT_LABELS]}
                </div>
              </div>
              
              <div className="bg-secondary/30 border border-border/40 rounded-lg p-2 text-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z" fill="currentColor"/>
                  </svg>
                </div>
                <h4 className="text-primary text-xs font-mono font-bold uppercase mb-1 tracking-wide">
                  Направл.
                </h4>
                <div className="text-foreground font-bold text-xs sm:text-sm">
                  {getAlignmentName(profile.moralAlignment)}
                </div>
              </div>
            </div>
          </div>

          {/* ИСПРАВЛЕННЫЕ показатели - распределение по всей ширине */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-lg text-primary text-center font-mono font-bold uppercase tracking-wider">
              Итоговые показатели
            </h3>
            
            {/* Адаптивная сетка для показателей */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {Object.entries(finalStats).map(([key, value]) => (
                <div key={key} className="text-center space-y-1 bg-secondary/20 rounded-lg p-2 border border-border/20">
                  <div className="text-xs text-muted-foreground font-mono font-medium uppercase tracking-wide">
                    {STAT_LABELS[key as keyof typeof STAT_LABELS].split(' ')[0]}
                  </div>
                  <div className="relative h-8 sm:h-12 bg-background/50 rounded border border-border/30 overflow-hidden">
                    <div 
                      className={`absolute bottom-0 w-full ${getStatBarColor(key)} transition-all duration-1500 ease-out rounded-sm`}
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <div className={`text-xs font-mono font-bold ${getStatColor(value)}`}>
                    {value}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Компактная статистика */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20 rounded-lg border border-border/30">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-primary font-mono">
                {gameStats.completedTerms || 1}
              </div>
              <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                Сроков
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-primary font-mono">
                {gameStats.totalDecisions || 0}
              </div>
              <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                Решений
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-primary font-mono">
                {gameStats.randomEventsTriggered || 0}
              </div>
              <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                События
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-primary font-mono">
                {Math.round((Object.keys(finalStats).filter(key => finalStats[key as keyof GameStats] > 50).length / Object.keys(finalStats).length) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                Успех
              </div>
            </div>
          </div>
        </div>

        {/* Фиксированные кнопки */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-center gap-2 p-3 border-t border-border/30 bg-background/50 backdrop-blur-sm">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="font-mono px-4 py-2 text-sm hover:bg-secondary/80 transition-all duration-200"
          >
            Продолжить просмотр
          </Button>
          <Button 
            onClick={() => {
              onRestart();
              onOpenChange(false);
            }}
            className={`
              relative font-mono px-4 py-2 text-sm transition-all duration-300 transform hover:scale-105 overflow-hidden group
              ${isVictory 
                ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400' 
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500'
              }
              text-white shadow-lg hover:shadow-xl border-0
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isVictory ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="animate-pulse">
                    <path d="M8 1L10 5L15 6L11 10L12 15L8 13L4 15L5 10L1 6L6 5L8 1Z" fill="currentColor"/>
                  </svg>
                  Новая эпоха
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="animate-spin group-hover:animate-pulse">
                    <path d="M8 1V3M8 13V15M15 8H13M3 8H1M13.36 2.64L11.95 4.05M4.05 11.95L2.64 13.36M13.36 13.36L11.95 11.95M4.05 4.05L2.64 2.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Попробовать снова
                </>
              )}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}