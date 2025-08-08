// UI Components and Management
class GameUI {
    constructor() {
        this.mobileStatsVisible = false;
        this.endDialogOpen = false;
    }
    
    updateHeader(gameState) {
        // Update progress info
        document.getElementById('current-term').textContent = gameState.currentTerm;
        document.getElementById('max-terms').textContent = GAME_CONFIG.maxTerms;
        document.getElementById('current-decision').textContent = gameState.currentDecisionIndex + 1;
        document.getElementById('total-decisions').textContent = GAME_CONFIG.maxTerms * GAME_CONFIG.decisionsPerTerm;
        
        // Update difficulty
        const difficultyNames = ['Стабильность', 'Стабильность', 'Напряжение', 'Напряжение', 'Кризис', 'Кризис', 'Хаос', 'Хаос'];
        const difficultyName = difficultyNames[gameState.difficulty - 1] || 'Хаос';
        document.getElementById('difficulty-name').textContent = difficultyName;
        
        // Update progress bars
        const termProgress = ((gameState.currentDecisionIndex % GAME_CONFIG.decisionsPerTerm) / GAME_CONFIG.decisionsPerTerm) * 100;
        const overallProgress = (gameState.currentDecisionIndex / (GAME_CONFIG.maxTerms * GAME_CONFIG.decisionsPerTerm)) * 100;
        
        document.getElementById('term-progress').style.width = `${termProgress}%`;
        document.getElementById('overall-progress').style.width = `${overallProgress}%`;
    }
    
    updateStats(gameState) {
        // Desktop stats
        this.updateDesktopStats(gameState);
        
        // Mobile stats (if visible)
        if (this.mobileStatsVisible) {
            this.updateMobileStats(gameState);
        }
        
        // Update corruption and popularity
        this.updateMetrics(gameState);
    }
    
    updateDesktopStats(gameState) {
        const container = document.getElementById('desktop-stats-grid');
        container.innerHTML = '';
        
        const statLabels = {
            military: 'Армия',
            society: 'Народ',
            ecology: 'Природа',
            economy: 'Бизнес',
            science: 'Наука',
            diplomacy: 'Мир'
        };
        
        const statColors = {
            military: 'red',
            society: 'pink',
            ecology: 'green',
            economy: 'amber',
            science: 'purple',
            diplomacy: 'cyan'
        };
        
        Object.entries(gameState.stats).forEach(([key, value]) => {
            const color = statColors[key];
            const label = statLabels[key];
            
            const statElement = document.createElement('div');
            statElement.className = `text-center p-3 border rounded-lg border-${color}-500/30 bg-${color}-500/10 text-${color}-400 transition-colors`;
            statElement.innerHTML = `
                <div class="text-xs font-mono font-bold mb-1">${label}</div>
                <div class="text-lg font-bold">${value}%</div>
            `;
            
            container.appendChild(statElement);
        });
        
        // Update overall balance
        this.updateOverallBalance(gameState, 'desktop-overall-balance');
    }
    
    updateMobileStats(gameState) {
        const container = document.getElementById('mobile-stats-grid');
        container.innerHTML = '';
        
        const statLabels = {
            military: 'Армия',
            society: 'Народ',
            ecology: 'Природа',
            economy: 'Бизнес',
            science: 'Наука',
            diplomacy: 'Мир'
        };
        
        const statColors = {
            military: 'red',
            society: 'pink',
            ecology: 'green',
            economy: 'amber',
            science: 'purple',
            diplomacy: 'cyan'
        };
        
        Object.entries(gameState.stats).forEach(([key, value]) => {
            const color = statColors[key];
            const label = statLabels[key];
            
            const statElement = document.createElement('div');
            statElement.className = `text-center p-3 border rounded-lg border-${color}-500/30 bg-${color}-500/10 text-${color}-400 transition-colors`;
            statElement.innerHTML = `
                <div class="text-xs font-mono font-bold mb-1">${label}</div>
                <div class="text-lg font-bold">${value}%</div>
            `;
            
            container.appendChild(statElement);
        });
        
        // Update overall balance
        this.updateOverallBalance(gameState, 'mobile-overall-balance');
        
        // Update game stats
        document.getElementById('mobile-decisions-count').textContent = gameState.gameStats.totalDecisions;
        document.getElementById('mobile-events-count').textContent = gameState.gameStats.randomEventsTriggered;
    }
    
