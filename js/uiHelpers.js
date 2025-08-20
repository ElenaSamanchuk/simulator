// Вспомогательные функции для UI
class UIHelpers {
    static getStatColors(statKey) {
        const colors = {
            military: {
                primary: 'rgb(239 68 68)',
                light: 'rgb(248 113 113)',
                bg: 'rgb(239 68 68 / 0.1)',
                border: 'rgb(239 68 68 / 0.2)',
                gradient: 'rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15), rgba(185, 28, 28, 0.2)'
            },
            society: {
                primary: 'rgb(236 72 153)',
                light: 'rgb(244 114 182)',
                bg: 'rgb(236 72 153 / 0.1)',
                border: 'rgb(236 72 153 / 0.2)',
                gradient: 'rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.15), rgba(190, 24, 93, 0.2)'
            },
            ecology: {
                primary: 'rgb(34 197 94)',
                light: 'rgb(74 222 128)',
                bg: 'rgb(34 197 94 / 0.1)',
                border: 'rgb(34 197 94 / 0.2)',
                gradient: 'rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.15), rgba(21, 128, 61, 0.2)'
            },
            economy: {
                primary: 'rgb(245 158 11)',
                light: 'rgb(251 191 36)',
                bg: 'rgb(245 158 11 / 0.1)',
                border: 'rgb(245 158 11 / 0.2)',
                gradient: 'rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.15), rgba(180, 83, 9, 0.2)'
            },
            science: {
                primary: 'rgb(168 85 247)',
                light: 'rgb(196 181 253)',
                bg: 'rgb(168 85 247 / 0.1)',
                border: 'rgb(168 85 247 / 0.2)',
                gradient: 'rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.15), rgba(124, 58, 237, 0.2)'
            },
            diplomacy: {
                primary: 'rgb(6 182 212)',
                light: 'rgb(34 211 238)',
                bg: 'rgb(6 182 212 / 0.1)',
                border: 'rgb(6 182 212 / 0.2)',
                gradient: 'rgba(6, 182, 212, 0.2), rgba(14, 165, 233, 0.15), rgba(8, 145, 178, 0.2)'
            }
        };
        return colors[statKey] || colors.military;
    }

    static getStatIcon(statKey) {
        const icons = {
            military: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L15.5 8.5L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L8.5 8.5L12 2Z" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="1"/></svg>`,
            society: `<svg viewBox="0 0 24 24" fill="none"><path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4Z" fill="currentColor" opacity="0.8"/><path d="M8 6C9.66 6 11 7.34 11 9C11 10.66 9.66 12 8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6Z" fill="currentColor" opacity="0.6"/><path d="M8 13C5.24 13 3 15.24 3 18V21H13V18C13 15.24 10.76 13 8 13Z" fill="currentColor"/><path d="M16 13C13.24 13 11 15.24 11 18V21H21V18C21 15.24 18.76 13 16 13Z" fill="currentColor" opacity="0.7"/><path d="M12 6L14 8L12 10L10 8Z" fill="currentColor"/></svg>`,
            ecology: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z" stroke="currentColor" stroke-width="1.5"/><path d="M8 12C8 8.69 10.69 6 14 6C14.34 6 14.67 6.04 15 6.11C13.78 4.88 12.11 4.27 10.39 4.41C8.67 4.55 7.13 5.42 6.13 6.8C5.13 8.18 4.77 9.93 5.13 11.6C5.49 13.27 6.53 14.71 8 15.58V12Z" fill="currentColor"/><path d="M16 12C16 15.31 13.31 18 10 18C9.66 18 9.33 17.96 9 17.89C10.22 19.12 11.89 19.73 13.61 19.59C15.33 19.45 16.87 18.58 17.87 17.2C18.87 15.82 19.23 14.07 18.87 12.4C18.51 10.73 17.47 9.29 16 8.42V12Z" fill="currentColor"/></svg>`,
            economy: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2V22M17 5H9.5C8.57 5 7.78 5.79 7.78 6.72C7.78 7.65 8.57 8.44 9.5 8.44H14.5C15.43 8.44 16.22 9.23 16.22 10.16C16.22 11.09 15.43 11.88 14.5 11.88H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 21H21M3 10H21M12 3L20 7L12 11L4 7L12 3Z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
            science: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 3H15V8L20 18H4L9 8V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="15" r="2" fill="currentColor"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/><path d="M9 3H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 2L20 4L18 6M6 2L4 4L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="6" r="1" fill="currentColor"/></svg>`,
            diplomacy: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 12L16 12M12 8L12 16" stroke="currentColor" stroke-width="1.5"/><path d="M8 8L16 16M16 8L8 16" stroke="currentColor" stroke-width="0.5" opacity="0.5"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/><path d="M12 3V5M12 19V21M21 12H19M5 12H3" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`
        };
        return icons[statKey] || icons.military;
    }

