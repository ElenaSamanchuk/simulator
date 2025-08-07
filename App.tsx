import React, { useEffect } from 'react';
import SwipeGame from './components/SwipeGame';

export default function App() {
  useEffect(() => {
    // Инициализируем с темой из localStorage или темной по умолчанию
    const savedTheme = localStorage.getItem('game-theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  return (
    <div className="size-full">
      <SwipeGame />
    </div>
  );
}