import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from './ui/badge';

interface BadgeData {
  id: string;
  type: 'achievement' | 'positive' | 'negative' | 'neutral';
  icon: string;
  title: string;
  description: string;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
}

interface EffectBadgesProps {
  badges: BadgeData[];
  className?: string;
  maxVisible?: number;
  compactMode?: boolean;
  iconOnlyMode?: boolean;
}

const BadgeIcon = ({ icon, type, intensity = 'medium' }: { 
  icon: string; 
  type: BadgeData['type']; 
  intensity?: 'low' | 'medium' | 'high';
}) => {
  const getTypeColors = () => {
    switch (type) {
      case 'achievement':
        return 'text-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-500/60';
      case 'positive':
        return 'text-green-400 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-500/60';
      case 'negative':
        return 'text-red-400 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/40 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-500/60';
      case 'neutral':
        return 'text-blue-400 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/40 hover:from-blue-500/30 hover:to-indigo-500/30 hover:border-blue-500/60';
      default:
        return 'text-foreground bg-muted/20 border-border/40 hover:bg-muted/40 hover:border-border/60';
    }
  };

  const getIntensityAnimation = () => {
    switch (intensity) {
      case 'high':
        return 'animate-pulse';
      case 'medium':
        return 'animate-bounce';
      case 'low':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200 hover:scale-110 ${getTypeColors()} ${getIntensityAnimation()}`}>
      {icon}
      
      {/* Векторные элементы для каждого типа */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24" fill="none">
        {type === 'achievement' && (
          <>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            <path d="M12 6L14 10H18L15 13L16 18L12 15L8 18L9 13L6 10H10L12 6Z" 
                  stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
          </>
        )}
        {type === 'positive' && (
          <>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
          </>
        )}
        {type === 'negative' && (
          <>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
          </>
        )}
        {type === 'neutral' && (
          <>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
          </>
        )}
      </svg>
      
      {/* Эффект свечения для важных бейджиков */}
      {(type === 'achievement' || intensity === 'high') && (
        <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
      )}
    </div>
  );
};

// Портал-тултип с максимальным z-index и умным позиционированием
const PortalTooltip = ({ 
  badge, 
  children 
}: { 
  badge: BadgeData; 
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !isVisible) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Размеры tooltip (примерные)
    const tooltipWidth = 256; // max-w-64 = 256px
    const tooltipHeight = 200; // примерная высота

    // Начальная позиция - сверху по центру
    let x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
    let y = triggerRect.top - tooltipHeight - 8;

    // Корректируем X если выходит за правый край
    if (x + tooltipWidth > viewport.width - 16) {
      x = viewport.width - tooltipWidth - 16;
    }
    
    // Корректируем X если выходит за левый край
    if (x < 16) {
      x = 16;
    }

    // Если сверху не помещается, ставим снизу
    if (y < 16) {
      y = triggerRect.bottom + 8;
    }

    // Если снизу тоже не помещается, ставим по центру экрана
    if (y + tooltipHeight > viewport.height - 16) {
      y = Math.max(16, (viewport.height - tooltipHeight) / 2);
    }

    setTooltipPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      
      // Обновляем позицию при скролле и ресайзе
      const handleUpdate = () => requestAnimationFrame(updatePosition);
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isVisible]);

  const getTypeLabel = () => {
    switch (badge.type) {
      case 'achievement': return 'Достижение';
      case 'positive': return 'Положительный эффект';
      case 'negative': return 'Отрицательный эффект';
      case 'neutral': return 'Нейтральный эффект';
      default: return 'Эффект';
    }
  };

  const getTypeColor = () => {
    switch (badge.type) {
      case 'achievement': return 'text-yellow-400 border-yellow-500/30';
      case 'positive': return 'text-green-400 border-green-500/30';
      case 'negative': return 'text-red-400 border-red-500/30';
      case 'neutral': return 'text-blue-400 border-blue-500/30';
      default: return 'text-foreground border-border/30';
    }
  };

  // Создаем tooltip элемент
  const tooltipElement = isVisible ? (
    <div 
      ref={tooltipRef}
      className="fixed pointer-events-none transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-2"
      style={{ 
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        zIndex: 9999 // Максимальный z-index
      }}
    >
      <div className="bg-popover/98 backdrop-blur-xl border border-border/60 rounded-lg shadow-2xl 
                     p-4 w-64 max-w-64 
                     before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:rounded-lg before:-z-10">
        
        {/* Заголовок с типом */}
        <div className={`flex items-center gap-3 mb-3 pb-2 border-b ${getTypeColor()}`}>
          <span className="text-xl flex-shrink-0">{badge.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono uppercase tracking-wide opacity-80 mb-1">
              {getTypeLabel()}
            </div>
            <div className="text-sm font-semibold text-popover-foreground break-words">
              {badge.title}
            </div>
          </div>
        </div>
        
        {/* Описание */}
        <div className="text-sm text-popover-foreground/90 leading-relaxed mb-3 break-words">
          {badge.description}
        </div>
        
        {/* Дополнительная информация */}
        <div className="space-y-2">
          {badge.duration && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
              <span>⏱️</span>
              <span>Осталось: {badge.duration} ходов</span>
            </div>
          )}
          
          {badge.intensity && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">
              <span>
                {badge.intensity === 'high' ? '🔥' : 
                 badge.intensity === 'medium' ? '⚡' : '💫'}
              </span>
              <span>
                Интенсивность: {
                  badge.intensity === 'high' ? 'Высокая' : 
                  badge.intensity === 'medium' ? 'Средняя' : 'Низкая'
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div 
      ref={triggerRef}
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {/* Рендерим tooltip через портал в body */}
      {tooltipElement && typeof document !== 'undefined' && createPortal(
        tooltipElement,
        document.body
      )}
    </div>
  );
};

// Компактный групповой бейджик
const GroupBadge = ({ 
  type, 
  count, 
  badges, 
  onClick 
}: { 
  type: BadgeData['type']; 
  count: number; 
  badges: BadgeData[];
  onClick: () => void;
}) => {
  const getTypeInfo = () => {
    switch (type) {
      case 'achievement':
        return { 
          icon: '🏆', 
          label: 'Достижения',
          color: 'text-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-500/60 hover:text-yellow-300'
        };
      case 'positive':
        return { 
          icon: '⬆️', 
          label: 'Бонусы',
          color: 'text-green-400 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-500/60 hover:text-green-300'
        };
      case 'negative':
        return { 
          icon: '⬇️', 
          label: 'Штрафы',
          color: 'text-red-400 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/40 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-500/60 hover:text-red-300'
        };
      case 'neutral':
        return { 
          icon: '🔄', 
          label: 'Эффекты',
          color: 'text-blue-400 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/40 hover:from-blue-500/30 hover:to-indigo-500/30 hover:border-blue-500/60 hover:text-blue-300'
        };
      default:
        return { 
          icon: '❓', 
          label: 'Прочее',
          color: 'text-foreground bg-muted/20 border-border/40 hover:bg-muted/40 hover:border-border/60'
        };
    }
  };

  const info = getTypeInfo();

  return (
    <PortalTooltip badge={{
      id: `group-${type}`,
      type,
      icon: info.icon,
      title: `${info.label}: ${count}`,
      description: `${info.label}: ${count} активных эффектов. Нажмите для подробностей.`
    }}>
      <div 
        className={`group relative inline-flex items-center gap-1.5 px-2 py-1 rounded-full border cursor-pointer hover:scale-105 transition-all duration-200 ${info.color}`}
        onClick={onClick}
      >
        <span className="text-sm">{info.icon}</span>
        <span className="text-xs font-mono font-bold">{count}</span>
      </div>
    </PortalTooltip>
  );
};

export function EffectBadges({ 
  badges, 
  className = '', 
  maxVisible = 3,
  compactMode = false,
  iconOnlyMode = false 
}: EffectBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (badges.length === 0) return null;

  // Режим только иконок для правой панели
  if (iconOnlyMode) {
    const visibleBadges = badges.slice(0, 8); // Максимум 8 иконок
    const hasMore = badges.length > 8;

    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {visibleBadges.map((badge) => (
          <PortalTooltip key={badge.id} badge={badge}>
            <div className="cursor-help">
              <BadgeIcon 
                icon={badge.icon} 
                type={badge.type} 
                intensity={badge.intensity}
              />
            </div>
          </PortalTooltip>
        ))}
        
        {hasMore && (
          <PortalTooltip badge={{
            id: 'more-effects',
            type: 'neutral',
            icon: '➕',
            title: `Еще ${badges.length - 8} эффектов`,
            description: `Всего активно ${badges.length} эффектов. Первые 8 показаны выше.`
          }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 text-muted-foreground bg-muted/20 border-border/40 hover:bg-muted/40 hover:border-border/60 transition-all duration-200 hover:scale-110 cursor-help">
              +{badges.length - 8}
            </div>
          </PortalTooltip>
        )}
      </div>
    );
  }

  // Группируем бейджики по типам
  const groupedBadges = badges.reduce((acc, badge) => {
    if (!acc[badge.type]) acc[badge.type] = [];
    acc[badge.type].push(badge);
    return acc;
  }, {} as Record<BadgeData['type'], BadgeData[]>);

  // Если эффектов мало или включен обычный режим
  if (badges.length <= maxVisible && !compactMode) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {badges.map((badge) => (
          <PortalTooltip key={badge.id} badge={badge}>
            <div className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-help hover:scale-105">
              <BadgeIcon 
                icon={badge.icon} 
                type={badge.type} 
                intensity={badge.intensity}
              />
              
              <div className="flex flex-col">
                <span className="text-xs font-mono font-semibold text-foreground leading-tight break-words">
                  {badge.title}
                </span>
                {badge.duration && (
                  <span className="text-xs text-muted-foreground font-mono leading-tight">
                    {badge.duration}⏱️
                  </span>
                )}
              </div>
            </div>
          </PortalTooltip>
        ))}
      </div>
    );
  }

  // Компактный режим или много эффектов
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Компактное отображение групп */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(groupedBadges).map(([type, typeBadges]) => (
          <GroupBadge
            key={type}
            type={type as BadgeData['type']}
            count={typeBadges.length}
            badges={typeBadges}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        ))}
        
        {/* Кнопка развернуть/свернуть */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 border border-border/50 hover:bg-muted/80 transition-all duration-200 text-xs font-mono text-muted-foreground hover:text-foreground hover:scale-105 whitespace-nowrap"
        >
          <span>{isExpanded ? '🔼' : '🔽'}</span>
          <span>{isExpanded ? 'Скрыть' : 'Показать'}</span>
        </button>
      </div>

      {/* Развернутое отображение */}
      {isExpanded && (
        <div className="space-y-3 p-3 bg-card/60 backdrop-blur-sm border border-border/30 rounded-lg">
          {Object.entries(groupedBadges).map(([type, typeBadges]) => {
            const typeInfo = {
              achievement: { icon: '🏆', label: 'Достижения', color: 'text-yellow-400' },
              positive: { icon: '⬆️', label: 'Положительные эффекты', color: 'text-green-400' },
              negative: { icon: '⬇️', label: 'Отрицательные эффекты', color: 'text-red-400' },
              neutral: { icon: '🔄', label: 'Нейтральные эффекты', color: 'text-blue-400' }
            }[type as BadgeData['type']];

            return (
              <div key={type} className="space-y-2">
                <div className={`flex items-center gap-2 text-sm font-mono font-bold ${typeInfo.color}`}>
                  <span>{typeInfo.icon}</span>
                  <span>{typeInfo.label} ({typeBadges.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {typeBadges.map((badge) => (
                    <PortalTooltip key={badge.id} badge={badge}>
                      <div className="flex items-center gap-2 p-2 bg-background/50 border border-border/20 rounded-lg hover:bg-background/80 transition-colors duration-200 cursor-help">
                        <BadgeIcon 
                          icon={badge.icon} 
                          type={badge.type} 
                          intensity={badge.intensity}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-mono font-semibold text-foreground break-words">
                            {badge.title}
                          </div>
                          <div className="text-xs text-muted-foreground leading-tight break-words">
                            {badge.description}
                          </div>
                          {badge.duration && (
                            <div className="text-xs text-muted-foreground font-mono">
                              Осталось: {badge.duration} ходов
                            </div>
                          )}
                        </div>
                      </div>
                    </PortalTooltip>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Хелперы для создания бейджиков
export const createAchievementBadge = (id: string, icon: string, title: string, description: string): BadgeData => ({
  id,
  type: 'achievement',
  icon,
  title,
  description,
  intensity: 'high'
});

export const createEffectBadge = (
  id: string, 
  icon: string, 
  title: string, 
  description: string, 
  duration: number,
  isPositive: boolean,
  intensity: 'low' | 'medium' | 'high' = 'medium'
): BadgeData => ({
  id,
  type: isPositive ? 'positive' : 'negative',
  icon,
  title,
  description,
  duration,
  intensity
});

export const createNeutralBadge = (id: string, icon: string, title: string, description: string): BadgeData => ({
  id,
  type: 'neutral',
  icon,
  title,
  description
});