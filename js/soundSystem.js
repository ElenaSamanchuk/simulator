// Sound System for Game
class SoundSystem {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.sounds = {};
        this.musicGain = null;
        this.sfxGain = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes for music and SFX
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            
            this.musicGain.connect(this.audioContext.destination);
            this.sfxGain.connect(this.audioContext.destination);
            
            // Set initial volumes
            this.musicGain.gain.value = 0.3;
            this.sfxGain.gain.value = 0.5;
            
            // Generate sounds
            this.generateSounds();
            
        } catch (error) {
            console.warn('Audio not supported:', error);
            this.enabled = false;
        }
    }
    
    generateSounds() {
        // Generate synthesized sounds for the game
        this.sounds = {
            swipeLeft: this.createSwipeSound(440, 0.1),
            swipeRight: this.createSwipeSound(523, 0.1),
            cardFlip: this.createCardFlipSound(),
            buttonClick: this.createClickSound(),
            notification: this.createNotificationSound(),
            achievement: this.createAchievementSound(),
            randomEvent: this.createRandomEventSound(),
            victory: this.createVictorySound(),
            defeat: this.createDefeatSound()
        };
    }
    
    createSwipeSound(frequency, duration) {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(this.sfxGain);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.audioContext.currentTime + duration);
            
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createCardFlipSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(this.sfxGain);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'triangle';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }
    
    createClickSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(this.sfxGain);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            
            gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
            
            oscillator.type = 'square';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        };
    }
    
    createNotificationSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            // Create a pleasant notification sound
            const playNote = (freq, start, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                oscillator.connect(gain);
                gain.connect(this.sfxGain);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + start);
                gain.gain.setValueAtTime(0.2, this.audioContext.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + start + duration);
                
                oscillator.type = 'sine';
                oscillator.start(this.audioContext.currentTime + start);
                oscillator.stop(this.audioContext.currentTime + start + duration);
            };
            
            playNote(523, 0, 0.1);     // C5
            playNote(659, 0.1, 0.1);   // E5
            playNote(784, 0.2, 0.15);  // G5
        };
    }
    
    createAchievementSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            // Create a triumphant achievement sound
            const playNote = (freq, start, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                oscillator.connect(gain);
                gain.connect(this.sfxGain);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + start);
                gain.gain.setValueAtTime(0.25, this.audioContext.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + start + duration);
                
                oscillator.type = 'triangle';
                oscillator.start(this.audioContext.currentTime + start);
                oscillator.stop(this.audioContext.currentTime + start + duration);
            };
            
            playNote(523, 0, 0.15);     // C5
            playNote(659, 0.15, 0.15);  // E5
            playNote(784, 0.3, 0.15);   // G5
            playNote(1047, 0.45, 0.3);  // C6
        };
    }
    
    createRandomEventSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            // Create an alert/warning sound
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(this.sfxGain);
            
            oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.2);
            
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gain.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
            
            oscillator.type = 'sawtooth';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.4);
        };
    }
    
    createVictorySound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            // Create a victory fanfare
            const playNote = (freq, start, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                oscillator.connect(gain);
                gain.connect(this.sfxGain);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + start);
                gain.gain.setValueAtTime(0.3, this.audioContext.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + start + duration);
                
                oscillator.type = 'triangle';
                oscillator.start(this.audioContext.currentTime + start);
                oscillator.stop(this.audioContext.currentTime + start + duration);
            };
            
            playNote(523, 0, 0.2);     // C5
            playNote(659, 0.2, 0.2);   // E5
            playNote(784, 0.4, 0.2);   // G5
            playNote(1047, 0.6, 0.4);  // C6
            playNote(784, 1.0, 0.2);   // G5
            playNote(1047, 1.2, 0.6);  // C6
        };
    }
    
    createDefeatSound() {
        return () => {
            if (!this.enabled || !this.audioContext) return;
            
            // Create a sad defeat sound
            const playNote = (freq, start, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                oscillator.connect(gain);
                gain.connect(this.sfxGain);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + start);
                gain.gain.setValueAtTime(0.25, this.audioContext.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + start + duration);
                
                oscillator.type = 'sine';
                oscillator.start(this.audioContext.currentTime + start);
                oscillator.stop(this.audioContext.currentTime + start + duration);
            };
            
            playNote(523, 0, 0.3);     // C5
            playNote(466, 0.3, 0.3);   // Bb4
            playNote(415, 0.6, 0.3);   // Ab4
            playNote(349, 0.9, 0.6);   // F4
        };
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled && this.audioContext) {
            // Stop all current sounds
            try {
                this.audioContext.suspend();
            } catch (error) {
                console.warn('Could not suspend audio context:', error);
            }
        } else if (enabled && this.audioContext && this.audioContext.state === 'suspended') {
            try {
                this.audioContext.resume();
            } catch (error) {
                console.warn('Could not resume audio context:', error);
            }
        }
    }
    
    playSwipe(isLeft) {
        if (isLeft) {
            this.sounds.swipeLeft?.();
        } else {
            this.sounds.swipeRight?.();
        }
    }
    
    playCardFlip() {
        this.sounds.cardFlip?.();
    }
    
    playButtonClick() {
        this.sounds.buttonClick?.();
    }
    
    playNotification() {
        this.sounds.notification?.();
    }
    
    playAchievement() {
        this.sounds.achievement?.();
    }
    
    playRandomEvent() {
        this.sounds.randomEvent?.();
    }
    
    playGameEnd(isVictory) {
        if (isVictory) {
            this.sounds.victory?.();
        } else {
            this.sounds.defeat?.();
        }
    }
}