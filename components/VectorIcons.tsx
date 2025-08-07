import React from 'react';

interface IconProps {
  className?: string;
}

export const StatIcons = {
  military: ({ className = "" }: IconProps) => (
    <svg className={`stat-icon ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15.5 8.5L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L8.5 8.5L12 2Z" fill="currentColor"/>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  
  society: ({ className = "" }: IconProps) => (
    <svg className={`stat-icon ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4Z" fill="currentColor" opacity="0.8"/>
      <path d="M8 6C9.66 6 11 7.34 11 9C11 10.66 9.66 12 8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6Z" fill="currentColor" opacity="0.6"/>
      <path d="M8 13C5.24 13 3 15.24 3 18V21H13V18C13 15.24 10.76 13 8 13Z" fill="currentColor"/>
      <path d="M16 13C13.24 13 11 15.24 11 18V21H21V18C21 15.24 18.76 13 16 13Z" fill="currentColor" opacity="0.7"/>
      <path d="M12 6L14 8L12 10L10 8Z" fill="currentColor"/>
    </svg>
  ),

  ecology: ({ className = "" }: IconProps) => (
    <svg className={`stat-icon ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 12C8 8.69 10.69 6 14 6C14.34 6 14.67 6.04 15 6.11C13.78 4.88 12.11 4.27 10.39 4.41C8.67 4.55 7.13 5.42 6.13 6.8C5.13 8.18 4.77 9.93 5.13 11.6C5.49 13.27 6.53 14.71 8 15.58V12Z" fill="currentColor"/>
      <path d="M16 12C16 15.31 13.31 18 10 18C9.66 18 9.33 17.96 9 17.89C10.22 19.12 11.89 19.73 13.61 19.59C15.33 19.45 16.87 18.58 17.87 17.2C18.87 15.82 19.23 14.07 18.87 12.4C18.51 10.73 17.47 9.29 16 8.42V12Z" fill="currentColor"/>
    </svg>
  ),

  economy: ({ className = "" }: IconProps) => (
    <svg className={`stat-icon ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M12 2V22M17 5H9.5C8.57 5 7.78 5.79 7.78 6.72C7.78 7.65 8.57 8.44 9.5 8.44H14.5C15.43 8.44 16.22 9.23 16.22 10.16C16.22 11.09 15.43 11.88 14.5 11.88H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 21H21M3 10H21M12 3L20 7L12 11L4 7L12 3Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),

  science: ({ className = "" }: IconProps) => (
    <svg className={`stat-icon ${className}`} viewBox="0 0 24 24" fill="none">
      <path d="M9 3H15V8L20 18H4L9 8V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="12" cy="15" r="2" fill="currentColor"/>
      <circle cx="8" cy="16" r="1" fill="currentColor"/>
      <circle cx="16" cy="16" r="1" fill="currentColor"/>
      <path d="M9 3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 2L20 4L18 6M6 2L4 4L6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="6" r="1" fill="currentColor"/>
    </svg>
  ),

  diplomacy: ({ className = "" }: IconProps) => (
    <svg className={`stat-icon ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 12L16 12M12 8L12 16" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
      <path d="M12 3V5M12 19V21M21 12H19M5 12H3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
};

export const AdvisorAvatars = {
  military: ({ className = "" }: IconProps) => (
    <svg className={`advisor-svg w-20 h-20 ${className}`} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="rgb(239 68 68 / 0.15)" stroke="rgb(239 68 68)" strokeWidth="3"/>
      
      {/* Военный шлем */}
      <path d="M16 28C16 20 23 14 32 14C41 14 48 20 48 28V32H16V28Z" fill="rgb(239 68 68 / 0.8)"/>
      <rect x="20" y="26" width="24" height="2" fill="white" opacity="0.8"/>
      
      {/* Звезды на плечах */}
      <path d="M12 36L16 32L20 36L16 40L12 36Z" fill="rgb(239 68 68)"/>
      <path d="M44 36L48 32L52 36L48 40L44 36Z" fill="rgb(239 68 68)"/>
      
      {/* Лицо и глаза */}
      <circle cx="26" cy="30" r="2" fill="white"/>
      <circle cx="38" cy="30" r="2" fill="white"/>
      
      {/* Погоны */}
      <rect x="14" y="38" width="4" height="8" fill="rgb(239 68 68 / 0.6)" rx="1"/>
      <rect x="46" y="38" width="4" height="8" fill="rgb(239 68 68 / 0.6)" rx="1"/>
      
      {/* Рот */}
      <rect x="28" y="38" width="8" height="2" rx="1" fill="rgb(239 68 68 / 0.6)"/>
      
      {/* Военные знаки */}
      <circle cx="15" cy="42" r="1" fill="rgb(255 215 0)"/>
      <circle cx="49" cy="42" r="1" fill="rgb(255 215 0)"/>
    </svg>
  ),

  society: ({ className = "" }: IconProps) => (
    <svg className={`advisor-svg w-20 h-20 ${className}`} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="rgb(236 72 153 / 0.15)" stroke="rgb(236 72 153)" strokeWidth="3"/>
      
      {/* Интеллигентная прическа */}
      <path d="M20 18C20 14 26 10 32 10C38 10 44 14 44 18V24H20V18Z" fill="rgb(236 72 153 / 0.6)"/>
      <path d="M22 20H42" stroke="white" strokeWidth="1" opacity="0.8"/>
      
      {/* Лицо */}
      <circle cx="32" cy="36" r="10" fill="white" opacity="0.9"/>
      
      {/* Умные глаза */}
      <circle cx="28" cy="34" r="1.5" fill="rgb(236 72 153)"/>
      <circle cx="36" cy="34" r="1.5" fill="rgb(236 72 153)"/>
      
      {/* Очки */}
      <circle cx="28" cy="34" r="3" fill="none" stroke="rgb(236 72 153)" strokeWidth="1"/>
      <circle cx="36" cy="34" r="3" fill="none" stroke="rgb(236 72 153)" strokeWidth="1"/>
      <path d="M31 34H33" stroke="rgb(236 72 153)" strokeWidth="1"/>
      
      {/* Мудрая улыбка */}
      <path d="M26 40C28 42 32 42 32 42C32 42 36 42 38 40" stroke="rgb(236 72 153)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* Книга в руках */}
      <rect x="12" y="48" width="8" height="6" fill="rgb(236 72 153 / 0.6)" rx="1"/>
      <path d="M14 50H18M14 52H18" stroke="white" strokeWidth="0.5"/>
      
      {/* Символы общества */}
      <circle cx="48" cy="24" r="2" fill="rgb(236 72 153 / 0.4)"/>
      <circle cx="16" cy="40" r="1.5" fill="rgb(236 72 153 / 0.4)"/>
      <path d="M47 23L49 25L47 27" stroke="white" strokeWidth="0.8"/>
    </svg>
  ),

  ecology: ({ className = "" }: IconProps) => (
    <svg className={`advisor-svg w-20 h-20 ${className}`} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="rgb(34 197 94 / 0.15)" stroke="rgb(34 197 94)" strokeWidth="3"/>
      
      {/* Листья как корона */}
      <path d="M20 20C16 16 20 12 24 16C28 12 32 16 28 20C32 16 36 12 40 16C44 12 48 16 44 20" fill="rgb(34 197 94 / 0.8)"/>
      <path d="M18 24C14 20 18 16 22 20C26 16 30 20 26 24" fill="rgb(34 197 94 / 0.6)"/>
      <path d="M38 24C42 20 46 16 50 20C46 16 42 20 38 24" fill="rgb(34 197 94 / 0.6)"/>
      
      {/* Лицо */}
      <circle cx="32" cy="32" r="12" fill="white" opacity="0.9"/>
      
      {/* Добрые глаза */}
      <circle cx="26" cy="28" r="2.5" fill="rgb(34 197 94)"/>
      <circle cx="38" cy="28" r="2.5" fill="rgb(34 197 94)"/>
      
      {/* Улыбка */}
      <path d="M24 36C28 40 36 40 40 36" stroke="rgb(34 197 94)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      
      {/* Листочки на щеках */}
      <path d="M20 32L24 36L20 40L16 36Z" fill="rgb(34 197 94 / 0.6)"/>
      <path d="M44 32L48 36L44 40L40 36Z" fill="rgb(34 197 94 / 0.6)"/>
      
      {/* Экологический значок */}
      <circle cx="32" cy="48" r="3" fill="rgb(34 197 94 / 0.8)"/>
      <path d="M30 48L32 46L34 48L32 50Z" fill="white"/>
    </svg>
  ),

  economy: ({ className = "" }: IconProps) => (
    <svg className={`advisor-svg w-20 h-20 ${className}`} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="rgb(245 158 11 / 0.15)" stroke="rgb(245 158 11)" strokeWidth="3"/>
      
      {/* Деловой костюм */}
      <path d="M20 16C20 12 28 12 32 12C36 12 44 12 44 16V24H20V16Z" fill="rgb(245 158 11 / 0.6)"/>
      <path d="M22 18H42" stroke="white" strokeWidth="1" opacity="0.8"/>
      
      {/* Лицо */}
      <circle cx="32" cy="34" r="8" fill="white" opacity="0.9"/>
      
      {/* Глаза */}
      <circle cx="28" cy="32" r="1.5" fill="rgb(245 158 11)"/>
      <circle cx="36" cy="32" r="1.5" fill="rgb(245 158 11)"/>
      
      {/* Деловая улыбка */}
      <path d="M28 38H36" stroke="rgb(245 158 11)" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Галстук */}
      <path d="M32 44L30 52L32 54L34 52L32 44Z" fill="rgb(245 158 11 / 0.8)"/>
      <circle cx="32" cy="46" r="1" fill="white"/>
      <circle cx="32" cy="50" r="1" fill="white"/>
      
      {/* Портфель */}
      <rect x="44" y="38" width="6" height="8" fill="rgb(245 158 11 / 0.6)" rx="1"/>
      <circle cx="47" cy="42" r="0.5" fill="white"/>
      
      {/* Графики роста */}
      <path d="M16 40L20 36L24 38L28 32" stroke="rgb(245 158 11)" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M36 32L40 38L44 36L48 40" stroke="rgb(245 158 11)" strokeWidth="2" fill="none" opacity="0.6"/>
    </svg>
  ),

  science: ({ className = "" }: IconProps) => (
    <svg className={`advisor-svg w-20 h-20 ${className}`} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="rgb(168 85 247 / 0.15)" stroke="rgb(168 85 247)" strokeWidth="3"/>
      
      {/* Космический шлем */}
      <circle cx="32" cy="32" r="18" fill="rgb(168 85 247 / 0.1)" stroke="rgb(168 85 247)" strokeWidth="2"/>
      <circle cx="32" cy="32" r="14" fill="white" opacity="0.9"/>
      
      {/* Отражения на шлеме */}
      <path d="M20 24C24 20 28 20 32 24" stroke="rgb(168 85 247)" strokeWidth="1" opacity="0.3"/>
      <circle cx="26" cy="26" r="2" fill="rgb(168 85 247)" opacity="0.2"/>
      
      {/* Глаза ученого */}
      <circle cx="26" cy="32" r="4.5" fill="none" stroke="rgb(168 85 247)" strokeWidth="2"/>
      <circle cx="38" cy="32" r="4.5" fill="none" stroke="rgb(168 85 247)" strokeWidth="2"/>
      <path d="M30.5 32H33.5" stroke="rgb(168 85 247)" strokeWidth="1.5"/>
      
      {/* Глаза за очками */}
      <circle cx="26" cy="32" r="1.5" fill="rgb(168 85 247)"/>
      <circle cx="38" cy="32" r="1.5" fill="rgb(168 85 247)"/>
      
      {/* Рот */}
      <ellipse cx="32" cy="40" rx="3" ry="1.5" fill="rgb(168 85 247 / 0.6)"/>
      
      {/* Космические элементы */}
      <circle cx="12" cy="16" r="1" fill="rgb(168 85 247)" opacity="0.6"/>
      <circle cx="52" cy="20" r="1.5" fill="rgb(168 85 247)" opacity="0.6"/>
      <circle cx="48" cy="48" r="1" fill="rgb(168 85 247)" opacity="0.6"/>
      <path d="M10 14L14 18M50 18L54 22M46 46L50 50" stroke="rgb(168 85 247)" strokeWidth="1" opacity="0.4"/>
      
      {/* Формулы */}
      <text x="12" y="52" fontSize="3" fill="rgb(168 85 247)" opacity="0.5">E=mc²</text>
      <text x="44" y="12" fontSize="2.5" fill="rgb(168 85 247)" opacity="0.5">∞</text>
    </svg>
  ),

  diplomacy: ({ className = "" }: IconProps) => (
    <svg className={`advisor-svg w-20 h-20 ${className}`} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="rgb(6 182 212 / 0.15)" stroke="rgb(6 182 212)" strokeWidth="3"/>
      
      {/* Дипломатическая шапка */}
      <ellipse cx="32" cy="18" rx="14" ry="6" fill="rgb(6 182 212 / 0.8)"/>
      <path d="M18 18V24C18 26 26 28 32 28C38 28 46 26 46 24V18" fill="rgb(6 182 212 / 0.6)"/>
      
      {/* Перо на шляпе */}
      <path d="M32 12L34 8L32 6L30 8L32 12Z" fill="rgb(255 215 0)"/>
      
      {/* Лицо */}
      <circle cx="32" cy="36" r="10" fill="white" opacity="0.9"/>
      
      {/* Мудрые глаза */}
      <circle cx="28" cy="34" r="1.5" fill="rgb(6 182 212)"/>
      <circle cx="36" cy="34" r="1.5" fill="rgb(6 182 212)"/>
      
      {/* Дипломатическая улыбка */}
      <path d="M26 40C28 42 32 42 32 42C32 42 36 42 38 40" stroke="rgb(6 182 212)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* Свиток в руках */}
      <rect x="12" y="46" width="10" height="6" fill="rgb(6 182 212 / 0.6)" rx="1"/>
      <path d="M14 48H20M14 50H20" stroke="white" strokeWidth="0.5"/>
      
      {/* Печать */}
      <circle cx="44" cy="48" r="3" fill="rgb(6 182 212 / 0.6)"/>
      <path d="M42 48L44 46L46 48L44 50Z" fill="white"/>
      
      {/* Международные символы */}
      <circle cx="16" cy="24" r="2" fill="rgb(6 182 212 / 0.4)"/>
      <circle cx="48" cy="24" r="2" fill="rgb(6 182 212 / 0.4)"/>
      <path d="M15 23L17 25L15 27" stroke="white" strokeWidth="0.8"/>
      <path d="M47 23L49 25L47 27" stroke="white" strokeWidth="0.8"/>
    </svg>
  )
};

export const ControlIcons = {
  theme: ({ isDark = true }: { isDark?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {isDark ? (
        <path d="M10 3V5M10 15V17M17 10H15M5 10H3M15.36 4.64L14.07 5.93M5.93 14.07L4.64 15.36M15.36 15.36L14.07 14.07M5.93 5.93L4.64 4.64" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      ) : (
        <path d="M10 3A7 7 0 0 1 17 10A7 7 0 0 1 10 17A7 7 0 1 0 10 3Z" 
              fill="currentColor"/>
      )}
    </svg>
  ),

  sound: ({ isMuted = false }: { isMuted?: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11 5L6 8H2V12H6L11 15V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {!isMuted && (
        <path d="M15.54 8.46C16.4776 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4776 14.5924 15.54 15.53" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )}
      {isMuted && (
        <path d="M15 9L19 13M19 9L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </svg>
  ),

  restart: ({ className = "" }: IconProps) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 3V7L14 3H10Z" fill="currentColor"/>
      <path d="M10 3C6.134 3 3 6.134 3 10C3 13.866 6.134 17 10 17C13.866 17 17 13.866 17 10C17 8.915 16.74 7.894 16.28 7" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  swipeLeft: ({ className = "" }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  swipeRight: ({ className = "" }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  close: ({ className = "" }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};