    updateOverallBalance(gameState, containerId) {
        const container = document.getElementById(containerId);
        const balance = this.calculateBalance(gameState.stats);
        
        let balanceText, balanceColor, balanceIcon;
        
        if (balance >= 80) {
            balanceText = 'ОТЛИЧНАЯ СТАБИЛЬНОСТЬ';
            balanceColor = 'text-green-400';
            balanceIcon = '🟢';
        } else if (balance >= 60) {
            balanceText = 'ХОРОШАЯ СТАБИЛЬНОСТЬ';
            balanceColor = 'text-green-400';
            balanceIcon = '🟢';
        } else if (balance >= 40) {
            balanceText = 'УМЕРЕННАЯ СТАБИЛЬНОСТЬ';
            balanceColor = 'text-yellow-400';
            balanceIcon = '🟡';
        } else if (balance >= 20) {
            balanceText = 'НЕСТАБИЛЬНОСТЬ';
            balanceColor = 'text-red-400';
            balanceIcon = '🟠';
        } else {
            balanceText = 'КРИТИЧЕСКОЕ СОСТОЯНИЕ';
            balanceColor = 'text-red-400';
            balanceIcon = '🔴';
        }
        
        container.innerHTML = `
            <div class="flex items-center gap-3 pb-3 border-b border-border/30">
                <div class="w-5 h-5 text-primary">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.09 8.26L19 7L14.64 12.5L21 14L12 18L3 14L9.36 12.5L5 7L10.91 8.26L12 2Z" 
                              stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </div>
                <div>
                    <h2 class="font-bold text-foreground font-mono text-sm">ОБЩИЙ БАЛАНС</h2>
                    <span class="text-muted-foreground text-xs">государства</span>
                </div>
            </div>
            <div class="text-center p-4 bg-secondary/20 rounded-lg border border-border/20">
                <div class="text-2xl mb-2">${balanceIcon}</div>
                <div class="${balanceColor} font-mono font-bold text-sm mb-1">${balanceText}</div>
                <div class="text-muted-foreground text-xs">${balance}/100 пунктов</div>
            </div>
        `;
    }
    
    updateMetrics(gameState) {
        // Mobile metrics
        const mobileCorruption = document.getElementById('mobile-corruption');
        const mobilePopularity = document.getElementById('mobile-popularity');
        
        if (mobileCorruption) {
            mobileCorruption.textContent = `${gameState.metrics.corruption}%`;
            mobileCorruption.className = `font-bold text-base ${this.getCorruptionColor(gameState.metrics.corruption)}`;
        }
        
        if (mobilePopularity) {
            mobilePopularity.textContent = `${gameState.metrics.satisfaction}%`;
            mobilePopularity.className = `font-bold text-base ${this.getSatisfactionColor(gameState.metrics.satisfaction)}`;
        }
        
        // Desktop metrics
        const desktopCorruption = document.getElementById('desktop-corruption');
        const desktopPopularity = document.getElementById('desktop-popularity');
        
        if (desktopCorruption) {
            desktopCorruption.textContent = `${gameState.metrics.corruption}%`;
            desktopCorruption.className = `font-semibold font-mono text-xs ${this.getCorruptionColor(gameState.metrics.corruption)}`;
        }
        
        if (desktopPopularity) {
            desktopPopularity.textContent = `${gameState.metrics.satisfaction}%`;
            desktopPopularity.className = `font-semibold font-mono text-xs ${this.getSatisfactionColor(gameState.metrics.satisfaction)}`;
        }
        
        // Update decisions and events count
        document.getElementById('desktop-decisions-count').textContent = gameState.gameStats.totalDecisions;
        document.getElementById('desktop-events-count').textContent = gameState.gameStats.randomEventsTriggered;
    }
    
    getCorruptionColor(corruption) {
        if (corruption > 70) return 'text-red-400';
        if (corruption > 40) return 'text-yellow-400';
        return 'text-green-400';
    }
    
