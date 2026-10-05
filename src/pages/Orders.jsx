import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Orders = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-dark font-body-md text-on-surface flex flex-col min-h-screen selection:bg-brand-gold selection:text-surface-dark">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-dark/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] pt-safe">
        <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <img 
              alt="Logo" 
              className="h-8 w-auto object-contain shrink-0" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1VtOWVGQc_fO4cpBuHMxtHDWUHVblsKxjccsp1iaaiBURlA3oMKUsf4eCuSaNwLL-pMbST-g2LYqVADVIdUvoyibN1_wDrh3sQ9Emuv908InISVMT_ltIqscJfnjlnOGHBmz9o1j-yDfHZptZzZaLH-c8MuQJzzeEsAskJjNkjj8bALOqSl1szug8r8RXLLXFtaIrCqIRvlVB0U455cV8tbRCPeJvUCwUq50Sinvh98FUKrKfAHErjMaoY" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-primary font-headline-sm tracking-wider uppercase truncate">Siparişler</span>
              <span className="text-text-muted text-[10px] uppercase tracking-widest leading-none font-semibold">Ali Dayı Yurdu</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <div className="w-8 h-8 rounded-full bg-surface-card-subtle text-primary font-bold text-xs flex items-center justify-center border border-primary/40 shrink-0 shadow-sm">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface-dark">
        <div className="flex flex-col w-full">
          <div className="px-margin pt-space-md pb-space-lg flex flex-col gap-space-md">
            
            {/* SEARCH & SCAN STRIP */}
            <div className="flex items-center gap-space-sm w-full">
              <div className="relative flex-1 flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-text-muted text-[20px] pointer-events-none">search</span>
                <input 
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-card text-on-surface placeholder:text-text-muted font-body-sm text-body-sm focus:outline-none focus:bg-surface-card-subtle shadow-md transition-colors" 
                  placeholder="Sipariş no, ürün veya barkod ara..." 
                  type="text" 
                />
              </div>
            </div>

            {/* PRIMARY STATUS FILTER CHIPS */}
            <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
              <button className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shrink-0 shadow-[0_2px_10px_rgba(233,193,118,0.3)] transition-all">
                Tümü
              </button>
              <button className="px-3.5 py-1.5 rounded-full bg-surface-card text-brand-gold-bright font-label-md text-label-md shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                <span className="w-2 h-2 rounded-full bg-brand-gold-bright animate-ping"></span>
                Aktif (2)
              </button>
              <button className="px-3.5 py-1.5 rounded-full bg-surface-card text-text-muted font-label-md text-label-md shrink-0 active:scale-95 transition-all">
                Tamamlananlar
              </button>
              <button className="px-3.5 py-1.5 rounded-full bg-surface-card text-text-muted font-label-md text-label-md shrink-0 active:scale-95 transition-all">
                İptal Edilenler
              </button>
            </div>

            {/* CATEGORY PILL FILTER */}
            <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pb-1">
              <button className="px-3 py-1 rounded-lg bg-surface-card-subtle text-primary font-label-sm text-label-sm shrink-0 flex items-center gap-1">
                <span>Hepsi</span>
              </button>
              <button className="px-3 py-1 rounded-lg bg-surface-card text-text-muted font-label-sm text-label-sm shrink-0 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">local_laundry_service</span>
                <span>Çamaşırhane</span>
              </button>
              <button className="px-3 py-1 rounded-lg bg-surface-card text-text-muted font-label-sm text-label-sm shrink-0 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">local_cafe</span>
                <span>Kantin & Kafe</span>
              </button>
              <button className="px-3 py-1 rounded-lg bg-surface-card text-text-muted font-label-sm text-label-sm shrink-0 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">restaurant</span>
                <span>Sıcak Satış</span>
              </button>
            </div>

            {/* LIVE ACTIVE ORDERS SECTION */}
            <div className="flex flex-col gap-space-sm mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold-bright"></span>
                  </span>
                  <span className="text-on-surface font-headline-sm text-headline-sm tracking-wide uppercase">Aktif Siparişlerim</span>
                </div>
              </div>

              {/* ACTIVE CARD 1: CAFETERIA ORDER */}
              <div className="rounded-xl bg-surface-card p-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col gap-space-md relative overflow-hidden">
                {/* Accent Glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Top Header Info */}
                <div className="flex items-start justify-between gap-space-sm relative z-10">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-card-subtle flex items-center justify-center shrink-0 shadow-inner">
                      <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>lunch_dining</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h2 className="text-on-surface font-headline-sm text-headline-sm truncate leading-snug">Kaşarlı Tost & Ayran</h2>
                      <span className="text-text-muted font-body-sm text-body-sm truncate">Yurt Kantini • Sipariş: #KN-492</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">hourglass_top</span>Hazırlanıyor
                    </span>
                    <div className="flex items-center gap-1 text-brand-gold-bright font-label-md text-label-md mt-1">
                      <span className="material-symbols-outlined text-[15px]">monetization_on</span>
                      <span>35 AD</span>
                    </div>
                  </div>
                </div>

                {/* Delivery & Pickup info */}
                <div className="rounded-lg bg-surface-dark/60 p-2.5 flex items-center justify-between gap-space-sm relative z-10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">storefront</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm truncate">Gel-Al: Kantin 2 Numaralı Banko</span>
                  </div>
                  <span className="text-text-muted font-label-sm text-label-sm shrink-0">Sıra No: #14</span>
                </div>

                {/* Action Row */}
                <div className="flex items-center gap-space-sm pt-0.5 relative z-10">
                  <button className="w-full h-9 rounded-lg bg-surface-card-subtle text-brand-gold-bright font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    Barkod / Teslimat QR Göster
                  </button>
                </div>
              </div>

              {/* ACTIVE CARD 2: LAUNDRY */}
              <div className="rounded-xl bg-surface-card p-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col gap-space-md relative overflow-hidden">
                {/* Top Header Info */}
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-card-subtle flex items-center justify-center shrink-0 shadow-inner">
                      <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_laundry_service</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h2 className="text-on-surface font-headline-sm text-headline-sm truncate leading-snug">İstasyon 04 - Kirli Sepet Yıkama</h2>
                      <span className="text-text-muted font-body-sm text-body-sm truncate">Günlük Pamuklu (40°C) • Lavanta</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold-bright font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] animate-spin">cyclone</span>
                      Yıkanıyor
                    </span>
                    <span className="text-text-muted font-label-sm text-label-sm tracking-tight mt-1">#ÇM-2026-089</span>
                  </div>
                </div>

                {/* Compact Progress Stepper */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between text-text-muted font-label-sm text-label-sm px-0.5">
                    <span className="text-brand-gold-bright font-semibold">1. Sepet Kabul</span>
                    <span className="text-primary font-bold">2. Yıkanıyor</span>
                    <span className="text-text-muted/60">3. Teslime Hazır</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container flex overflow-hidden">
                    <div className="w-1/3 bg-brand-gold h-full"></div>
                    <div className="w-1/3 bg-primary h-full animate-pulse"></div>
                    <div className="w-1/3 bg-transparent h-full"></div>
                  </div>
                </div>

                {/* Logistics ETA Banner */}
                <div className="rounded-lg bg-surface-dark/60 p-2.5 flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">schedule</span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm truncate">Tahmini: 15:45 (Yıkananlar Sepeti 04)</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-brand-gold-bright font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[15px]">monetization_on</span>
                    <span>20 AD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MONTHLY SUMMARY STATS STRIP */}
            <div className="rounded-xl bg-surface-card-subtle p-3.5 shadow-md flex items-center justify-around text-center my-1">
              <div className="flex flex-col items-center">
                <span className="text-text-muted font-label-sm text-label-sm">Bu Ayki Harcama</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[15px]">monetization_on</span>
                  <span className="text-brand-gold-bright font-headline-sm text-headline-sm font-bold">113 AD</span>
                </div>
              </div>
              <div className="w-px h-8 bg-surface-container"></div>
              <div className="flex flex-col items-center">
                <span className="text-text-muted font-label-sm text-label-sm">Çamaşır</span>
                <span className="text-on-surface font-headline-sm text-headline-sm font-bold mt-0.5">6 Yıkama</span>
              </div>
              <div className="w-px h-8 bg-surface-container"></div>
              <div className="flex flex-col items-center">
                <span className="text-text-muted font-label-sm text-label-sm">Kantin Siparişi</span>
                <span className="text-on-surface font-headline-sm text-headline-sm font-bold mt-0.5">14 Adet</span>
              </div>
            </div>

            {/* PAST ORDERS SECTION */}
            <div className="flex flex-col gap-space-sm mt-2">
              <div className="flex items-center justify-between">
                <span className="text-on-surface font-headline-sm text-headline-sm tracking-wide uppercase">Geçmiş Siparişler</span>
                <button className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors">
                  <span className="font-label-sm text-label-sm">Tarihe Göre</span>
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </button>
              </div>

              {/* PAST ITEM 1 */}
              <div className="rounded-xl bg-surface-card p-3.5 shadow-sm flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-card-subtle flex items-center justify-center shrink-0 shadow-inner">
                      <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>lunch_dining</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h2 className="text-on-surface font-headline-sm text-headline-sm truncate leading-snug">Kaşarlı Tost & Ayran</h2>
                      <span className="text-text-muted font-body-sm text-body-sm truncate">Yurt Kantini • Sipariş: #KN-492</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>Tamamlandı
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-text-muted font-body-sm text-body-sm">
                    <span>Tutar:</span>
                    <span className="text-brand-gold-bright font-label-md text-label-md flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                      15 AD
                    </span>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-surface-card-subtle text-primary font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[14px]">replay</span>
                    Tekrar Sipariş Ver
                  </button>
                </div>
              </div>

              {/* PAST ITEM 2 */}
              <div className="rounded-xl bg-surface-card p-3.5 shadow-sm flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-card-subtle flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-text-muted text-[19px]">fastfood</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-on-surface font-body-md text-body-md font-semibold truncate">Kantin - Soğuk Sandviç & Su</h3>
                      <span className="text-text-muted font-label-sm text-label-sm">3 Ekim, 12:45 • Gel-Al Teslimat</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-surface-card-subtle text-primary font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      Tamamlandı
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-text-muted font-body-sm text-body-sm">
                    <span>Tutar:</span>
                    <span className="text-brand-gold-bright font-label-md text-label-md flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                      28 AD
                    </span>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-surface-card-subtle text-text-muted hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[14px]">receipt</span>
                    Fiş Görüntüle
                  </button>
                </div>
              </div>

              {/* PAST ITEM 3 (CANCELLED / REFUNDED) */}
              <div className="rounded-xl bg-surface-card p-3.5 shadow-sm flex flex-col gap-2.5 opacity-90">
                <div className="flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-card-subtle flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-text-muted text-[19px]">local_laundry_service</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-on-surface font-body-md text-body-md font-semibold truncate">İstasyon 02 - Hızlı Yıkama</h3>
                      <span className="text-text-muted font-label-sm text-label-sm">1 Ekim, 10:15 • Kullanıcı İptali</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-brand-crimson/20 text-tertiary font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">cancel</span>
                      İptal Edildi
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-text-muted font-body-sm text-body-sm">
                    <span>Bakiye:</span>
                    <span className="text-primary font-label-md text-label-md flex items-center gap-0.5">
                      +15 AD Coin İadesi
                    </span>
                  </div>
                  <span className="text-text-muted/60 font-label-sm text-label-sm">Otomatik İade</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
