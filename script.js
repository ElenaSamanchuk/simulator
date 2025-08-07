// Государственный Симулятор 2077 - Улучшенная версия с UX/UI и векторными иконками

class GameState {
    constructor() {
        this.currentDecisionIndex = 0;
        this.stats = {
            army: 50,
            ecology: 50,
            medicine: 50,
            banks: 50,
            science: 50,
            morality: 50,
            economy: 50
        };
        this.swipeOffset = 0;
        this.isAnimating = false;
        this.isDragging = false;
        this.gameOver = false;
        this.gameWon = false;
        this.currentTerm = 1;
        this.difficulty = 1;
        this.completedDecisions = [];
        this.soundEnabled = true;
        this.theme = localStorage.getItem('game-theme') || 'dark';
        this.gameStats = {
            totalDecisions: 0,
            swipesLeft: 0,
            swipesRight: 0,
            maxStats: { ...this.stats },
            minStats: { ...this.stats },
            completedTerms: 0,
            highestDifficulty: 1,
            advisorInteractions: { army: 0, ecology: 0, medicine: 0, banks: 0, science: 0, morality: 0, economy: 0 },
            criticalDecisions: 0,
            balancedDecisions: 0,
            extremeDecisions: 0,
            gameEndType: 'ongoing',
            finalStats: { ...this.stats },
            playStyle: 'balanced'
        };
        this.maxTerms = 5;
        this.decisionsPerTerm = 8;
        this.totalDecisions = this.maxTerms * this.decisionsPerTerm;
        this.touchStart = { x: 0, y: 0 };
        this.decisionStartTime = Date.now();
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('game-theme') || 'dark';
        this.applyTheme(this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('game-theme', this.currentTheme);
        return this.currentTheme;
    }

    applyTheme(theme) {
        const body = document.body;
        body.className = body.className.replace(/\b(light|dark)-theme\b/g, '');
        body.classList.add(`${theme}-theme`);
        body.setAttribute('data-theme', theme);
        
        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            const icon = themeBtn.querySelector('.theme-icon');
            if (icon) {
                if (theme === 'dark') {
                    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
                } else {
                    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
                }
            }
            themeBtn.title = theme === 'dark' ? 'Светлая тема' : 'Темная тема';
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

class DragAndDropManager {
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        this.minSwipeDistance = 80;
        this.maxVerticalDistance = 150;
        
        this.initializeEvents();
    }

    initializeEvents() {
        // Touch события
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Mouse события
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.element.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Предотвращаем стандартное поведение drag
        this.element.addEventListener('dragstart', (e) => e.preventDefault());
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        this.startDrag(touch.clientX, touch.clientY);
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        this.updateDrag(touch.clientX, touch.clientY);
    }

    handleTouchEnd() {
        this.endDrag();
    }

    handleMouseDown(e) {
        this.startDrag(e.clientX, e.clientY);
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.updateDrag(e.clientX, e.clientY);
    }

    handleMouseUp() {
        this.endDrag();
    }

    startDrag(x, y) {
        this.isDragging = true;
        this.startX = x;
        this.startY = y;
        this.currentX = x;
        this.currentY = y;
        
        if (this.callbacks.onStart) {
            this.callbacks.onStart({ x, y });
        }
    }

    updateDrag(x, y) {
        this.currentX = x;
        this.currentY = y;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        
        if (this.callbacks.onMove) {
            this.callbacks.onMove({ deltaX, deltaY, x, y });
        }
    }

    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        
        // Проверяем, является ли это свайпом
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        if (absX > this.minSwipeDistance && absX > absY && absY < this.maxVerticalDistance) {
            if (deltaX > 0) {
                if (this.callbacks.onSwipeRight) {
                    this.callbacks.onSwipeRight();
                }
            } else {
                if (this.callbacks.onSwipeLeft) {
                    this.callbacks.onSwipeLeft();
                }
            }
        }
        
        if (this.callbacks.onEnd) {
            this.callbacks.onEnd({ deltaX, deltaY });
        }
    }
}

class AudioManager {
    constructor() {
        this.context = null;
        this.masterVolume = null;
        this.isEnabled = true;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterVolume = this.context.createGain();
            this.masterVolume.connect(this.context.destination);
            this.masterVolume.gain.value = 0.1;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            this.isEnabled = false;
        }
    }

