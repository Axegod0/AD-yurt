import { Link } from 'react-router-dom';

const ActiveOrders = () => {
  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">Aktif Sipariş & Durum</h2>
        <Link to="/orders" className="text-[13px] font-bold text-[#C5A059] hover:opacity-80 flex items-center gap-1">
          Tümünü Gör <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
      
      {/* Highlight Card */}
      <div className="bg-white dark:bg-surface-card rounded-2xl dark:rounded-[22px] p-4 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex items-center justify-between gap-3 transition-colors duration-300">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-surface-card-subtle border border-[#C5A059]/25 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-[#C5A059]">
            <span className="material-symbols-outlined text-[24px]">local_cafe</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-white truncate leading-tight">Filtre Kahve (Orta Boy)</h3>
            <span className="text-[12px] text-slate-500 dark:text-text-muted mt-0.5 font-medium">Kahve Köşesi • Barkod: <span className="text-amber-800 dark:text-[#E5C158] font-semibold dark:font-mono">#AD-8492</span></span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-[#C5A059] text-amber-800 dark:text-[#0f172a] border border-amber-200/60 dark:border-none px-3.5 py-1.5 rounded-full font-bold text-[11px] shadow-sm dark:shadow-[0_0_12px_rgba(197,160,89,0.35)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-[#0f172a] animate-pulse"></span>
            Hazırlanıyor
          </span>
        </div>
      </div>
      
      {/* Second status item: Laundry Reservation sub-card */}
      <div className="bg-white dark:bg-surface-card/60 rounded-2xl dark:rounded-[18px] px-4 py-3 border border-slate-200/80 dark:border-border-dark/60 shadow-sm dark:shadow-none flex items-center justify-between text-[12px] transition-colors duration-300">
        <div className="flex items-center gap-2 text-slate-500 dark:text-text-muted">
          <span className="material-symbols-outlined text-[16px] text-[#C5A059]">dry_cleaning</span>
          <span className="font-medium dark:font-normal text-slate-600 dark:text-text-muted">Kurutma Makinesi 02 Randevusu</span>
        </div>
        <span className="font-semibold text-[#0F172A] dark:text-white">Bugün 17:30</span>
      </div>
    </div>
  );
};

export default ActiveOrders;
