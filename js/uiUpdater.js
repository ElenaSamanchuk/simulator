// Модуль для обновления пользовательского интерфейса
class UIUpdater {
    constructor(elements, engine) {
        this.elements = elements;
        this.engine = engine;
    }

    // Обновление всех элементов интерфейса
    updateAll() {
        this.updateHeader();
        this.updateStats();
        this.updateAdvisorContext();
        this.updateGameCard();
        this.updateEffects();
        this.updateAchievements();
    }

    // Обновление заголовка
    updateHeader() {
        const termProgress = ((this.engine.gameState.currentDecisionIndex % GAME_CONFIG.decisionsPerTerm) / GAME_CONFIG.decisionsPerTerm) * 100;
        const overallProgress = (this.engine.gameState.currentDecisionIndex / (GAME_CONFIG.maxTerms * GAME_CONFIG.decisionsPerTerm)) * 100;
        const difficultyName = DIFFICULTY_NAMES[this.engine.gameState.difficulty - 1] || 'Хаос';

        UIComponents.updateTextContent(this.elements.currentTerm, this.engine.gameState.currentTerm);
        UIComponents.updateTextContent(this.elements.currentDecision, this.engine.gameState.currentDecisionIndex + 1);
        UIComponents.updateTextContent(this.elements.difficultyDisplay, difficultyName);

        if (this.elements.termProgress) {
            this.elements.termProgress.style.width = `${termProgress}%`;
        }
        if (this.elements.overallProgress) {
            this.elements.overallProgress.style.width = `${overallProgress}%`;
        }
    }

    // Обновление статистики
    updateStats() {
        // Обновляем основные показатели
        if (this.elements.statsGrid) {
            this.elements.statsGrid.innerHTML = '';
            Object.entries(this.engine.gameState.stats).forEach(([key, value]) => {
                const statItem = UIComponents.createStatItem(key, value, STAT_LABELS[key]);
                this.elements.statsGrid.appendChild(statItem);
            });
        }

        // Обновляем общий баланс
        if (this.elements.overallBalance) {
            const balanceIndicator = UIComponents.createBalanceIndicator(this.engine.gameState.stats);
            this.elements.overallBalance.innerHTML = '';
            this.elements.overallBalance.appendChild(balanceIndicator);
        }

        // Обновляем метрики
        this.updateMetrics();
    }

    // Обновление метрик (коррупция, популярность)
    updateMetrics() {
        if (this.elements.corruptionValue) {
            const corruption = this.engine.gameState.metrics.corruption;
            this.elements.corruptionValue.textContent = `${corruption}%`;
            this.elements.corruptionValue.className = `metric-value ${
                corruption > 70 ? 'bad' : corruption > 40 ? 'medium' : 'good'
            }`;
        }

        if (this.elements.satisfactionValue) {
            const satisfaction = this.engine.gameState.metrics.satisfaction;
            this.elements.satisfactionValue.textContent = `${satisfaction}%`;
            this.elements.satisfactionValue.className = `metric-value ${
                satisfaction > 70 ? 'good' : satisfaction > 40 ? 'medium' : 'bad'
            }`;
        }
    }

    // Обновление контекста советника
    updateAdvisorContext() {
        const currentDecision = this.engine.getCurrentDecision();
        const advisor = ADVISOR_BACKSTORIES[currentDecision.advisor];

        if (this.elements.advisorAvatar && advisor) {
            this.elements.advisorAvatar.textContent = advisor.avatar;
        }

        UIComponents.updateTextContent(this.elements.advisorName, advisor?.name || '');
        UIComponents.updateTextContent(this.elements.advisorQuote, `"${advisor?.catchPhrase || ''}"` );
    }

