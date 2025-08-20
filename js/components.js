// UI компоненты для игры
class UIComponents {
    // Создание элемента статистики
    static createStatItem(key, value, label) {
        const item = document.createElement('div');
        item.className = `stat-item ${key}`;
        
        item.innerHTML = `
            <div class="stat-label">${label}</div>
            <div class="stat-value">${value}%</div>
        `;
        
        return item;
    }

    // Создание индикатора общего баланса
    static createBalanceIndicator(stats) {
        const values = Object.values(stats);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        
        let balanceClass, balanceText;
        
        if (variance <= 100 && avg >= 60) {
            balanceClass = 'excellent';
            balanceText = 'ПРЕВОСХОДНО';
        } else if (variance <= 200 && avg >= 50) {
            balanceClass = 'good';
            balanceText = 'ХОРОШО';
        } else if (variance <= 400 && avg >= 40) {
            balanceClass = 'fair';
            balanceText = 'УДОВЛЕТВОРИТЕЛЬНО';
        } else if (avg >= 30) {
            balanceClass = 'poor';
            balanceText = 'ПЛОХО';
        } else {
            balanceClass = 'critical';
            balanceText = 'КРИТИЧНО';
        }
        
        const indicator = document.createElement('div');
        indicator.className = `balance-indicator ${balanceClass}`;
        indicator.textContent = balanceText;
        
        return indicator;
    }

    // Создание мобильной панели статистики
    static createMobileStatsContent(gameState) {
        const container = document.createElement('div');
        
        // Статистики государства
        const statsGrid = document.createElement('div');
        statsGrid.className = 'stats-grid';
        
        Object.entries(gameState.stats).forEach(([key, value]) => {
            const statItem = UIComponents.createStatItem(key, value, STAT_LABELS[key]);
            statsGrid.appendChild(statItem);
        });
        
        container.appendChild(statsGrid);
        
        // Общий баланс
        const balanceSection = document.createElement('div');
        balanceSection.className = 'overall-balance-section';
        
        const balanceTitle = document.createElement('h4');
        balanceTitle.className = 'balance-title';
        balanceTitle.textContent = 'ОБЩИЙ БАЛАНС';
        balanceSection.appendChild(balanceTitle);
        
        const balanceIndicator = UIComponents.createBalanceIndicator(gameState.stats);
        balanceSection.appendChild(balanceIndicator);
        container.appendChild(balanceSection);
        
        // Метрики
        const metricsSection = document.createElement('div');
        metricsSection.className = 'metrics-section';
        
        const corruptionItem = document.createElement('div');
        corruptionItem.className = 'metric-item';
        
        const corruptionLabel = document.createElement('span');
        corruptionLabel.className = 'metric-label';
        corruptionLabel.textContent = 'Коррупция:';
        
        const corruptionValue = document.createElement('span');
        corruptionValue.className = `metric-value ${
            gameState.metrics.corruption > 70 ? 'bad' : 
            gameState.metrics.corruption > 40 ? 'medium' : 'good'
        }`;
        corruptionValue.textContent = `${gameState.metrics.corruption}%`;
        
        corruptionItem.appendChild(corruptionLabel);
        corruptionItem.appendChild(corruptionValue);
        
        const satisfactionItem = document.createElement('div');
        satisfactionItem.className = 'metric-item';
        
        const satisfactionLabel = document.createElement('span');
        satisfactionLabel.className = 'metric-label';
        satisfactionLabel.textContent = 'Популярность:';
        
        const satisfactionValue = document.createElement('span');
        satisfactionValue.className = `metric-value ${
            gameState.metrics.satisfaction > 70 ? 'good' : 
            gameState.metrics.satisfaction > 40 ? 'medium' : 'bad'
        }`;
        satisfactionValue.textContent = `${gameState.metrics.satisfaction}%`;
        
        satisfactionItem.appendChild(satisfactionLabel);
        satisfactionItem.appendChild(satisfactionValue);
        
        metricsSection.appendChild(corruptionItem);
        metricsSection.appendChild(satisfactionItem);
        container.appendChild(metricsSection);
        
        return container;
    }

    // Создание индикатора эффекта
    static createEffectIndicator(stat, value) {
        const indicator = document.createElement('div');
        indicator.className = 'effect-indicator';
        
        const icon = document.createElement('div');
        icon.className = 'effect-icon';
        icon.textContent = STAT_ICONS[stat] || '📊';
        
        const arrow = document.createElement('span');
        arrow.textContent = value > 0 ? '↗' : '↘';
        arrow.style.color = value > 0 ? '#22c55e' : '#ef4444';
        
        const amount = document.createElement('span');
        amount.textContent = Math.abs(value);
        amount.style.color = value > 0 ? '#22c55e' : '#ef4444';
        
        indicator.appendChild(icon);
        indicator.appendChild(arrow);
        indicator.appendChild(amount);
        
        return indicator;
    }

    // Создание аватара советника
    static createAdvisorAvatar(advisor, size = 'md') {
        const avatar = document.createElement('div');
        avatar.className = `advisor-avatar ${size}`;
        
        const advisorData = ADVISOR_BACKSTORIES[advisor];
        if (advisorData) {
            avatar.textContent = advisorData.avatar;
            avatar.title = advisorData.name;
        }
        
        return avatar;
    }

