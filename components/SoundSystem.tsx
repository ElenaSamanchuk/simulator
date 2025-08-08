// Звуковая система с использованием Web Audio API для создания синтетических звуков
class GameSoundSystem {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isEnabled: boolean = true;
  private backgroundMusic: OscillatorNode | null = null;
  private musicGainNode: GainNode | null = null;
  private isBackgroundPlaying: boolean = false;
  private musicNodes: AudioNode[] = []; // Для хранения всех активных узлов

  constructor() {
    this.initAudio();
  }

  private async initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // Громкость эффектов

      // Создаем отдельный gain node для фоновой музыки
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.audioContext.destination);
      this.musicGainNode.gain.value = 0.08; // Очень тихая фоновая музыка
    } catch (error) {
      console.warn('Web Audio API не поддерживается:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initAudio();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private async playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.isEnabled) return;
    
    try {
      await this.ensureAudioContext();
      if (!this.audioContext || !this.gainNode) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.gainNode);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      // Envelope для более приятного звука
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Ошибка воспроизведения звука:', error);
    }
  }

  private async playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volume: number = 0.2) {
    if (!this.isEnabled) return;
    
    for (const freq of frequencies) {
      this.playTone(freq, duration, type, volume);
    }
  }

  // Улучшенная фоновая музыка - мелодичная и атмосферная
  async startBackgroundMusic() {
    if (!this.isEnabled || this.isBackgroundPlaying) return;
    
    try {
      await this.ensureAudioContext();
      if (!this.audioContext || !this.musicGainNode) return;

      this.isBackgroundPlaying = true;
      this.playMelodicAmbient();
    } catch (error) {
      console.warn('Ошибка запуска фоновой музыки:', error);
    }
  }

  private async playMelodicAmbient() {
    if (!this.isBackgroundPlaying || !this.audioContext || !this.musicGainNode) return;

    // Создаем гармоничную мелодичную последовательность
    const melodyNotes = [
      { freq: 220, duration: 4 },    // A3
      { freq: 246.94, duration: 3 }, // B3
      { freq: 293.66, duration: 4 }, // D4
      { freq: 329.63, duration: 3 }, // E4
      { freq: 293.66, duration: 2 }, // D4
      { freq: 246.94, duration: 6 }  // B3
    ];

    const baseGain = this.audioContext.createGain();
    baseGain.connect(this.musicGainNode);
    
    // Играем мелодию
    let currentTime = this.audioContext.currentTime;
    
    melodyNotes.forEach((note, index) => {
      if (!this.isBackgroundPlaying) return;
      
      const oscillator = this.audioContext!.createOscillator();
      const noteGain = this.audioContext!.createGain();
      
      oscillator.connect(noteGain);
      noteGain.connect(baseGain);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'triangle'; // Мягкий звук
      
      // Плавное появление и исчезновение каждой ноты
      noteGain.gain.setValueAtTime(0, currentTime);
      noteGain.gain.linearRampToValueAtTime(0.03, currentTime + 0.5);
      noteGain.gain.linearRampToValueAtTime(0.03, currentTime + note.duration - 0.5);
      noteGain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      this.musicNodes.push(oscillator);
      
      currentTime += note.duration;
    });

    // Добавляем тихую гармонию - басовые ноты
    const bassOscillator = this.audioContext.createOscillator();
    const bassGain = this.audioContext.createGain();
    
    bassOscillator.connect(bassGain);
    bassGain.connect(this.musicGainNode);
    
    bassOscillator.frequency.value = 110; // A2
    bassOscillator.type = 'sine';
    
    const totalDuration = melodyNotes.reduce((sum, note) => sum + note.duration, 0);
    
    bassGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    bassGain.gain.linearRampToValueAtTime(0.015, this.audioContext.currentTime + 2);
    bassGain.gain.linearRampToValueAtTime(0.015, this.audioContext.currentTime + totalDuration - 2);
    bassGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + totalDuration);
    
    bassOscillator.start(this.audioContext.currentTime);
    bassOscillator.stop(this.audioContext.currentTime + totalDuration);
    
    this.musicNodes.push(bassOscillator);
    
    // Повторяем через некоторое время
    setTimeout(() => {
      if (this.isBackgroundPlaying) {
        this.playMelodicAmbient();
      }
    }, (totalDuration + 4) * 1000); // Пауза 4 секунды между повторами
  }

  stopBackgroundMusic() {
    this.isBackgroundPlaying = false;
    
    // Останавливаем все активные музыкальные узлы
    this.musicNodes.forEach(node => {
      try {
        if (node instanceof OscillatorNode) {
          node.stop();
        }
      } catch (error) {
        // Узел уже остановлен
      }
    });
    this.musicNodes = [];
  }

  // Игровые звуки
  async swipeLeft() {
    // Отклонение - нисходящий тон
    await this.playTone(400, 0.2, 'square', 0.4);
    setTimeout(() => this.playTone(300, 0.15, 'square', 0.3), 100);
  }

  async swipeRight() {
    // Принятие - восходящий тон
    await this.playTone(500, 0.2, 'triangle', 0.4);
    setTimeout(() => this.playTone(600, 0.15, 'triangle', 0.3), 100);
  }

  async cardFlip() {
    // Быстрый щелчок
    await this.playTone(800, 0.1, 'square', 0.2);
  }

  async notification() {
    // Мелодичное уведомление
    await this.playChord([523, 659, 783], 0.3, 'sine', 0.15); // C-E-G аккорд
  }

  async victory() {
    // Победная фанфара
    const melody = [523, 587, 659, 698, 783]; // C-D-E-F-G
    for (let i = 0; i < melody.length; i++) {
      setTimeout(() => {
        this.playTone(melody[i], 0.3, 'triangle', 0.3);
      }, i * 150);
    }
    
    // Финальный аккорд
    setTimeout(() => {
      this.playChord([523, 659, 783, 1046], 1, 'sine', 0.2);
    }, melody.length * 150);
  }

  async defeat() {
    // Печальная мелодия
    const melody = [400, 350, 300, 250]; // Нисходящая последовательность
    for (let i = 0; i < melody.length; i++) {
      setTimeout(() => {
        this.playTone(melody[i], 0.4, 'sawtooth', 0.25);
      }, i * 200);
    }
  }

  async achievement() {
    // Яркий звон достижения
    await this.playChord([659, 830, 987, 1319], 0.5, 'sine', 0.2); // E-G#-B-E
    setTimeout(() => {
      this.playTone(1319, 0.8, 'triangle', 0.15); // Высокая нота
    }, 200);
  }

  async warning() {
    // Предупреждающий сигнал
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(800, 0.1, 'sawtooth', 0.3);
      }, i * 150);
    }
  }

  async randomEvent() {
    // Драматичный звук для случайных событий
    await this.playTone(200, 0.3, 'sawtooth', 0.4);
    setTimeout(() => this.playTone(300, 0.2, 'triangle', 0.3), 150);
    setTimeout(() => this.playTone(400, 0.2, 'sine', 0.2), 300);
  }

  async buttonClick() {
    // Мягкий клик кнопки
    await this.playTone(1000, 0.05, 'square', 0.15);
  }

  async termComplete() {
    // Завершение срока правления
    const chord1 = [440, 554, 659]; // A-C#-E
    const chord2 = [523, 659, 783]; // C-E-G
    
    await this.playChord(chord1, 0.5, 'triangle', 0.2);
    setTimeout(() => {
      this.playChord(chord2, 0.8, 'sine', 0.25);
    }, 300);
  }

  // Управление звуком - полное отключение всех звуков
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
      
      // Останавливаем все звуки немедленно
      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(0, this.audioContext?.currentTime || 0);
      }
      if (this.musicGainNode) {
        this.musicGainNode.gain.setValueAtTime(0, this.audioContext?.currentTime || 0);
      }
    } else {
      // Восстанавливаем громкость при включении
      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(0.3, this.audioContext?.currentTime || 0);
      }
      if (this.musicGainNode) {
        this.musicGainNode.gain.setValueAtTime(0.08, this.audioContext?.currentTime || 0);
      }
      this.startBackgroundMusic();
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume * 0.3;
    }
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = volume * 0.08;
    }
  }

  // Инициализация звука при взаимодействии пользователя
  async initUserInteraction() {
    await this.ensureAudioContext();
    if (this.isEnabled && !this.isBackgroundPlaying) {
      this.startBackgroundMusic();
    }
  }
}

// Глобальный экземпляр
export const SoundSystem = new GameSoundSystem();

// Автоматический запуск при первом взаимодействии
let hasInitialized = false;
const initOnUserInteraction = () => {
  if (!hasInitialized) {
    hasInitialized = true;
    SoundSystem.initUserInteraction();
    document.removeEventListener('click', initOnUserInteraction);
    document.removeEventListener('keydown', initOnUserInteraction);
    document.removeEventListener('touchstart', initOnUserInteraction);
  }
};

// Слушатели для инициализации
document.addEventListener('click', initOnUserInteraction);
document.addEventListener('keydown', initOnUserInteraction);
document.addEventListener('touchstart', initOnUserInteraction);