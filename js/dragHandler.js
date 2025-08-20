// Обработчик перетаскивания и свайпов
class DragHandler {
    constructor(engine, cardElement) {
        this.engine = engine;
        this.cardElement = cardElement;
        this.dragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            initialTransform: ''
        };
        
        this.setupEventListeners();
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        if (!this.cardElement) return;

        // Мышь
        this.cardElement.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        
        // Касания
        this.cardElement.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.cardElement.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.cardElement.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Отключаем контекстное меню на карточке
        this.cardElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Начало перетаскивания мышью
    handleMouseDown(e) {
        if (this.isDisabled()) return;
        
        this.startDrag(e.clientX, e.clientY);
        
        if (this.engine.localState.isSoundEnabled) {
            SoundSystem.cardFlip();
        }
        
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('mouseleave', this.handleMouseUp);
    }

    // Перемещение мыши
    handleMouseMove = (e) => {
        if (!this.dragState.isDragging) return;
        
        this.updateDrag(e.clientX, e.clientY);
    }

    // Окончание перетаскивания мышью
    handleMouseUp = (e) => {
        if (!this.dragState.isDragging) return;
        
        this.endDrag();
        
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('mouseleave', this.handleMouseUp);
    }

    // Начало касания
    handleTouchStart(e) {
        if (this.isDisabled() || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        this.startDrag(touch.clientX, touch.clientY);
        
        if (this.engine.localState.isSoundEnabled) {
            SoundSystem.cardFlip();
        }
    }

    // Перемещение касания
    handleTouchMove(e) {
        if (!this.dragState.isDragging || e.touches.length !== 1) return;
        
        e.preventDefault(); // Предотвращаем скролл
        const touch = e.touches[0];
        this.updateDrag(touch.clientX, touch.clientY);
    }

    // Окончание касания
    handleTouchEnd(e) {
        if (!this.dragState.isDragging) return;
        
        this.endDrag();
    }

    // Начало перетаскивания
    startDrag(x, y) {
        this.dragState.isDragging = true;
        this.dragState.startX = x;
        this.dragState.startY = y;
        this.dragState.currentX = x;
        this.dragState.currentY = y;
        
        // Добавляем класс для курсора
        if (this.cardElement) {
            this.cardElement.style.cursor = 'grabbing';
        }
    }

    // Обновление перетаскивания
    updateDrag(x, y) {
        this.dragState.currentX = x;
        this.dragState.currentY = y;
        
        const offset = {
            x: this.dragState.currentX - this.dragState.startX,
            y: this.dragState.currentY - this.dragState.startY
        };
        
        this.updateDragTransform(offset);
    }

    // Завершение перетаскивания
    endDrag() {
        const offset = {
            x: this.dragState.currentX - this.dragState.startX,
            y: this.dragState.currentY - this.dragState.startY
        };
        
        // Восстанавливаем курсор
        if (this.cardElement) {
            this.cardElement.style.cursor = 'grab';
        }
        
        // Проверяем, достаточно ли далеко потащили
        if (Math.abs(offset.x) > GAME_CONFIG.minSwipeDistance) {
            const isLeftChoice = offset.x < 0;
            this.engine.handleChoice(isLeftChoice);
        } else {
            // Возвращаем карточку в исходное положение
            this.engine.localState.cardTransform = '';
            this.engine.localState.swipeIndicator = null;
            this.engine.updateCardTransform();
        }
        
        this.dragState.isDragging = false;
    }

    // Обновление трансформации во время перетаскивания
    updateDragTransform(offset) {
        const rotation = offset.x * CONSTANTS.CARD_ROTATION_FACTOR;
        const scale = 1 - Math.abs(offset.x) * CONSTANTS.CARD_SCALE_FACTOR;
        
        // Ограничиваем поворот и масштаб
        const clampedRotation = Math.max(-45, Math.min(45, rotation));
        const clampedScale = Math.max(CONSTANTS.MIN_CARD_SCALE, scale);
        
        this.engine.localState.cardTransform = 
            `translateX(${offset.x}px) rotate(${clampedRotation}deg) scale(${clampedScale})`;
        
        // Показываем индикатор свайпа при достижении порога
        if (Math.abs(offset.x) > CONSTANTS.SWIPE_THRESHOLD) {
            this.engine.localState.swipeIndicator = offset.x > 0 ? 'right' : 'left';
        } else {
            this.engine.localState.swipeIndicator = null;
        }
        
        // Обновляем трансформацию карточки
        this.engine.updateCardTransform();
    }

    // Проверка, отключено ли перетаскивание
    isDisabled() {
        return this.engine.gameState.gameOver || 
               this.engine.gameState.gameWon || 
               this.engine.localState.isAnimating;
    }

    // Сброс состояния перетаскивания
    reset() {
        this.dragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            initialTransform: ''
        };
        
        if (this.cardElement) {
            this.cardElement.style.cursor = 'grab';
        }
    }

    // Получение текущего состояния перетаскивания
    getState() {
        return { ...this.dragState };
    }

    // Установка нового элемента карточки (если карточка пересоздается)
    setCardElement(element) {
        this.cardElement = element;
        this.setupEventListeners();
    }
}

// Экспорт для других модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DragHandler;
} else {
    window.DragHandler = DragHandler;
}