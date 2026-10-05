import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">Hızlı Hizmetler</h2>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {/* Quick Action 1: Çamaşırhane (Links to Laundry Page) */}
        <Link to="/laundry" className="bg-white dark:bg-surface-card hover:bg-slate-50 dark:hover:bg-surface-card-subtle transition-all rounded-2xl dark:rounded-[20px] p-3 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex flex-col justify-between active:scale-[0.98] group relative overflow-hidden duration-300 block">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-surface-card-subtle border border-amber-100 dark:border-[#C5A059]/25 flex items-center justify-center text-amber-600 dark:text-[#C5A059] group-hover:border-amber-300 dark:group-hover:border-[#C5A059]/50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight whitespace-nowrap">Çamaşırhane</h4>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-border-dark/60 flex items-center justify-between text-[#C5A059] whitespace-nowrap">
              <span className="text-[10px] font-semibold tracking-tight">Sıra Al</span>
              <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* Quick Action 2: Kantin */}
        <div className="bg-white dark:bg-surface-card hover:bg-slate-50 dark:hover:bg-surface-card-subtle transition-all rounded-2xl dark:rounded-[20px] p-3 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex flex-col justify-between active:scale-[0.98] group relative overflow-hidden duration-300">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-surface-card-subtle border border-amber-100 dark:border-[#C5A059]/25 flex items-center justify-center text-amber-600 dark:text-[#C5A059] group-hover:border-amber-300 dark:group-hover:border-[#C5A059]/50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight whitespace-nowrap">Kantin</h4>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-border-dark/60 flex items-center justify-between text-[#C5A059] whitespace-nowrap">
              <span className="text-[10px] font-semibold tracking-tight">Alışveriş</span>
              <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* Quick Action 3: Sıcak Satış */}
        <div className="bg-white dark:bg-surface-card hover:bg-slate-50 dark:hover:bg-surface-card-subtle transition-all rounded-2xl dark:rounded-[20px] p-3 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex flex-col justify-between active:scale-[0.98] group relative overflow-hidden duration-300">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-surface-card-subtle border border-amber-100 dark:border-[#C5A059]/25 flex items-center justify-center text-amber-600 dark:text-[#C5A059] group-hover:border-amber-300 dark:group-hover:border-[#C5A059]/50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">restaurant</span>
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight whitespace-nowrap">Sıcak Satış</h4>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-border-dark/60 flex items-center justify-between text-[#C5A059] whitespace-nowrap">
              <span className="text-[10px] font-semibold tracking-tight">Menü</span>
              <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
