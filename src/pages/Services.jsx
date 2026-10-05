import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Services = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-surface-dark text-on-surface font-body-md flex flex-col min-h-screen selection:bg-brand-gold selection:text-brand-navy">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-dark/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="h-20 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <img 
              alt="Ali Dayı Yurdu Monogram" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1VtOWVGQc_fO4cpBuHMxtHDWUHVblsKxjccsp1iaaiBURlA3oMKUsf4eCuSaNwLL-pMbST-g2LYqVADVIdUvoyibN1_wDrh3sQ9Emuv908InISVMT_ltIqscJfnjlnOGHBmz9o1j-yDfHZptZzZaLH-c8MuQJzzeEsAskJjNkjj8bALOqSl1szug8r8RXLLXFtaIrCqIRvlVB0U455cV8tbRCPeJvUCwUq50Sinvh98FUKrKfAHErjMaoY" 
            />
            <div className="flex flex-col">
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-wide uppercase">İşlemler</h1>
              <span className="font-label-sm text-label-sm text-brand-gold font-medium tracking-wider uppercase">Ali Dayı Yurdu</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <button aria-label="Bildirimler" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-28 pb-28 bg-surface-dark min-h-screen">
        <div className="flex flex-col w-full px-margin space-y-space-lg">
          
          {/* Search and Discovery Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gold">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input 
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface-card text-on-surface placeholder:text-outline font-body-md text-body-md shadow-md focus:outline-none transition-all" 
              placeholder="Hizmet, talep veya izin ara..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.trim().length > 0 && (
              <button 
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-brand-gold transition-colors"
                onClick={() => setSearchQuery('')}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* AD Coin Micro Balance Strip */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-navy via-surface-card to-surface-card-subtle p-space-md shadow-xl flex items-center justify-between">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-brand-gold/10 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                <span className="material-symbols-outlined text-[22px]">monetization_on</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-brand-gold uppercase tracking-wider">AD Coin Cüzdanı</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-lg text-headline-lg text-on-surface">340.50</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">AD</span>
                </div>
              </div>
            </div>
            <button className="px-3.5 py-2 rounded-xl bg-brand-gold text-on-primary font-headline-sm text-headline-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span className="">Yükle</span>
            </button>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button className="px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md whitespace-nowrap shadow-sm">Tümü</button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-card text-on-surface-variant hover:text-brand-gold font-label-md text-label-md whitespace-nowrap transition-colors">Tesisler</button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-card text-on-surface-variant hover:text-brand-gold font-label-md text-label-md whitespace-nowrap transition-colors">Destek</button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-card text-on-surface-variant hover:text-brand-gold font-label-md text-label-md whitespace-nowrap transition-colors">İletişim</button>
          </div>

          {/* Primary Facilities Section (2x2 Grid) */}
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-brand-gold"></span>
                Yurt Tesis Hizmetleri
              </h2>
              <span className="font-label-sm text-label-sm text-text-muted">3 Hizmet</span>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-1">
              {/* Laundry Card */}
              <div 
                className="group relative rounded-2xl bg-surface-card p-space-md shadow-md active:scale-[0.99] transition-all flex items-center justify-between overflow-hidden cursor-pointer"
                onClick={() => navigate('/laundry')}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-surface-card-subtle flex items-center justify-center text-brand-gold flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">Çamaşırhane</h3>
                      <span className="px-2 py-0.5 rounded-md bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm">Müsait</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-muted truncate mt-0.5">Makine & sepet randevusu al</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-brand-gold/15 text-brand-gold hover:bg-brand-gold hover:text-on-primary font-label-md text-label-md flex items-center gap-1 transition-colors flex-shrink-0">
                  <span className="">Sıra Al</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-gutter">
                {/* Kantin Card */}
                <div className="group relative rounded-2xl bg-surface-card p-space-md shadow-md active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-card-subtle flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">storefront</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-brand-gold/15 text-brand-gold font-label-sm text-label-sm">Açık</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Kantin</h3>
                    <p className="font-body-sm text-body-sm text-text-muted mt-0.5">Aperatif, içecek, atıştırmalık siparişi</p>
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between text-brand-gold font-label-md text-label-md">
                    <span className="">Sipariş Ver</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </div>
                </div>

                {/* Sıcak Satış Card */}
                <div className="group relative rounded-2xl bg-surface-card p-space-md shadow-md active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden cursor-pointer">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand-crimson/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-card-subtle flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">soup_kitchen</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Sıcak</span>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Sıcak Satış</h3>
                    <p className="font-body-sm text-body-sm text-text-muted mt-0.5">Günün taze lezzetleri, tost ve sıcak menü</p>
                  </div>
                  <div className="mt-3 pt-2 flex items-center justify-between text-brand-gold font-label-md text-label-md">
                    <span className="">Menüyü Gör</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Administrative Requests */}
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-brand-gold"></span>
                Destek & Sorun Talebi
              </h2>
              <span className="font-label-sm text-label-sm text-text-muted">Hızlı Çözüm</span>
            </div>
            <div className="rounded-2xl bg-surface-card p-4 shadow-xl border-dark flex flex-col space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-brand-gold flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">build_circle</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Talep veya Arıza Bildirimi</h3>
                    <p className="font-body-sm text-body-sm text-text-muted mt-0.5">Oda arızası, temizlik veya genel yurt problemi</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold font-label-sm text-label-sm uppercase">Aktif</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-surface-card-subtle text-on-surface-variant font-label-sm text-label-sm"># Elektrik / Sıhhi</span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-card-subtle text-on-surface-variant font-label-sm text-label-sm"># Mobilya</span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-card-subtle text-on-surface-variant font-label-sm text-label-sm"># Oda Hijyeni</span>
              </div>
              <button className="w-full py-2.5 px-4 rounded-xl bg-brand-gold text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all mt-1">
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                <span className="">Talep Oluştur +</span>
              </button>
            </div>
          </div>

          {/* 24/7 Security & Nöbetçi Memuru Emergency Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-card via-brand-navy to-surface-card p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-brand-crimson/20 flex items-center justify-center text-brand-crimson flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">support_agent</span>
                  </div>
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">Nöbetçi Yurt Hocası</h4>
                    <span className="px-1.5 py-0.2 rounded bg-brand-gold/15 text-brand-gold font-label-sm text-label-sm uppercase font-semibold">7/24 Aktif</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-text-muted">Acil durum & yurt danışma hattı</span>
                </div>
              </div>
              <a className="px-3.5 py-2 rounded-xl bg-brand-gold text-on-primary font-headline-sm text-headline-sm flex items-center gap-1.5 shadow-lg active:scale-90 transition-transform" href="tel:02120000000">
                <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                <span className="">Ara</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Services;
