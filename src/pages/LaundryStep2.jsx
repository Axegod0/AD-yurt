import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const programs = [
  {
    id: 'hizli',
    title: 'Hızlı Yıkama',
    subtitle: '30 Dk • 30°C • 800 Devir',
    desc: 'Az kirli günlük kıyafetler ve t-shirtler için ideal.',
    price: 15,
    icon: 'timer',
    isPopular: false,
    extraBadge: null,
  },
  {
    id: 'gunluk',
    title: 'Günlük Pamuklu',
    subtitle: '45 Dk • 40°C • 1000 Devir',
    desc: 'Günlük tişört, gömlek ve pantolonlar için en dengeli tüketim.',
    price: 18,
    icon: 'local_fire_department',
    isPopular: true,
    extraBadge: 'Eco 40°C',
  },
  {
    id: 'yogun',
    title: 'Yoğun & Hijyen',
    subtitle: '60 Dk • 60°C • 1200 Devir',
    desc: 'Nevresim, havlu ve yoğun kirli çamaşırlar için derinlemesine hijyen.',
    price: 22,
    icon: 'sanitizer',
    isPopular: false,
    extraBadge: null,
  },
  {
    id: 'hassas',
    title: 'Hassas / Yünlü',
    subtitle: '35 Dk • 20°C • 600 Devir',
    desc: 'Narin kumaşlar, kazaklar ve pamuklu gömlekler için hafif bakım.',
    price: 16,
    icon: 'dry_cleaning',
    isPopular: false,
    extraBadge: null,
  },
];

const LaundryStep2 = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState('gunluk');

  const currentProgram = programs.find((p) => p.id === selectedProgram);

  const handleNext = () => {
    // Navigate to step 3 when ready
    navigate('/laundry/step3', { state: { baseCost: currentProgram.price } });
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
          <div className="px-margin pt-space-md flex flex-col gap-space-lg">
            
            {/* Stepper Header */}
            <div className="bg-[#111625]/90 border border-primary/20 rounded-2xl p-4 mb-4 flex flex-col gap-space-md shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">ADIM 2 / 4 • YIKAMA PROGRAMI</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm text-brand-gold-bright font-medium">%50 Tamamlandı</span>
                  <div className="flex items-center gap-1 bg-surface-dark/80 px-2 py-0.5 rounded-full border border-primary/10 ml-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">local_laundry_service</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">İstasyon 04</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                <div className="bg-primary rounded-full h-full"></div>
                <div className="bg-primary rounded-full h-full"></div>
                <div className="bg-surface-dark rounded-full h-full"></div>
                <div className="bg-surface-dark rounded-full h-full"></div>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-medium truncate w-full">1. Sepet</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_0_12px_rgba(197,160,89,0.35)]">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-brand-gold-bright font-bold truncate w-full">2. Program</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center opacity-50">
                  <div className="w-9 h-9 rounded-full bg-surface-dark border border-primary/10 flex items-center justify-center text-text-muted">
                    <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-text-muted truncate w-full">3. Yumuşatıcı</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center opacity-50">
                  <div className="w-9 h-9 rounded-full bg-surface-dark border border-primary/10 flex items-center justify-center text-text-muted">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-text-muted truncate w-full">4. Onay</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Yıkama Programını Belirleyin</h2>
              <p className="font-body-sm text-body-sm text-text-muted">Çamaşırlarınızın türüne uygun sıcaklık ve devir modunu seçin.</p>
            </div>

            {/* Program List */}
            <div className="flex flex-col gap-space-md">
              {programs.map((prog) => {
                const isSelected = prog.id === selectedProgram;
                return (
                  <div 
                    key={prog.id}
                    className={`cursor-pointer transition-all duration-200 active:scale-[0.99] flex flex-col gap-space-xs ${
                      isSelected 
                        ? 'selected-program relative bg-gradient-to-br from-[#1c2744] via-surface-card-subtle to-surface-card p-space-md rounded-xl shadow-[0_10px_28px_rgba(197,160,89,0.18)]'
                        : 'bg-surface-card hover:bg-surface-card-subtle p-space-md rounded-xl shadow-md'
                    }`}
                    onClick={() => setSelectedProgram(prog.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-sm min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected 
                            ? 'bg-primary/20 text-brand-gold-bright' 
                            : 'bg-surface-dark text-primary'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">{prog.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-space-xs">
                            <span className="font-headline-sm text-headline-sm text-on-surface truncate">{prog.title}</span>
                            {prog.isPopular && (
                              <span className="bg-primary text-on-primary-container font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-bold uppercase">Popüler</span>
                            )}
                          </div>
                          <div className="flex items-center gap-space-xs mt-0.5">
                            <span className={`font-label-sm text-label-sm ${isSelected ? 'text-brand-gold-bright' : 'text-text-muted'}`}>
                              {prog.subtitle}
                            </span>
                            {prog.extraBadge && (
                              <span className="bg-emerald-950/70 text-emerald-400 font-label-sm text-label-sm px-1 rounded">
                                {prog.extraBadge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-space-xs shrink-0">
                        <div className="flex items-center gap-space-xs bg-surface-dark px-space-sm py-1 rounded-full">
                          <span className="material-symbols-outlined text-primary text-[15px]">monetization_on</span>
                          <span className="font-headline-sm text-headline-sm text-primary font-bold">{prog.price} AD</span>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`font-body-sm text-body-sm pl-[44px] ${isSelected ? 'text-on-surface-variant' : 'text-text-muted'}`}>
                      {prog.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-dark/95 backdrop-blur-xl p-space-md shadow-[0_-8px_24px_rgba(0,0,0,0.65)] pb-safe">
          <div className="max-w-md mx-auto flex items-center gap-space-sm">
            <button 
              aria-label="Geri Adım" 
              className="w-12 h-12 rounded-xl bg-surface-card hover:bg-surface-card-subtle flex items-center justify-center text-on-surface active:scale-95 transition-all shrink-0" 
              onClick={() => navigate(-1)} 
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <button 
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary via-brand-gold to-brand-gold-bright text-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-between px-space-md shadow-[0_4px_16px_rgba(197,160,89,0.35)] active:scale-[0.98] transition-all" 
              onClick={handleNext}
              type="button"
            >
              <span>Devam Et: Yumuşatıcı Seçimi</span>
              <div className="flex items-center gap-1">
                <span>{currentProgram?.price} AD</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default LaundryStep2;
