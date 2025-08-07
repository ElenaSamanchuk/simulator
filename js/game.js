// Main Game Controller
class Game {
    constructor() {
        this.gameState = new GameState();
        this.soundSystem = new SoundSystem();
        this.ui = new GameUI();
        this.achievements = new AchievementSystem();
        this.randomEvents = new RandomEventGenerator();
        this.internationalRelations = new InternationalRelations();
        
        this.isAnimating = false;
        this.streakCount = 0;
        this.lastChoiceTime = Date.now();
        this.animationKey = 0;
        
        // Touch/drag handling
        this.dragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.updateUI();
        this.soundSystem.setEnabled(true);
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Sound toggle
        document.getElementById('sound-toggle').addEventListener('click', () => {
            this.toggleSound();
        });
        
        // Restart button
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restart();
        });
        
        // Mobile stats toggle
        document.getElementById('mobile-stats-toggle').addEventListener('click', () => {
            this.ui.toggleMobileStats();
        });
        
        // Choice buttons
        document.getElementById('left-choice').addEventListener('click', () => {
            this.makeChoice(true);
        });
        
        document.getElementById('right-choice').addEventListener('click', () => {
            this.makeChoice(false);
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Touch/mouse events for card dragging
        const gameCard = document.getElementById('game-card');
        
        // Mouse events
        gameCard.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', (e) => this.handleDragEnd(e));
        
        // Touch events
        gameCard.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleDragEnd(e));
        
        // Game end dialog
        document.getElementById('close-dialog-button').addEventListener('click', () => {
            this.ui.hideEndDialog();
        });
        
        document.getElementById('restart-dialog-button').addEventListener('click', () => {
            this.restart();
            this.ui.hideEndDialog();
        });
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('game-theme') || 'dark';
        const isDark = savedTheme === 'dark';
        document.body.classList.toggle('dark', isDark);
        this.ui.updateThemeIcon(isDark);
    }
    
    toggleTheme() {
        const isDark = document.body.classList.contains('dark');
        const newTheme = !isDark;
        
        document.body.classList.toggle('dark', newTheme);
        localStorage.setItem('game-theme', newTheme ? 'dark' : 'light');
        this.ui.updateThemeIcon(newTheme);
        
        if (this.soundSystem.enabled) {
            this.soundSystem.playButtonClick();
        }
    }
    
    toggleSound() {
        const enabled = !this.soundSystem.enabled;
        this.soundSystem.setEnabled(enabled);
        this.ui.updateSoundIcon(enabled);
        
        if (enabled) {
            this.soundSystem.playButtonClick();
        }
    }
    
    handleKeyPress(e) {
        if (this.gameState.gameOver || this.gameState.gameWon || this.isAnimating) return;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                this.makeChoice(true);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                this.makeChoice(false);
                break;
            case 'r':
            case 'R':
                if (this.gameState.gameOver || this.gameState.gameWon) {
                    e.preventDefault();
                    this.restart();
                }
                break;
            case 'Escape':
                e.preventDefault();
                if (this.ui.isEndDialogOpen()) {
                    this.ui.hideEndDialog();
                }
                break;
        }
    }
    
    handleDragStart(e) {
        if (this.gameState.gameOver || this.gameState.gameWon || this.isAnimating) return;
        
        e.preventDefault();
        this.dragState.isDragging = true;
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        this.dragState.startX = clientX;
        this.dragState.startY = clientY;
        this.dragState.currentX = clientX;
        this.dragState.currentY = clientY;
        
        if (this.soundSystem.enabled) {
            this.soundSystem.playCardFlip();
        }
    }
    
    handleDragMove(e) {
        if (!this.dragState.isDragging || this.isAnimating) return;
        
        e.preventDefault();
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        
        this.dragState.currentX = clientX;
        
        const offsetX = clientX - this.dragState.startX;
        const rotation = offsetX * 0.03;
        const scale = 1 - Math.abs(offsetX) * 0.0002;
        
        const gameCard = document.getElementById('game-card');
        gameCard.style.transform = `translateX(${offsetX}px) rotate(${rotation}deg) scale(${Math.max(0.9, scale)})`;
        
        // Show swipe indicators
        const threshold = 60;
        const leftIndicator = document.getElementById('swipe-left-indicator');
        const rightIndicator = document.getElementById('swipe-right-indicator');
        
        if (Math.abs(offsetX) > threshold) {
            if (offsetX > 0) {
                rightIndicator.style.opacity = '1';
                leftIndicator.style.opacity = '0';
            } else {
                leftIndicator.style.opacity = '1';
                rightIndicator.style.opacity = '0';
            }
        } else {
            leftIndicator.style.opacity = '0';
            rightIndicator.style.opacity = '0';
        }
    }
    
    handleDragEnd(e) {
        if (!this.dragState.isDragging) return;
        
        this.dragState.isDragging = false;
        
        const offsetX = this.dragState.currentX - this.dragState.startX;
        const threshold = 60;
        
        if (Math.abs(offsetX) > threshold) {
            // Make choice based on swipe direction
            this.makeChoice(offsetX < 0);
        } else {
            // Reset card position
            const gameCard = document.getElementById('game-card');
            gameCard.style.transform = '';
            
            // Hide indicators
            document.getElementById('swipe-left-indicator').style.opacity = '0';
            document.getElementById('swipe-right-indicator').style.opacity = '0';
        }
    }
    
    async makeChoice(isLeftChoice) {
        if (this.gameState.gameOver || this.gameState.gameWon || this.isAnimating) return;
        
        this.isAnimating = true;
        
        try {
            const decision = this.gameState.getCurrentDecision();
            const effects = isLeftChoice ? decision.leftChoice.effects : decision.rightChoice.effects;
            
            // Update streak
            const now = Date.now();
            if (now - this.lastChoiceTime < 2000) {
                this.streakCount++;
            } else {
                this.streakCount = 1;
            }
            this.lastChoiceTime = now;
            
            // Play sound effects
            if (this.soundSystem.enabled) {
                this.soundSystem.playSwipe(isLeftChoice);
                
                if (this.streakCount >= 3) {
                    setTimeout(() => this.soundSystem.playNotification(), 100);
                }
            }
            
            // Animate card
            this.animateCard(isLeftChoice);
            
            // Apply effects and update game state
            this.gameState.applyEffects(effects, isLeftChoice);
            
            // Update international relations
            this.internationalRelations.updateRelationships(effects, this.gameState.currentDecisionIndex);
            
            // Check for random events
            if (this.randomEvents.shouldTriggerEvent(this.gameState.currentDecisionIndex, this.gameState)) {
                const event = this.randomEvents.selectRandomEvent(this.gameState);
                if (event) {
                    const result = this.randomEvents.triggerEvent(event, this.gameState.currentDecisionIndex);
                    this.gameState.addRandomEvent(result.event, result.temporaryEffect);
                    this.ui.showRandomEvent(event.description);
                    
                    if (this.soundSystem.enabled) {
                        this.soundSystem.playRandomEvent();
                    }
                }
            }
            
            // Update active random events
            this.randomEvents.updateActiveEvents();
            
            // Check for diplomatic events
            const diplomaticEvents = this.internationalRelations.checkDiplomaticEvents(this.gameState.currentDecisionIndex);
            diplomaticEvents.forEach(event => {
                this.gameState.addDiplomaticEvent(event);
            });
            
            // Check for achievements
            this.achievements.checkAchievements(this.gameState, this.soundSystem.enabled);
            
            // Reset animation after delay
            setTimeout(() => {
                this.resetCard();
                this.updateUI();
                this.isAnimating = false;
                this.animationKey++;
                
                // Check for game end
                if (this.gameState.gameOver || this.gameState.gameWon) {
                    this.handleGameEnd();
                }
            }, 150);
            
        } catch (error) {
            console.error('Error making choice:', error);
            this.isAnimating = false;
        }
    }
    
    animateCard(isLeftChoice) {
        const gameCard = document.getElementById('game-card');
        const direction = isLeftChoice ? -1 : 1;
        
        gameCard.style.transform = `translateX(${direction * 300}px) rotate(${direction * 15}deg) scale(0.9)`;
        
        // Show appropriate indicator
        const leftIndicator = document.getElementById('swipe-left-indicator');
        const rightIndicator = document.getElementById('swipe-right-indicator');
        
        if (isLeftChoice) {
            leftIndicator.style.opacity = '1';
            rightIndicator.style.opacity = '0';
        } else {
            rightIndicator.style.opacity = '1';
            leftIndicator.style.opacity = '0';
        }
    }
    
    resetCard() {
        const gameCard = document.getElementById('game-card');
        gameCard.style.transform = '';
        
        // Hide indicators
        document.getElementById('swipe-left-indicator').style.opacity = '0';
        document.getElementById('swipe-right-indicator').style.opacity = '0';
    }
    
    handleGameEnd() {
        if (this.soundSystem.enabled) {
            setTimeout(() => {
                this.soundSystem.playGameEnd(this.gameState.gameWon);
            }, 500);
        }
        
        setTimeout(() => {
            this.ui.showEndDialog(this.gameState);
        }, 1500);
    }
    
    restart() {
        this.gameState.reset();
        this.achievements.reset();
        this.randomEvents.reset();
        this.internationalRelations.reset();
        this.streakCount = 0;
        this.lastChoiceTime = Date.now();
        this.isAnimating = false;
        this.animationKey = 0;
        
        this.resetCard();
        this.updateUI();
        
        // Hide restart button and hint
        document.getElementById('restart-button').classList.add('hidden');
        document.getElementById('restart-hint').classList.add('hidden');
        
        if (this.soundSystem.enabled) {
            this.soundSystem.playButtonClick();
        }
    }
    
    updateUI() {
        this.ui.updateHeader(this.gameState);
        this.ui.updateStats(this.gameState);
        this.ui.updateCard(this.gameState);
        this.ui.updateAdvisor(this.gameState);
        this.ui.updateStreak(this.streakCount);
        this.ui.updateEffects(this.gameState, this.achievements.getRecentAchievements());
        this.ui.updateCountries(this.internationalRelations.getTopCountries());
        
        // Show restart button if game is over
        if (this.gameState.gameOver || this.gameState.gameWon) {
            document.getElementById('restart-button').classList.remove('hidden');
            document.getElementById('restart-hint').classList.remove('hidden');
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});