    // Создание бейджа срочности
    static createUrgencyBadge(urgency) {
        const badge = document.createElement('div');
        badge.className = `urgency-badge ${urgency}`;
        
        const icon = document.createElement('span');
        icon.textContent = URGENCY_ICONS[urgency];
        
        const text = document.createElement('span');
        text.textContent = URGENCY_LABELS[urgency];
        
        badge.appendChild(icon);
        badge.appendChild(text);
        
        return badge;
    }

    // Создание бейджа эффекта
    static createEffectBadge(effect) {
        const badge = document.createElement('div');
        badge.className = `effect-badge ${effect.type}`;
        
        const icon = document.createElement('div');
        icon.className = 'badge-icon';
        icon.textContent = effect.icon;
        
        const content = document.createElement('div');
        content.className = 'badge-content';
        
        const title = document.createElement('div');
        title.className = 'badge-title';
        title.textContent = effect.title;
        
        const description = document.createElement('div');
        description.className = 'badge-description';
        description.textContent = effect.description;
        
        content.appendChild(title);
        content.appendChild(description);
        
        badge.appendChild(icon);
        badge.appendChild(content);
        
        return badge;
    }

    // Создание элемента достижения
    static createAchievementItem(achievement) {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        
        const icon = document.createElement('div');
        icon.className = 'badge-icon';
        icon.textContent = achievement.icon;
        
        const content = document.createElement('div');
        content.className = 'badge-content';
        
        const title = document.createElement('div');
        title.className = 'badge-title';
        title.textContent = achievement.name;
        
        const description = document.createElement('div');
        description.className = 'badge-description';
        description.textContent = achievement.description;
        
        content.appendChild(title);
        content.appendChild(description);
        
        item.appendChild(icon);
        item.appendChild(content);
        
        return item;
    }

    // Создание уведомления о достижении
    static createAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        
        const content = document.createElement('div');
        content.className = 'achievement-content';
        
        const icon = document.createElement('div');
        icon.className = 'achievement-icon';
        icon.textContent = achievement.icon;
        
        const info = document.createElement('div');
        info.className = 'achievement-info';
        
        const title = document.createElement('h4');
        title.textContent = achievement.name;
        
        const desc = document.createElement('p');
        desc.textContent = achievement.description;
        
        info.appendChild(title);
        info.appendChild(desc);
        
        const progress = document.createElement('div');
        progress.className = 'achievement-progress';
        
        content.appendChild(icon);
        content.appendChild(info);
        notification.appendChild(content);
        notification.appendChild(progress);
        
        return notification;
    }

    // Создание уведомления о событии
    static createEventNotification(event) {
        const notification = document.createElement('div');
        notification.className = 'event-notification';
        
        let message = '';
        if (typeof event === 'string') {
            message = event;
        } else if (typeof event === 'object' && event !== null) {
            message = event.description || event.title || event.name || 'Случайное событие';
        } else {
            message = 'Случайное событие';
        }
        
        notification.textContent = message;
        
        return notification;
    }

    // Создание индикатора стрика
    static createStreakIndicator(count) {
        const indicator = document.createElement('div');
        indicator.className = 'streak-indicator';
        
        const content = document.createElement('div');
        content.className = 'streak-content';
        
        const icon = document.createElement('span');
        icon.className = 'streak-icon';
        icon.textContent = '🔥';
        
        const countSpan = document.createElement('span');
        countSpan.className = 'streak-count';
        countSpan.textContent = count;
        
        const label = document.createElement('span');
        label.className = 'streak-label';
        label.textContent = 'СЕРИЯ!';
        
        content.appendChild(icon);
        content.appendChild(countSpan);
        content.appendChild(label);
        indicator.appendChild(content);
        
        return indicator;
    }

    // Создание индикатора свайпа
    static createSwipeIndicator(direction) {
        const indicator = document.createElement('div');
        indicator.className = `swipe-indicator ${direction}`;
        
        const arrow = document.createElement('div');
        arrow.className = 'swipe-arrow';
        arrow.textContent = direction === 'left' ? '←' : '→';
        
        indicator.appendChild(arrow);
        
        return indicator;
    }

    // Анимация появления элемента
    static animateIn(element, animationClass = 'card-slide-in') {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 300);
    }

    // Утилита для безопасного обновления текста
    static updateTextContent(element, text) {
        if (element && typeof text !== 'undefined') {
            element.textContent = text;
        }
    }

    // Утилита для безопасного обновления HTML
    static updateInnerHTML(element, html) {
        if (element && typeof html !== 'undefined') {
            element.innerHTML = html;
        }
    }

    // Утилита для безопасного добавления класса
    static addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    }

    // Утилита для безопасного удаления класса
    static removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    }

    // Утилита для переключения класса
    static toggleClass(element, className, force) {
        if (element && className) {
            if (typeof force !== 'undefined') {
                element.classList.toggle(className, force);
            } else {
                element.classList.toggle(className);
            }
        }
    }
}

// Экспорт для других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIComponents;
} else {
    window.UIComponents = UIComponents;
}