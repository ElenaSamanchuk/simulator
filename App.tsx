import React, { useEffect } from 'react';
import SwipeGame from './components/SwipeGame';
import './styles/globals.css';

export default function App() {
  // Инициализация темы при запуске
  useEffect(() => {
    const savedTheme = localStorage.getItem('game-theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Устанавливаем базовые мета-теги для PWA
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    const handleResize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-background text-foreground game-container no-select">
      <SwipeGame />
    </div>
  );
}