    // Обновление игровой карточки
    updateGameCard() {
        const decision = this.engine.getCurrentDecision();
        const advisor = ADVISOR_BACKSTORIES[decision.advisor];

        // Обновляем аватар советника в карточке
        if (this.elements.cardAdvisorAvatar && advisor) {
            this.elements.cardAdvisorAvatar.textContent = advisor.avatar;
        }

        // Обновляем информацию о советнике
        UIComponents.updateTextContent(this.elements.cardAdvisorName, advisor?.name || '');
        
        // Обновляем заголовок решения
        UIComponents.updateTextContent(this.elements.cardTitle, decision.title);
        
        // Обновляем описание
        UIComponents.updateTextContent(this.elements.cardDescription, decision.description);

        // Обновляем последствия
        if (this.elements.cardConsequences && decision.consequences) {
            this.elements.cardConsequences.innerHTML = `
                <div class="consequences-label">Возможные последствия:</div>
                <div class="consequences-text">${decision.consequences}</div>
            `;
            this.elements.cardConsequences.classList.remove('hidden');
        } else if (this.elements.cardConsequences) {
            this.elements.cardConsequences.classList.add('hidden');
        }

        // Обновляем бейдж срочности
        this.updateUrgencyBadge(decision.urgency);

        // Обновляем кнопки выбора
        this.updateChoiceButtons(decision);
    }

    // Обновление бейджа срочности
    updateUrgencyBadge(urgency) {
        if (!this.elements.urgencyBadge) return;

        const badge = UIComponents.createUrgencyBadge(urgency);
        this.elements.urgencyBadge.innerHTML = '';
        this.elements.urgencyBadge.appendChild(badge);
    }

    // Обновление кнопок выбора
    updateChoiceButtons(decision) {
        // Левая кнопка (отклонить)
        if (this.elements.leftChoice) {
            const choiceText = this.elements.leftChoice.querySelector('.choice-text');
            const choiceEffects = this.elements.leftChoice.querySelector('.choice-effects');
            
            if (choiceText) {
                choiceText.textContent = decision.leftChoice.text;
            }
            
            if (choiceEffects) {
                choiceEffects.innerHTML = '';
                this.addEffectIndicators(choiceEffects, decision.leftChoice.effects);
            }
        }

        // Правая кнопка (принять)
        if (this.elements.rightChoice) {
            const choiceText = this.elements.rightChoice.querySelector('.choice-text');
            const choiceEffects = this.elements.rightChoice.querySelector('.choice-effects');
            
            if (choiceText) {
                choiceText.textContent = decision.rightChoice.text;
            }
            
            if (choiceEffects) {
                choiceEffects.innerHTML = '';
                this.addEffectIndicators(choiceEffects, decision.rightChoice.effects);
            }
        }
    }

    // Добавление индикаторов эффектов
    addEffectIndicators(container, effects) {
        const effectEntries = Object.entries(effects).filter(([_, value]) => value !== 0);
        
        if (effectEntries.length === 0) {
            const noEffects = document.createElement('div');
            noEffects.className = 'effect-indicator';
            noEffects.textContent = 'Нет эффектов';
            noEffects.style.opacity = '0.7';
            container.appendChild(noEffects);
            return;
        }

        effectEntries.slice(0, 4).forEach(([stat, value]) => {
            const indicator = UIComponents.createEffectIndicator(stat, value);
            container.appendChild(indicator);
        });

        // Показать "+N" если эффектов больше 4
        if (effectEntries.length > 4) {
            const moreIndicator = document.createElement('div');
            moreIndicator.className = 'effect-indicator';
            moreIndicator.innerHTML = `<span>+${effectEntries.length - 4}</span>`;
            moreIndicator.style.opacity = '0.7';
            container.appendChild(moreIndicator);
        }
    }

    // Обновление активных эффектов
    updateEffects() {
        if (!this.elements.effectBadgesList) return;

        this.elements.effectBadgesList.innerHTML = '';

        // Временные эффекты
        this.engine.gameState.temporaryEffects.forEach(effect => {
            const hasPositiveEffects = Object.values(effect.effects).some(val => val > 0);
            const hasNegativeEffects = Object.values(effect.effects).some(val => val < 0);
            
            let type = 'neutral';
            if (hasPositiveEffects && !hasNegativeEffects) {
                type = 'positive';
            } else if (hasNegativeEffects && !hasPositiveEffects) {
                type = 'negative';
            }

            const icon = this.getEffectIcon(effect.description);
            const effectData = {
                id: effect.id,
                type: type,
                icon: icon,
                title: effect.description,
                description: `Действует ${effect.duration} ходов. Эффекты: ${this.formatEffects(effect.effects)}`
            };

            const badge = UIComponents.createEffectBadge(effectData);
            this.elements.effectBadgesList.appendChild(badge);
        });
    }

