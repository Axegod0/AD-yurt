import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { supabase } from '../supabase';

const Services = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('balance')
          .eq('id', user.id)
          .single();
        if (profile) setBalance(profile.balance || 0);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body-md flex flex-col min-h-screen selection:bg-brand-gold selection:text-white transition-colors duration-300">
      {/* Header */}
      <Header title="İşlemler" />

      {/* Main Content */}
      <main className="flex flex-col relative w-full pt-20 pb-28 min-h-screen">
        <div className="flex flex-col w-full px-margin space-y-space-lg pt-1">
          
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input 
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body-md text-body-md shadow-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" 
              placeholder="Hizmet, talep veya izin ara..." 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue.length > 0 && (
              <button 
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" 
                onClick={() => setSearchValue('')}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          
          {/* AD Coin Premium Balance Strip */}
          <div className={`relative overflow-hidden rounded-2xl p-space-md shadow-lg shadow-slate-900/10 flex items-center justify-between text-white border ${balance < 0 ? 'bg-gradient-to-br from-[#450a0a] via-[#7f1d1d] to-[#450a0a] border-red-800/40' : 'bg-gradient-to-br from-[#0d1b3e] via-[#12234f] to-[#152a5e] border-slate-800/40'}`}>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-brand-gold/15 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <img alt="AD Coin" className="w-11 h-11 object-contain drop-shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADPYqNMbq5t_1SjWShh6dxY73YvZK2F4vKspZ0hdeQeVt-LzVWmEf5emgBlgtcYrfIOSuGe9HslK-JSFYOAzAQz5Cr_S7snlNEIns6asuaZMH2CQTsT4BHiP_m3PivqpIHxZmmWX3L4WL6tD6k44mscbHd3S2zWWDhy1OFGSSyG4tdmHWhku5tR2cSaTGRO84Wj1OBoEjy4aSuWHTjEME0q1ow97GFMMgBzgrOvDFaa8aYE7dcnwTkfEvk5-F_tQXgmbM" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-brand-gold font-semibold uppercase tracking-wider">AD Coin Cüzdanı</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-headline-lg text-[22px] font-bold text-white tracking-tight">{balance}</span>
                  <span className="font-label-sm text-[11px] text-amber-200/90 font-semibold">AD</span>
                </div>
              </div>
            </div>
            <a href="https://wa.me/905336775003?text=AD%20coin%20y%C3%BCklemek%20istiyorum." target="_blank" rel="noopener noreferrer" className="relative z-10 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-headline-sm text-headline-sm font-bold flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Yükle</span>
            </a>
          </div>
          
          {/* Removed Categories */}
          
          {/* Primary Facilities Section */}
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-brand-gold"></span>Yurt Hizmetleri
              </h2>
              <span className="font-label-sm text-label-sm text-slate-400 dark:text-slate-500 font-medium">3 Hizmet</span>
            </div>
            <div className="grid grid-cols-2 gap-gutter pt-1">
              <div 
                onClick={() => navigate('/laundry')} 
                className="group relative rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-space-md shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-between overflow-hidden cursor-pointer col-span-2"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-brand-gold/10 border border-amber-200/60 dark:border-brand-gold/20 flex items-center justify-center text-brand-gold flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white truncate">Çamaşırhane</h3>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-label-sm text-label-sm font-semibold border border-blue-100 dark:border-blue-500/20">Müsait</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">Makine & sepet randevusu al</p>
                  </div>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-brand-gold/10 text-amber-900 dark:text-brand-gold font-label-md text-label-md flex items-center gap-1 font-semibold flex-shrink-0 border border-amber-200/80 dark:border-brand-gold/20">
                  <span>Sıra Al</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </div>
              </div>
              
              <div 
                onClick={() => navigate('/coming-soon', { state: { title: 'Kantin', icon: 'storefront' } })} 
                className="group relative rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-space-md shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">storefront</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-500/20 font-label-sm text-label-sm font-semibold">Açık</span>
                </div>
                <div className="mt-3 flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white">Kantin</h3>
                  <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">Aperatif, içecek, atıştırmalık siparişi</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-brand-gold font-label-md text-label-md font-semibold">
                  <span>Sipariş Ver</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </div>
              </div>
              <div 
                onClick={() => navigate('/coming-soon', { state: { title: 'Sıcak Satış', icon: 'soup_kitchen' } })}
                className="group relative rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-space-md shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">soup_kitchen</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200/70 dark:border-orange-500/20 font-label-sm text-label-sm font-semibold">Sıcak</span>
                </div>
                <div className="mt-3 flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white">Sıcak Satış</h3>
                  <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">Günün taze lezzetleri, tost ve sıcak menü</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-brand-gold font-label-md text-label-md font-semibold">
                  <span>Menüyü Gör</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Student Administrative Requests */}
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-brand-gold"></span>Destek & Sorun Talebi
              </h2>
              <span className="font-label-sm text-label-sm text-slate-400 dark:text-slate-500 font-medium">Hızlı Çözüm</span>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-4 shadow-sm flex flex-col space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-brand-gold/10 border border-amber-200/60 dark:border-brand-gold/20 flex items-center justify-center text-brand-gold flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">build_circle</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white">Talep veya Arıza Bildirimi</h3>
                    <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mt-0.5">Oda arızası, temizlik veya genel yurt problemi</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-label-sm text-label-sm font-semibold uppercase">Aktif</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-label-sm text-label-sm font-medium"># Elektrik / Sıhhi</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-label-sm text-label-sm font-medium"># Mobilya</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-label-sm text-label-sm font-medium"># Oda Hijyeni</span>
              </div>
              <button onClick={() => navigate('/create-ticket')} className="w-full py-2.5 px-4 rounded-xl bg-brand-gold hover:bg-amber-600 text-slate-950 font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all mt-1" type="button">
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                <span>Talep Oluştur +</span>
              </button>
            </div>
          </div>
          
          {/* 24/7 Security & Emergency Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200/70 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">support_agent</span>
                  </div>
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f1523] animate-pulse"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white">Nöbetçi Yurt Hocası</h4>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-label-sm text-label-sm uppercase font-semibold">7/24 Aktif</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400">Acil durum & yurt danışma hattı</span>
                </div>
              </div>
              <button onClick={() => navigate('/coming-soon', { state: { title: 'Nöbetçi İletişim', icon: 'support_agent' } })} className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-brand-gold/10 hover:bg-amber-100 dark:hover:bg-brand-gold/20 text-amber-900 dark:text-brand-gold border border-amber-200 dark:border-brand-gold/20 font-headline-sm text-headline-sm font-bold flex items-center gap-1.5 shadow-sm active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-[20px] text-amber-800 dark:text-brand-gold">phone_in_talk</span>
                <span>Ara</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Services;
