import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementNotification extends Achievement {
  notificationId: string;
  showTime: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
}

export function AchievementSystem({ achievements }: AchievementSystemProps) {
  const [activeNotifications, setActiveNotifications] = useState<AchievementNotification[]>([]);
  const [processedAchievements, setProcessedAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Проверяем новые достижения
    const newUnlocked = achievements.filter(achievement => 
      achievement.unlocked && 
      !processedAchievements.has(achievement.id)
    );

    if (newUnlocked.length > 0) {
      // Добавляем новые достижения к уведомлениям
      const newNotifications: AchievementNotification[] = newUnlocked.map(achievement => ({
        ...achievement,
        notificationId: `${achievement.id}-${Date.now()}`,
        showTime: Date.now()
      }));

      setActiveNotifications(prev => [...prev, ...newNotifications]);
      
      // Обновляем список обработанных достижений
      setProcessedAchievements(prev => {
        const newSet = new Set(prev);
        newUnlocked.forEach(achievement => newSet.add(achievement.id));
        return newSet;
      });

      // Автоматически убираем уведомления через 5 секунд
      newNotifications.forEach(notification => {
        setTimeout(() => {
          setActiveNotifications(prev => 
            prev.filter(n => n.notificationId !== notification.notificationId)
          );
        }, 5000);
      });
    }
  }, [achievements, processedAchievements]);

  const handleClose = (notificationId: string) => {
    setActiveNotifications(prev => 
      prev.filter(n => n.notificationId !== notificationId)
    );
  };

  const getRarityStyle = (rarity: string) => {
    const styles = {
      common: {
        border: 'border-gray-400/30',
        bg: 'bg-gray-400/5',
        text: 'text-gray-300',
        glow: 'shadow-gray-400/20'
      },
      rare: {
        border: 'border-blue-400/40',
        bg: 'bg-blue-400/10',
        text: 'text-blue-300',
        glow: 'shadow-blue-400/25'
      },
      epic: {
        border: 'border-purple-400/50',
        bg: 'bg-purple-400/15',
        text: 'text-purple-300',
        glow: 'shadow-purple-400/30'
      },
      legendary: {
        border: 'border-yellow-400/60',
        bg: 'bg-yellow-400/20',
        text: 'text-yellow-300',
        glow: 'shadow-yellow-400/40'
      }
    };
    return styles[rarity as keyof typeof styles] || styles.common;
  };

  if (activeNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-2 lg:right-4 z-50 space-y-3 max-w-[90vw] lg:max-w-sm pointer-events-none">
      {activeNotifications.map((notification) => {
        const style = getRarityStyle(notification.rarity);
        return (
          <div
            key={notification.notificationId}
            className={`
              ${style.bg} ${style.border} ${style.glow}
              backdrop-blur-md border rounded-xl p-4 lg:p-5 shadow-2xl 
              transform transition-all duration-500 ease-out pointer-events-auto
              animate-in slide-in-from-right-full fade-in-0
              hover:scale-105 w-full lg:w-auto
            `}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl lg:text-3xl flex-shrink-0 animate-bounce">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className={`text-xs lg:text-xs font-mono font-bold uppercase tracking-wider ${style.text} leading-tight`}>
                    🏆 Достижение получено!
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 lg:h-5 lg:w-5 p-0 text-muted-foreground/60 hover:text-foreground transition-colors hover:bg-white/10 flex-shrink-0"
                    onClick={() => handleClose(notification.notificationId)}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </Button>
                </div>
                
                <div className={`text-xs font-mono font-semibold uppercase tracking-wide mb-2 ${style.text} opacity-80`}>
                  {notification.rarity}
                </div>
                
                <div className="font-bold text-foreground mb-2 text-sm lg:text-base leading-tight break-words">
                  {notification.name}
                </div>
                
                <div className="text-xs lg:text-sm text-muted-foreground leading-relaxed break-words">
                  {notification.description}
                </div>
              </div>
            </div>
            
            {/* Прогресс-бар автоскрытия */}
            <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${style.text} bg-current rounded-full achievement-progress-bar`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}