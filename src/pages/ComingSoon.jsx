import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to determine the title from the state or URL
  const title = location.state?.title || "Çok Yakında";
  const icon = location.state?.icon || "hourglass_top";

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body flex flex-col min-h-screen selection:bg-[#C5A059] selection:text-white transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-sm pt-safe transition-colors duration-300">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-[#C5A059] dark:hover:text-[#C5A059] transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-[#0F172A] dark:text-white tracking-tight uppercase truncate">{title}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative w-full pt-16 pb-28 px-5 bg-[#f8fafc] dark:bg-[#07090e]">
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm">
          <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/20 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px] text-[#C5A059]">{icon}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Çok Yakında!</h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {title} modülü şu anda yapım aşamasında. Size en iyi deneyimi sunmak için çalışıyoruz, lütfen beklemede kalın!
          </p>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Önceki Sayfaya Dön
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ComingSoon;