    static getAdvisorEmoji(advisor) {
        const emojis = {
            military: '⚔️',
            society: '👥',
            ecology: '🌱',
            economy: '💰',
            science: '🚀',
            diplomacy: '🤝'
        };
        return emojis[advisor] || '📋';
    }

    static getUrgencyData(urgency) {
        const data = {
            low: {
                icon: '📝',
                text: 'НИЗКАЯ',
                colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
            },
            medium: {
                icon: '⚡',
                text: 'СРЕДНЯЯ',
                colorClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
            },
            high: {
                icon: '🔥',
                text: 'ВЫСОКАЯ',
                colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
            },
            critical: {
                icon: '🚨',
                text: 'КРИТИЧЕСКАЯ',
                colorClass: 'text-red-400 bg-red-500/10 border-red-500/30'
            }
        };
        return data[urgency] || data.medium;
    }

    static getEffectIcon(description) {
        if (description.includes('восстановление')) return '🔧';
        if (description.includes('кризис')) return '⚠️';
        if (description.includes('бонус')) return '⬆️';
        if (description.includes('штраф')) return '⬇️';
        if (description.includes('военн')) return '⚔️';
        if (description.includes('эконом')) return '💰';
        if (description.includes('наук')) return '🔬';
        if (description.includes('эколог')) return '🌱';
        if (description.includes('общество')) return '👥';
        if (description.includes('дипломат')) return '🤝';
        return '🔄';
    }

    static formatEffects(effects) {
        return Object.entries(effects)
            .map(([stat, value]) => `${STAT_LABELS[stat]}: ${value > 0 ? '+' : ''}${value}`)
            .join(', ');
    }

    static createStatItem(statKey, value, label) {
        const colors = UIHelpers.getStatColors(statKey);
        const item = document.createElement('div');
        item.className = `bg-gradient-to-br border border-opacity-30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-all duration-300`;
        item.style.background = `linear-gradient(135deg, ${colors.gradient})`;
        item.style.borderColor = colors.border;

        const getValueColor = (val) => {
            if (val <= 15) return 'text-red-400';
            if (val <= 30) return 'text-orange-400';
            if (val >= 85) return 'text-red-400';
            if (val >= 70) return colors.light;
            return 'text-foreground';
        };

        const getBarIntensity = (val) => {
            if (val <= 20 || val >= 80) return 'animate-pulse';
            return '';
        };

        item.innerHTML = `
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(circle at center, ${colors.bg}, transparent 70%)"></div>
            <div class="relative z-10">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6" style="color: ${colors.primary}">
                            ${UIHelpers.getStatIcon(statKey)}
                        </div>
                        <span class="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                            ${label}
                        </span>
                    </div>
                    <div class="text-lg font-mono font-bold ${getValueColor(value)} transition-colors duration-300">
                        ${value}%
                    </div>
                </div>
                <div class="relative h-3 bg-background/50 rounded-full overflow-hidden border border-border/30">
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    <div class="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${getBarIntensity(value)}" 
                         style="width: ${Math.max(0, Math.min(100, value))}%; background: linear-gradient(90deg, ${colors.primary}, ${colors.light})"></div>
                    <div class="absolute inset-y-0 left-0 rounded-full opacity-50 blur-sm transition-all duration-700 ease-out" 
                         style="width: ${Math.max(0, Math.min(100, value))}%; background: ${colors.primary}"></div>
                </div>
                ${(value <= 20 || value >= 80) ? `
                <div class="flex items-center gap-1 mt-2">
                    <div class="w-2 h-2 rounded-full ${value <= 20 ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse"></div>
                    <span class="text-xs font-mono text-muted-foreground">
                        ${value <= 20 ? 'КРИТИЧЕСКИ НИЗКО' : 'КРИТИЧЕСКИ ВЫСОКО'}
                    </span>
                </div>` : ''}
            </div>
        `;

        return item;
    }