    getSatisfactionColor(satisfaction) {
        if (satisfaction > 70) return 'text-green-400';
        if (satisfaction > 40) return 'text-yellow-400';
        return 'text-red-400';
    }
    
    calculateBalance(stats) {
        const values = Object.values(stats);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
        const stability = Math.max(0, 100 - variance);
        return Math.round(stability);
    }
    
    updateCard(gameState) {
        const decision = gameState.getCurrentDecision();
        
        document.getElementById('decision-title').textContent = decision.title;
        document.getElementById('decision-description').textContent = decision.description;
        document.getElementById('left-choice-text').textContent = decision.leftChoice.text;
        document.getElementById('right-choice-text').textContent = decision.rightChoice.text;
        
        // Update choice effects
        this.updateChoiceEffects('left-choice-effects', decision.leftChoice.effects);
        this.updateChoiceEffects('right-choice-effects', decision.rightChoice.effects);
    }
    
    updateCountries(countries) {
        // Update countries display in right panel if needed
        // This can be expanded based on UI requirements
        console.log('Top countries by reputation:', countries);
    }
    
    updateChoiceEffects(containerId, effects) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        const statLabels = {
            military: 'Армия',
            society: 'Народ',
            ecology: 'Природа',
            economy: 'Бизнес',
            science: 'Наука',
            diplomacy: 'Мир'
        };
        
        const statIcons = {
            military: '⚔️',
            society: '👥',
            ecology: '🌱',
            economy: '💰',
            science: '🔬',
            diplomacy: '🤝'
        };
        
