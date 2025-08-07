import React from 'react';
import { motion } from 'motion/react';

interface EndingData {
  type: string;
  title: string;
  description: string;
  flavor: string;
  icon: string;
  color: string;
  bgGradient: string;
}

export interface PlayerProfile {
  dominantStat: string;
  playStyle: 'balanced' | 'extremist' | 'cautious' | 'aggressive' | 'chaotic' | 'technocrat' | 'traditionalist';
  moralAlignment: 'good' | 'neutral' | 'evil';
  economicApproach: 'capitalist' | 'socialist' | 'mixed';
  militaryStance: 'pacifist' | 'defensive' | 'aggressive';
  innovationLevel: 'conservative' | 'moderate' | 'progressive' | 'radical';
}

export class EndingAnalyzer {
  static analyzePlayerProfile(stats: Record<string, number>, decisions: any[]): PlayerProfile {
    // Определяем доминирующую статистику
    const dominantStat = Object.entries(stats).reduce((a, b) => stats[a[0]] > stats[b[0]] ? a : b)[0];
    
    // Анализируем стиль игры
    const statValues = Object.values(stats);
    const average = statValues.reduce((a, b) => a + b, 0) / statValues.length;
    const variance = statValues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / statValues.length;
    
    let playStyle: PlayerProfile['playStyle'] = 'balanced';
    if (variance < 100) playStyle = 'balanced';
    else if (variance > 400) playStyle = 'extremist';
    else if (average < 40) playStyle = 'cautious';
    else if (average > 70) playStyle = 'aggressive';
    else playStyle = 'chaotic';
    
    // Особые стили
    if (stats.science > 75) playStyle = 'technocrat';
    if (stats.morality > 75 && stats.science < 40) playStyle = 'traditionalist';
    
    // Моральное выравнивание
    let moralAlignment: PlayerProfile['moralAlignment'] = 'neutral';
    if (stats.morality > 70 && stats.ecology > 60) moralAlignment = 'good';
    else if (stats.morality < 30 || stats.army > 80) moralAlignment = 'evil';
    
    // Экономический подход
    let economicApproach: PlayerProfile['economicApproach'] = 'mixed';
    if (stats.banks > 70 && stats.economy > 70) economicApproach = 'capitalist';
    else if (stats.morality > 60 && stats.medicine > 60) economicApproach = 'socialist';
    
    // Военная позиция
    let militaryStance: PlayerProfile['militaryStance'] = 'defensive';
    if (stats.army < 30) militaryStance = 'pacifist';
    else if (stats.army > 80) militaryStance = 'aggressive';
    
    // Уровень инноваций
    let innovationLevel: PlayerProfile['innovationLevel'] = 'moderate';
    if (stats.science < 30) innovationLevel = 'conservative';
    else if (stats.science > 60 && stats.science < 80) innovationLevel = 'progressive';
    else if (stats.science > 80) innovationLevel = 'radical';
    
    return {
      dominantStat,
      playStyle,
      moralAlignment,
      economicApproach,
      militaryStance,
      innovationLevel
    };
  }
  
  static generateEnding(profile: PlayerProfile, stats: Record<string, number>, isVictory: boolean): EndingData {
    if (!isVictory) {
      return this.getDefeatEnding(profile, stats);
    }
    
    // Комбинируем характеристики для уникальных концовок
    const key = `${profile.playStyle}_${profile.moralAlignment}_${profile.innovationLevel}`;
    
    // Специальные концовки для уникальных комбинаций
    const specialEndings = this.getSpecialEndings();
    
    if (specialEndings[key]) {
      return specialEndings[key];
    }
    
    // Стандартные концовки по стилю игры
    return this.getStandardEnding(profile, stats);
  }
  
