import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AdvisorAvatar } from './AdvisorAvatar';
import { StatIcons } from './VectorIcons';
import { ADVISOR_NAMES, STAT_LABELS } from '../constants/gameData';
import type { GameDecision } from '../constants/gameData';

interface GameCardProps {
  decision: GameDecision;
  transform?: string;
  swipeIndicator?: 'left' | 'right' | null;
  dragHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
    isDragging?: boolean;
  };
  onChoiceClick: (isLeftChoice: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// Компонент для отображения мини-индикаторов эффектов
const EffectIndicators = ({ 
  effects, 
  className = '' 
}: { 
  effects: Record<string, number>;
  className?: string;
}) => {
  const effectEntries = Object.entries(effects).filter(([_, value]) => value !== 0);
  
  if (effectEntries.length === 0) {
    return <div className={`text-xs text-muted-foreground/70 ${className}`}>Нет эффектов</div>;
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {effectEntries.slice(0, 4).map(([stat, value]) => {
        const Icon = StatIcons[stat as keyof typeof StatIcons];
        const isPositive = value > 0;
        const colorClass = isPositive ? 'text-green-300' : 'text-red-300';
        const arrow = isPositive ? '↗' : '↘';
        
        return (
          <div 
            key={stat} 
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/20 ${colorClass}`}
            title={`${STAT_LABELS[stat as keyof typeof STAT_LABELS]}: ${isPositive ? '+' : ''}${value}`}
          >
            {Icon && (
              <div className="w-3 h-3 flex-shrink-0">
                <Icon />
              </div>
            )}
            <span className="text-xs font-mono font-bold">{arrow}</span>
            <span className="text-xs font-mono font-bold">{Math.abs(value)}</span>
          </div>
        );
      })}
      
      {/* Показать "+N" если эффектов больше 4 */}
      {effectEntries.length > 4 && (
        <div className="flex items-center px-1.5 py-0.5 rounded-md bg-black/20 text-white/70">
          <span className="text-xs font-mono">+{effectEntries.length - 4}</span>
        </div>
      )}
    </div>
  );
};

// Компонент подсказки с эффектами для hover
const EffectTooltip = ({ 
  effects, 
  children, 
  position = 'top' 
}: { 
  effects: Record<string, number>;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const effectEntries = Object.entries(effects).filter(([_, value]) => value !== 0);
  
  if (effectEntries.length === 0) {
    return <>{children}</>;
  }

  const positionClasses = position === 'top' 
    ? 'bottom-full mb-2' 
    : 'top-full mt-2';

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 ${positionClasses} z-50 pointer-events-none`}>
          <div className="bg-popover/95 backdrop-blur-md border border-border/50 rounded-lg shadow-2xl p-3 min-w-48 max-w-64">
            <div className="text-xs font-mono font-bold text-primary uppercase tracking-wide mb-2 text-center">
              Эффекты на показатели:
            </div>
            <div className="space-y-1">
              {effectEntries.map(([stat, value]) => {
                const Icon = StatIcons[stat as keyof typeof StatIcons];
                const isPositive = value > 0;
                const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
                const arrow = isPositive ? '↗' : '↘';
                
                return (
                  <div key={stat} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <div className={`w-4 h-4 ${colorClass}`}>
                          <Icon />
                        </div>
                      )}
                      <span className="text-xs text-popover-foreground font-mono">
                        {STAT_LABELS[stat as keyof typeof STAT_LABELS] || stat}:
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${colorClass} flex items-center gap-1`}>
                      <span>{arrow}</span>
                      <span>{isPositive ? '+' : ''}{value}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Стрелка указывающая на кнопку */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 ${
              position === 'top' 
                ? 'top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-border/50' 
                : 'bottom-full border-l-4 border-r-4 border-b-4 border-transparent border-b-border/50'
            }`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export function GameCard({
  decision,
  transform = '',
  swipeIndicator,
  dragHandlers,
  onChoiceClick,
  disabled = false,
  className = ''
}: GameCardProps) {
  
  // Извлекаем isDragging из dragHandlers, чтобы не передавать его на DOM
  const { isDragging, ...domHandlers } = dragHandlers;
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-foreground bg-muted/50 border-border';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return '📝';
      case 'medium':
        return '⚡';
      case 'high':
        return '🔥';
      case 'critical':
        return '🚨';
      default:
        return '📋';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'НИЗКАЯ';
      case 'medium':
        return 'СРЕДНЯЯ';
      case 'high':
        return 'ВЫСОКАЯ';
      case 'critical':
        return 'КРИТИЧЕСКАЯ';
      default:
        return urgency.toUpperCase();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Card 
        className={`
          relative w-full min-h-[500px] lg:min-h-[600px] p-0 
          bg-gradient-to-br from-card/80 via-card/90 to-card/95 
          backdrop-blur-xl border border-border/60 shadow-2xl
          transition-all duration-200 ease-out cursor-grab select-none
          hover:shadow-3xl hover:border-primary/30
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        style={{ 
          transform: transform,
          touchAction: 'none'
        }}
        {...(disabled ? {} : domHandlers)}
      >
        {/* Заголовок карточки с аватаром */}
        <div className="flex items-center gap-4 p-4 pb-3 border-b border-border/30">
          <AdvisorAvatar 
            advisor={decision.advisor} 
            size="md" 
            showGlow={true}
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-primary text-sm uppercase tracking-wide">
                {ADVISOR_NAMES[decision.advisor]}
              </h3>
              
              <div className={`
                px-2 py-1 rounded-full border text-xs font-mono font-bold
                flex items-center gap-1 ${getUrgencyColor(decision.urgency)}
              `}>
                <span>{getUrgencyIcon(decision.urgency)}</span>
                <span>{getUrgencyText(decision.urgency)}</span>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-foreground leading-tight">
              {decision.title}
            </h2>
          </div>
        </div>

        {/* Контент карточки */}
        <div className="p-4 space-y-4 flex-1">
          <div className="text-sm text-muted-foreground leading-relaxed">
            {decision.description}
          </div>

          {decision.consequences && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-xs text-primary font-mono font-bold uppercase mb-1 tracking-wide">
                Возможные последствия:
              </div>
              <div className="text-sm text-foreground italic">
                {decision.consequences}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки выбора с индикаторами эффектов - улучшенные стили для светлой темы */}
        <div className="p-4 pt-0 space-y-3">
          <EffectTooltip effects={decision.leftChoice.effects} position="top">
            <Button
              className={`
                w-full h-auto p-4 text-left justify-start
                bg-gradient-to-r from-red-600/30 via-red-700/25 to-red-800/30
                hover:from-red-600/40 hover:via-red-700/35 hover:to-red-800/40
                dark:from-red-500/20 dark:via-red-600/15 dark:to-red-700/20
                dark:hover:from-red-500/30 dark:hover:via-red-600/25 dark:hover:to-red-700/30
                border border-red-600/40 hover:border-red-600/60
                dark:border-red-500/30 dark:hover:border-red-500/50
                text-white dark:text-red-100 font-mono text-sm leading-relaxed
                transition-all duration-200 hover:scale-[1.02]
                shadow-lg hover:shadow-xl space-y-2
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onChoiceClick(true);
              }}
              disabled={disabled}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="text-white dark:text-red-400 font-bold text-lg flex-shrink-0">←</div>
                <div className="flex-1 space-y-2">
                  <div className="text-white/90 dark:text-red-300 font-bold text-xs uppercase mb-1">ОТКЛОНИТЬ</div>
                  <div className="text-white dark:text-red-100 mb-2">{decision.leftChoice.text}</div>
                  
                  {/* Индикаторы эффектов */}
                  <EffectIndicators 
                    effects={decision.leftChoice.effects}
                    className="justify-start"
                  />
                </div>
              </div>
            </Button>
          </EffectTooltip>

          <EffectTooltip effects={decision.rightChoice.effects} position="bottom">
            <Button
              className={`
                w-full h-auto p-4 text-left justify-start
                bg-gradient-to-r from-green-600/30 via-green-700/25 to-green-800/30
                hover:from-green-600/40 hover:via-green-700/35 hover:to-green-800/40
                dark:from-green-500/20 dark:via-green-600/15 dark:to-green-700/20
                dark:hover:from-green-500/30 dark:hover:via-green-600/25 dark:hover:to-green-700/30
                border border-green-600/40 hover:border-green-600/60
                dark:border-green-500/30 dark:hover:border-green-500/50
                text-white dark:text-green-100 font-mono text-sm leading-relaxed
                transition-all duration-200 hover:scale-[1.02]
                shadow-lg hover:shadow-xl space-y-2
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onChoiceClick(false);
              }}
              disabled={disabled}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="text-white dark:text-green-400 font-bold text-lg flex-shrink-0">→</div>
                <div className="flex-1 space-y-2">
                  <div className="text-white/90 dark:text-green-300 font-bold text-xs uppercase mb-1">ПРИНЯТЬ</div>
                  <div className="text-white dark:text-green-100 mb-2">{decision.rightChoice.text}</div>
                  
                  {/* Индикаторы эффектов */}
                  <EffectIndicators 
                    effects={decision.rightChoice.effects}
                    className="justify-start"
                  />
                </div>
              </div>
            </Button>
          </EffectTooltip>
        </div>

        {/* Индикаторы свайпа */}
        {swipeIndicator && (
          <>
            {swipeIndicator === 'left' && (
              <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-red-500/50">
                <div className="text-6xl animate-bounce">←</div>
              </div>
            )}
            {swipeIndicator === 'right' && (
              <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-green-500/50">
                <div className="text-6xl animate-bounce">→</div>
              </div>
            )}
          </>
        )}

        {/* Эффект свечения при наведении */}
        <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg" />
        </div>

        {/* Блики и отражения для киберпанк эффекта */}
        <div className="absolute top-4 left-4 w-16 h-0.5 bg-gradient-to-r from-primary/60 to-transparent opacity-40" />
        <div className="absolute bottom-4 right-4 w-12 h-0.5 bg-gradient-to-l from-primary/60 to-transparent opacity-40" />
      </Card>
    </div>
  );
}