import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import ActiveOrders from './components/ActiveOrders';
import Announcements from './components/Announcements';
import QuickActions from './components/QuickActions';
import BottomNav from './components/BottomNav';

const Dashboard = () => {
  const [hasActiveOrder, setHasActiveOrder] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#07090e] font-sans text-slate-800 dark:text-white antialiased flex flex-col min-h-screen select-none transition-colors duration-300">
      <Header />
      
      <main className="flex flex-col relative w-full pt-24 pb-28 px-5 space-y-5">
        <BalanceCard />

        {hasActiveOrder ? (
          <>
            <Announcements isCompact={true} />
            <ActiveOrders />
          </>
        ) : (
          <Announcements isCompact={false} />
        )}

        <QuickActions />
        
        {/* Test Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => setHasActiveOrder(!hasActiveOrder)}
            className="flex-1 p-3 bg-white dark:bg-surface-card border border-slate-200 dark:border-border-dark rounded-xl text-[12px] font-bold text-slate-500 dark:text-text-muted hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
          >
            {hasActiveOrder ? "Aktif Siparişi Kapat" : "Aktif Siparişi Aç"}
          </button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex-1 p-3 bg-white dark:bg-surface-card border border-slate-200 dark:border-border-dark rounded-xl text-[12px] font-bold text-slate-500 dark:text-text-muted hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
            {isDarkMode ? "Aydınlık Mod" : "Karanlık Mod"}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
