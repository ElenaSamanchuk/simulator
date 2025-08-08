import { useCallback, useRef, useState } from 'react';

export interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  dragStarted: boolean;
}

export interface DragCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onDragStart?: (point: { x: number; y: number }) => void;
  onDragMove?: (offset: { x: number; y: number }) => void;
  onDragEnd?: () => void;
}

export function useDragAndDrop(callbacks: DragCallbacks, minSwipeDistance = 80) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    dragStarted: false
  });

  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const dragThreshold = useRef(5); // Минимальное движение для начала перетаскивания

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startPos.current = { x: clientX, y: clientY };
    currentPos.current = { x: clientX, y: clientY };
    
    setDragState(prev => ({
      ...prev,
      dragStarted: true
    }));

    callbacks.onDragStart?.({ x: clientX, y: clientY });
  }, [callbacks]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragState.dragStarted) return;

    currentPos.current = { x: clientX, y: clientY };
    
    const offset = {
      x: clientX - startPos.current.x,
      y: clientY - startPos.current.y
    };

    // Начинаем перетаскивание только после преодоления порога
    const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    
    if (!dragState.isDragging && distance > dragThreshold.current) {
      setDragState(prev => ({
        ...prev,
        isDragging: true,
        dragOffset: offset
      }));
    } else if (dragState.isDragging) {
      setDragState(prev => ({
        ...prev,
        dragOffset: offset
      }));
    }

    if (dragState.isDragging) {
      callbacks.onDragMove?.(offset);
    }
  }, [dragState.isDragging, dragState.dragStarted, callbacks]);

  const handleEnd = useCallback(() => {
    if (!dragState.dragStarted) return;

    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;
    
    // Определяем свайп только если было перетаскивание
    if (dragState.isDragging) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > minSwipeDistance && absX > absY && absY < 150) {
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      }
    }

    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      dragStarted: false
    });

    callbacks.onDragEnd?.();
  }, [dragState.isDragging, dragState.dragStarted, minSwipeDistance, callbacks]);

  // Touch события - более осторожный подход
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Не предотвращаем действие по умолчанию сразу
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragState.isDragging) {
      // Предотвращаем скролл только во время активного перетаскивания
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, touch.clientY);
    }
  }, [handleMove, dragState.isDragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Не предотвращаем действие по умолчанию для touchend
    handleEnd();
  }, [handleEnd]);

  // Mouse события
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Предотвращаем выделение текста
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragState.dragStarted) {
      handleMove(e.clientX, e.clientY);
    }
  }, [handleMove, dragState.dragStarted]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    handleEnd();
  }, [handleEnd]);

  const handleMouseLeave = useCallback(() => {
    if (dragState.isDragging || dragState.dragStarted) {
      handleEnd();
    }
  }, [dragState.isDragging, dragState.dragStarted, handleEnd]);

  return {
    dragState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove, 
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      isDragging: dragState.isDragging // Экспортируем для использования в GameCard
    }
  };
}