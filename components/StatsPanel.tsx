import React from 'react';
import { StatIcons } from './VectorIcons';
import { STAT_LABELS } from '../constants/gameData';
import type { GameStats } from '../hooks/useGameState';

interface StatsPanelProps {
  stats: GameStats;
  className?: string;
}

// Цветовая схема для каждого показателя
const STAT_COLORS = {
  military: {
    primary: 'rgb(239 68 68)',
    light: 'rgb(248 113 113)',
    dark: 'rgb(185 28 28)',
    bg: 'rgb(239 68 68 / 0.1)',
    border: 'rgb(239 68 68 / 0.2)',
    gradient: 'from-red-500/20 via-red-600/15 to-red-700/20'
  },
  society: {
    primary: 'rgb(236 72 153)',
    light: 'rgb(244 114 182)',
    dark: 'rgb(190 24 93)',
    bg: 'rgb(236 72 153 / 0.1)',
    border: 'rgb(236 72 153 / 0.2)',
    gradient: 'from-pink-500/20 via-pink-600/15 to-pink-700/20'
  },
  ecology: {
    primary: 'rgb(34 197 94)',
    light: 'rgb(74 222 128)',
    dark: 'rgb(21 128 61)',
    bg: 'rgb(34 197 94 / 0.1)',
    border: 'rgb(34 197 94 / 0.2)',
    gradient: 'from-green-500/20 via-green-600/15 to-green-700/20'
  },
  economy: {
    primary: 'rgb(245 158 11)',
    light: 'rgb(251 191 36)',
    dark: 'rgb(180 83 9)',
    bg: 'rgb(245 158 11 / 0.1)',
    border: 'rgb(245 158 11 / 0.2)',
    gradient: 'from-amber-500/20 via-amber-600/15 to-amber-700/20'
  },
  science: {
    primary: 'rgb(168 85 247)',
    light: 'rgb(196 181 253)',
    dark: 'rgb(124 58 237)',
    bg: 'rgb(168 85 247 / 0.1)',
    border: 'rgb(168 85 247 / 0.2)',
    gradient: 'from-purple-500/20 via-purple-600/15 to-purple-700/20'
  },
  diplomacy: {
    primary: 'rgb(6 182 212)',
    light: 'rgb(34 211 238)',
    dark: 'rgb(8 145 178)',
    bg: 'rgb(6 182 212 / 0.1)',
    border: 'rgb(6 182 212 / 0.2)',
    gradient: 'from-cyan-500/20 via-cyan-600/15 to-cyan-700/20'
  }
} as const;

const StatBar = ({ 
  statKey, 
  value, 
  label 
}: { 
  statKey: keyof typeof STAT_COLORS; 
  value: number; 
  label: string; 
}) => {
  const colors = STAT_COLORS[statKey];
  const Icon = StatIcons[statKey];
  
  const getValueColor = (val: number) => {
    if (val <= 15) return 'text-red-400';
    if (val <= 30) return 'text-orange-400';
    if (val >= 85) return 'text-red-400';
    if (val >= 70) return colors.light;
    return 'text-foreground';
  };

  const getBarIntensity = (val: number) => {
    if (val <= 20) return 'animate-pulse';
    if (val >= 80) return 'animate-pulse';
    return '';
  };

  return (
    <div className={`bg-gradient-to-br ${colors.gradient} border border-opacity-30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-all duration-300`}
         style={{ borderColor: colors.border }}>
      
      {/* Фоновый эффект */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{ 
             background: `radial-gradient(circle at center, ${colors.bg}, transparent 70%)` 
           }} />
      
      <div className="relative z-10">
        {/* Иконка и лейбл */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6" style={{ color: colors.primary }}>
              <Icon />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
          </div>
          <div className={`text-lg font-mono font-bold ${getValueColor(value)} transition-colors duration-300`}>
            {value}%
          </div>
        </div>

        {/* Прогресс бар */}
        <div className="relative h-3 bg-background/50 rounded-full overflow-hidden border border-border/30">
          {/* Фоновый градиент */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          {/* Основной бар */}
          <div 
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${getBarIntensity(value)}`}
            style={{ 
              width: `${Math.max(0, Math.min(100, value))}%`,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.light})`
            }}
          />
          
          {/* Эффект свечения */}
          <div 
            className="absolute inset-y-0 left-0 rounded-full opacity-50 blur-sm transition-all duration-700 ease-out"
            style={{ 
              width: `${Math.max(0, Math.min(100, value))}%`,
              background: colors.primary
            }}
          />
        </div>

        {/* Индикатор критических состояний */}
        {(value <= 20 || value >= 80) && (
          <div className="flex items-center gap-1 mt-2">
            <div className={`w-2 h-2 rounded-full ${value <= 20 ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`} />
            <span className="text-xs font-mono text-muted-foreground">
              {value <= 20 ? 'КРИТИЧЕСКИ НИЗКО' : 'КРИТИЧЕСКИ ВЫСОКО'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент общего баланса (теперь отдельный)
export const OverallBalance = ({ stats }: { stats: GameStats }) => {
  const values = Object.values(stats);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const isBalanced = values.every(v => v >= 25 && v <= 75);
  const isStable = Math.max(...values) - Math.min(...values) < 40;
  
  return (
    <div className="p-3 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl backdrop-blur-sm">
      <div className="text-center">
        <h3 className="text-sm font-mono font-bold text-primary uppercase tracking-wide mb-2">
          Общий баланс
        </h3>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isBalanced && isStable ? 'bg-green-500 animate-pulse' :
            isStable ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
          }`} />
          <span className="text-sm font-mono text-foreground">
            {isBalanced && isStable ? 'СТАБИЛЬНОСТЬ' :
             isStable ? 'УМЕРЕННОСТЬ' : 'НЕСТАБИЛЬНОСТЬ'}
          </span>
          <span className="text-xs text-muted-foreground">
            ({Math.round(average)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export function StatsPanel({ 
  stats, 
  className = ''
}: StatsPanelProps) {

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Заголовок */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
        <div className="w-6 h-6 text-primary">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M9 9H15M9 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground font-mono">ПОКАЗАТЕЛИ</h2>
          <span className="text-muted-foreground text-sm">государства</span>
        </div>
      </div>

      {/* Статистики */}
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <StatBar
            key={key}
            statKey={key as keyof typeof STAT_COLORS}
            value={value}
            label={STAT_LABELS[key as keyof typeof STAT_LABELS]}
          />
        ))}
      </div>
    </div>
  );
}