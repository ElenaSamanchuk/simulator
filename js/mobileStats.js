// Функции для работы с мобильной статистикой
class MobileStats {
    static createOverallBalance(stats) {
        const values = Object.values(stats);
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        const isBalanced = values.every(v => v >= 25 && v <= 75);
        const isStable = Math.max(...values) - Math.min(...values) < 40;
        
        const balanceDiv = document.createElement('div');
        balanceDiv.className = 'p-3 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl backdrop-blur-sm';
        
        balanceDiv.innerHTML = `
            <div class="text-center">
                <h3 class="text-sm font-mono font-bold text-primary uppercase tracking-wide mb-2">
                    Общий баланс
                </h3>
                <div class="flex items-center justify-center gap-2">
                    <div class="w-3 h-3 rounded-full ${
                        isBalanced && isStable ? 'bg-green-500 animate-pulse' :
                        isStable ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                    }"></div>
                    <span class="text-sm font-mono text-foreground">
                        ${isBalanced && isStable ? 'СТАБИЛЬНОСТЬ' :
                          isStable ? 'УМЕРЕННОСТЬ' : 'НЕСТАБИЛЬНОСТЬ'}
                    </span>
                    <span class="text-xs text-muted-foreground">
                        (${Math.round(average)}%)
                    </span>
                </div>
            </div>
        `;
        
        return balanceDiv;
    }