    async resumeContext() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }

    createTone(frequency, duration, type = 'sine', volume = 0.05) {
        if (!this.context || !this.masterVolume || !this.isEnabled) return;

        this.resumeContext();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterVolume);
        
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    }

    swipeLeft() {
        this.createTone(320, 0.15, 'triangle', 0.03);
    }

    swipeRight() {
        this.createTone(480, 0.15, 'triangle', 0.03);
    }

    cardFlip() {
        this.createTone(600, 0.08, 'sine', 0.02);
    }

    notification() {
        this.createTone(800, 0.2, 'sine', 0.03);
    }

    success() {
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((freq, i) => {
            setTimeout(() => this.createTone(freq, 0.2, 'sine', 0.025), i * 100);
        });
    }

    victory() {
        const melody = [523, 659, 784, 1047]; // C5, E5, G5, C6
        melody.forEach((freq, i) => {
            setTimeout(() => this.createTone(freq, 0.4, 'sine', 0.04), i * 150);
        });
    }

    defeat() {
        const notes = [392, 349, 311, 262]; // G4, F4, Eb4, C4
        notes.forEach((freq, i) => {
            setTimeout(() => this.createTone(freq, 0.5, 'triangle', 0.035), i * 200);
        });
    }

    toggleSound() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }
}