    static addEffectIndicators(container, effects) {
        const effectEntries = Object.entries(effects).filter(([_, value]) => value !== 0);
        
        if (effectEntries.length === 0) {
            const noEffects = document.createElement('div');
            noEffects.className = 'flex items-center px-1.5 py-0.5 rounded-md bg-black/20 text-white/70';
            noEffects.innerHTML = '<span class="text-xs font-mono">Нет эффектов</span>';
            container.appendChild(noEffects);
            return;
        }

        effectEntries.slice(0, 4).forEach(([stat, value]) => {
            const indicator = document.createElement('div');
            indicator.className = `flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/20 ${value > 0 ? 'text-green-300' : 'text-red-300'}`;
            indicator.title = `${STAT_LABELS[stat]}: ${value > 0 ? '+' : ''}${value}`;
            
            const icon = document.createElement('div');
            icon.className = 'w-3 h-3 flex-shrink-0';
            icon.innerHTML = UIHelpers.getStatIcon(stat);
            
            const arrow = document.createElement('span');
            arrow.className = 'text-xs font-mono font-bold';
            arrow.textContent = value > 0 ? '↗' : '↘';
            
            const amount = document.createElement('span');
            amount.className = 'text-xs font-mono font-bold';
            amount.textContent = Math.abs(value);
            
            indicator.appendChild(icon);
            indicator.appendChild(arrow);
            indicator.appendChild(amount);
            container.appendChild(indicator);
        });

        if (effectEntries.length > 4) {
            const moreIndicator = document.createElement('div');
            moreIndicator.className = 'flex items-center px-1.5 py-0.5 rounded-md bg-black/20 text-white/70';
            moreIndicator.innerHTML = `<span class="text-xs font-mono">+${effectEntries.length - 4}</span>`;
            container.appendChild(moreIndicator);
        }
    }

    static createEffectBadge(effect) {
        const hasPositiveEffects = Object.values(effect.effects).some(val => val > 0);
        const hasNegativeEffects = Object.values(effect.effects).some(val => val < 0);
        
        let type = 'neutral';
        if (hasPositiveEffects && !hasNegativeEffects) {
            type = 'positive';
        } else if (hasNegativeEffects && !hasPositiveEffects) {
            type = 'negative';
        }
        
        const icon = UIHelpers.getEffectIcon(effect.description);
        
        const badge = document.createElement('div');
        badge.className = `p-2 bg-secondary border border-border rounded-md text-xs flex items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:shadow-sm ${type === 'positive' ? 'border-green-500/30 bg-green-500/5' : type === 'negative' ? 'border-red-500/30 bg-red-500/5' : ''}`;
        
        badge.innerHTML = `
            <div class="text-sm flex-shrink-0">${icon}</div>
            <div class="flex-1 min-w-0">
                <div class="font-mono font-bold text-foreground text-xs uppercase tracking-wide truncate">${effect.description}</div>
                <div class="text-muted-foreground text-xs mt-1">Действует ${effect.duration} ходов</div>
                <div class="text-xs mt-1 truncate">Эффекты: ${UIHelpers.formatEffects(effect.effects)}</div>
            </div>
        `;
        
        return badge;
    }

    static createAchievementBadge(achievement) {
        const badge = document.createElement('div');
        badge.className = 'p-2 bg-secondary border border-amber-500/30 bg-amber-500/5 rounded-md text-xs flex items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:shadow-sm';
        
        badge.innerHTML = `
            <div class="text-sm flex-shrink-0">${achievement.icon}</div>
            <div class="flex-1 min-w-0">
                <div class="font-mono font-bold text-foreground text-xs uppercase tracking-wide truncate">${achievement.name}</div>
                <div class="text-muted-foreground text-xs mt-1 line-clamp-2">${achievement.description}</div>
            </div>
        `;
        
        return badge;
    }

    static createAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-2xl mb-3 min-w-80 backdrop-blur-sm border border-yellow-500/30';
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-2xl">${achievement.icon}</div>
                <div class="flex-1">
                    <h4 class="font-mono font-bold text-sm uppercase tracking-wide">${achievement.name}</h4>
                    <p class="text-xs opacity-90">${achievement.description}</p>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 h-1 bg-white/30 w-full achievement-progress-bar"></div>
        `;
        
        return notification;
    }

    static updateElement(element, text) {
        if (element && typeof text !== 'undefined') {
            element.textContent = text;
        }
    }
}

// Экспорт
window.UIHelpers = UIHelpers;