    // Получение иконки для эффекта
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

    // Форматирование эффектов для отображения
    formatEffects(effects) {
        return Object.entries(effects)
            .map(([stat, value]) => `${STAT_LABELS[stat]}: ${value > 0 ? '+' : ''}${value}`)
            .join(', ');
    }

    // Обновление достижений
    updateAchievements() {
        if (!this.elements.achievementItems) return;

        this.elements.achievementItems.innerHTML = '';

        // Показываем последние 5 достижений
        const recentAchievements = this.engine.localState.achievements
            .filter(achievement => achievement.unlocked)
            .slice(-5);

        recentAchievements.forEach(achievement => {
            const item = UIComponents.createAchievementItem(achievement);
            this.elements.achievementItems.appendChild(item);
        });
    }

    // Обновление диалога окончания игры
    updateEndDialog() {
        const gameState = this.engine.gameState;
        const gameStats = gameState.gameStats;

        // Заголовок и иконка
        if (gameState.gameWon) {
            UIComponents.updateTextContent(this.elements.gameEndTitle, 'ПОБЕДА!');
            UIComponents.updateTextContent(this.elements.gameEndIcon, '🏆');
            UIComponents.updateTextContent(this.elements.gameEndMessage, 
                'Поздравляем! Вы успешно правили страной все 5 сроков и привели её к процветанию.');
        } else {
            UIComponents.updateTextContent(this.elements.gameEndTitle, 'ИГРА ОКОНЧЕНА');
            UIComponents.updateTextContent(this.elements.gameEndIcon, '💀');
            const reason = gameStats.defeatReason || 'Один из показателей достиг критического значения';
            UIComponents.updateTextContent(this.elements.gameEndMessage, 
                `Ваше правление завершилось неудачей. ${reason}.`);
        }

        // Финальная статистика
        if (this.elements.finalStatsGrid) {
            this.elements.finalStatsGrid.innerHTML = '';
            Object.entries(gameStats.finalStats).forEach(([key, value]) => {
                const statItem = UIComponents.createStatItem(key, value, STAT_LABELS[key]);
                this.elements.finalStatsGrid.appendChild(statItem);
            });
        }

        // Статистика игры
        if (this.elements.gameStatistics) {
            this.elements.gameStatistics.innerHTML = '';
            
            const stats = [
                { label: 'Принято решений', value: gameStats.totalDecisions },
                { label: 'Завершено сроков', value: gameStats.completedTerms },
                { label: 'Случайных событий', value: gameStats.randomEventsTriggered },
                { label: 'Максимальная сложность', value: gameStats.highestDifficulty },
                { label: 'Достижений получено', value: this.engine.localState.achievements.length },
                { label: 'Критических решений', value: gameStats.criticalDecisions }
            ];

            stats.forEach(stat => {
                const item = document.createElement('div');
                item.className = 'metric-item';
                item.innerHTML = `
                    <span class="metric-label">${stat.label}:</span>
                    <span class="metric-value">${stat.value}</span>
                `;
                this.elements.gameStatistics.appendChild(item);
            });
        }
    }

    // Добавление анимации к элементу
    animateElement(element, animationClass = 'card-slide-in') {
        if (!element) return;
        
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 300);
    }

    // Безопасное обновление элемента
    safeUpdate(element, updateFn) {
        try {
            if (element) {
                updateFn(element);
            }
        } catch (error) {
            console.warn('Ошибка при обновлении элемента:', error);
        }
    }
}

// Экспорт для других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUpdater;
} else {
    window.UIUpdater = UIUpdater;
}