    static createMobileStatsContent(gameState) {
        const container = document.createElement('div');
        
        // Статистики государства
        let html = '<div class="grid grid-cols-2 gap-3 mb-4">';
        Object.entries(gameState.stats).forEach(([key, value]) => {
            const colors = UIHelpers.getStatColors(key);
            html += `
                <div class="text-center p-3 border rounded-lg transition-colors" style="color: ${colors.light}; border-color: ${colors.border}; background: ${colors.bg}">
                    <div class="text-xs font-mono font-bold mb-1">${STAT_LABELS[key]}</div>
                    <div class="text-lg font-bold">${value}%</div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
        
        // Общий баланс
        const balanceSection = document.createElement('div');
        balanceSection.className = 'mb-4';
        balanceSection.appendChild(MobileStats.createOverallBalance(gameState.stats));
        container.appendChild(balanceSection);
        
        // Метрики
        const metricsSection = document.createElement('div');
        metricsSection.className = 'grid grid-cols-2 gap-3 mb-4';
        
        const corruptionItem = document.createElement('div');
        corruptionItem.className = 'flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/20';
        corruptionItem.innerHTML = `
            <span class="text-muted-foreground text-xs mb-1">Коррупция:</span>
            <span class="font-bold text-base ${
                gameState.metrics.corruption > 70 ? 'text-red-400' : 
                gameState.metrics.corruption > 40 ? 'text-yellow-400' : 'text-green-400'
            }">
                ${gameState.metrics.corruption}%
            </span>
        `;
        
        const satisfactionItem = document.createElement('div');
        satisfactionItem.className = 'flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/20';
        satisfactionItem.innerHTML = `
            <span class="text-muted-foreground text-xs mb-1">Популярность:</span>
            <span class="font-bold text-base ${
                gameState.metrics.satisfaction > 70 ? 'text-green-400' : 
                gameState.metrics.satisfaction > 40 ? 'text-yellow-400' : 'text-red-400'
            }">
                ${gameState.metrics.satisfaction}%
            </span>
        `;
        
        metricsSection.appendChild(corruptionItem);
        metricsSection.appendChild(satisfactionItem);
        container.appendChild(metricsSection);
        
        // Активные эффекты
        const effectBadges = gameState.temporaryEffects.map((effect) => {
            const hasPositiveEffects = Object.values(effect.effects).some((val) => val > 0);
            const hasNegativeEffects = Object.values(effect.effects).some((val) => val < 0);
            
            let type = 'neutral';
            if (hasPositiveEffects && !hasNegativeEffects) {
                type = 'positive';
            } else if (hasNegativeEffects && !hasPositiveEffects) {
                type = 'negative';
            }
            
            const icon = UIHelpers.getEffectIcon(effect.description);
            
            return {
                id: effect.id,
                type,
                icon,
                title: effect.description,
                description: `${effect.description}. Действует ${effect.duration} ходов. Эффекты: ${UIHelpers.formatEffects(effect.effects)}`
            };
        });
        
        if (effectBadges.length > 0) {
            const effectsSection = document.createElement('div');
            effectsSection.className = 'space-y-3 mb-4';
            
            const effectsHeader = document.createElement('div');
            effectsHeader.className = 'flex items-center gap-2 pb-2 border-b border-border/30';
            effectsHeader.innerHTML = `
                <div class="w-4 h-4 text-primary">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="text-sm font-mono font-bold text-primary uppercase tracking-wide">
                    Активные эффекты
                </h3>
            `;
            
            const effectsContainer = document.createElement('div');
            effectsContainer.className = 'p-3 bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg space-y-2';
            
            effectBadges.slice(0, 4).forEach(badge => {
                const badgeElement = document.createElement('div');
                badgeElement.className = `flex items-center gap-2 p-2 rounded text-xs ${
                    badge.type === 'positive' ? 'bg-green-500/10 border border-green-500/20' :
                    badge.type === 'negative' ? 'bg-red-500/10 border border-red-500/20' :
                    'bg-gray-500/10 border border-gray-500/20'
                }`;
                
                badgeElement.innerHTML = `
                    <div class="text-sm">${badge.icon}</div>
                    <div class="flex-1 min-w-0">
                        <div class="font-mono font-bold text-xs truncate">${badge.title}</div>
                        <div class="text-xs opacity-70 truncate">${badge.description}</div>
                    </div>
                `;
                
                effectsContainer.appendChild(badgeElement);
            });
            
            effectsSection.appendChild(effectsHeader);
            effectsSection.appendChild(effectsContainer);
            container.appendChild(effectsSection);
        }
        
        // Статистика игры
        const gameStatsSection = document.createElement('div');
        gameStatsSection.className = 'space-y-2';
        
        const gameStatsHeader = document.createElement('h3');
        gameStatsHeader.className = 'text-sm font-mono font-bold text-primary uppercase tracking-wide';
        gameStatsHeader.textContent = 'Статистика';
        
        const gameStatsGrid = document.createElement('div');
        gameStatsGrid.className = 'grid grid-cols-2 gap-2 text-xs';
        
        const decisions = document.createElement('div');
        decisions.className = 'flex justify-between p-2 bg-secondary/20 rounded border border-border/10';
        decisions.innerHTML = `
            <span class="text-muted-foreground">Решений:</span>
            <span class="font-bold text-primary">${gameState.gameStats.totalDecisions}</span>
        `;
        
        const events = document.createElement('div');
        events.className = 'flex justify-between p-2 bg-secondary/20 rounded border border-border/10';
        events.innerHTML = `
            <span class="text-muted-foreground">События:</span>
            <span class="font-bold text-primary">${gameState.gameStats.randomEventsTriggered}</span>
        `;
        
        gameStatsGrid.appendChild(decisions);
        gameStatsGrid.appendChild(events);
        
        gameStatsSection.appendChild(gameStatsHeader);
        gameStatsSection.appendChild(gameStatsGrid);
        container.appendChild(gameStatsSection);
        
        // Международная репутация (если есть)
        if (gameState.countries && gameState.countries.length > 0) {
            const reputationSection = document.createElement('div');
            reputationSection.className = 'space-y-2 mt-4';
            
            const reputationHeader = document.createElement('h3');
            reputationHeader.className = 'text-sm font-mono font-bold text-primary uppercase tracking-wide';
            reputationHeader.textContent = 'Репутация';
            
            const reputationList = document.createElement('div');
            reputationList.className = 'space-y-2 max-h-32 overflow-y-auto';
            
            gameState.countries.slice(0, 3).forEach((country) => {
                const countryItem = document.createElement('div');
                countryItem.className = 'flex items-center justify-between p-2 bg-secondary/20 rounded-md border border-border/10';
                
                countryItem.innerHTML = `
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                        <div class="w-2 h-2 rounded-full flex-shrink-0 ${
                            country.type === 'ally' ? 'bg-green-400' : 
                            country.type === 'enemy' ? 'bg-red-400' : 'bg-yellow-400'
                        }"></div>
                        <span class="text-xs font-mono truncate ${
                            country.type === 'ally' ? 'text-green-400' : 
                            country.type === 'enemy' ? 'text-red-400' : 'text-yellow-400'
                        }">
                            ${country.name}
                        </span>
                    </div>
                    <span class="text-xs font-mono font-bold flex-shrink-0 ${
                        country.reputation > 0 ? 'text-green-400' : 
                        country.reputation < 0 ? 'text-red-400' : 'text-gray-400'
                    }">
                        ${country.reputation > 0 ? '+' : ''}${country.reputation}
                    </span>
                `;
                
                reputationList.appendChild(countryItem);
            });
            
            reputationSection.appendChild(reputationHeader);
            reputationSection.appendChild(reputationList);
            container.appendChild(reputationSection);
        }
        
        return container;
    }
}

// Экспорт
window.MobileStats = MobileStats;