        Object.entries(effects).forEach(([stat, value]) => {
            if (value !== 0) {
                const isPositive = value > 0;
                const icon = statIcons[stat] || '📊';
                const color = isPositive ? 'text-green-400' : 'text-red-400';
                const sign = isPositive ? '+' : '';
                
                const effectElement = document.createElement('div');
                effectElement.className = `flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/20 border border-border/10 ${color} text-xs font-mono`;
                effectElement.innerHTML = `
                    <span>${icon}</span>
                    <span class="font-bold">${sign}${value}</span>
                `;
                effectElement.title = `${statLabels[stat]}: ${sign}${value}`;
                
                container.appendChild(effectElement);
            }
        });
    }
    
    updateAdvisor(gameState) {
        const decision = gameState.getCurrentDecision();
        const advisor = ADVISOR_BACKSTORIES[decision.advisor];
        
        if (advisor) {
            document.getElementById('advisor-name').textContent = advisor.name;
            document.getElementById('advisor-phrase').textContent = `"${advisor.catchPhrase}"`;
            
            // Update avatar with advisor emoji
            const avatar = document.getElementById('advisor-avatar');
            avatar.textContent = advisor.avatar || '👤';
            avatar.className = `w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-${advisor.color || 'primary'}/20 to-accent/20 border-2 border-${advisor.color || 'primary'}/30 flex items-center justify-center text-xl lg:text-2xl font-bold backdrop-blur-sm`;
        }
    }
    
    updateStreak(streakCount) {
        const streakIndicator = document.getElementById('streak-indicator');
        const streakCountElement = document.getElementById('streak-count');
        
        if (streakCount >= 3) {
            streakIndicator.classList.remove('hidden');
            streakCountElement.textContent = streakCount;
        } else {
            streakIndicator.classList.add('hidden');
        }
    }
    
    updateEffects(gameState, recentAchievements) {
        // Update active effects for desktop
        this.updateEffectsContainer('desktop-effects-container', 'desktop-effects-section', gameState, recentAchievements, false);
        
        // Update active effects for mobile
        this.updateEffectsContainer('mobile-effects-container', 'mobile-effects-section', gameState, recentAchievements, true);
    }
    
    updateEffectsContainer(containerId, sectionId, gameState, recentAchievements, isMobile) {
        const container = document.getElementById(containerId);
        const section = document.getElementById(sectionId);
        
        if (!container || !section) return;
        
        const hasEffects = gameState.temporaryEffects.length > 0 || recentAchievements.length > 0;
        
        if (hasEffects) {
            section.classList.remove('hidden');
            container.innerHTML = '';
            
            // Add temporary effects
            gameState.temporaryEffects.forEach(effect => {
                const effectElement = this.createEffectBadge(effect, 'effect', isMobile);
                container.appendChild(effectElement);
            });
            
            // Add recent achievements
            recentAchievements.forEach(achievement => {
                const effectElement = this.createEffectBadge(achievement, 'achievement', isMobile);
                container.appendChild(effectElement);
            });
        } else {
            section.classList.add('hidden');
        }
    }
    
    createEffectBadge(item, type, isMobile) {
        const element = document.createElement('div');
        
        let bgClass, borderClass, textClass, icon, title, description;
        
        if (type === 'achievement') {
            bgClass = 'bg-yellow-500/20';
            borderClass = 'border-yellow-500/30';
            textClass = 'text-yellow-400';
            icon = item.icon || '🏆';
            title = item.name;
            description = item.description;
        } else {
            const hasPositive = Object.values(item.effects).some(val => val > 0);
            const hasNegative = Object.values(item.effects).some(val => val < 0);
            
            if (hasPositive && !hasNegative) {
                bgClass = 'bg-green-500/20';
                borderClass = 'border-green-500/30';
                textClass = 'text-green-400';
            } else if (hasNegative && !hasPositive) {
                bgClass = 'bg-red-500/20';
                borderClass = 'border-red-500/30';
                textClass = 'text-red-400';
            } else {
                bgClass = 'bg-blue-500/20';
                borderClass = 'border-blue-500/30';
                textClass = 'text-blue-400';
            }
            
            icon = this.getEffectIcon(item.description);
            title = item.description;
            description = `Действует ${item.duration} ходов`;
        }
        
        if (isMobile) {
            element.className = `flex items-center gap-2 p-2 rounded-lg ${bgClass} border ${borderClass} ${textClass} text-xs`;
            element.innerHTML = `
                <span class="text-lg">${icon}</span>
                <div class="flex-1 min-w-0">
                    <div class="font-bold truncate">${title}</div>
                    <div class="text-xs opacity-80 truncate">${description}</div>
                </div>
            `;
        } else {
            element.className = `inline-flex items-center gap-1 px-2 py-1 rounded-lg ${bgClass} border ${borderClass} ${textClass} text-xs font-mono cursor-help`;
            element.innerHTML = `<span>${icon}</span>`;
            element.title = `${title}\n${description}`;
        }
        
        return element;
    }
    
    getEffectIcon(description) {
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
    
    toggleMobileStats() {
        this.mobileStatsVisible = !this.mobileStatsVisible;
        const panel = document.getElementById('mobile-stats-panel');
        const arrow = document.getElementById('mobile-stats-arrow');
        
        if (this.mobileStatsVisible) {
            panel.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
            // Update mobile stats when shown
            if (window.game) {
                this.updateMobileStats(window.game.gameState);
            }
        } else {
            panel.classList.add('hidden');
            arrow.style.transform = '';
        }
    }
    
    showRandomEvent(eventText) {
        const notification = document.getElementById('random-event-notification');
        const textElement = document.getElementById('event-text');
        
        textElement.textContent = eventText;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 2000);
    }
    
    showEndDialog(gameState) {
        this.endDialogOpen = true;
        const dialog = document.getElementById('game-end-dialog');
        const icon = document.getElementById('end-dialog-icon');
        const title = document.getElementById('end-dialog-title');
        const subtitle = document.getElementById('end-dialog-subtitle');
        const statsContainer = document.getElementById('end-dialog-stats');
        
        if (gameState.gameWon) {
            icon.textContent = '🏆';
            title.textContent = 'ПОБЕДА!';
            subtitle.textContent = 'Вы успешно управляли государством 5 сроков';
        } else {
            icon.textContent = '💀';
            title.textContent = 'ПОРАЖЕНИЕ';
            subtitle.textContent = 'Ваше правление завершилось досрочно';
        }
        
        // Show final stats
        statsContainer.innerHTML = '';
        
        const finalStats = [
            { label: 'Решений принято', value: gameState.gameStats.totalDecisions },
            { label: 'Случайных событий', value: gameState.gameStats.randomEventsTriggered },
            { label: 'Завершенных сроков', value: gameState.currentTerm - 1 },
            { label: 'Итоговая коррупция', value: `${gameState.metrics.corruption}%` },
            { label: 'Итоговая популярность', value: `${gameState.metrics.satisfaction}%` }
        ];
        
        finalStats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'flex justify-between items-center p-2 bg-secondary/20 rounded border border-border/10';
            statElement.innerHTML = `
                <span class="text-muted-foreground text-sm">${stat.label}:</span>
                <span class="font-bold text-primary">${stat.value}</span>
            `;
            statsContainer.appendChild(statElement);
        });
        
        dialog.classList.remove('hidden');
    }
    
    hideEndDialog() {
        this.endDialogOpen = false;
        document.getElementById('game-end-dialog').classList.add('hidden');
    }
    
    isEndDialogOpen() {
        return this.endDialogOpen;
    }
    
    updateThemeIcon(isDark) {
        const icon = document.getElementById('theme-icon');
        if (isDark) {
            icon.setAttribute('d', 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z');
        } else {
            icon.setAttribute('d', 'M12 1v2M18.36 6.64l1.42-1.42M23 12h-2M18.36 17.36l1.42 1.42M12 21v2M4.22 19.78l1.42-1.42M2 12h2M4.22 4.22l1.42 1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z');
        }
    }
    
    updateSoundIcon(enabled) {
        const icon = document.getElementById('sound-icon');
        if (enabled) {
            icon.setAttribute('d', 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416c.363 0 .706.141.963.397l3.384 3.383A.705.705 0 0 0 11 19.298V4.702ZM16 9a5 5 0 0 1 0 6m2-8a9 9 0 0 1 0 10');
        } else {
            icon.setAttribute('d', 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416c.363 0 .706.141.963.397l3.384 3.383A.705.705 0 0 0 11 19.298V4.702Zm6.293 2.195a1 1 0 0 1 1.414 1.414L17.414 9.604a1 1 0 1 1-1.414-1.414l1.293-1.293Zm0 6.896a1 1 0 0 1-1.414 1.414L14.586 13.914a1 1 0 1 1 1.414-1.414l1.293 1.293Z');
        }
    }
}

// Achievement System
class AchievementSystem {
    constructor() {
        this.achievements = [];
        this.processedIds = new Set();
    }
    
    checkAchievements(gameState, soundEnabled) {
        const newAchievements = [];
        
        // Define achievements
        const achievementChecks = [
            {
                id: 'first_decision',
                condition: gameState.gameStats.totalDecisions === 1,
                achievement: {
                    id: 'first_decision',
                    name: 'ПЕРВЫЙ ШАГ',
                    description: 'Примите своё первое решение как правитель.',
                    icon: '👑',
                    rarity: 'common',
                    unlocked: true,
                    unlockedAt: new Date()
                }
            },
            {
                id: 'balanced_ruler',
                condition: gameState.currentTerm >= 2 && Object.values(gameState.stats).every(v => v >= 30 && v <= 70),
                achievement: {
                    id: 'balanced_ruler',
                    name: 'МАСТЕР БАЛАНСА',
                    description: 'Сохраняйте все показатели между 30-70% в течение целого срока.',
                    icon: '⚖️',
                    rarity: 'epic',
                    unlocked: true,
                    unlockedAt: new Date()
                }
            },
            {
                id: 'crisis_manager',
                condition: gameState.gameStats.randomEventsTriggered >= 3,
                achievement: {
                    id: 'crisis_manager',
                    name: 'КРИЗИС-МЕНЕДЖЕР',
                    description: 'Переживите 3+ случайных события.',
                    icon: '⚡',
                    rarity: 'epic',
                    unlocked: true,
                    unlockedAt: new Date()
                }
            },
            {
                id: 'diplomat',
                condition: gameState.stats.diplomacy >= 80,
                achievement: {
                    id: 'diplomat',
                    name: 'ВЕЛИКИЙ ДИПЛОМАТ',
                    description: 'Достигните 80+ пунктов дипломатии.',
                    icon: '🕊️',
                    rarity: 'rare',
                    unlocked: true,
                    unlockedAt: new Date()
                }
            },
            {
                id: 'technocrat',
                condition: gameState.stats.science >= 85,
                achievement: {
                    id: 'technocrat',
                    name: 'ПОКОРИТЕЛЬ КОСМОСА',
                    description: 'Достигните 85+ пунктов науки.',
                    icon: '🚀',
                    rarity: 'rare',
                    unlocked: true,
                    unlockedAt: new Date()
                }
            },
            {
                id: 'clean_hands',
                condition: gameState.metrics.corruption <= 15 && gameState.currentTerm >= 3,
                achievement: {
                    id: 'clean_hands',
                    name: 'ЧИСТЫЕ РУКИ',
                    description: 'Держите коррупцию ниже 15% в течение 3 сроков.',
                    icon: '✨',
                    rarity: 'epic',
                    unlocked: true,
                    unlockedAt: new Date()
                }
            },
            {
                id: 'victory',
                condition: gameState.gameWon,
                achievement: {
                    id: 'victory',
                    name: 'ВЕЛИКИЙ ПРАВИТЕЛЬ',
                    description: 'Успешно завершите все 5 сроков правления.',
                    icon: '🏆',
                    rarity: 'legendary',
                    unlocked: true,
                    unlockedAt: new Date()
                }
            }
        ];
        
        achievementChecks.forEach(({ id, condition, achievement }) => {
            if (condition && !this.processedIds.has(id)) {
                newAchievements.push(achievement);
                this.processedIds.add(id);
            }
        });
        
        if (newAchievements.length > 0) {
            this.achievements.push(...newAchievements);
            
            // Show achievement notifications
            newAchievements.forEach(achievement => {
                this.showAchievementNotification(achievement);
            });
            
            if (soundEnabled) {
                // Achievement sound would be played here
                console.log('Achievement unlocked sound');
            }
        }
    }
    
    showAchievementNotification(achievement) {
        const container = document.getElementById('achievement-notifications');
        
        const notification = document.createElement('div');
        notification.className = 'transform transition-all duration-500 ease-out pointer-events-auto animate-in slide-in-from-right-full fade-in-0 hover:scale-105';
        
        const rarityStyles = {
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
        
        const style = rarityStyles[achievement.rarity] || rarityStyles.common;
        
        notification.innerHTML = `
            <div class="${style.bg} ${style.border} ${style.glow} backdrop-blur-md border rounded-xl p-4 lg:p-5 shadow-2xl w-full lg:w-auto">
                <div class="flex items-start gap-3">
                    <div class="text-2xl lg:text-3xl flex-shrink-0 animate-bounce">
                        ${achievement.icon}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start mb-2">
                            <div class="${style.text} text-xs lg:text-xs font-mono font-bold uppercase tracking-wider leading-tight">
                                🏆 Достижение получено!
                            </div>
                            <button class="h-6 w-6 lg:h-5 lg:w-5 p-0 text-muted-foreground/60 hover:text-foreground transition-colors hover:bg-white/10 flex-shrink-0 rounded" onclick="this.closest('.transform').remove()">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="${style.text} text-xs font-mono font-semibold uppercase tracking-wide mb-2 opacity-80">
                            ${achievement.rarity}
                        </div>
                        
                        <div class="font-bold text-foreground mb-2 text-sm lg:text-base leading-tight break-words">
                            ${achievement.name}
                        </div>
                        
                        <div class="text-xs lg:text-sm text-muted-foreground leading-relaxed break-words">
                            ${achievement.description}
                        </div>
                    </div>
                </div>
                
                <div class="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full ${style.text} bg-current rounded-full animate-shrink"></div>
                </div>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    getRecentAchievements() {
        return this.achievements.slice(-5); // Return last 5 achievements
    }
    
    reset() {
        this.achievements = [];
        this.processedIds.clear();
        
        // Clear notification container
        const container = document.getElementById('achievement-notifications');
        if (container) {
            container.innerHTML = '';
        }
    }
}