// Основной скрипт приложения - полная версия с анализом правления и иконками эффектов
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем инициализацию...');
    
    // Проверяем что все зависимости загружены
    if (typeof GAME_CONFIG === 'undefined') {
        console.error('GAME_CONFIG не загружен');
        return;
    }
    
    if (typeof SoundSystem === 'undefined') {
        console.error('SoundSystem не загружен');
        return;
    }
    
    // Инициализация игры
    const game = new SimpleGameEngine();
    game.init();
});

// Игровой движок с анализом правления
class SimpleGameEngine {
    constructor() {
        this.gameState = {
            stats: { ...GAME_CONFIG.initialStats },
            metrics: { ...GAME_CONFIG.initialMetrics },
            currentDecisionIndex: 0,
            currentTerm: 1,
            difficulty: 1,
            gameOver: false,
            gameWon: false,
            totalDecisions: 0,
            temporaryEffects: [],
            lastRandomEvent: null,
            gameStats: {
                totalDecisions: 0,
                randomEventsTriggered: 0,
                completedTerms: 0,
                highestDifficulty: 1,
                criticalDecisions: 0,
                defeatReason: null,
                finalStats: { ...GAME_CONFIG.initialStats },
                finalMetrics: { ...GAME_CONFIG.initialMetrics }
            },
            reputation: {
                allies: 5,
                enemies: -2,
                neutral: 0
            }
        };
        
        this.localState = {
            isSoundEnabled: true,
            showEndDialog: false,
            cardTransform: '',
            swipeIndicator: null,
            achievements: [],
            streakCount: 0,
            isAnimating: false,
            showMobileStats: false,
            processedAchievements: new Set()
        };
        
        this.elements = {};
        
        // Состояние для touch events
        this.touchState = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            isDragging: false,
            startTime: 0
        };
    }
    
    init() {
        console.log('Инициализация игрового движка...');
        
        // Настройка viewport для мобильных
        this.setupMobileViewport();
        
        // Получаем элементы
        this.setupElements();
        
        // Настройка обработчиков событий
        this.setupEventListeners();
        
        // Первое обновление UI
        this.updateUI();
        
        console.log('Игровой движок инициализирован');
    }
    
    setupMobileViewport() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        
        const handleResize = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
        
        window.addEventListener('resize', handleResize);
    }
    
    setupElements() {
        const elementIds = [
            'termDisplay', 'decisionDisplay', 'overallBalanceDisplay', 'balanceIndicator', 'termProgress', 'overallProgress',
            'soundToggle', 'restartBtn', 'mobileStatsToggle', 'mobileStatsContent',
            'mobileStatsArrow', 'statsGrid', 'advisorAvatar', 'advisorName', 'advisorQuote',
            'gameCard', 'cardAdvisorAvatar', 'cardAdvisorName', 'cardTitle', 'cardDescription',
            'cardConsequences', 'consequencesText', 'urgencyBadge', 'leftChoice', 'rightChoice',
            'leftChoiceText', 'leftChoiceEffects', 'rightChoiceText', 'rightChoiceEffects',
            'swipeIndicator', 'swipeArrow', 'streakIndicator', 'streakCount', 'effectBadges',
            'achievementBadges', 'gameEndDialog', 'gameEndTitle', 'gameEndIcon', 'gameEndMessage',
            'gameEndQuote', 'ruleAnalysis', 'playStyleText', 'priorityText', 'alignmentText',
            'finalStats', 'completedTermsValue', 'totalDecisionsValue', 'randomEventsValue', 'successRateValue',
            'playAgainBtn', 'closeDialogBtn', 'achievementSystem',
            'corruptionValue', 'corruptionBar', 'satisfactionValue', 'satisfactionBar',
            'alliesRep', 'enemiesRep', 'neutralRep'
        ];

        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.elements[id] = element;
            } else {
                console.warn(`Элемент ${id} не найден`);
            }
        });
    }
    
    setupEventListeners() {
        // Кнопки управления
        this.elements.soundToggle?.addEventListener('click', () => this.toggleSound());
        this.elements.restartBtn?.addEventListener('click', () => this.resetGame());
        
        // Мобильная панель
        this.elements.mobileStatsToggle?.addEventListener('click', () => this.toggleMobileStats());
        
        // Кнопки выбора
        this.elements.leftChoice?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleChoice(true);
        });
        
        this.elements.rightChoice?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleChoice(false);
        });
        
        // Диалог окончания игры
        this.elements.playAgainBtn?.addEventListener('click', () => {
            this.hideEndDialog();
            this.resetGame();
        });
        this.elements.closeDialogBtn?.addEventListener('click', () => this.hideEndDialog());
        
        // Touch события для свайпов
        if (this.elements.gameCard) {
            // Touch events
            this.elements.gameCard.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            this.elements.gameCard.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            this.elements.gameCard.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
            
            // Mouse events для десктопа
            this.elements.gameCard.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.elements.gameCard.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.elements.gameCard.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.elements.gameCard.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        }
        
        // Клавиатура
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Возобновление аудио контекста
        const resumeAudio = () => {
            SoundSystem.resumeContext();
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
        };
        document.addEventListener('click', resumeAudio);
        document.addEventListener('touchstart', resumeAudio);
    }
    
    // Touch обработчики - без изменений
    handleTouchStart(e) {
        if (this.gameState.gameOver || this.gameState.gameWon || this.localState.isAnimating) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        this.touchState.startX = touch.clientX;
        this.touchState.startY = touch.clientY;
        this.touchState.currentX = touch.clientX;
        this.touchState.currentY = touch.clientY;
        this.touchState.isDragging = true;
        this.touchState.startTime = Date.now();
        
        if (this.localState.isSoundEnabled) {
            SoundSystem.cardFlip();
        }
    }
    
    handleTouchMove(e) {
        if (!this.touchState.isDragging || this.gameState.gameOver || this.gameState.gameWon || this.localState.isAnimating) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        this.touchState.currentX = touch.clientX;
        this.touchState.currentY = touch.clientY;
        
        const offsetX = this.touchState.currentX - this.touchState.startX;
        const offsetY = this.touchState.currentY - this.touchState.startY;
        
        // Проверяем что это горизонтальный свайп
        if (Math.abs(offsetX) > Math.abs(offsetY)) {
            const rotation = offsetX * 0.1;
            const scale = 1 - Math.abs(offsetX) * 0.0005;
            
            this.localState.cardTransform = `translateX(${offsetX}px) rotate(${rotation}deg) scale(${Math.max(0.9, scale)})`;
            
            if (Math.abs(offsetX) > 50) {
                this.localState.swipeIndicator = offsetX > 0 ? 'right' : 'left';
            } else {
                this.localState.swipeIndicator = null;
            }
            
            this.updateCardTransform();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.touchState.isDragging) return;
        
        e.preventDefault();
        const offsetX = this.touchState.currentX - this.touchState.startX;
        const duration = Date.now() - this.touchState.startTime;
        const velocity = Math.abs(offsetX) / duration;
        
        // Определяем был ли это свайп
        const isSwipe = Math.abs(offsetX) > GAME_CONFIG.minSwipeDistance || velocity > 0.5;
        
        if (isSwipe && Math.abs(offsetX) > 30) {
            this.handleChoice(offsetX < 0); // left choice если свайп влево
        } else {
            // Возвращаем карточку в исходное положение
            this.localState.cardTransform = '';
            this.localState.swipeIndicator = null;
            this.updateCardTransform();
        }
        
        this.touchState.isDragging = false;
    }
    
    // Mouse обработчики - без изменений
    handleMouseDown(e) {
        if (this.gameState.gameOver || this.gameState.gameWon || this.localState.isAnimating) return;
        
        this.touchState.startX = e.clientX;
        this.touchState.startY = e.clientY;
        this.touchState.currentX = e.clientX;
        this.touchState.currentY = e.clientY;
        this.touchState.isDragging = true;
        this.touchState.startTime = Date.now();
        
        this.elements.gameCard.style.cursor = 'grabbing';
        
        if (this.localState.isSoundEnabled) {
            SoundSystem.cardFlip();
        }
    }
    
    handleMouseMove(e) {
        if (!this.touchState.isDragging || this.gameState.gameOver || this.gameState.gameWon || this.localState.isAnimating) return;
        
        this.touchState.currentX = e.clientX;
        this.touchState.currentY = e.clientY;
        
        const offsetX = this.touchState.currentX - this.touchState.startX;
        const rotation = offsetX * 0.1;
        const scale = 1 - Math.abs(offsetX) * 0.0005;
        
        this.localState.cardTransform = `translateX(${offsetX}px) rotate(${rotation}deg) scale(${Math.max(0.9, scale)})`;
        
        if (Math.abs(offsetX) > 50) {
            this.localState.swipeIndicator = offsetX > 0 ? 'right' : 'left';
        } else {
            this.localState.swipeIndicator = null;
        }
        
        this.updateCardTransform();
    }
    
    handleMouseUp(e) {
        if (!this.touchState.isDragging) return;
        
        const offsetX = this.touchState.currentX - this.touchState.startX;
        const duration = Date.now() - this.touchState.startTime;
        const velocity = Math.abs(offsetX) / duration;
        
        const isSwipe = Math.abs(offsetX) > GAME_CONFIG.minSwipeDistance || velocity > 0.3;
        
        if (isSwipe && Math.abs(offsetX) > 30) {
            this.handleChoice(offsetX < 0);
        } else {
            this.localState.cardTransform = '';
            this.localState.swipeIndicator = null;
            this.updateCardTransform();
        }
        
        this.touchState.isDragging = false;
        this.elements.gameCard.style.cursor = 'grab';
    }
    
    handleMouseLeave(e) {
        if (this.touchState.isDragging) {
            this.localState.cardTransform = '';
            this.localState.swipeIndicator = null;
            this.updateCardTransform();
            this.touchState.isDragging = false;
            this.elements.gameCard.style.cursor = 'grab';
        }
    }
    
    getCurrentDecision() {
        const availableDecisions = GAME_DECISIONS.filter(decision => 
            decision.id <= this.gameState.currentDecisionIndex + 1
        );
        
        if (availableDecisions.length === 0) {
            return GAME_DECISIONS[0];
        }
        
        return availableDecisions[this.gameState.currentDecisionIndex % availableDecisions.length];
    }
    
    checkAchievements() {
        const newAchievements = [];
        
        // Проверяем достижения
        const achievementChecks = [
            {
                condition: this.gameState.gameStats.totalDecisions === 1,
                id: 'first_decision',
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
                condition: this.gameState.currentTerm >= 2 && Object.values(this.gameState.stats).every(v => v >= 30 && v <= 70),
                id: 'balanced_ruler',
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
                condition: this.gameState.stats.diplomacy >= 80,
                id: 'diplomat',
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
                condition: this.gameState.gameWon,
                id: 'victory',
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

        achievementChecks.forEach(({ condition, id, achievement }) => {
            if (condition && !this.localState.processedAchievements.has(id)) {
                newAchievements.push(achievement);
                this.localState.processedAchievements.add(id);
            }
        });

        if (newAchievements.length > 0) {
            this.localState.achievements.push(...newAchievements);
            
            // Показываем уведомления
            newAchievements.forEach(achievement => {
                this.showAchievementNotification(achievement);
            });
            
            if (this.localState.isSoundEnabled) {
                SoundSystem.achievement();
            }
        }
    }
    
    showAchievementNotification(achievement) {
        if (!this.elements.achievementSystem) return;
        
        const style = this.getRarityStyle(achievement.rarity);
        const notificationId = `achievement-${achievement.id}-${Date.now()}`;
        
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `${style.bg} ${style.border} ${style.glow} backdrop-blur-md border rounded-xl p-4 lg:p-5 shadow-2xl transform transition-all duration-500 ease-out pointer-events-auto animate-in slide-in-from-right-full fade-in-0 hover:scale-105 w-full lg:w-auto`;
        
        notification.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="text-2xl lg:text-3xl flex-shrink-0 animate-bounce">
                    ${achievement.icon}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-xs lg:text-xs font-mono font-bold uppercase tracking-wider ${style.text} leading-tight">
                            🏆 Достижение получено!
                        </div>
                        <button class="h-6 w-6 lg:h-5 lg:w-5 flex items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors hover:bg-white/10 flex-shrink-0 rounded" onclick="document.getElementById('${notificationId}').remove()">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="text-xs font-mono font-semibold uppercase tracking-wide mb-2 ${style.text} opacity-80">
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
                <div class="${style.text} bg-current rounded-full achievement-progress-bar" style="height: 100%; width: 100%;"></div>
            </div>
        `;
        
        this.elements.achievementSystem.appendChild(notification);
        
        // Автоматически убираем через 5 секунд
        setTimeout(() => {
            if (document.getElementById(notificationId)) {
                notification.remove();
            }
        }, 5000);
    }
    
    getRarityStyle(rarity) {
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
        return styles[rarity] || styles.common;
    }
    
    // Анализ игрока - из React компонента
    analyzePlayerProfile(stats) {
        const dominantStat = Object.entries(stats).reduce((a, b) => stats[a[0]] > stats[b[0]] ? a : b)[0];
        
        const statValues = Object.values(stats);
        const average = statValues.reduce((a, b) => a + b, 0) / statValues.length;
        const variance = statValues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / statValues.length;
        
        let playStyle = 'balanced';
        if (variance < 100) playStyle = 'balanced';
        else if (variance > 400) playStyle = 'extremist';
        else if (average < 40) playStyle = 'cautious';
        else if (average > 70) playStyle = 'aggressive';
        else playStyle = 'chaotic';
        
        if (stats.science > 75) playStyle = 'technocrat';
        if (stats.society > 75 && stats.science < 40) playStyle = 'traditionalist';
        if (stats.diplomacy > 75) playStyle = 'diplomat';
        
        let moralAlignment = 'neutral';
        if (stats.society > 70 && stats.ecology > 60) moralAlignment = 'good';
        else if (stats.society < 30 || stats.military > 80) moralAlignment = 'evil';
        
        return {
            dominantStat,
            playStyle,
            moralAlignment
        };
    }
    
    // Генерация концовки - из React компонента
    generateEnding(profile, stats, isVictory) {
        if (!isVictory) {
            const lowestStat = Object.entries(stats).reduce((a, b) => stats[a[0]] < stats[b[0]] ? a : b);
            const [statName] = lowestStat;
            
            const defeatReasons = {
                military: {
                    type: 'MILITARY_COLLAPSE',
                    title: 'ВОЕННЫЙ КОЛЛАПС',
                    description: 'Ослабленная армия не смогла защитить государство от внешних угроз.',
                    flavor: 'Мир - это хорошо, но не тогда, когда враги у ворот.',
                    icon: '⚔️',
                    color: 'text-red-400'
                },
                society: {
                    type: 'SOCIAL_CRISIS',
                    title: 'СОЦИАЛЬНЫЙ КРИЗИС',
                    description: 'Потеря доверия народа привела к анархии и распаду общества.',
                    flavor: 'Без народа нет государства.',
                    icon: '💫',
                    color: 'text-purple-400'
                },
                ecology: {
                    type: 'ECOLOGICAL_DISASTER',
                    title: 'ЭКОЛОГИЧЕСКАЯ КАТАСТРОФА', 
                    description: 'Планета больше не может поддерживать жизнь из-за экологических разрушений.',
                    flavor: 'Прогресс без заботы о природе - путь к самоуничтожению.',
                    icon: '🌍',
                    color: 'text-green-400'
                }
            };
            
            return defeatReasons[statName] || {
                type: 'GENERAL_COLLAPSE',
                title: 'ВСЕОБЩИЙ КОЛЛАПС',
                description: 'Государство рухнуло под грузом накопившихся проблем.',
                flavor: 'Иногда даже лучшие намерения приводят к худшим результатам.',
                icon: '💀',
                color: 'text-foreground'
            };
        }
        
        if (profile.playStyle === 'diplomat') {
            return {
                type: 'PEACEFUL_EMPIRE',
                title: 'МИРНАЯ ИМПЕРИЯ',
                description: 'Вы создали процветающее государство, где конфликты решаются словом, а не мечом.',
                flavor: 'Истинная сила в умении договариваться.',
                icon: '🕊️',
                color: 'text-cyan-400'
            };
        }
        
        if (profile.playStyle === 'balanced' && profile.moralAlignment === 'good') {
            return {
                type: 'GOLDEN_AGE',
                title: 'ЗОЛОТОЙ ВЕК',
                description: 'Под вашим мудрым правлением началась новая эра процветания. Нация достигла идеального баланса между прогрессом и традициями.',
                flavor: 'История будет помнить вас как величайшего правителя всех времён.',
                icon: '👑',
                color: 'text-yellow-400'
            };
        }
        
        return {
            type: 'STABLE_DEMOCRACY',
            title: 'СТАБИЛЬНАЯ ДЕМОКРАТИЯ',
            description: 'Ваше сбалансированное правление создало устойчивое демократическое государство.',
            flavor: 'Мудрость в балансе - залог долгой жизни нации.',
            icon: '⚖️',
            color: 'text-blue-400'
        };
    }
    
    handleChoice(isLeftChoice) {
        if (this.gameState.gameOver || this.gameState.gameWon || this.localState.isAnimating) return;
        
        this.localState.isAnimating = true;
        
        const decision = this.getCurrentDecision();
        const choice = isLeftChoice ? decision.leftChoice : decision.rightChoice;
        
        // Применяем эффекты
        Object.entries(choice.effects).forEach(([stat, value]) => {
            if (this.gameState.stats.hasOwnProperty(stat)) {
                this.gameState.stats[stat] = Math.max(0, Math.min(100, this.gameState.stats[stat] + value));
            }
        });
        
        // Обновляем метрики
        if (choice.corruption !== undefined) {
            this.gameState.metrics.corruption = Math.max(0, Math.min(100, this.gameState.metrics.corruption + choice.corruption));
        }
        if (choice.satisfaction !== undefined) {
            this.gameState.metrics.satisfaction = Math.max(0, Math.min(100, this.gameState.metrics.satisfaction + choice.satisfaction));
        }
        
        // Добавляем временные эффекты
        if (decision.temporaryEffects) {
            this.gameState.temporaryEffects.push({
                id: `temp-${Date.now()}`,
                ...decision.temporaryEffects
            });
        }
        
        // Обновляем репутацию
        if (decision.reputationEffects) {
            Object.entries(decision.reputationEffects).forEach(([type, value]) => {
                if (this.gameState.reputation.hasOwnProperty(type)) {
                    this.gameState.reputation[type] += value;
                }
            });
        }
        
        // Обновляем игровую статистику
        this.gameState.gameStats.totalDecisions++;
        this.gameState.currentDecisionIndex++;
        this.gameState.currentTerm = Math.ceil(this.gameState.currentDecisionIndex / GAME_CONFIG.decisionsPerTerm) + 1;
        
        // Правильный расчет сложности
        this.gameState.difficulty = Math.min(8, Math.floor(this.gameState.currentDecisionIndex / 6) + 1);
        this.gameState.gameStats.highestDifficulty = Math.max(this.gameState.gameStats.highestDifficulty, this.gameState.difficulty);
        
        // Проверяем критическое решение
        const hasExtremeEffect = Object.values(choice.effects).some(val => Math.abs(val) >= 20);
        if (hasExtremeEffect) {
            this.gameState.gameStats.criticalDecisions++;
        }
        
        // Уменьшаем длительность временных эффектов
        this.gameState.temporaryEffects = this.gameState.temporaryEffects.filter(effect => {
            effect.duration--;
            return effect.duration > 0;
        });
        
        // Проверяем условия окончания игры
        const values = Object.values(this.gameState.stats);
        const criticalStat = values.find(val => val <= 0 || val >= 100);
        const corruptionFailure = this.gameState.metrics.corruption >= 90;
        const satisfactionFailure = this.gameState.metrics.satisfaction <= 10;
        
        const gameOver = criticalStat !== undefined || corruptionFailure || satisfactionFailure;
        const gameWon = this.gameState.currentTerm > GAME_CONFIG.maxTerms && !gameOver;
        
        // Устанавливаем причину поражения
        if (gameOver) {
            if (criticalStat !== undefined) {
                const statName = Object.keys(this.gameState.stats).find(key => 
                    this.gameState.stats[key] === criticalStat
                );
                this.gameState.gameStats.defeatReason = criticalStat <= 0 
                    ? `Показатель "${STAT_LABELS[statName]}" упал до критического минимума`
                    : `Показатель "${STAT_LABELS[statName]}" достиг критического максимума`;
            } else if (corruptionFailure) {
                this.gameState.gameStats.defeatReason = 'Коррупция достигла критического уровня';
            } else if (satisfactionFailure) {
                this.gameState.gameStats.defeatReason = 'Популярность упала до критического минимума';
            }
        }
        
        this.gameState.gameOver = gameOver;
        this.gameState.gameWon = gameWon;
        this.gameState.gameStats.completedTerms = Math.max(0, this.gameState.currentTerm - 1);
        
        // Сохраняем финальные статистики
        this.gameState.gameStats.finalStats = { ...this.gameState.stats };
        this.gameState.gameStats.finalMetrics = { ...this.gameState.metrics };
        
        // Проверяем достижения
        this.checkAchievements();
        
        // Звуковые эффекты
        if (this.localState.isSoundEnabled) {
            isLeftChoice ? SoundSystem.swipeLeft() : SoundSystem.swipeRight();
        }
        
        // Анимация карточки
        const direction = isLeftChoice ? -1 : 1;
        this.localState.cardTransform = `translateX(${direction * 300}px) rotate(${direction * 15}deg) scale(0.9)`;
        this.localState.swipeIndicator = isLeftChoice ? 'left' : 'right';
        
        // Обновляем UI
        this.updateUI();
        
        // Сброс анимации
        setTimeout(() => {
            this.localState.cardTransform = '';
            this.localState.swipeIndicator = null;
            this.localState.isAnimating = false;
            this.updateUI();
            
            // Показываем диалог окончания игры если нужно
            if (gameOver || gameWon) {
                setTimeout(() => this.showEndDialog(), 1000);
            }
        }, 150);
    }
    
    handleKeyPress(e) {
        if (this.gameState.gameOver || this.gameState.gameWon || this.localState.isAnimating) return;
        
        const keyActions = {
            'ArrowLeft': () => this.handleChoice(true),
            'a': () => this.handleChoice(true),
            'A': () => this.handleChoice(true),
            'ArrowRight': () => this.handleChoice(false),
            'd': () => this.handleChoice(false),
            'D': () => this.handleChoice(false)
        };
        
        const action = keyActions[e.key];
        if (action) {
            e.preventDefault();
            action();
        }
    }
    
    toggleSound() {
        this.localState.isSoundEnabled = !this.localState.isSoundEnabled;
        SoundSystem.setEnabled(this.localState.isSoundEnabled);
        this.updateSoundIcon();
        
        if (this.localState.isSoundEnabled) {
            SoundSystem.buttonClick();
        }
    }
    
    toggleMobileStats() {
        this.localState.showMobileStats = !this.localState.showMobileStats;
        this.updateMobileStats();
        
        if (this.localState.isSoundEnabled) {
            SoundSystem.buttonClick();
        }
    }
    
    resetGame() {
        this.gameState = {
            stats: { ...GAME_CONFIG.initialStats },
            metrics: { ...GAME_CONFIG.initialMetrics },
            currentDecisionIndex: 0,
            currentTerm: 1,
            difficulty: 1,
            gameOver: false,
            gameWon: false,
            totalDecisions: 0,
            temporaryEffects: [],
            lastRandomEvent: null,
            gameStats: {
                totalDecisions: 0,
                randomEventsTriggered: 0,
                completedTerms: 0,
                highestDifficulty: 1,
                criticalDecisions: 0,
                defeatReason: null,
                finalStats: { ...GAME_CONFIG.initialStats },
                finalMetrics: { ...GAME_CONFIG.initialMetrics }
            },
            reputation: {
                allies: 5,
                enemies: -2,
                neutral: 0
            }
        };
        
        this.localState.showEndDialog = false;
        this.localState.cardTransform = '';
        this.localState.swipeIndicator = null;
        this.localState.achievements = [];
        this.localState.processedAchievements = new Set();
        this.localState.streakCount = 0;
        this.localState.isAnimating = false;
        this.localState.showMobileStats = false;
        
        // Очищаем уведомления о достижениях
        if (this.elements.achievementSystem) {
            this.elements.achievementSystem.innerHTML = '';
        }
        
        this.updateUI();
        
        if (this.localState.isSoundEnabled) {
            SoundSystem.buttonClick();
        }
    }
    
    showEndDialog() {
        this.localState.showEndDialog = true;
        this.updateEndDialog();
        
        if (this.localState.isSoundEnabled) {
            this.gameState.gameWon ? SoundSystem.victory() : SoundSystem.defeat();
        }
    }
    
    hideEndDialog() {
        this.localState.showEndDialog = false;
        if (this.elements.gameEndDialog) {
            this.elements.gameEndDialog.classList.add('hidden');
        }
    }
    
    updateUI() {
        this.updateHeader();
        this.updateStats();
        this.updateAdvisorContext();
        this.updateGameCard();
        this.updateCardTransform();
        this.updateRestartButton();
        this.updateEffects();
        this.updateAchievements();
        this.updateOverallBalance();
        this.updateMetrics();
        this.updateReputation();
    }
    
    updateHeader() {
        const termProgress = ((this.gameState.currentDecisionIndex % GAME_CONFIG.decisionsPerTerm) / GAME_CONFIG.decisionsPerTerm) * 100;
        const overallProgress = (this.gameState.currentDecisionIndex / (GAME_CONFIG.maxTerms * GAME_CONFIG.decisionsPerTerm)) * 100;

        this.updateElement(this.elements.termDisplay, `Срок ${this.gameState.currentTerm}/${GAME_CONFIG.maxTerms}`);
        this.updateElement(this.elements.decisionDisplay, `Решение ${this.gameState.currentDecisionIndex + 1}/${GAME_CONFIG.maxTerms * GAME_CONFIG.decisionsPerTerm}`);

        if (this.elements.termProgress) {
            this.elements.termProgress.style.width = `${termProgress}%`;
        }
        if (this.elements.overallProgress) {
            this.elements.overallProgress.style.width = `${overallProgress}%`;
        }
    }
    
    updateOverallBalance() {
        const values = Object.values(this.gameState.stats);
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        const isBalanced = values.every(v => v >= 25 && v <= 75);
        const isStable = Math.max(...values) - Math.min(...values) < 40;
        
        let status, color, indicatorColor;
        
        if (isBalanced && isStable) {
            status = 'СТАБИЛЬНОСТЬ';
            color = 'text-green-400';
            indicatorColor = 'bg-green-500 animate-pulse';
        } else if (isStable) {
            status = 'УМЕРЕННОСТЬ';
            color = 'text-yellow-400';
            indicatorColor = 'bg-yellow-500';
        } else {
            status = 'НЕСТАБИЛЬНОСТЬ';
            color = 'text-red-400';
            indicatorColor = 'bg-red-500 animate-pulse';
        }
        
        this.updateElement(this.elements.overallBalanceDisplay, status);
        if (this.elements.overallBalanceDisplay) {
            this.elements.overallBalanceDisplay.className = `text-sm ${color} font-mono font-semibold uppercase tracking-wide`;
        }
        if (this.elements.balanceIndicator) {
            this.elements.balanceIndicator.className = `w-2 h-2 rounded-full ${indicatorColor}`;
        }
    }
    
    updateStats() {
        if (!this.elements.statsGrid) return;
        
        this.elements.statsGrid.innerHTML = '';
        Object.entries(this.gameState.stats).forEach(([key, value]) => {
            const statItem = this.createStatItem(key, value, STAT_LABELS[key]);
            this.elements.statsGrid.appendChild(statItem);
        });
    }
    
    updateMetrics() {
        // Коррупция
        if (this.elements.corruptionValue) {
            this.updateElement(this.elements.corruptionValue, `${this.gameState.metrics.corruption}%`);
            this.elements.corruptionValue.className = `text-lg font-mono font-bold ${
                this.gameState.metrics.corruption > 70 ? 'text-red-400' : 
                this.gameState.metrics.corruption > 40 ? 'text-orange-400' : 'text-green-400'
            }`;
        }
        if (this.elements.corruptionBar) {
            this.elements.corruptionBar.style.width = `${this.gameState.metrics.corruption}%`;
        }
        
        // Популярность
        if (this.elements.satisfactionValue) {
            this.updateElement(this.elements.satisfactionValue, `${this.gameState.metrics.satisfaction}%`);
            this.elements.satisfactionValue.className = `text-lg font-mono font-bold ${
                this.gameState.metrics.satisfaction > 70 ? 'text-green-400' : 
                this.gameState.metrics.satisfaction > 40 ? 'text-yellow-400' : 'text-red-400'
            }`;
        }
        if (this.elements.satisfactionBar) {
            this.elements.satisfactionBar.style.width = `${this.gameState.metrics.satisfaction}%`;
        }
    }
    
    updateReputation() {
        this.updateElement(this.elements.alliesRep, `+${this.gameState.reputation.allies}`);
        this.updateElement(this.elements.enemiesRep, this.gameState.reputation.enemies);
        this.updateElement(this.elements.neutralRep, this.gameState.reputation.neutral);
    }
    
    updateEffects() {
        if (!this.elements.effectBadges) return;
        
        if (this.gameState.temporaryEffects.length === 0) {
            this.elements.effectBadges.innerHTML = '<div class="text-xs text-muted-foreground">Нет активных эффектов</div>';
            return;
        }
        
        this.elements.effectBadges.innerHTML = '';
        this.gameState.temporaryEffects.forEach(effect => {
            const badge = this.createEffectBadge(effect);
            this.elements.effectBadges.appendChild(badge);
        });
    }
    
    createEffectBadge(effect) {
        const hasPositiveEffects = Object.values(effect.effects).some(val => val > 0);
        const hasNegativeEffects = Object.values(effect.effects).some(val => val < 0);
        
        let typeClass = '';
        let icon = '🔄';
        
        if (hasPositiveEffects && !hasNegativeEffects) {
            typeClass = 'text-green-400 bg-green-500/10 border-green-500/30';
            icon = '⬆️';
        } else if (hasNegativeEffects && !hasPositiveEffects) {
            typeClass = 'text-red-400 bg-red-500/10 border-red-500/30';
            icon = '⬇️';
        } else {
            typeClass = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
        }
        
        const badge = document.createElement('div');
        badge.className = `flex items-center gap-2 p-2 rounded-lg border ${typeClass} hover:scale-105 transition-all duration-200`;
        badge.innerHTML = `
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${typeClass}">
                ${icon}
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-xs font-mono font-semibold break-words">${effect.description}</div>
                <div class="text-xs text-muted-foreground">Осталось: ${effect.duration} ходов</div>
            </div>
        `;
        
        return badge;
    }
    
    updateAchievements() {
        if (!this.elements.achievementBadges) return;
        
        if (this.localState.achievements.length === 0) {
            this.elements.achievementBadges.innerHTML = '<div class="text-xs text-muted-foreground">Достижения появятся здесь</div>';
            return;
        }
        
        this.elements.achievementBadges.innerHTML = '';
        this.localState.achievements.slice(-5).forEach(achievement => {
            const badge = this.createAchievementBadge(achievement);
            this.elements.achievementBadges.appendChild(badge);
        });
    }
    
    createAchievementBadge(achievement) {
        const style = this.getRarityStyle(achievement.rarity);
        
        const badge = document.createElement('div');
        badge.className = `flex items-center gap-2 p-2 rounded-lg border ${style.border} ${style.bg} hover:scale-105 transition-all duration-200`;
        badge.innerHTML = `
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${style.border} ${style.text}">
                ${achievement.icon}
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-xs font-mono font-semibold ${style.text} break-words">${achievement.name}</div>
                <div class="text-xs text-muted-foreground break-words">${achievement.description}</div>
            </div>
        `;
        
        return badge;
    }
    
    createStatItem(statKey, value, label) {
        const colors = this.getStatColors(statKey);
        const item = document.createElement('div');
        item.className = 'bg-gradient-to-br border border-opacity-30 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-all duration-300';
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
            if (val <= 20) return 'animate-pulse';
            if (val >= 80) return 'animate-pulse';
            return '';
        };

        item.innerHTML = `
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(circle at center, ${colors.bg}, transparent 70%)"></div>
            <div class="relative z-10">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6" style="color: ${colors.primary}">
                            ${this.getStatIcon(statKey)}
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
    
    getStatColors(statKey) {
        const colors = {
            military: {
                primary: 'rgb(239, 68, 68)',
                light: 'rgb(248, 113, 113)',
                bg: 'rgb(239, 68, 68, 0.1)',
                border: 'rgb(239, 68, 68, 0.2)',
                gradient: 'rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05), rgba(185, 28, 28, 0.1)'
            },
            society: {
                primary: 'rgb(236, 72, 153)',
                light: 'rgb(244, 114, 182)',
                bg: 'rgb(236, 72, 153, 0.1)',
                border: 'rgb(236, 72, 153, 0.2)',
                gradient: 'rgba(236, 72, 153, 0.1), rgba(244, 114, 182, 0.05), rgba(190, 24, 93, 0.1)'
            },
            ecology: {
                primary: 'rgb(34, 197, 94)',
                light: 'rgb(74, 222, 128)',
                bg: 'rgb(34, 197, 94, 0.1)',
                border: 'rgb(34, 197, 94, 0.2)',
                gradient: 'rgba(34, 197, 94, 0.1), rgba(74, 222, 128, 0.05), rgba(21, 128, 61, 0.1)'
            },
            economy: {
                primary: 'rgb(245, 158, 11)',
                light: 'rgb(251, 191, 36)',
                bg: 'rgb(245, 158, 11, 0.1)',
                border: 'rgb(245, 158, 11, 0.2)',
                gradient: 'rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05), rgba(180, 83, 9, 0.1)'
            },
            science: {
                primary: 'rgb(168, 85, 247)',
                light: 'rgb(196, 181, 253)',
                bg: 'rgb(168, 85, 247, 0.1)',
                border: 'rgb(168, 85, 247, 0.2)',
                gradient: 'rgba(168, 85, 247, 0.1), rgba(196, 181, 253, 0.05), rgba(124, 58, 237, 0.1)'
            },
            diplomacy: {
                primary: 'rgb(6, 182, 212)',
                light: 'rgb(34, 211, 238)',
                bg: 'rgb(6, 182, 212, 0.1)',
                border: 'rgb(6, 182, 212, 0.2)',
                gradient: 'rgba(6, 182, 212, 0.1), rgba(34, 211, 238, 0.05), rgba(8, 145, 178, 0.1)'
            }
        };
        return colors[statKey] || colors.military;
    }
    
    getStatIcon(statKey) {
        const icons = {
            military: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.5 8.5L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L8.5 8.5L12 2Z"/></svg>',
            society: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4Z" opacity="0.8"/><path d="M8 6C9.66 6 11 7.34 11 9C11 10.66 9.66 12 8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6Z" opacity="0.6"/><path d="M8 13C5.24 13 3 15.24 3 18V21H13V18C13 15.24 10.76 13 8 13Z"/><path d="M16 13C13.24 13 11 15.24 11 18V21H21V18C21 15.24 18.76 13 16 13Z" opacity="0.7"/></svg>',
            ecology: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 12C8 8.69 10.69 6 14 6C14.34 6 14.67 6.04 15 6.11C13.78 4.88 12.11 4.27 10.39 4.41C8.67 4.55 7.13 5.42 6.13 6.8C5.13 8.18 4.77 9.93 5.13 11.6C5.49 13.27 6.53 14.71 8 15.58V12Z"/></svg>',
            economy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2V22M17 5H9.5C8.57 5 7.78 5.79 7.78 6.72C7.78 7.65 8.57 8.44 9.5 8.44H14.5C15.43 8.44 16.22 9.23 16.22 10.16C16.22 11.09 15.43 11.88 14.5 11.88H7"/></svg>',
            science: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3H15V8L20 18H4L9 8V3Z"/><circle cx="12" cy="15" r="2" fill="currentColor"/></svg>',
            diplomacy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 12L16 12M12 8L12 16"/></svg>'
        };
        return icons[statKey] || icons.military;
    }
    
    updateAdvisorContext() {
        const decision = this.getCurrentDecision();
        const advisor = ADVISOR_BACKSTORIES[decision.advisor];

        if (this.elements.advisorAvatar && advisor) {
            this.elements.advisorAvatar.textContent = this.getAdvisorEmoji(decision.advisor);
        }

        this.updateElement(this.elements.advisorName, advisor?.name || '');
        this.updateElement(this.elements.advisorQuote, `"${advisor?.catchPhrase || ''}"`);
    }
    
    getAdvisorEmoji(advisor) {
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
    
    updateGameCard() {
        const decision = this.getCurrentDecision();
        const advisor = ADVISOR_BACKSTORIES[decision.advisor];

        if (this.elements.cardAdvisorAvatar && advisor) {
            this.elements.cardAdvisorAvatar.textContent = this.getAdvisorEmoji(decision.advisor);
        }

        this.updateElement(this.elements.cardAdvisorName, advisor?.name || '');
        this.updateElement(this.elements.cardTitle, decision.title);
        this.updateElement(this.elements.cardDescription, decision.description);

        if (decision.consequences) {
            this.elements.cardConsequences?.classList.remove('hidden');
            this.updateElement(this.elements.consequencesText, decision.consequences);
        } else {
            this.elements.cardConsequences?.classList.add('hidden');
        }

        this.updateUrgencyBadge(decision.urgency);
        this.updateChoiceButtons(decision);
    }
    
    updateUrgencyBadge(urgency) {
        if (!this.elements.urgencyBadge) return;

        const urgencyData = this.getUrgencyData(urgency);
        this.elements.urgencyBadge.className = `px-2 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-1 ${urgencyData.colorClass}`;
        this.elements.urgencyBadge.innerHTML = `
            <span>${urgencyData.icon}</span>
            <span>${urgencyData.text}</span>
        `;
    }
    
    getUrgencyData(urgency) {
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
    
    updateChoiceButtons(decision) {
        this.updateElement(this.elements.leftChoiceText, decision.leftChoice.text);
        this.updateElement(this.elements.rightChoiceText, decision.rightChoice.text);
        
        // Иконки эффектов вместо текста
        if (this.elements.leftChoiceEffects) {
            this.elements.leftChoiceEffects.innerHTML = this.formatEffectsAsIcons(decision.leftChoice.effects);
        }
        if (this.elements.rightChoiceEffects) {
            this.elements.rightChoiceEffects.innerHTML = this.formatEffectsAsIcons(decision.rightChoice.effects);
        }
    }
    
    // НОВАЯ ФУНКЦИЯ: форматирование эффектов как иконки
    formatEffectsAsIcons(effects) {
        const statIcons = {
            military: '⚔️',
            society: '👥', 
            ecology: '🌱',
            economy: '💰',
            science: '🚀',
            diplomacy: '🤝'
        };
        
        const effectEntries = Object.entries(effects).filter(([_, value]) => value !== 0);
        
        if (effectEntries.length === 0) {
            return '<span class="text-xs text-white/70">➖</span>';
        }
        
        return effectEntries.slice(0, 4).map(([stat, value]) => {
            const icon = statIcons[stat] || '📊';
            const color = value > 0 ? 'text-green-300' : 'text-red-300';
            const arrow = value > 0 ? '↗' : '↘';
            return `<span class="${color} text-sm" title="${STAT_LABELS[stat]}: ${value > 0 ? '+' : ''}${value}%">${icon}${arrow}</span>`;
        }).join(' ');
    }
    
    updateCardTransform() {
        if (this.elements.gameCard) {
            this.elements.gameCard.style.transform = this.localState.cardTransform;
            
            if (this.elements.swipeIndicator && this.elements.swipeArrow) {
                if (this.localState.swipeIndicator) {
                    const direction = this.localState.swipeIndicator;
                    this.elements.swipeIndicator.className = `absolute inset-0 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 ${direction === 'left' ? 'bg-red-500/20 border-red-500/50' : 'bg-green-500/20 border-green-500/50'}`;
                    this.elements.swipeArrow.textContent = direction === 'left' ? '←' : '→';
                    this.elements.swipeIndicator.classList.remove('hidden');
                } else {
                    this.elements.swipeIndicator.classList.add('hidden');
                }
            }
        }
    }
    
    updateMobileStats() {
        if (this.elements.mobileStatsArrow) {
            this.elements.mobileStatsArrow.style.transform = this.localState.showMobileStats ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        
        if (this.elements.mobileStatsContent) {
            if (this.localState.showMobileStats) {
                this.elements.mobileStatsContent.classList.remove('hidden');
                this.elements.mobileStatsContent.innerHTML = this.createMobileStatsContent();
            } else {
                this.elements.mobileStatsContent.classList.add('hidden');
            }
        }
    }
    
    createMobileStatsContent() {
        let html = '<div class="grid grid-cols-2 gap-3 mb-4">';
        Object.entries(this.gameState.stats).forEach(([key, value]) => {
            const colors = this.getStatColors(key);
            html += `
                <div class="text-center p-3 border rounded-lg transition-colors" style="color: ${colors.light}; border-color: ${colors.border}; background: ${colors.bg}">
                    <div class="text-xs font-mono font-bold mb-1">${STAT_LABELS[key]}</div>
                    <div class="text-lg font-bold">${value}%</div>
                </div>
            `;
        });
        html += '</div>';
        
        // Метрики
        html += `
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/20">
                    <span class="text-muted-foreground text-xs mb-1">Коррупция:</span>
                    <span class="font-bold text-base ${this.gameState.metrics.corruption > 70 ? 'text-red-400' : this.gameState.metrics.corruption > 40 ? 'text-yellow-400' : 'text-green-400'}">
                        ${this.gameState.metrics.corruption}%
                    </span>
                </div>
                <div class="flex flex-col p-3 bg-secondary/30 rounded-lg border border-border/20">
                    <span class="text-muted-foreground text-xs mb-1">Популярность:</span>
                    <span class="font-bold text-base ${this.gameState.metrics.satisfaction > 70 ? 'text-green-400' : this.gameState.metrics.satisfaction > 40 ? 'text-yellow-400' : 'text-red-400'}">
                        ${this.gameState.metrics.satisfaction}%
                    </span>
                </div>
            </div>
        `;
        
        return html;
    }
    
    updateRestartButton() {
        if (this.elements.restartBtn) {
            const shouldShow = this.gameState.gameOver || this.gameState.gameWon;
            this.elements.restartBtn.classList.toggle('hidden', !shouldShow);
        }
    }
    
    updateSoundIcon() {
        if (this.elements.soundToggle) {
            const icon = this.elements.soundToggle.querySelector('svg');
            if (icon) {
                icon.innerHTML = this.localState.isSoundEnabled
                    ? '<path d="M11 5L6 8H2V12H6L11 15V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46C16.4776 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4776 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                    : '<path d="M11 5L6 8H2V12H6L11 15V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 9L19 13M19 9L15 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            }
            this.elements.soundToggle.title = this.localState.isSoundEnabled ? 'Отключить звук' : 'Включить звук';
        }
    }
    
    // ОБНОВЛЕННАЯ ФУНКЦИЯ: диалог окончания с анализом правления
    updateEndDialog() {
        if (!this.elements.gameEndDialog) return;

        if (this.localState.showEndDialog) {
            // Анализ игрока и генерация концовки
            const profile = this.analyzePlayerProfile(this.gameState.gameStats.finalStats);
            const ending = this.generateEnding(profile, this.gameState.gameStats.finalStats, this.gameState.gameWon);
            
            // Заголовок с анимированной иконкой
            this.updateElement(this.elements.gameEndTitle, ending.title);
            this.updateElement(this.elements.gameEndIcon, ending.icon);
            
            if (this.elements.gameEndTitle) {
                this.elements.gameEndTitle.className = `text-2xl font-bold mb-4 ${ending.color}`;
            }
            
            this.updateElement(this.elements.gameEndMessage, ending.description);
            
            // Цитата
            if (this.elements.gameEndQuote) {
                const quoteElement = this.elements.gameEndQuote.querySelector('p');
                if (quoteElement) {
                    this.updateElement(quoteElement, `"${ending.flavor}"`);
                }
            }
            
            // Анализ правления
            this.updateElement(this.elements.playStyleText, this.getPlayStyleName(profile.playStyle));
            this.updateElement(this.elements.priorityText, STAT_LABELS[profile.dominantStat]);
            this.updateElement(this.elements.alignmentText, this.getAlignmentName(profile.moralAlignment));

            // Финальные статистики
            if (this.elements.finalStats) {
                this.elements.finalStats.innerHTML = '';
                Object.entries(this.gameState.gameStats.finalStats).forEach(([key, value]) => {
                    const colors = this.getStatColors(key);
                    const item = document.createElement('div');
                    item.className = 'text-center p-3 border rounded-lg';
                    item.style.color = colors.light;
                    item.style.borderColor = colors.border;
                    item.style.background = colors.bg;
                    item.innerHTML = `
                        <div class="text-xs font-mono font-bold mb-1">${STAT_LABELS[key]}</div>
                        <div class="text-lg font-bold">${value}%</div>
                    `;
                    this.elements.finalStats.appendChild(item);
                });
            }

            // Компактная статистика игры в стиле React
            this.updateElement(this.elements.completedTermsValue, this.gameState.gameStats.completedTerms || 1);
            this.updateElement(this.elements.totalDecisionsValue, this.gameState.gameStats.totalDecisions || 0);
            this.updateElement(this.elements.randomEventsValue, this.gameState.gameStats.randomEventsTriggered || 0);
            
            // Процент успеха
            const successStats = Object.values(this.gameState.gameStats.finalStats).filter(val => val > 50);
            const successRate = Math.round((successStats.length / Object.keys(this.gameState.gameStats.finalStats).length) * 100);
            this.updateElement(this.elements.successRateValue, `${successRate}%`);

            this.elements.gameEndDialog.classList.remove('hidden');
        } else {
            this.elements.gameEndDialog.classList.add('hidden');
        }
    }
    
    getPlayStyleName(style) {
        const names = {
            'balanced': 'СБАЛАНСИРОВАННЫЙ',
            'extremist': 'ЭКСТРЕМИСТ',
            'cautious': 'ОСТОРОЖНЫЙ',
            'aggressive': 'АГРЕССИВНЫЙ',
            'chaotic': 'ХАОТИЧНЫЙ',
            'technocrat': 'ТЕХНОКРАТ',
            'traditionalist': 'ТРАДИЦИОНАЛИСТ',
            'diplomat': 'ДИПЛОМАТ'
        };
        return names[style] || 'НЕИЗВЕСТНЫЙ';
    }

    getAlignmentName(alignment) {
        const names = {
            'good': 'ДОБРО',
            'evil': 'ЗЛО',
            'neutral': 'НЕЙТРАЛЬ'
        };
        return names[alignment] || 'НЕЙТРАЛЬ';
    }
    
    updateElement(element, text) {
        if (element && typeof text !== 'undefined') {
            element.textContent = text;
        }
    }
}