import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Laundry = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="bg-surface-dark text-on-surface font-body-md text-body-md flex flex-col min-h-screen selection:bg-brand-gold/30">
      
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-dark/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-card transition-colors">
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </Link>
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-wider">Çamaşırhane</span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-card px-space-sm py-1 rounded-full shadow-[0_0_12px_rgba(197,160,89,0.15)]">
              <span className="material-symbols-outlined text-primary text-[18px]">monetization_on</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">145 AD</span>
            </div>
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1Umi-vFsj8j_T0eYltaHg1Buj2RYmu6Hen2oBFpTX0M3qM9pq4e7dQ_r0Mm3RImZsQSFC2gyV4ifC7o2gSuN_Vpt9FH9wcBGkNCFtLsRR-MFB22CReA1i2EvHsPdZ4xFo77_VVwhO9Q42UV5d4Rpg8wo5LyV50ItcjQEWoXbHAai9IwWG8Qf1cvLHcn5PvpvjVeOhwJEoLKG5mczZ7UEfsBEUx2zj5aohDke-ev79Jg3kK8yx61HGxiydlbLcScXOMEcJD1u8ixvIQ" />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-28 bg-surface-dark min-h-screen">
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-space-lg px-margin pb-6">
            
            {/* Konum & Canlı İstasyon Durum Özeti Bandı */}
            <div className="flex items-center justify-between bg-surface-card p-space-sm rounded-xl shadow-md">
              <div className="flex items-center gap-space-xs min-w-0">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">shopping_basket</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface truncate">Sepet İstasyonları</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant truncate">Sepet Bırakma Alanı (3. Kat)</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-high px-space-sm py-1 rounded-full shrink-0">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-primary font-bold tracking-tight">8 Boş / 4 Dolu</span>
              </div>
            </div>

            {/* Aktif Yıkama Takip Bölümü */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">motion_photos_on</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Aktif Siparişim</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Canlı Akış</span>
              </div>

              {/* Canlı Ana Takip Kartı */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-navy-light/40 via-surface-card to-surface-card-subtle p-space-md shadow-xl">
                {/* Ambient Glowing Aura */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex flex-col gap-space-md relative z-10">
                  
                  {/* Üst İstasyon Bilgi & Canlı Rozet */}
                  <div className="flex items-start justify-between gap-space-xs">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-surface-dark flex items-center justify-center shrink-0 shadow-inner">
                        <span className="material-symbols-outlined text-primary text-[22px]">shopping_basket</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-headline-md text-headline-md text-on-surface truncate">1. Sepetim • İstasyon 04</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Zemin Kat Sol Blok Sepet Alanı</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/15 px-space-xs py-1 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      <span className="font-label-sm text-label-sm text-primary font-bold">SIRADA BEKLİYOR</span>
                    </div>
                  </div>

                  {/* Yıkama Programı Detayı */}
                  <div className="flex items-center gap-space-xs bg-surface-dark/60 backdrop-blur-md px-space-sm py-2 rounded-lg">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] shrink-0">tune</span>
                    <span className="font-body-sm text-body-sm text-on-surface truncate">Günlük Pamuklu (40°C • 1000 Devir) • Lavanta Bahçesi</span>
                  </div>

                  {/* Bilgilendirme Notu Rozeti */}
                  <div className="flex items-start gap-space-xs bg-primary/10 border border-primary/20 px-space-sm py-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
                    <span className="font-body-sm text-body-sm text-on-surface leading-relaxed">🧺 Sepetiniz İstasyon 04'te görevlinin yıkaması için bekliyor / sıraya alındı.</span>
                  </div>

                  {/* Sipariş Durumu Adımları */}
                  <div className="flex flex-col gap-space-sm bg-surface-dark/70 backdrop-blur-md p-space-sm rounded-xl border border-primary/20">
                    <div className="flex items-center justify-between px-space-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Sipariş Durumu</span>
                      <span className="font-headline-sm text-headline-sm font-mono text-on-surface">#AD-CY482</span>
                    </div>
                    <div className="grid grid-cols-3 gap-space-xs pt-1">
                      <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-primary/15 border border-primary/40 text-center relative shadow-[0_0_12px_rgba(197,160,89,0.2)]">
                        <span className="material-symbols-outlined text-[18px] text-primary">pending_actions</span>
                        <span className="font-label-sm text-label-sm text-primary font-bold">Sepet Bekliyor</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-surface-container/50 opacity-60 text-center">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">local_laundry_service</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Yıkanıyor</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-surface-container/50 opacity-60 text-center">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">check_circle</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Yıkandı & Hazır</span>
                      </div>
                    </div>
                  </div>

                  {/* Aksiyon Butonları (Siparişi İptal Et & Siparişi Güncelle) */}
                  <div className="grid grid-cols-2 gap-gutter pt-1">
                    <button className="flex items-center justify-center gap-space-xs bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all text-on-surface-variant hover:text-on-surface py-2.5 px-space-sm rounded-xl border border-surface-variant/40">
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      <span className="font-label-md text-label-md font-bold">Siparişi İptal Et</span>
                    </button>
                    <button className="flex items-center justify-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-primary active:scale-95 transition-all py-2.5 px-space-sm rounded-xl border border-primary/40 shadow-[0_0_12px_rgba(197,160,89,0.15)]">
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      <span className="font-label-md text-label-md font-bold">Siparişi Güncelle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Yeni Yıkama Siparişi Bölümü */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
                <span className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">Hızlı Rezervasyon</span>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-surface-card p-space-md shadow-lg flex flex-col gap-space-md">
                {/* Arka Plan Dekoratif Vurgu & İkon */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1 min-w-0 pr-2">
                    <span className="font-headline-md text-headline-md text-on-surface">Yeni Sepet Bırak / Sıra Al</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Boş olan 12 sepet alanından birine kirli sepetinizi bırakın, yıkama modunuzu seçip sıraya girin.</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-primary text-[28px]">shopping_basket</span>
                  </div>
                </div>
                
                {/* Fiyat Bilgisi Rozeti & Coin Görseli */}
                <div className="flex items-center justify-between bg-surface-dark px-space-sm py-2 rounded-lg">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">monetization_on</span>
                    <span className="font-body-sm text-body-sm text-on-surface">Standart Yıkama:</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">15 AD Coin'den başlayanlarla</span>
                </div>
                
                {/* Büyük Ana Aksiyon Butonu */}
                <Link to="/laundry/step1" className="w-full flex items-center justify-center gap-space-sm bg-gradient-to-r from-primary via-brand-gold to-brand-gold-bright text-on-primary py-3 px-space-md rounded-xl font-headline-sm text-headline-sm font-bold shadow-[0_6px_20px_rgba(233,193,118,0.3)] active:scale-95 transition-all">
                  <span className="">Sepet Bırak & Sıra Al</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Hatırlatma & Yurt Kuralları Bandı */}
            <div className="flex items-start gap-space-sm bg-surface-card border border-primary/20 p-space-sm rounded-xl shadow-md">
              <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">lightbulb</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">Öğrenci Bilgilendirmesi</span>
                <span className="font-body-sm text-body-sm text-on-surface leading-relaxed">💡 Bilgi: Yıkama bittiğinde çamaşırlarınızı yıkananlar alanından teslim alıp kurutmayı kendiniz yapabilirsiniz.</span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <div 
                className="flex items-center justify-between bg-surface-card hover:bg-surface-card-subtle border border-primary/20 transition-all p-space-md rounded-xl cursor-pointer shadow-lg" 
                onClick={() => setIsHistoryOpen(true)}
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 shadow-inner">
                    <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">Geçmiş Yıkamaları İncele</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Önceki tamamlanan siparişler ve makine detayları</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-dark text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col justify-end transition-opacity duration-300" onClick={(e) => { if (e.target === e.currentTarget) setIsHistoryOpen(false); }}>
          <div className="bg-surface-card rounded-t-2xl border-t border-primary/20 p-space-md max-h-[80vh] overflow-y-auto shadow-2xl flex flex-col gap-space-md pb-safe">
            <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto self-center mb-1"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">Geçmiş Yıkamalarım</span>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="w-8 h-8 rounded-full bg-surface-dark flex items-center justify-center text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between p-space-sm bg-surface-dark/90 rounded-xl border border-surface-variant/40">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">1. Sepetim • İstasyon 02</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">24 Ekim 2023 • 14:15 • Teslim Alındı</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-label-md text-label-md text-primary font-bold font-mono">-15 AD Coin</span>
                  <span className="font-label-sm text-label-sm text-primary/80">Tamamlandı</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-space-sm bg-surface-dark/90 rounded-xl border border-surface-variant/40">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">2. Sepetim • İstasyon 05</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">20 Ekim 2023 • 11:20 • Öğrenci İptal Etti</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-label-md text-label-md text-on-surface-variant font-bold font-mono">0 AD Coin</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">İptal Edildi</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-space-sm bg-surface-dark/90 rounded-xl border border-surface-variant/40">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">1. Sepetim • İstasyon 01</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">11 Ekim 2023 • 10:30 • Teslim Alındı</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-label-md text-label-md text-primary font-bold font-mono">-15 AD Coin</span>
                  <span className="font-label-sm text-label-sm text-primary/80">Tamamlandı</span>
                </div>
              </div>
            </div>
            
            <button onClick={() => setIsHistoryOpen(false)} className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface font-headline-sm text-headline-sm mt-1 transition-all">Kapat</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Laundry;
