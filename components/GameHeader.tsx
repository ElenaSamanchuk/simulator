import React from 'react';
import { Button } from './ui/button';
import { ControlIcons } from './VectorIcons';

interface GameHeaderProps {
  currentTerm: number;
  maxTerms: number;
  currentDecision: number;
  totalDecisions: number;
  difficulty: string;
  termProgress: number;
  overallProgress: number;
  isDarkTheme: boolean;
  isSoundEnabled: boolean;
  showRestartButton: boolean;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onRestart: () => void;
}

// Новый футуристический логотип
const FuturisticLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-primary">
    {/* Внешнее кольцо */}
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
    
    {/* Средний шестиугольник */}
    <path d="M20 4L32 12V28L20 36L8 28V12L20 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    
    {/* Внутренний кристалл */}
    <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="currentColor" opacity="0.2"/>
    
    {/* Центральный элемент */}
    <circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.8"/>
    <circle cx="20" cy="20" r="3" fill="currentColor"/>
    
    {/* Орбитальные элементы */}
    <circle cx="20" cy="8" r="2" fill="currentColor" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="32" cy="20" r="2" fill="currentColor" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    </circle>
    <circle cx="20" cy="32" r="2" fill="currentColor" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1s"/>
    </circle>
    <circle cx="8" cy="20" r="2" fill="currentColor" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1.5s"/>
    </circle>
    
    {/* Соединительные линии */}
    <path d="M20 14L20 8M26 20L32 20M20 26L20 32M14 20L8 20" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
    
    {/* Внутренние детали */}
    <path d="M16 16L24 24M24 16L16 24" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
  </svg>
);

export function GameHeader({
  currentTerm,
  maxTerms,
  currentDecision,
  totalDecisions,
  difficulty,
  termProgress,
  overallProgress,
  isDarkTheme,
  isSoundEnabled,
  showRestartButton,
  onToggleTheme,
  onToggleSound,
  onRestart
}: GameHeaderProps) {
  return (
    <header className="flex-shrink-0 bg-secondary/80 backdrop-blur-md border-b border-border/50 relative z-10">
      <div className="flex justify-between items-center p-4 lg:px-6 gap-4 max-w-full">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <FuturisticLogo />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg lg:text-xl font-bold text-primary font-mono tracking-tight leading-tight">
              ГОСУДАРСТВЕННЫЙ СИМУЛЯТОР 2077
            </h1>
            <div className="text-xs text-muted-foreground font-mono mt-0.5 hidden sm:block">
              Принимайте решения • Управляйте балансом • Спасите нацию
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          {showRestartButton && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onRestart}
              className="w-10 h-10 p-0 relative group hover:scale-105 transition-all duration-200 dark:bg-red-600/80 dark:hover:bg-red-600/90 dark:text-white"
              title="Новая игра"
            >
              <ControlIcons.restart />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
            className="w-10 h-10 p-0 hover:rotate-180 transition-all duration-500 hover:scale-105 
                     dark:border-border/50 dark:bg-background/50 dark:hover:bg-background/80 dark:hover:border-primary/50
                     dark:text-foreground dark:hover:text-primary"
            title={isDarkTheme ? 'Светлая тема' : 'Темная тема'}
          >
            <ControlIcons.theme isDark={isDarkTheme} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSound}
            className={`w-10 h-10 p-0 transition-all duration-200 hover:scale-105
                     dark:border-border/50 dark:bg-background/50 dark:hover:bg-background/80 dark:hover:border-primary/50
                     dark:text-foreground dark:hover:text-primary
                     ${isSoundEnabled ? '' : 'opacity-50 dark:opacity-40'}`}
            title={isSoundEnabled ? 'Отключить звук' : 'Включить звук'}
          >
            <ControlIcons.sound isMuted={!isSoundEnabled} />
          </Button>
        </div>
      </div>
      
      {/* Прогресс игры */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 p-3 px-4 lg:px-6 bg-muted/30 border-t border-border/30">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="text-sm text-muted-foreground font-mono font-medium whitespace-nowrap">
            Срок {currentTerm}/{maxTerms}
          </div>
          <div className="w-24 h-2.5 bg-background/50 rounded-full overflow-hidden border border-border/20 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-primary via-blue-500 to-cyan-400 transition-all duration-700 rounded-full shadow-sm"
              style={{ width: `${termProgress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="text-sm text-muted-foreground font-mono font-medium whitespace-nowrap">
            Решение {currentDecision}/{totalDecisions}
          </div>
          <div className="w-24 h-2.5 bg-background/50 rounded-full overflow-hidden border border-border/20 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-primary transition-all duration-700 rounded-full shadow-sm"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
          <span className="text-sm text-muted-foreground font-mono">Сложность:</span>
          <span className="text-sm text-yellow-400 font-mono font-semibold uppercase tracking-wide">
            {difficulty}
          </span>
        </div>
      </div>
    </header>
  );
}