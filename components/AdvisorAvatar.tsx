import React from 'react';

interface AdvisorAvatarProps {
  advisor: 'military' | 'society' | 'ecology' | 'economy' | 'science' | 'diplomacy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export function AdvisorAvatar({ advisor, size = 'md', className = '', showGlow = false }: AdvisorAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const glowColors = {
    military: 'shadow-2xl shadow-red-500/60 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]',
    society: 'shadow-2xl shadow-pink-500/60 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]',
    ecology: 'shadow-2xl shadow-green-500/60 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]',
    economy: 'shadow-2xl shadow-amber-500/60 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]',
    science: 'shadow-2xl shadow-purple-500/60 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]',
    diplomacy: 'shadow-2xl shadow-cyan-500/60 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]'
  };

  const AdvisorIcon = ({ advisor }: { advisor: string }) => {
    switch (advisor) {
      case 'military':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* 3D helmet base */}
            <defs>
              <radialGradient id="militaryBase" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgb(248 113 113)" />
                <stop offset="30%" stopColor="rgb(239 68 68)" />
                <stop offset="70%" stopColor="rgb(185 28 28)" />
                <stop offset="100%" stopColor="rgb(127 29 29)" />
              </radialGradient>
              <linearGradient id="militaryMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(156 163 175)" />
                <stop offset="50%" stopColor="rgb(75 85 99)" />
                <stop offset="100%" stopColor="rgb(31 41 55)" />
              </linearGradient>
              <filter id="metallic">
                <feGaussianBlur stdDeviation="0.5"/>
                <feColorMatrix values="1.2 0 0 0 0  0 1.2 0 0 0  0 0 1.2 0 0  0 0 0 1 0"/>
              </filter>
            </defs>
            
            {/* Main helmet structure */}
            <ellipse cx="32" cy="38" rx="18" ry="22" fill="url(#militaryMetal)" opacity="0.9"/>
            <ellipse cx="32" cy="36" rx="16" ry="20" fill="url(#militaryBase)" opacity="0.95"/>
            
            {/* Helmet details and paneling */}
            <path d="M16 32L48 32L46 42L18 42Z" fill="url(#militaryMetal)" opacity="0.8"/>
            <rect x="20" y="34" width="24" height="2" fill="rgb(239 68 68)" opacity="0.9"/>
            <rect x="22" y="37" width="20" height="1" fill="rgb(248 113 113)" opacity="0.7"/>
            
            {/* Cybernetic eye - more detailed */}
            <circle cx="26" cy="30" r="4" fill="rgb(31 41 55)" opacity="0.9"/>
            <circle cx="26" cy="30" r="3.5" fill="rgb(239 68 68)" className="animate-pulse"/>
            <circle cx="26" cy="30" r="2" fill="rgb(248 113 113)" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
            <circle cx="26" cy="30" r="1" fill="rgb(255 255 255)" opacity="0.9"/>
            
            {/* Crosshair in cybernetic eye */}
            <path d="M24 30L28 30M26 28L26 32" stroke="rgb(255 255 255)" strokeWidth="0.5" opacity="0.8"/>
            <path d="M23 27L29 33M29 27L23 33" stroke="rgb(239 68 68)" strokeWidth="0.3" opacity="0.6"/>
            
            {/* Human eye */}
            <ellipse cx="38" cy="30" rx="2.5" ry="3" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="38" cy="30" r="1.5" fill="rgb(31 41 55)"/>
            <circle cx="38" cy="29.5" r="0.5" fill="rgb(255 255 255)" opacity="0.9"/>
            
            {/* Battle scars - more realistic */}
            <path d="M34 26L42 34" stroke="rgb(185 28 28)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M36 22L44 30" stroke="rgb(239 68 68)" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
            <path d="M40 20L46 26" stroke="rgb(248 113 113)" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
            
            {/* Armor plating details */}
            <rect x="12" y="42" width="6" height="12" fill="url(#militaryMetal)" opacity="0.8" rx="2"/>
            <rect x="46" y="42" width="6" height="12" fill="url(#militaryMetal)" opacity="0.8" rx="2"/>
            
            {/* Tech details and circuitry */}
            <circle cx="16" cy="20" r="1.5" fill="rgb(239 68 68)" className="animate-ping" opacity="0.8"/>
            <circle cx="48" cy="22" r="1.2" fill="rgb(239 68 68)" className="animate-pulse" opacity="0.8"/>
            <rect x="14" y="56" width="3" height="4" fill="rgb(239 68 68)" opacity="0.9" rx="1"/>
            <rect x="47" y="56" width="3" height="4" fill="rgb(239 68 68)" opacity="0.9" rx="1"/>
            
            {/* Breathing apparatus */}
            <ellipse cx="32" cy="40" rx="4" ry="2" fill="rgb(75 85 99)" opacity="0.8"/>
            <circle cx="30" cy="40" r="0.5" fill="rgb(239 68 68)" className="animate-pulse"/>
            <circle cx="34" cy="40" r="0.5" fill="rgb(239 68 68)" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
          </svg>
        );
      
      case 'society':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <defs>
              <radialGradient id="societyBase" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgb(251 207 232)" />
                <stop offset="40%" stopColor="rgb(244 114 182)" />
                <stop offset="80%" stopColor="rgb(236 72 153)" />
                <stop offset="100%" stopColor="rgb(190 24 93)" />
              </radialGradient>
              <linearGradient id="societyHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(120 113 108)" />
                <stop offset="50%" stopColor="rgb(87 83 78)" />
                <stop offset="100%" stopColor="rgb(41 37 36)" />
              </linearGradient>
            </defs>
            
            {/* Head with warm skin tone */}
            <circle cx="32" cy="28" r="14" fill="url(#societyBase)" opacity="0.95"/>
            
            {/* Stylish hair with tech elements */}
            <path d="M24 18C22 16 22 10 28 10H36C42 10 42 16 40 18C36 12 28 12 24 18Z" 
                  fill="url(#societyHair)" opacity="0.9"/>
            <path d="M26 14C28 12 30 14 32 12C34 14 36 12 38 14" 
                  stroke="url(#societyHair)" strokeWidth="1.2" opacity="0.9"/>
            
            {/* Kind, expressive eyes */}
            <ellipse cx="28" cy="26" rx="2.5" ry="3" fill="rgb(255 255 255)" opacity="0.95"/>
            <ellipse cx="36" cy="26" rx="2.5" ry="3" fill="rgb(255 255 255)" opacity="0.95"/>
            <circle cx="28" cy="26" r="1.8" fill="rgb(101 163 13)"/>
            <circle cx="36" cy="26" r="1.8" fill="rgb(101 163 13)"/>
            <circle cx="28" cy="25.2" r="0.8" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="36" cy="25.2" r="0.8" fill="rgb(255 255 255)" opacity="0.9"/>
            
            {/* Gentle smile */}
            <path d="M26 33C28 35 30 35 32 35C34 35 36 35 38 33" 
                  stroke="rgb(190 24 93)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
            
            {/* Digital enhancement - subtle neural interface */}
            <rect x="40" y="20" width="5" height="2" fill="rgb(236 72 153)" className="animate-pulse" rx="1"/>
            <circle cx="42.5" cy="21" r="0.5" fill="rgb(255 255 255)" className="animate-ping"/>
            <path d="M41 19L44 19M41 23L44 23" stroke="rgb(236 72 153)" strokeWidth="0.5" opacity="0.7"/>
            
            {/* Heart symbol - more detailed */}
            <path d="M28 44C28 42 26 40 23 40C20 40 17 42 17 44C17 47 23 54 28 54C33 54 39 47 39 44C39 42 36 40 33 40C30 40 28 42 28 44Z" 
                  fill="rgb(236 72 153)" opacity="0.5"/>
            <path d="M26 46C26 45 25 44 24 44C23 44 22 45 22 46C22 47 24 49 26 49C28 49 30 47 30 46C30 45 29 44 28 44C27 44 26 45 26 46Z" 
                  fill="rgb(236 72 153)" className="animate-pulse"/>
            
            {/* Community connection lines */}
            <circle cx="12" cy="32" r="3" fill="rgb(244 114 182)" opacity="0.4"/>
            <circle cx="52" cy="32" r="3" fill="rgb(244 114 182)" opacity="0.4"/>
            <path d="M15 32L24 28M40 28L49 32" stroke="rgb(236 72 153)" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Data streams representing social networks */}
            <path d="M8 28C12 26 16 28 20 26" stroke="rgb(236 72 153)" strokeWidth="1" opacity="0.5"/>
            <path d="M44 26C48 28 52 26 56 28" stroke="rgb(236 72 153)" strokeWidth="1" opacity="0.5"/>
          </svg>
        );

      case 'ecology':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <defs>
              <radialGradient id="ecoBase" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgb(187 247 208)" />
                <stop offset="40%" stopColor="rgb(74 222 128)" />
                <stop offset="80%" stopColor="rgb(34 197 94)" />
                <stop offset="100%" stopColor="rgb(21 128 61)" />
              </radialGradient>
              <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(74 222 128)" />
                <stop offset="50%" stopColor="rgb(34 197 94)" />
                <stop offset="100%" stopColor="rgb(21 128 61)" />
              </linearGradient>
            </defs>
            
            {/* Head integrated with nature */}
            <circle cx="32" cy="30" r="13" fill="url(#ecoBase)" opacity="0.95"/>
            
            {/* Organic leaf-like hair/crown */}
            <path d="M22 18C20 16 20 10 26 10C28 8 30 8 32 10C34 8 36 8 38 10C44 10 44 16 42 18L32 15L22 18Z" 
                  fill="url(#leafGradient)" opacity="0.9"/>
            
            {/* Multiple leaf details */}
            <ellipse cx="24" cy="14" rx="4" ry="2" fill="rgb(34 197 94)" opacity="0.8" className="animate-pulse" transform="rotate(-20 24 14)"/>
            <ellipse cx="32" cy="12" rx="3" ry="1.5" fill="rgb(74 222 128)" opacity="0.9" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
            <ellipse cx="40" cy="14" rx="4" ry="2" fill="rgb(34 197 94)" opacity="0.8" className="animate-pulse" transform="rotate(20 40 14)" style={{animationDelay: '1s'}}/>
            
            {/* Natural eyes */}
            <circle cx="28" cy="28" r="2" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="36" cy="28" r="2" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="28" cy="28" r="1.5" fill="rgb(21 128 61)"/>
            <circle cx="36" cy="28" r="1.5" fill="rgb(21 128 61)"/>
            
            {/* Bio-tech symbiosis points */}
            <circle cx="24" cy="22" r="1.2" fill="rgb(34 197 94)" className="animate-pulse"/>
            <circle cx="40" cy="22" r="1.2" fill="rgb(34 197 94)" className="animate-pulse" style={{animationDelay: '0.7s'}}/>
            
            {/* Symbiosis network */}
            <path d="M24 21L24 23M23 22L25 22" stroke="rgb(74 222 128)" strokeWidth="0.6" opacity="0.8"/>
            <path d="M40 21L40 23M39 22L41 22" stroke="rgb(74 222 128)" strokeWidth="0.6" opacity="0.8"/>
            
            {/* Tree trunk integration */}
            <path d="M32 42C26 42 20 48 20 58H24C26 56 28 54 32 54C36 54 38 56 40 58H44C44 48 38 42 32 42Z" 
                  fill="url(#leafGradient)" opacity="0.6"/>
            
            {/* Root system */}
            <path d="M22 50L32 42L42 50" stroke="rgb(34 197 94)" strokeWidth="2" opacity="0.8"/>
            <path d="M18 52L32 44L46 52" stroke="rgb(74 222 128)" strokeWidth="1.5" opacity="0.6"/>
            
            {/* Floating leaves and nature elements */}
            <ellipse cx="16" cy="40" rx="4" ry="2" fill="rgb(34 197 94)" opacity="0.7" className="animate-pulse" transform="rotate(-30 16 40)"/>
            <ellipse cx="48" cy="40" rx="4" ry="2" fill="rgb(34 197 94)" opacity="0.7" className="animate-pulse" transform="rotate(30 48 40)"/>
            
            {/* Pollen and spores */}
            <circle cx="12" cy="24" r="1" fill="rgb(74 222 128)" className="animate-ping" opacity="0.8"/>
            <circle cx="52" cy="26" r="0.8" fill="rgb(34 197 94)" className="animate-pulse" opacity="0.8"/>
            <circle cx="8" cy="48" r="0.6" fill="rgb(74 222 128)" className="animate-ping" opacity="0.6"/>
            
            {/* Growth spirals */}
            <path d="M10 54C12 52 14 52 16 54C18 56 18 58 16 60" stroke="rgb(34 197 94)" strokeWidth="1" fill="none" opacity="0.7"/>
            <path d="M48 54C50 52 52 52 54 54C56 56 56 58 54 60" stroke="rgb(34 197 94)" strokeWidth="1" fill="none" opacity="0.7"/>
          </svg>
        );

      case 'economy':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <defs>
              <radialGradient id="economyBase" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgb(254 215 170)" />
                <stop offset="40%" stopColor="rgb(251 191 36)" />
                <stop offset="80%" stopColor="rgb(245 158 11)" />
                <stop offset="100%" stopColor="rgb(180 83 9)" />
              </radialGradient>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(254 240 138)" />
                <stop offset="50%" stopColor="rgb(245 158 11)" />
                <stop offset="100%" stopColor="rgb(180 83 9)" />
              </linearGradient>
            </defs>
            
            {/* Professional head */}
            <circle cx="32" cy="28" r="13" fill="url(#economyBase)" opacity="0.95"/>
            
            {/* Slicked business hair */}
            <path d="M24 16C22 16 22 10 28 10H36C42 10 42 16 40 16L32 17L24 16Z" 
                  fill="rgb(41 37 36)" opacity="0.9"/>
            <path d="M26 14C28 12 30 12 32 14C34 12 36 12 38 14" 
                  stroke="rgb(87 83 78)" strokeWidth="1" opacity="0.7"/>
            
            {/* Business eyes */}
            <circle cx="28" cy="26" r="2" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="28" cy="26" r="1.5" fill="rgb(31 41 55)"/>
            <circle cx="28" cy="25.2" r="0.5" fill="rgb(255 255 255)" opacity="0.9"/>
            
            {/* Golden cybernetic monocle - more elaborate */}
            <circle cx="36" cy="26" r="4" stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" className="animate-pulse"/>
            <circle cx="36" cy="26" r="3" fill="url(#goldGradient)" opacity="0.8" className="animate-pulse"/>
            <circle cx="36" cy="26" r="2" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="36" cy="26" r="1.2" fill="rgb(31 41 55)"/>
            
            {/* Monocle chain and details */}
            <path d="M32 26C30 28 26 29 24 31" stroke="url(#goldGradient)" strokeWidth="1.2" opacity="0.9"/>
            <circle cx="24" cy="31" r="0.8" fill="url(#goldGradient)" opacity="0.8"/>
            
            {/* HUD display in monocle */}
            <rect x="34" y="24" width="4" height="0.4" fill="rgb(245 158 11)" opacity="0.7"/>
            <rect x="34" y="25" width="3" height="0.3" fill="rgb(245 158 11)" opacity="0.5"/>
            <rect x="34" y="26" width="2" height="0.3" fill="rgb(245 158 11)" opacity="0.8"/>
            
            {/* Expensive suit */}
            <path d="M24 40L32 38L40 40L48 42V58H16V42L24 40Z" fill="rgb(31 41 55)" opacity="0.8"/>
            <path d="M26 42L32 40L38 42" stroke="rgb(75 85 99)" strokeWidth="1.2" opacity="0.9"/>
            
            {/* Luxury tie with pattern */}
            <path d="M28 38L32 40L36 38L35 52L29 52L28 38Z" fill="url(#goldGradient)" opacity="0.9"/>
            <path d="M30 42L34 42M30 45L34 45M30 48L34 48" stroke="rgb(180 83 9)" strokeWidth="0.5" opacity="0.8"/>
            
            {/* Digital currency symbols */}
            <text x="12" y="52" fontSize="6" fill="url(#goldGradient)" className="animate-pulse">$</text>
            <text x="48" y="52" fontSize="6" fill="url(#goldGradient)" className="animate-pulse" style={{animationDelay: '0.5s'}}>₿</text>
            <text x="8" y="32" fontSize="4" fill="url(#goldGradient)" opacity="0.8">€</text>
            <text x="52" y="34" fontSize="4" fill="url(#goldGradient)" opacity="0.8">¥</text>
            
            {/* Holographic market data */}
            <rect x="6" y="44" width="12" height="6" fill="url(#goldGradient)" opacity="0.3" className="animate-pulse" rx="2"/>
            <rect x="46" y="44" width="12" height="6" fill="url(#goldGradient)" opacity="0.3" className="animate-pulse" rx="2"/>
            
            {/* Stock market lines */}
            <path d="M8 46L10 44L12 46L14 42L16 45" stroke="rgb(245 158 11)" strokeWidth="1" fill="none" opacity="0.8"/>
            <path d="M48 46L50 44L52 46L54 42L56 45" stroke="rgb(245 158 11)" strokeWidth="1" fill="none" opacity="0.8"/>
          </svg>
        );

      case 'science':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <defs>
              <radialGradient id="scienceBase" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgb(221 214 254)" />
                <stop offset="40%" stopColor="rgb(196 181 253)" />
                <stop offset="80%" stopColor="rgb(168 85 247)" />
                <stop offset="100%" stopColor="rgb(124 58 237)" />
              </radialGradient>
              <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(196 181 253)" />
                <stop offset="50%" stopColor="rgb(168 85 247)" />
                <stop offset="100%" stopColor="rgb(124 58 237)" />
              </linearGradient>
            </defs>
            
            {/* Futuristic head */}
            <circle cx="32" cy="28" r="13" fill="url(#scienceBase)" opacity="0.95"/>
            
            {/* Advanced neural interface crown */}
            <path d="M24 16C22 16 22 10 28 10H36C42 10 42 16 40 16" fill="rgb(75 85 99)" opacity="0.9"/>
            <rect x="26" y="10" width="12" height="4" fill="url(#techGradient)" opacity="0.95" rx="2"/>
            
            {/* Neural interface ports - more detailed */}
            <circle cx="28" cy="12" r="1.2" fill="rgb(168 85 247)" className="animate-pulse"/>
            <circle cx="32" cy="12" r="1.2" fill="rgb(168 85 247)" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
            <circle cx="36" cy="12" r="1.2" fill="rgb(168 85 247)" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
            
            {/* Port connection details */}
            <circle cx="28" cy="12" r="0.6" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="32" cy="12" r="0.6" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="36" cy="12" r="0.6" fill="rgb(255 255 255)" opacity="0.9"/>
            
            {/* Advanced cybernetic eyes */}
            <circle cx="28" cy="26" r="3" fill="rgb(31 41 55)" opacity="0.9"/>
            <circle cx="36" cy="26" r="3" fill="rgb(31 41 55)" opacity="0.9"/>
            <circle cx="28" cy="26" r="2.5" fill="url(#techGradient)" className="animate-pulse"/>
            <circle cx="36" cy="26" r="2.5" fill="url(#techGradient)" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
            <circle cx="28" cy="26" r="1.5" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="36" cy="26" r="1.5" fill="rgb(255 255 255)" opacity="0.9"/>
            
            {/* Eye scan patterns */}
            <path d="M25 24L31 26M25 28L31 26" stroke="rgb(168 85 247)" strokeWidth="0.8" opacity="0.7"/>
            <path d="M33 24L39 26M33 28L39 26" stroke="rgb(168 85 247)" strokeWidth="0.8" opacity="0.7"/>
            
            {/* Advanced suit/lab coat */}
            <path d="M20 40C20 38 23 36 32 36C41 36 44 38 44 40V58H20V40Z" 
                  fill="rgb(75 85 99)" opacity="0.6"/>
            <circle cx="32" cy="46" r="4" stroke="url(#techGradient)" strokeWidth="1.5" fill="none" opacity="0.9"/>
            <circle cx="32" cy="46" r="2.5" fill="url(#techGradient)" className="animate-pulse"/>
            
            {/* Quantum field generator */}
            <circle cx="32" cy="46" r="1.5" fill="rgb(255 255 255)" opacity="0.9" className="animate-pulse"/>
            <circle cx="32" cy="46" r="0.8" fill="url(#techGradient)" className="animate-ping"/>
            
            {/* Space elements and stars */}
            <circle cx="10" cy="18" r="1.5" fill="rgb(168 85 247)" className="animate-pulse"/>
            <circle cx="54" cy="22" r="1.2" fill="rgb(196 181 253)" className="animate-pulse" style={{animationDelay: '0.8s'}}/>
            <circle cx="12" cy="50" r="1" fill="rgb(168 85 247)" className="animate-ping"/>
            <circle cx="52" cy="52" r="1.2" fill="rgb(196 181 253)" className="animate-pulse" style={{animationDelay: '1.2s'}}/>
            
            {/* Star constellation patterns */}
            <path d="M14 20L16 22L14 24L12 22L14 20Z" fill="rgb(168 85 247)" opacity="0.8"/>
            <path d="M50 18L52 20L50 22L48 20L50 18Z" fill="rgb(168 85 247)" opacity="0.8"/>
            
            {/* Quantum energy streams */}
            <path d="M6 30L18 30M46 30L58 30" stroke="url(#techGradient)" strokeWidth="1.2" opacity="0.6"/>
            <path d="M6 34L12 34M52 34L58 34" stroke="url(#techGradient)" strokeWidth="1" opacity="0.5"/>
            
            {/* Data streams */}
            <circle cx="8" cy="30" r="0.5" fill="rgb(168 85 247)" className="animate-ping"/>
            <circle cx="56" cy="30" r="0.5" fill="rgb(168 85 247)" className="animate-ping" style={{animationDelay: '0.5s'}}/>
          </svg>
        );

      case 'diplomacy':
        return (
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <defs>
              <radialGradient id="diplomacyBase" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgb(207 250 254)" />
                <stop offset="40%" stopColor="rgb(34 211 238)" />
                <stop offset="80%" stopColor="rgb(6 182 212)" />
                <stop offset="100%" stopColor="rgb(8 145 178)" />
              </radialGradient>
              <linearGradient id="elegantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(34 211 238)" />
                <stop offset="50%" stopColor="rgb(6 182 212)" />
                <stop offset="100%" stopColor="rgb(8 145 178)" />
              </linearGradient>
            </defs>
            
            {/* Elegant head */}
            <circle cx="32" cy="28" r="13" fill="url(#diplomacyBase)" opacity="0.95"/>
            
            {/* Sophisticated hairstyle */}
            <path d="M24 16C22 16 22 10 28 10H36C42 10 42 16 40 16C38 12 26 12 24 16Z" 
                  fill="rgb(120 113 108)" opacity="0.9"/>
            <path d="M24 14C26 12 28 14 30 12C32 14 34 12 36 14C38 12 40 14 40 16" 
                  stroke="rgb(87 83 78)" strokeWidth="1.2" opacity="0.9"/>
            
            {/* Refined eyes */}
            <ellipse cx="28" cy="26" rx="2.5" ry="3" fill="rgb(255 255 255)" opacity="0.95"/>
            <ellipse cx="36" cy="26" rx="2.5" ry="3" fill="rgb(255 255 255)" opacity="0.95"/>
            <circle cx="28" cy="26" r="1.8" fill="rgb(8 145 178)"/>
            <circle cx="36" cy="26" r="1.8" fill="rgb(8 145 178)"/>
            <circle cx="28" cy="25.2" r="0.8" fill="rgb(255 255 255)" opacity="0.9"/>
            <circle cx="36" cy="25.2" r="0.8" fill="rgb(255 255 255)" opacity="0.9"/>
            
            {/* Diplomatic smile */}
            <path d="M24 33C26 35 28 35 32 35C36 35 38 35 40 33" 
                  stroke="url(#elegantGradient)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9"/>
            
            {/* Advanced communication devices */}
            <circle cx="20" cy="24" r="3" stroke="url(#elegantGradient)" strokeWidth="1.2" fill="none" 
                    className="animate-pulse"/>
            <circle cx="44" cy="24" r="3" stroke="url(#elegantGradient)" strokeWidth="1.2" fill="none" 
                    className="animate-pulse" style={{animationDelay: '0.5s'}}/>
            <circle cx="20" cy="24" r="1" fill="url(#elegantGradient)" className="animate-ping"/>
            <circle cx="44" cy="24" r="1" fill="url(#elegantGradient)" className="animate-ping" style={{animationDelay: '0.5s'}}/>
            
            {/* Communication signal waves */}
            <circle cx="20" cy="24" r="2" stroke="rgb(34 211 238)" strokeWidth="0.5" fill="none" opacity="0.6" className="animate-pulse"/>
            <circle cx="44" cy="24" r="2" stroke="rgb(34 211 238)" strokeWidth="0.5" fill="none" opacity="0.6" className="animate-pulse"/>
            
            {/* Formal diplomatic attire */}
            <path d="M24 40L32 38L40 40V58H24V40Z" fill="rgb(31 41 55)" opacity="0.8"/>
            <path d="M26 42L32 40L38 42" stroke="rgb(75 85 99)" strokeWidth="1.2" opacity="0.9"/>
            
            {/* Diplomatic insignia */}
            <circle cx="32" cy="46" r="3" fill="url(#elegantGradient)" opacity="0.8"/>
            <path d="M30 44L32 46L34 44M30 48L32 46L34 48" stroke="rgb(255 255 255)" strokeWidth="1" opacity="0.9"/>
            
            {/* Peace symbols */}
            <circle cx="12" cy="36" r="3" stroke="url(#elegantGradient)" strokeWidth="1.5" fill="none" opacity="0.8"/>
            <circle cx="52" cy="36" r="3" stroke="url(#elegantGradient)" strokeWidth="1.5" fill="none" opacity="0.8"/>
            <path d="M12 33L12 39M9 36L15 36" stroke="url(#elegantGradient)" strokeWidth="1" opacity="0.8"/>
            <path d="M52 33L52 39M49 36L55 36" stroke="url(#elegantGradient)" strokeWidth="1" opacity="0.8"/>
            
            {/* Doves of peace */}
            <path d="M12 30C14 28 16 30 14 32C16 30 18 32 16 34" 
                  stroke="url(#elegantGradient)" strokeWidth="1.2" fill="none" opacity="0.8"/>
            <path d="M52 30C50 28 48 30 50 32C48 30 46 32 48 34" 
                  stroke="url(#elegantGradient)" strokeWidth="1.2" fill="none" opacity="0.8"/>
            
            {/* Global connection network */}
            <path d="M18 46L32 42L46 46" stroke="url(#elegantGradient)" strokeWidth="1.5" opacity="0.7"/>
            <circle cx="32" cy="42" r="1.5" fill="url(#elegantGradient)" className="animate-pulse"/>
            <circle cx="18" cy="46" r="1" fill="url(#elegantGradient)" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
            <circle cx="46" cy="46" r="1" fill="url(#elegantGradient)" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
            
            {/* World flags representation */}
            <rect x="6" y="54" width="8" height="4" fill="url(#elegantGradient)" opacity="0.4" rx="1"/>
            <rect x="50" y="54" width="8" height="4" fill="url(#elegantGradient)" opacity="0.4" rx="1"/>
            
            {/* Diplomatic communication lines */}
            <path d="M8 52L16 48M48 48L56 52" stroke="url(#elegantGradient)" strokeWidth="1" opacity="0.6"/>
          </svg>
        );

      default:
        return <div />;
    }
  };

  return (
    <div className={`
      relative flex-shrink-0 ${sizeClasses[size]} ${className}
      border-4 rounded-full p-1
      transition-all duration-500 hover:scale-110 hover:rotate-2
      backdrop-blur-lg cursor-pointer
      ${showGlow ? glowColors[advisor] : ''}
      bg-gradient-to-br from-background/20 via-background/10 to-transparent
      hover:from-background/30 hover:via-background/20 hover:to-background/10
    `}
         style={{
           borderImage: `linear-gradient(45deg, ${
             advisor === 'military' ? 'rgb(239 68 68), rgb(248 113 113), rgb(185 28 28)' :
             advisor === 'society' ? 'rgb(236 72 153), rgb(244 114 182), rgb(190 24 93)' :
             advisor === 'ecology' ? 'rgb(34 197 94), rgb(74 222 128), rgb(21 128 61)' :
             advisor === 'economy' ? 'rgb(245 158 11), rgb(251 191 36), rgb(180 83 9)' :
             advisor === 'science' ? 'rgb(168 85 247), rgb(196 181 253), rgb(124 58 237)' :
             'rgb(6 182 212), rgb(34 211 238), rgb(8 145 178)'
           }) 1`
         }}>
      
      {/* Multiple animated rings */}
      <div className="absolute inset-0 rounded-full border border-current opacity-30 animate-pulse" />
      <div className="absolute inset-1 rounded-full border border-current opacity-20 animate-ping" 
           style={{ animationDuration: '4s' }} />
      <div className="absolute inset-2 rounded-full border border-current opacity-10 animate-pulse" 
           style={{ animationDuration: '6s' }} />
      
      {/* Main content area with enhanced background */}
      <div className={`
        w-full h-full rounded-full 
        flex items-center justify-center
        text-current
        relative overflow-hidden
        bg-gradient-to-br from-background/30 via-background/10 to-transparent
        backdrop-blur-sm
      `}>
        <AdvisorIcon advisor={advisor} />
        
        {/* Enhanced scanning effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent 
                        transform -translate-y-full animate-pulse opacity-60" 
             style={{ 
               animationDuration: '3s', 
               animationIterationCount: 'infinite',
               animationDirection: 'alternate'
             }} />
             
        {/* Rotating light effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        animate-spin opacity-40" 
             style={{ animationDuration: '8s' }} />
      </div>
      
      {/* Enhanced corner decorations */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full opacity-80 animate-pulse" />
      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-current rounded-full opacity-60 animate-ping" />
      <div className="absolute top-1 -left-1 w-1.5 h-1.5 bg-current rounded-full opacity-90 animate-pulse" 
           style={{animationDelay: '0.5s'}} />
      <div className="absolute -top-1 right-1 w-1.5 h-1.5 bg-current rounded-full opacity-70 animate-ping" 
           style={{animationDelay: '1s'}} />
           
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-0.5 h-0.5 bg-current rounded-full opacity-60 animate-ping"
            style={{
              top: `${20 + i * 20}%`,
              left: `${30 + i * 15}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Компонент для отображения миниатюрных аватарок в списках
export function AdvisorMiniAvatar({ advisor, className = '' }: { 
  advisor: 'military' | 'society' | 'ecology' | 'economy' | 'science' | 'diplomacy';
  className?: string;
}) {
  const colors = {
    military: 'text-red-400',
    society: 'text-pink-400',
    ecology: 'text-green-400',
    economy: 'text-amber-400',
    science: 'text-purple-400',
    diplomacy: 'text-cyan-400'
  };

  const symbols = {
    military: '⚔️',
    society: '👥',
    ecology: '🌿',
    economy: '💰',
    science: '🚀',
    diplomacy: '🤝'
  };

  return (
    <div className={`
      w-6 h-6 ${colors[advisor]} 
      flex items-center justify-center 
      text-sm font-bold
      ${className}
    `}>
      {symbols[advisor]}
    </div>
  );
}