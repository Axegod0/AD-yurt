import React from 'react';

const Announcements = ({ isCompact }) => {
  if (isCompact) {
    return (
      <div className="bg-white dark:bg-surface-card rounded-2xl dark:rounded-[22px] p-4 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex items-center justify-between gap-3 relative overflow-hidden transition-colors duration-300">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-brand-crimson/15 border border-rose-100 dark:border-brand-crimson/30 flex items-center justify-center text-rose-500 dark:text-[#f87171] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">campaign</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#0F172A] dark:text-white truncate">Planlı Su Kesintisi Duyurusu</span>
            <span className="text-[11px] text-slate-500 dark:text-text-muted">Yarın 14:00 - 16:00 arası</span>
          </div>
        </div>
        <button className="bg-[#C5A059]/10 dark:bg-[#C5A059]/15 text-amber-800 dark:text-[#C5A059] border border-[#C5A059]/25 dark:border-[#C5A059]/30 hover:bg-[#C5A059] dark:hover:bg-[#C5A059] hover:text-white dark:hover:text-[#0f172a] transition-colors px-3.5 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0" type="button">
          Detay
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">Duyurular & Gelişmeler</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-[#C5A059]/15 text-amber-800 dark:text-[#C5A059] border-none dark:border dark:border-[#C5A059]/25">3 Yeni</span>
        </div>
        <a className="text-[12px] font-semibold text-amber-700 dark:text-[#C5A059] hover:underline flex items-center gap-0.5" href="#">
          Tümü<span className="material-symbols-outlined text-[14px]">chevron_right</span>
        </a>
      </div>
      
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl dark:rounded-[22px] bg-white dark:bg-surface-card border border-slate-100 dark:border-border-dark p-4 shadow-sm dark:shadow-none group hover:border-slate-300 dark:hover:border-[#C5A059]/30 transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-brand-crimson/15 border border-rose-100 dark:border-brand-crimson/30 flex items-center justify-center text-rose-500 dark:text-[#f87171] flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">campaign</span>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-brand-crimson/20 text-rose-600 dark:text-[#f87171] border border-rose-200 dark:border-brand-crimson/30 leading-none mb-1">Önemli</span>
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">Planlı Su & Hidrofor Bakımı</h3>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-text-muted flex-shrink-0">Yarın 14:00</span>
          </div>
          <p className="text-[12px] text-slate-600 dark:text-text-muted mt-2.5 leading-relaxed">A ve B Blok hidrofor hatlarındaki periyodik bakım sebebiyle 14:00 - 16:00 arasında kısa süreli kesinti yaşanacaktır.</p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-border-dark/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-slate-400 dark:text-[#C5A059]">schedule</span>
              14:00 - 16:00
            </span>
            <button className="text-[11px] font-bold text-[#C5A059] hover:text-amber-800 dark:hover:text-[#E5C158] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" type="button">
              Detayları Gör<span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl dark:rounded-[22px] bg-white dark:bg-surface-card border border-slate-100 dark:border-border-dark p-4 shadow-sm dark:shadow-none group hover:border-slate-300 dark:hover:border-[#C5A059]/30 transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-[#C5A059]/15 border border-amber-100 dark:border-[#C5A059]/30 flex items-center justify-center text-amber-600 dark:text-[#C5A059] flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">emoji_events</span>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-[#C5A059]/20 text-amber-700 dark:text-[#E5C158] border border-amber-200 dark:border-[#C5A059]/30 leading-none mb-1">Etkinlik</span>
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">Masa Tenisi Turnuvası Kayıtları</h3>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-[#C5A059] flex-shrink-0">Bu Hafta</span>
          </div>
          <p className="text-[12px] text-slate-600 dark:text-text-muted mt-2.5 leading-relaxed">Geleneksel yurtlar arası masa tenisi turnuvası başlıyor! İlk 3 dereceye sürpriz AD Coin ödülleri verilecektir.</p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-border-dark/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-slate-400 dark:text-[#C5A059]">event</span>
              Son Başvuru: Cuma 18:00
            </span>
            <button className="bg-amber-50 dark:bg-[#C5A059]/15 text-amber-900 dark:text-[#C5A059] border border-amber-300 dark:border-[#C5A059]/30 hover:bg-amber-100 dark:hover:bg-[#C5A059] hover:text-amber-900 dark:hover:text-[#0f172a] transition-colors px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1" type="button">
              Kayıt Ol<span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
