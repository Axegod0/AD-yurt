import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LaundryStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Accept base price from navigation state if available, otherwise default to 18 (Günlük Pamuklu)
  const baseCost = location.state?.baseCost || 18;
  
  const [careOption, setCareOption] = useState('dorm');
  const [scent, setScent] = useState('lavender');

  const softenerCost = careOption === 'dorm' ? 4 : 0;
  const totalCost = baseCost + softenerCost;

  const handleNext = () => {
    // Navigate to step 4 when ready
    navigate('/laundry/step4', { state: { totalCost } });
  };

  return (
    <div className="bg-surface-dark text-on-surface font-body-md text-body-md flex flex-col min-h-screen selection:bg-brand-gold/30">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-dark/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <button 
              aria-label="Geri Dön" 
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95" 
              onClick={() => navigate(-1)}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight uppercase truncate">
              Makine Detay
            </h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-card px-space-sm py-1 rounded-full shadow-[0_0_12px_rgba(197,160,89,0.15)]">
              <span className="material-symbols-outlined text-primary text-[18px]">monetization_on</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">145 AD</span>
            </div>
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1Umi-vFsj8j_T0eYltaHg1Buj2RYmu6Hen2oBFpTX0M3qM9pq4e7dQ_r0Mm3RImZsQSFC2gyV4ifC7o2gSuN_Vpt9FH9wcBGkNCFtLsRR-MFB22CReA1i2EvHsPdZ4xFo77_VVwhO9Q42UV5d4Rpg8wo5LyV50ItcjQEWoXbHAai9IwWG8Qf1cvLHcn5PvpvjVeOhwJEoLKG5mczZ7UEfsBEUx2zj5aohDke-ev79Jg3kK8yx61HGxiydlbLcScXOMEcJD1u8ixvIQ" 
            />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-safe bg-surface-dark min-h-screen">
        <div className="flex flex-col w-full pb-28">
          
          {/* Stepper & Order Context */}
          <section className="px-margin pt-space-md">
            <div className="bg-[#111625]/90 border border-primary/20 rounded-2xl p-4 mb-4 shadow-lg backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold">ADIM 3 / 4 • YUMUŞATICI & BAKIM</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">%75 Tamamlandı</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 my-2.5">
                <div className="h-1.5 rounded-full bg-[#C5A059]"></div>
                <div className="h-1.5 rounded-full bg-[#C5A059]"></div>
                <div className="h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_rgba(233,193,118,0.5)]"></div>
                <div className="h-1.5 rounded-full bg-surface-variant/60"></div>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2 items-start text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface truncate w-full">1. Sepet</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface truncate w-full">2. Program</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center shadow-[0_0_12px_rgba(233,193,118,0.5)] ring-2 ring-primary/40">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-bold truncate w-full">3. Yumuşatıcı</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-40">
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant truncate w-full">4. Onay</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-border-dark/60 bg-surface-dark/70 rounded-lg p-space-sm flex items-center justify-between">
                <div className="flex items-center gap-space-xs min-w-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">local_laundry_service</span>
                  <p className="font-label-md text-label-md text-on-surface truncate">İstasyon 04 • Günlük Pamuklu (40°C) • 45 dk</p>
                </div>
                <span className="bg-primary/20 text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold flex-shrink-0">Hazır</span>
              </div>
            </div>
          </section>

          {/* Title & Explainer */}
          <section className="px-margin mt-space-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Yumuşatıcı & Bakım Tercihi</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Yurt otomatından lüks kokulu yumuşatıcı ekleyebilir veya kendi ürününüzü kullanabilirsiniz.
            </p>
          </section>

          {/* Auto-Dosage Notice Banner */}
          <section className="px-margin mt-space-md">
            <div className="bg-surface-card-subtle p-space-md rounded-xl flex items-start gap-space-sm shadow-md">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-primary text-[20px]">magic_button</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline-sm text-headline-sm text-primary">Otomatik Dozajlama</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Makinelerimiz döngü sırasında yumuşatıcıyı tam doğru su sıcaklığında ve durulama evresinde serbest bırakır.
                </p>
              </div>
            </div>
          </section>

          {/* 3 Main Choices */}
          <section className="px-margin mt-space-lg flex flex-col gap-space-md">
            
            {/* Option 1: Dorm Fabric Softener */}
            <div 
              className={`cursor-pointer rounded-xl p-space-md transition-all relative overflow-hidden ${
                careOption === 'dorm' 
                  ? 'bg-gradient-to-b from-primary/10 via-surface-card to-surface-card shadow-xl' 
                  : 'bg-surface-card shadow-md opacity-90 hover:opacity-100'
              }`}
              onClick={() => setCareOption('dorm')}
            >
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    careOption === 'dorm' ? 'bg-primary/20 text-primary shadow-inner' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">spa</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <h4 className="font-headline-md text-headline-md text-on-surface">Yurt Yumuşatıcısı İstiyorum</h4>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Yurt deposundan profesyonel Yumoş/Vernel ekstra kalıcı koku & doku koruma formülü otomatik dozlanır.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`${
                    careOption === 'dorm' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  } font-headline-sm text-headline-sm px-2.5 py-1 rounded-full flex items-center gap-1`}>
                    +4 AD
                  </span>
                  <span className={`material-symbols-outlined text-[24px] mt-2 ${
                    careOption === 'dorm' ? 'text-primary' : 'text-surface-variant'
                  }`} style={careOption === 'dorm' ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}>
                    {careOption === 'dorm' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>

              {/* Scent Selector Chips */}
              {careOption === 'dorm' && (
                <div className="mt-space-md pt-space-sm bg-surface-dark/60 rounded-xl p-space-sm">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-2 uppercase tracking-wide">Koku Varyasyonu Seçin:</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className={`px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all active:scale-95 ${
                        scent === 'lavender' ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={(e) => { e.stopPropagation(); setScent('lavender'); }}
                      type="button"
                    >
                      <span>🌿</span> Lavanta Bahçesi
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all active:scale-95 ${
                        scent === 'spring' ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={(e) => { e.stopPropagation(); setScent('spring'); }}
                      type="button"
                    >
                      <span>🌸</span> Bahar Çiçekleri
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all active:scale-95 ${
                        scent === 'sensitive' ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={(e) => { e.stopPropagation(); setScent('sensitive'); }}
                      type="button"
                    >
                      <span>🍃</span> Hassas & Parfümsüz
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Option 2: BYO Softener */}
            <div 
              className={`cursor-pointer rounded-xl p-space-md transition-all ${
                careOption === 'self' 
                  ? 'bg-gradient-to-b from-primary/10 via-surface-card to-surface-card shadow-xl' 
                  : 'bg-surface-card shadow-md opacity-90 hover:opacity-100'
              }`}
              onClick={() => setCareOption('self')}
            >
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    careOption === 'self' ? 'bg-primary/20 text-primary shadow-inner' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">water_bottle</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface">Kendi Yumuşatıcımı Kullanacağım</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Kendi getirdiğiniz yumuşatıcıyı makinenin II numaralı gözüne kendiniz dökersiniz. Döngü başlamadan önce eklemeyi unutmayınız.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`${
                    careOption === 'self' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  } font-headline-sm text-headline-sm px-2.5 py-1 rounded-full flex items-center gap-1`}>
                    0 AD
                  </span>
                  <span className={`material-symbols-outlined text-[24px] mt-2 ${
                    careOption === 'self' ? 'text-primary' : 'text-surface-variant'
                  }`} style={careOption === 'self' ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}>
                    {careOption === 'self' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Option 3: No Softener */}
            <div 
              className={`cursor-pointer rounded-xl p-space-md transition-all ${
                careOption === 'none' 
                  ? 'bg-gradient-to-b from-primary/10 via-surface-card to-surface-card shadow-xl' 
                  : 'bg-surface-card shadow-md opacity-90 hover:opacity-100'
              }`}
              onClick={() => setCareOption('none')}
            >
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    careOption === 'none' ? 'bg-primary/20 text-primary shadow-inner' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">block</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface">Yurt Yumuşatıcısı İstemiyorum</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Sadece standart çamaşır deterjanı ile yıkanır; ek koku veya yumuşatıcı ilave edilmez.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`${
                    careOption === 'none' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  } font-headline-sm text-headline-sm px-2.5 py-1 rounded-full flex items-center gap-1`}>
                    0 AD
                  </span>
                  <span className={`material-symbols-outlined text-[24px] mt-2 ${
                    careOption === 'none' ? 'text-primary' : 'text-surface-variant'
                  }`} style={careOption === 'none' ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}>
                    {careOption === 'none' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            </div>
            
          </section>

          {/* Quality & Dermatologic Guarantee Badge */}
          <section className="px-margin mt-space-lg mb-8">
            <div className="bg-surface-container/60 p-space-md rounded-xl flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[28px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Standart antialerjik toz/sıvı deterjan tüm yıkamalara <span className="text-primary font-semibold">ücretsiz dahildir</span>. Dermatolojik onaylı cilt dostu formül kullanılır.
              </p>
            </div>
          </section>

        </div>

        {/* Sticky Bottom Checkout Action Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-dark/95 backdrop-blur-xl px-margin py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-safe">
          <div className="flex items-center justify-between gap-space-md max-w-md mx-auto">
            {/* Total Price Block */}
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Toplam Tutar</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">monetization_on</span>
                <span className="font-display-hero text-headline-lg text-primary font-bold">{totalCost} AD</span>
              </div>
            </div>
            
            {/* Action Buttons Pair */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button 
                aria-label="Geri" 
                className="h-12 w-12 rounded-xl bg-surface-card flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-all" 
                onClick={() => navigate(-1)} 
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
              <button 
                className="h-12 px-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(233,193,118,0.3)] active:scale-[0.98] hover:brightness-105 transition-all flex-1 max-w-[200px]" 
                onClick={handleNext}
                type="button"
              >
                <span>Devam Et</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LaundryStep3;