  private static getSpecialEndings(): Record<string, EndingData> {
    return {
      'technocrat_neutral_radical': {
        type: 'TECHNOLOGICAL_SINGULARITY',
        title: 'ТЕХНОЛОГИЧЕСКАЯ СИНГУЛЯРНОСТЬ',
        description: 'Вы создали идеальное техно-государство, где ИИ и люди существуют в гармонии. Ваша нация стала первой постчеловеческой цивилизацией.',
        flavor: 'Машины служат человечеству, а человечество эволюционирует вместе с ними.',
        icon: '🤖',
        color: '#a55eea',
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      
      'balanced_good_progressive': {
        type: 'GOLDEN_AGE',
        title: 'ЗОЛОТОЙ ВЕК',
        description: 'Под вашим мудрым правлением началась новая эра процветания. Нация достигла идеального баланса между прогрессом и традициями.',
        flavor: 'История будет помнить вас как величайшего правителя всех времён.',
        icon: '👑',
        color: '#f9ca24',
        bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      
      'extremist_evil_radical': {
        type: 'DARK_EMPIRE',
        title: 'ТЁМНАЯ ИМПЕРИЯ',
        description: 'Вы создали технократическую диктатуру, где наука служит угнетению. Ваша нация стала самой могущественной, но потеряла душу.',
        flavor: 'Великая сила требует великих жертв. Вы заплатили цену за абсолютную власть.',
        icon: '⚡',
        color: '#ff6b6b',
        bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      
      'traditionalist_good_conservative': {
        type: 'MORAL_RENAISSANCE',
        title: 'МОРАЛЬНОЕ ВОЗРОЖДЕНИЕ',
        description: 'Вы вернули нации духовные ценности и моральные принципы. Общество стало более справедливым и человечным.',
        flavor: 'Иногда движение вперёд означает возвращение к истокам.',
        icon: '⛪',
        color: '#fd79a8',
        bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      },
      
      'chaotic_neutral_progressive': {
        type: 'QUANTUM_DEMOCRACY',
        title: 'КВАНТОВАЯ ДЕМОКРАТИЯ',
        description: 'Ваш хаотичный стиль правления привёл к созданию новой формы правления, где решения принимаются квантовым суперкомпьютером.',
        flavor: 'Из хаоса рождается новый порядок.',
        icon: '🌀',
        color: '#4ecdc4',
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    };
  }
  
  private static getStandardEnding(profile: PlayerProfile, stats: Record<string, number>): EndingData {
    switch (profile.playStyle) {
      case 'balanced':
        return {
          type: 'STABLE_DEMOCRACY',
          title: 'СТАБИЛЬНАЯ ДЕМОКРАТИЯ',
          description: 'Ваше сбалансированное правление создало устойчивое демократическое государство.',
          flavor: 'Мудрость в балансе - залог долгой жизни нации.',
          icon: '⚖️',
          color: '#45b7d1',
          bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
        
      case 'extremist':
        return {
          type: 'RADICAL_TRANSFORMATION',
          title: 'РАДИКАЛЬНАЯ ТРАНСФОРМАЦИЯ',
          description: 'Ваши крайние решения полностью изменили облик государства.',
          flavor: 'Великие перемены требуют решительных действий.',
          icon: '💥',
          color: '#ff6b6b',
          bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        };
        
      case 'technocrat':
        return {
          type: 'SCIENTIFIC_UTOPIA',
          title: 'НАУЧНАЯ УТОПИЯ',
          description: 'Наука и технологии превратили вашу нацию в футуристическую утопию.',
          flavor: 'Знание - это сила, и вы использовали её мудро.',
          icon: '🔬',
          color: '#a55eea',
          bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
        
      default:
        return {
          type: 'MIXED_LEGACY',
          title: 'СМЕШАННОЕ НАСЛЕДИЕ',
          description: 'Ваше правление оставило сложное, но значимое наследие.',
          flavor: 'История рассудит ваши деяния.',
          icon: '📜',
          color: '#ffffff',
          bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
    }
  }
  
  private static getDefeatEnding(profile: PlayerProfile, stats: Record<string, number>): EndingData {
    // Определяем причину поражения
    const lowestStat = Object.entries(stats).reduce((a, b) => stats[a[0]] < stats[b[0]] ? a : b);
    const [statName, value] = lowestStat;
    
    const defeatReasons: Record<string, EndingData> = {
      army: {
        type: 'MILITARY_COLLAPSE',
        title: 'ВОЕННЫЙ КОЛЛАПС',
        description: 'Ослабленная армия не смогла защитить государство от внешних угроз.',
        flavor: 'Мир - это хорошо, но не тогда, когда враги у ворот.',
        icon: '⚔️',
        color: '#ff6b6b',
        bgGradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
      },
      
      ecology: {
        type: 'ECOLOGICAL_DISASTER',
        title: 'ЭКОЛОГИЧЕСКАЯ КАТАСТРОФА',
        description: 'Планета больше не может поддерживать жизнь из-за экологических разрушений.',
        flavor: 'Прогресс без заботы о природе - путь к самоуничтожению.',
        icon: '💀',
        color: '#4ecdc4',
        bgGradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
      },
      
      economy: {
        type: 'ECONOMIC_COLLAPSE',
        title: 'ЭКОНОМИЧЕСКИЙ КРАХ',
        description: 'Экономика рухнула, оставив нацию в нищете и хаосе.',
        flavor: 'Деньги не всё, но без них - ничто.',
        icon: '💸',
        color: '#00b894',
        bgGradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
      },
      
      morality: {
        type: 'MORAL_DECAY',
        title: 'МОРАЛЬНОЕ РАЗЛОЖЕНИЕ',
        description: 'Общество разрушилось изнутри из-за полной потери моральных ценностей.',
        flavor: 'Нация без морали - это не нация, а толпа.',
        icon: '💔',
        color: '#fd79a8',
        bgGradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
      }
    };
    
    return defeatReasons[statName] || {
      type: 'GENERAL_COLLAPSE',
      title: 'ВСЕОБЩИЙ КОЛЛАПС',
      description: 'Государство рухнуло под грузом накопившихся проблем.',
      flavor: 'Иногда даже лучшие намерения приводят к худшим результатам.',
      icon: '💀',
      color: '#ffffff',
      bgGradient: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
    };
  }
}