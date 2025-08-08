import React from 'react';

interface RuleTimerProps {
  currentTerm: number;
  maxTerms: number;
  currentDecision: number;
  totalDecisions: number;
  difficulty: number;
}

const RuleTimer: React.FC<RuleTimerProps> = ({ 
  currentTerm, 
  maxTerms, 
  currentDecision, 
  totalDecisions, 
  difficulty 
}) => {
  const termProgress = (currentDecision % (totalDecisions / maxTerms)) / (totalDecisions / maxTerms) * 100;
  const overallProgress = ((currentTerm - 1) * 100 + termProgress) / maxTerms;

  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return '#4ecdc4';
    if (diff <= 4) return '#f9ca24';
    if (diff <= 6) return '#ff6b6b';
    return '#a55eea';
  };

  const getDifficultyName = (diff: number) => {
    if (diff <= 2) return 'СТАБИЛЬНОСТЬ';
    if (diff <= 4) return 'НАПРЯЖЕНИЕ';
    if (diff <= 6) return 'КРИЗИС';
    return 'ХАОС';
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 space-y-4">
      {/* Current term display */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-cyan-400 font-mono text-sm">СРОК ПРАВЛЕНИЯ</div>
          <div className="text-white font-mono text-lg">
            {currentTerm} / {maxTerms}
          </div>
        </div>
        
        <div className="space-y-1 text-right">
          <div className="text-cyan-400 font-mono text-sm">СЛОЖНОСТЬ</div>
          <div 
            className="font-mono text-lg"
            style={{ color: getDifficultyColor(difficulty) }}
          >
            {getDifficultyName(difficulty)}
          </div>
        </div>
      </div>

      {/* Term progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>ПРОГРЕСС СРОКА</span>
          <span>{Math.floor(termProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${termProgress}%` }}
          />
        </div>
      </div>

      {/* Overall progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>ОБЩИЙ ПРОГРЕСС</span>
          <span>{Math.floor(overallProgress)}%</span>
        </div>
        <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Current decision counter */}
      <div className="flex justify-center space-x-4 text-xs font-mono">
        <span className="text-slate-400">РЕШЕНИЕ</span>
        <span className="text-cyan-400">{currentDecision}</span>
        <span className="text-slate-400">/</span>
        <span className="text-cyan-400">{totalDecisions}</span>
      </div>

      {/* Cyberpunk decorations */}
      <div className="flex justify-center space-x-2 mt-4">
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
        <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}} />
        <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.8s'}} />
      </div>
    </div>
  );
};

export default RuleTimer;