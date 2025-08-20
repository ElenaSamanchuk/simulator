// Система звуков - упрощенная версия для HTML
class SoundSystem {
    static audioContext = null;
    static isEnabled = true;
    
    static async init() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        } catch (error) {
            console.warn('Аудио контекст недоступен:', error);
        }
    }
    
    static async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    static setEnabled(enabled) {
        this.isEnabled = enabled;
    }
    
    static playTone(frequency, duration = 0.1, type = 'sine') {
        if (!this.isEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Ошибка воспроизведения звука:', error);
        }
    }
    
    // Звуки из React версии
    static buttonClick() {
        this.playTone(800, 0.1);
    }
    
    static swipeLeft() {
        this.playTone(400, 0.15);
    }
    
    static swipeRight() {
        this.playTone(600, 0.15);
    }
    
    static cardFlip() {
        this.playTone(500, 0.05);
    }
    
    static achievement() {
        // Мелодия достижения
        setTimeout(() => this.playTone(523, 0.1), 0);
        setTimeout(() => this.playTone(659, 0.1), 100);
        setTimeout(() => this.playTone(784, 0.2), 200);
    }
    
    static notification() {
        this.playTone(700, 0.08);
        setTimeout(() => this.playTone(900, 0.08), 80);
    }
    
    static victory() {
        // Победная мелодия
        setTimeout(() => this.playTone(523, 0.2), 0);
        setTimeout(() => this.playTone(659, 0.2), 200);
        setTimeout(() => this.playTone(784, 0.2), 400);
        setTimeout(() => this.playTone(1047, 0.4), 600);
    }
    
    static defeat() {
        // Мелодия поражения
        setTimeout(() => this.playTone(392, 0.3), 0);
        setTimeout(() => this.playTone(294, 0.3), 300);
        setTimeout(() => this.playTone(220, 0.5), 600);
    }
    
    static randomEvent() {
        // Тревожный звук события
        this.playTone(200, 0.1);
        setTimeout(() => this.playTone(300, 0.1), 100);
        setTimeout(() => this.playTone(200, 0.1), 200);
    }
}

// Инициализируем звуковую систему
SoundSystem.init();

// Экспорт для глобального использования
if (typeof window !== 'undefined') {
    window.SoundSystem = SoundSystem;
}