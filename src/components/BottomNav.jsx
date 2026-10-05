import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl border-t border-slate-100 dark:border-[#C5A059]/15 shadow-lg dark:shadow-none transition-colors duration-300">
      <div className="flex justify-around items-center h-16 px-3 max-w-md mx-auto">
        
        {/* Ana Sayfa */}
        <NavLink 
          to="/"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 min-w-[52px] transition-all ${
            isActive 
              ? "text-[#C5A059] dark:drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" 
              : "text-slate-500 dark:text-text-muted hover:text-[#C5A059] dark:hover:text-[#C5A059]"
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[10px] font-semibold tracking-wide">Ana Sayfa</span>
        </NavLink>
        
        {/* Siparişler */}
        <NavLink 
          to="/orders"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 min-w-[52px] transition-all ${
            isActive 
              ? "text-[#C5A059] dark:drop-shadow-[0_0_8px_rgba(197,160,89,0.5)] font-bold" 
              : "text-slate-500 dark:text-text-muted hover:text-[#C5A059] dark:hover:text-[#C5A059]"
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          <span className="text-[10px] font-medium tracking-wide">Siparişler</span>
        </NavLink>
        
        {/* İşlemler */}
        <NavLink 
          to="/services"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 min-w-[52px] transition-all ${
            isActive 
              ? "text-[#C5A059] dark:drop-shadow-[0_0_8px_rgba(197,160,89,0.5)] font-bold" 
              : "text-slate-500 dark:text-text-muted hover:text-[#C5A059] dark:hover:text-[#C5A059]"
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">grid_view</span>
          <span className="text-[10px] font-medium tracking-wide">İşlemler</span>
        </NavLink>
        
        {/* Duyurular */}
        <NavLink 
          to="/duyurular"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 min-w-[52px] transition-all ${
            isActive 
              ? "text-[#C5A059] dark:drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" 
              : "text-slate-500 dark:text-text-muted hover:text-[#C5A059] dark:hover:text-[#C5A059]"
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="text-[10px] font-medium tracking-wide">Duyuru</span>
        </NavLink>
        
        {/* Profil */}
        <NavLink 
          to="/profil"
          className={({ isActive }) => `flex flex-col items-center justify-center gap-1 min-w-[52px] transition-all ${
            isActive 
              ? "text-[#C5A059] dark:drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" 
              : "text-slate-500 dark:text-text-muted hover:text-[#C5A059] dark:hover:text-[#C5A059]"
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[10px] font-medium tracking-wide">Profil</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