class VectorIcons {
    static getStatIcon(statType) {
        const icons = {
            army: `
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.5 8.5L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L8.5 8.5L12 2Z" fill="currentColor"/>
                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="1"/>
                </svg>
            `,
            ecology: `
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 12C8 8.69 10.69 6 14 6C14.34 6 14.67 6.04 15 6.11C13.78 4.88 12.11 4.27 10.39 4.41C8.67 4.55 7.13 5.42 6.13 6.8C5.13 8.18 4.77 9.93 5.13 11.6C5.49 13.27 6.53 14.71 8 15.58V12Z" fill="currentColor"/>
                    <path d="M16 12C16 15.31 13.31 18 10 18C9.66 18 9.33 17.96 9 17.89C10.22 19.12 11.89 19.73 13.61 19.59C15.33 19.45 16.87 18.58 17.87 17.2C18.87 15.82 19.23 14.07 18.87 12.4C18.51 10.73 17.47 9.29 16 8.42V12Z" fill="currentColor"/>
                </svg>
            `,
            medicine: `
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2"/>
                    <circle cx="7" cy="4" r="1" fill="currentColor"/>
                    <circle cx="12" cy="4" r="1" fill="currentColor"/>
                    <circle cx="17" cy="4" r="1" fill="currentColor"/>
                    <path d="M9 2H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            `,
            banks: `
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21H21M3 10H21M12 3L20 7L12 11L4 7L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 10V17M10 10V17M14 10V17M18 10V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="12" cy="7" r="1" fill="currentColor"/>
                    <path d="M8 7H16" stroke="currentColor" stroke-width="0.5"/>
                </svg>
            `,
            science: `
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M9 3H15V8L20 18H4L9 8V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <circle cx="12" cy="15" r="2" fill="currentColor"/>
                    <circle cx="8" cy="16" r="1" fill="currentColor"/>
                    <circle cx="16" cy="16" r="1" fill="currentColor"/>
                    <path d="M9 3H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6 18L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            morality: `
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    <path d="M8 4L16 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M6 8L18 8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                </svg>
            `,
            economy: `
                <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2V22M17 5H9.5C8.57 5 7.78 5.79 7.78 6.72C7.78 7.65 8.57 8.44 9.5 8.44H14.5C15.43 8.44 16.22 9.23 16.22 10.16C16.22 11.09 15.43 11.88 14.5 11.88H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 12H21" stroke="currentColor" stroke-width="0.5"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                </svg>
            `
        };
        
        return icons[statType] || '';
    }

    static getAdvisorAvatar(advisorType) {
        const avatars = {
            army: `
                <svg class="advisor-svg" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="var(--stat-army)" opacity="0.2"/>
                    <circle cx="16" cy="16" r="14" stroke="var(--stat-army)" stroke-width="2"/>
                    <!-- Шлем -->
                    <path d="M8 14C8 10 11.5 7 16 7C20.5 7 24 10 24 14V16H8V14Z" fill="var(--stat-army)" opacity="0.8"/>
                    <!-- Забрало -->
                    <rect x="10" y="13" width="12" height="1" fill="var(--bg-card)" opacity="0.8"/>
                    <!-- Звезды на плечах -->
                    <path d="M6 18L8 16L10 18L8 20L6 18Z" fill="var(--stat-army)"/>
                    <path d="M22 18L24 16L26 18L24 20L22 18Z" fill="var(--stat-army)"/>
                    <!-- Глаза -->
                    <circle cx="13" cy="15" r="1" fill="var(--bg-card)"/>
                    <circle cx="19" cy="15" r="1" fill="var(--bg-card)"/>
                    <!-- Рот -->
                    <rect x="14" y="19" width="4" height="1" rx="0.5" fill="var(--stat-army)" opacity="0.6"/>
                </svg>
            `,
            ecology: `
                <svg class="advisor-svg" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="var(--stat-ecology)" opacity="0.2"/>
                    <circle cx="16" cy="16" r="14" stroke="var(--stat-ecology)" stroke-width="2"/>
                    <!-- Листья вместо волос -->
                    <path d="M10 10C8 8 10 6 12 8C14 6 16 8 14 10C16 8 18 6 20 8C22 6 24 8 22 10" fill="var(--stat-ecology)" opacity="0.8"/>
                    <!-- Лицо -->
                    <circle cx="16" cy="16" r="8" fill="var(--bg-card)" opacity="0.9"/>
                    <!-- Глаза -->
                    <circle cx="13" cy="14" r="1.5" fill="var(--stat-ecology)"/>
                    <circle cx="19" cy="14" r="1.5" fill="var(--stat-ecology)"/>
                    <!-- Улыбка -->
                    <path d="M12 18C14 20 18 20 20 18" stroke="var(--stat-ecology)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                    <!-- Листочки на щеках -->
                    <path d="M10 16L12 18L10 20L8 18Z" fill="var(--stat-ecology)" opacity="0.6"/>
                    <path d="M22 16L24 18L22 20L20 18Z" fill="var(--stat-ecology)" opacity="0.6"/>
                </svg>
            `,
            medicine: `
                <svg class="advisor-svg" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="var(--stat-medicine)" opacity="0.2"/>
                    <circle cx="16" cy="16" r="14" stroke="var(--stat-medicine)" stroke-width="2"/>
                    <!-- Медицинская шапочка -->
                    <ellipse cx="16" cy="10" rx="8" ry="3" fill="var(--bg-card)" opacity="0.9"/>
                    <path d="M8 10V13C8 14 12 15 16 15C20 15 24 14 24 13V10" fill="var(--bg-card)" opacity="0.8"/>
                    <!-- Крест на шапочке -->
                    <path d="M16 8V12M14 10H18" stroke="var(--stat-medicine)" stroke-width="1.5"/>
                    <!-- Лицо -->
                    <circle cx="16" cy="18" r="6" fill="var(--bg-card)" opacity="0.9"/>
                    <!-- Очки -->
                    <circle cx="13" cy="17" r="2.5" fill="none" stroke="var(--stat-medicine)" stroke-width="1"/>
                    <circle cx="19" cy="17" r="2.5" fill="none" stroke="var(--stat-medicine)" stroke-width="1"/>
                    <path d="M15.5 17H16.5" stroke="var(--stat-medicine)" stroke-width="1"/>
                    <!-- Глаза за очками -->
                    <circle cx="13" cy="17" r="1" fill="var(--stat-medicine)"/>
                    <circle cx="19" cy="17" r="1" fill="var(--stat-medicine)"/>
                    <!-- Рот -->
                    <path d="M14 20H18" stroke="var(--stat-medicine)" stroke-width="1" stroke-linecap="round"/>
                </svg>
            `,
            banks: `
                <svg class="advisor-svg" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="var(--stat-banks)" opacity="0.2"/>
                    <circle cx="16" cy="16" r="14" stroke="var(--stat-banks)" stroke-width="2"/>
                    <!-- Цилиндр -->
                    <ellipse cx="16" cy="8" rx="6" ry="2" fill="var(--stat-banks)" opacity="0.8"/>
                    <rect x="10" y="8" width="12" height="6" fill="var(--stat-banks)" opacity="0.6"/>
                    <ellipse cx="16" cy="14" rx="6" ry="2" fill="var(--stat-banks)" opacity="0.8"/>
                    <!-- Лента на шляпе -->
                    <rect x="10" y="11" width="12" height="1" fill="var(--bg-card)" opacity="0.8"/>
                    <!-- Лицо -->
                    <circle cx="16" cy="20" r="5" fill="var(--bg-card)" opacity="0.9"/>
                    <!-- Глаза -->
                    <circle cx="14" cy="19" r="1" fill="var(--stat-banks)"/>
                    <circle cx="18" cy="19" r="1" fill="var(--stat-banks)"/>
                    <!-- Усы -->
                    <path d="M12 21C14 22 16 21 16 21C16 21 18 22 20 21" stroke="var(--stat-banks)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                    <!-- Монеты вокруг -->
                    <circle cx="8" cy="12" r="1.5" fill="var(--stat-banks)" opacity="0.6"/>
                    <circle cx="24" cy="12" r="1.5" fill="var(--stat-banks)" opacity="0.6"/>
                    <text x="8" y="13" text-anchor="middle" font-size="1" fill="var(--bg-card)">$</text>
                    <text x="24" y="13" text-anchor="middle" font-size="1" fill="var(--bg-card)">$</text>
                </svg>
            `,
            science: `
                <svg class="advisor-svg" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="var(--stat-science)" opacity="0.2"/>
                    <circle cx="16" cy="16" r="14" stroke="var(--stat-science)" stroke-width="2"/>
                    <!-- Безумные волосы -->
                    <path d="M8 8C6 6 8 4 10 6C12 4 14 6 12 8C14 6 16 4 18 6C20 4 22 6 20 8C22 6 24 4 26 6" stroke="var(--stat-science)" stroke-width="2" fill="none"/>
                    <!-- Лицо -->
                    <circle cx="16" cy="17" r="6" fill="var(--bg-card)" opacity="0.9"/>
                    <!-- Очки -->
                    <circle cx="13" cy="16" r="2.5" fill="none" stroke="var(--stat-science)" stroke-width="1.5"/>
                    <circle cx="19" cy="16" r="2.5" fill="none" stroke="var(--stat-science)" stroke-width="1.5"/>
                    <path d="M15.5 16H16.5" stroke="var(--stat-science)" stroke-width="1"/>
                    <!-- Спираль в очках (безумный взгляд) -->
                    <path d="M13 16C12.5 15.5 12.5 16.5 13 16.5C13.5 16.5 13.5 15.5 13 16" fill="none" stroke="var(--stat-science)" stroke-width="0.5"/>
                    <path d="M19 16C18.5 15.5 18.5 16.5 19 16.5C19.5 16.5 19.5 15.5 19 16" fill="none" stroke="var(--stat-science)" stroke-width="0.5"/>
                    <!-- Рот -->
                    <ellipse cx="16" cy="20" rx="2" ry="1" fill="var(--stat-science)" opacity="0.6"/>
                    <!-- Формулы вокруг -->
                    <text x="6" y="20" font-size="2" fill="var(--stat-science)" opacity="0.4">E=mc²</text>
                    <text x="22" y="26" font-size="2" fill="var(--stat-science)" opacity="0.4">∆x∆p≥ℏ/2</text>
                </svg>
            `,
            morality: `
                <svg class="advisor-svg" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="var(--stat-morality)" opacity="0.2"/>
                    <circle cx="16" cy="16" r="14" stroke="var(--stat-morality)" stroke-width="2"/>
                    <!-- Корона/нимб -->
                    <circle cx="16" cy="8" r="6" fill="none" stroke="var(--stat-morality)" stroke-width="1.5" opacity="0.6"/>
                    <path d="M12 8L14 6L16 8L18 6L20 8" stroke="var(--stat-morality)" stroke-width="1.5" fill="none"/>
                    <!-- Лицо -->
                    <circle cx="16" cy="18" r="6" fill="var(--bg-card)" opacity="0.9"/>
                    <!-- Глаза -->
                    <circle cx="14" cy="17" r="1" fill="var(--stat-morality)"/>
                    <circle cx="18" cy="17" r="1" fill="var(--stat-morality)"/>
                    <!-- Мудрая улыбка -->
                    <path d="M13 20C14 21 16 21 16 21C16 21 18 21 19 20" stroke="var(--stat-morality)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                    <!-- Борода -->
                    <path d="M14 22C15 24 16 24 16 24C16 24 17 24 18 22" stroke="var(--stat-morality)" stroke-width="1.5" fill="none"/>
                    <!-- Крестик на груди -->
                    <path d="M16 25V27M15 26H17" stroke="var(--stat-morality)" stroke-width="1"/>
                </svg>
            `,
            economy: `
                <svg class="advisor-svg" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="var(--stat-economy)" opacity="0.2"/>
                    <circle cx="16" cy="16" r="14" stroke="var(--stat-economy)" stroke-width="2"/>
                    <!-- Деловая прическа -->
                    <path d="M10 8C10 6 14 6 16 6C18 6 22 6 22 8V12H10V8Z" fill="var(--stat-economy)" opacity="0.6"/>
                    <!-- Лицо -->
                    <circle cx="16" cy="17" r="5" fill="var(--bg-card)" opacity="0.9"/>
                    <!-- Глаза -->
                    <circle cx="14" cy="16" r="1" fill="var(--stat-economy)"/>
                    <circle cx="18" cy="16" r="1" fill="var(--stat-economy)"/>
                    <!-- Рот -->
                    <path d="M14 19H18" stroke="var(--stat-economy)" stroke-width="1" stroke-linecap="round"/>
                    <!-- Галстук -->
                    <path d="M16 22L15 26L16 27L17 26L16 22Z" fill="var(--stat-economy)" opacity="0.8"/>
                    <!-- Ромбы на галстуке -->
                    <circle cx="16" cy="23" r="0.5" fill="var(--bg-card)"/>
                    <circle cx="16" cy="25" r="0.5" fill="var(--bg-card)"/>
                    <!-- График роста -->
                    <path d="M8 20L10 18L12 19L14 16" stroke="var(--stat-economy)" stroke-width="1" fill="none" opacity="0.6"/>
                    <path d="M18 16L20 19L22 18L24 20" stroke="var(--stat-economy)" stroke-width="1" fill="none" opacity="0.6"/>
                </svg>
            `
        };
        
        return avatars[advisorType] || '';
    }
}

class AchievementManager {
    constructor() {
        this.achievements = [
            {
                id: 'first_decision',
                name: 'ПЕРВЫЙ ШАГ',
                description: 'Примите своё первое решение как правитель.',
                icon: '👑',
                rarity: 'common',
                unlocked: false
            },
            {
                id: 'balanced_ruler',
                name: 'МАСТЕР БАЛАНСА',
                description: 'Завершите срок, сохранив все показатели между 30-70%.',
                icon: '⚖️',
                rarity: 'rare',
                unlocked: false
            },
            {
                id: 'extreme_army',
                name: 'ВОЕННЫЙ ДИКТАТОР',
                description: 'Доведите армию до 90% или выше.',
                icon: '⚔️',
                rarity: 'epic',
                unlocked: false
            },
            {
                id: 'perfectionist',
                name: 'ПЕРФЕКЦИОНИСТ',
                description: 'Завершите игру со всеми показателями выше 60%.',
                icon: '💎',
                rarity: 'legendary',
                unlocked: false
            },
            {
                id: 'master_ruler',
                name: 'ВЕЛИКИЙ ПРАВИТЕЛЬ',
                description: 'Завершите все 5 сроков правления.',
                icon: '👑',
                rarity: 'legendary',
                unlocked: false
            },
            {
                id: 'swipe_master',
                name: 'МАСТЕР СВАЙПОВ',
                description: 'Сделайте 100 свайпов за игру.',
                icon: '👆',
                rarity: 'rare',
                unlocked: false
            }
        ];
    }

    checkAchievements(stats) {
        const newlyUnlocked = [];

        this.achievements.forEach(achievement => {
            if (achievement.unlocked) return;

            let shouldUnlock = false;

            switch (achievement.id) {
                case 'first_decision':
                    shouldUnlock = stats.totalDecisions >= 1;
                    break;
                case 'balanced_ruler':
                    shouldUnlock = Object.values(stats.finalStats).every(value => value >= 30 && value <= 70);
                    break;
                case 'extreme_army':
                    shouldUnlock = stats.maxStats.army >= 90;
                    break;
                case 'perfectionist':
                    shouldUnlock = stats.gameEndType === 'victory' && 
                        Object.values(stats.finalStats).every(value => value >= 60);
                    break;
                case 'master_ruler':
                    shouldUnlock = stats.completedTerms >= 5;
                    break;
                case 'swipe_master':
                    shouldUnlock = (stats.swipesLeft + stats.swipesRight) >= 100;
                    break;
            }

            if (shouldUnlock) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date();
                newlyUnlocked.push(achievement);
            }
        });

        return newlyUnlocked;
    }

    getCompletionRate() {
        const unlockedCount = this.achievements.filter(a => a.unlocked).length;
        return (unlockedCount / this.achievements.length) * 100;
    }
}

class EndingAnalyzer {
    static analyzePlayerProfile(stats) {
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
        if (stats.morality > 75 && stats.science < 40) playStyle = 'traditionalist';
        
        let moralAlignment = 'neutral';
        if (stats.morality > 70 && stats.ecology > 60) moralAlignment = 'good';
        else if (stats.morality < 30 || stats.army > 80) moralAlignment = 'evil';
        
        return {
            dominantStat,
            playStyle,
            moralAlignment
        };
    }
    
    static generateEnding(profile, stats, isVictory) {
        if (!isVictory) {
            return this.getDefeatEnding(stats);
        }
        
        if (profile.playStyle === 'balanced' && profile.moralAlignment === 'good') {
            return {
                type: 'GOLDEN_AGE',
                title: 'ЗОЛОТОЙ ВЕК',
                description: 'Под вашим мудрым правлением началась новая эра процветания. Нация достигла идеального баланса между прогрессом и традициями.',
                flavor: 'История будет помнить вас как величайшего правителя всех времён.',
                icon: '👑',
                color: 'var(--accent-secondary)'
            };
        }
        
        if (profile.playStyle === 'technocrat') {
            return {
                type: 'TECHNOLOGICAL_SINGULARITY',
                title: 'ТЕХНОЛОГИЧЕСКАЯ СИНГУЛЯРНОСТЬ',
                description: 'Вы создали идеальное техно-государство, где ИИ и люди существуют в гармонии.',
                flavor: 'Машины служат человечеству, а человечество эволюционирует вместе с ними.',
                icon: '🤖',
                color: 'var(--stat-science)'
            };
        }
        
        return {
            type: 'STABLE_DEMOCRACY',
            title: 'СТАБИЛЬНАЯ ДЕМОКРАТИЯ',
            description: 'Ваше сбалансированное правление создало устойчивое демократическое государство.',
            flavor: 'Мудрость в балансе - залог долгой жизни нации.',
            icon: '⚖️',
            color: 'var(--accent-primary)'
        };
    }
    
    static getDefeatEnding(stats) {
        const lowestStat = Object.entries(stats).reduce((a, b) => stats[a[0]] < stats[b[0]] ? a : b);
        const [statName] = lowestStat;
        
        const defeatReasons = {
            army: {
                type: 'MILITARY_COLLAPSE',
                title: 'ВОЕННЫЙ КОЛЛАПС',
                description: 'Ослабленная армия не смогла защитить государство от внешних угроз.',
                flavor: 'Мир - это хорошо, но не тогда, когда враги у ворот.',
                icon: '⚔️',
                color: 'var(--accent-danger)'
            },
            ecology: {
                type: 'ECOLOGICAL_DISASTER',
                title: 'ЭКОЛОГИЧЕСКАЯ КАТАСТРОФА',
                description: 'Планета больше не может поддерживать жизнь из-за экологических разрушений.',
                flavor: 'Прогресс без заботы о природе - путь к самоуничтожению.',
                icon: '🌍',
                color: 'var(--stat-ecology)'
            },
            economy: {
                type: 'ECONOMIC_COLLAPSE',
                title: 'ЭКОНОМИЧЕСКИЙ КРАХ',
                description: 'Экономика рухнула, оставив нацию в нищете и хаосе.',
                flavor: 'Деньги не всё, но без них - ничто.',
                icon: '💸',
                color: 'var(--stat-economy)'
            },
            morality: {
                type: 'MORAL_DECAY',
                title: 'МОРАЛЬНОЕ РАЗЛОЖЕНИЕ',
                description: 'Общество разрушилось изнутри из-за полной потери моральных ценностей.',
                flavor: 'Нация без морали - это не нация, а толпа.',
                icon: '💔',
                color: 'var(--stat-morality)'
            }
        };
        
        return defeatReasons[statName] || {
            type: 'GENERAL_COLLAPSE',
            title: 'ВСЕОБЩИЙ КОЛЛАПС',
            description: 'Государство рухнуло под грузом накопившихся проблем.',
            flavor: 'Иногда даже лучшие намерения приводят к худшим результатам.',
            icon: '💀',
            color: 'var(--text-primary)'
        };
    }
}

class Game {
    constructor() {
        this.state = new GameState();
        this.themeManager = new ThemeManager();
        this.audioManager = new AudioManager();
        this.achievementManager = new AchievementManager();
        this.dragManager = null;
        this.decisions = this.createDecisions();
        
        this.initGame();
        this.initEventListeners();
        this.initDragAndDrop();
    }

    createDecisions() {
        return [
            {
                id: 1,
                title: "Вступление в должность",
                description: "Вы только что стали правителем нации в кризисе. Народ ждет от вас первых решений. Генерал Стиль настаивает на укреплении армии для защиты от внешних угроз.",
                advisor: 'army',
                urgency: 'medium',
                leftChoice: {
                    text: "Сократить военные расходы",
                    effects: { army: -15, economy: 10, morality: 5 }
                },
                rightChoice: {
                    text: "Увеличить военный бюджет",
                    effects: { army: 20, economy: -10, morality: -5 }
                },
                consequences: "Первые решения определят ваш имидж как лидера."
            },
            {
                id: 2,
                title: "Экологический кризис на заводах",
                description: "Д-р Грин сообщает о серьезном загрязнении от старых заводов. Бизнес лоббирует за постепенные изменения, экологи требуют немедленных действий.",
                advisor: 'ecology',
                urgency: 'high',
                leftChoice: {
                    text: "Постепенная модернизация",
                    effects: { ecology: 5, economy: 5, banks: 10 }
                },
                rightChoice: {
                    text: "Немедленное закрытие заводов",
                    effects: { ecology: 25, economy: -20, banks: -15 }
                },
                consequences: "Экологические проблемы могут повлиять на здоровье нации."
            },
            {
                id: 3,
                title: "Реформа здравоохранения",
                description: "Д-р Хелм предлагает масштабную реформу медицинской системы. Система устарела, но реформы потребуют огромных инвестиций и времени.",
                advisor: 'medicine',
                urgency: 'medium',
                leftChoice: {
                    text: "Отложить реформы",
                    effects: { medicine: -10, economy: 15, banks: 5 }
                },
                rightChoice: {
                    text: "Начать реформу немедленно",
                    effects: { medicine: 20, economy: -15, science: 5 }
                }
            },
            {
                id: 4,
                title: "Банковская нестабильность",
                description: "Мр. Голд предупреждает о проблемах в банковском секторе. Несколько крупных банков находятся под угрозой банкротства из-за рискованных инвестиций.",
                advisor: 'banks',
                urgency: 'high',
                leftChoice: {
                    text: "Позволить рынку решить",
                    effects: { banks: -20, economy: -10, morality: 10 }
                },
                rightChoice: {
                    text: "Государственное вмешательство",
                    effects: { banks: 15, economy: -5, morality: -5 }
                },
                consequences: "Банковский кризис может привести к экономическому коллапсу."