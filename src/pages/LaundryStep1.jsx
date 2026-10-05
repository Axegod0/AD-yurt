import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LaundryStep1 = () => {
  const navigate = useNavigate();
  // State to track selected station (defaults to 4 as in the design)
  const [selectedStation, setSelectedStation] = useState(4);

  // Helper to render a station card
  const renderStationCard = (id, status, description, iconLabel = 'Boş') => {
    const isSelected = selectedStation === id;

    if (status === 'free') {
      return (
        <button
          key={id}
          onClick={() => setSelectedStation(id)}
          className={`text-left p-space-sm rounded-xl active:scale-[0.98] transition-all flex flex-col justify-between h-32 relative shadow-md ${
            isSelected 
              ? 'bg-secondary-container/80 text-on-surface shadow-[0_0_20px_rgba(197,160,89,0.3)]' 
              : 'bg-surface-card hover:bg-surface-card-subtle'
          }`}
          type="button"
        >
          <div className="flex items-center justify-between w-full">
            <span className={isSelected ? 'font-headline-sm text-primary' : 'font-label-md text-on-surface'}>
              #{id.toString().padStart(2, '0')}
            </span>
            {isSelected ? (
              <div className="w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </div>
          
          <div className={`flex flex-col items-center justify-center my-auto ${isSelected ? 'text-primary' : ''}`}>
            <span className={`material-symbols-outlined text-[28px] ${isSelected ? 'text-[30px]' : 'text-text-muted'}`} style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>
              shopping_basket
            </span>
            <span className={`font-label-sm mt-1 font-bold ${isSelected ? 'text-primary uppercase tracking-tight' : 'text-emerald-400'}`}>
              {isSelected ? 'Seçildi' : iconLabel}
            </span>
          </div>
          
          <div className={`flex items-center justify-between w-full font-label-sm ${isSelected ? 'text-primary' : 'text-text-muted'}`}>
            <span>{description}</span>
            <span className="material-symbols-outlined text-[14px]">
              {isSelected ? 'done_all' : 'arrow_forward'}
            </span>
          </div>
        </button>
      );
    }

    if (status === 'busy' || status === 'waiting') {
      const isBusy = status === 'busy';
      return (
        <div key={id} className="opacity-75 p-space-sm rounded-xl bg-surface-container text-left flex flex-col justify-between h-32 relative shadow-inner">
          <div className="flex items-center justify-between w-full">
            <span className="font-label-md text-text-muted">#{id.toString().padStart(2, '0')}</span>
            <span className={`w-2 h-2 rounded-full bg-brand-gold-bright ${isBusy ? 'animate-ping' : ''}`}></span>
          </div>
          <div className="flex flex-col items-center justify-center my-auto text-primary">
            <span className={`material-symbols-outlined text-[26px] ${isBusy ? 'animate-spin' : ''}`}>
              {isBusy ? 'progress_activity' : 'schedule'}
            </span>
            <span className="font-label-sm text-primary mt-1 font-bold text-center leading-tight">
              {isBusy ? 'Görevli Yıkıyor' : 'Sırada Bekliyor'}
            </span>
          </div>
          <div className="flex items-center justify-between w-full text-text-muted font-label-sm">
            <span>{description}</span>
            <span className="material-symbols-outlined text-[14px] text-primary">timelapse</span>
          </div>
        </div>
      );
    }

    if (status === 'offline') {
      return (
        <div key={id} className="opacity-60 p-space-sm rounded-xl bg-surface-container-lowest text-left flex flex-col justify-between h-32 relative shadow-inner">
          <div className="flex items-center justify-between w-full">
            <span className="font-label-md text-text-muted">#{id.toString().padStart(2, '0')}</span>
            <span className="w-2 h-2 rounded-full bg-brand-crimson"></span>
          </div>
          <div className="flex flex-col items-center justify-center my-auto text-error">
            <span className="material-symbols-outlined text-[26px]">do_not_disturb_on</span>
            <span className="font-label-sm text-error mt-1 font-bold">Dolu / Kapalı</span>
          </div>
          <div className="flex items-center justify-between w-full text-text-muted font-label-sm">
            <span>{description}</span>
            <span className="material-symbols-outlined text-[14px]">block</span>
          </div>
        </div>
      );
    }
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
        <div className="flex flex-col w-full px-margin pb-32 space-y-space-lg">
          
          {/* Stepper Header */}
          <div className="flex flex-col bg-[#111625]/90 border border-primary/20 rounded-2xl p-4 shadow-lg mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-sm text-primary uppercase tracking-wider font-bold text-[11px]">ADIM 1 / 4 • SEPET İSTASYONU</span>
              </div>
              <span className="text-[11px] font-label-md px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">%25 Tamamlandı</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              <div className="h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>
              <div className="h-1.5 rounded-full bg-surface-variant/40"></div>
              <div className="h-1.5 rounded-full bg-surface-variant/40"></div>
              <div className="h-1.5 rounded-full bg-surface-variant/40"></div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-1">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center mb-1 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_basket</span>
                </div>
                <span className="font-label-sm text-primary font-bold text-[11px]">1. Sepet</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-7 h-7 rounded-full bg-surface-variant/60 text-on-surface flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </div>
                <span className="font-label-sm text-on-surface-variant text-[11px]">2. Program</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-7 h-7 rounded-full bg-surface-variant/60 text-on-surface flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[16px]">soap</span>
                </div>
                <span className="font-label-sm text-on-surface-variant text-[11px]">3. Yumuşatıcı</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-7 h-7 rounded-full bg-surface-variant/60 text-on-surface flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
                <span className="font-label-sm text-on-surface-variant text-[11px]">4. Onay</span>
              </div>
            </div>
          </div>
          
          {/* Title & QR Scanner Trigger */}
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex flex-col min-w-0">
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Sepet Bırakma İstasyonu Seçin</h2>
              <p className="font-body-sm text-body-sm text-text-muted mt-0.5">Kirli çamaşır sepetinizi bırakacağınız 1-12 arasındaki boş sepet istasyonunu seçin. Görevli sepetinizi buradan teslim alacaktır.</p>
            </div>
            <button aria-label="Hızlı QR Kod Tara" className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-surface-card-subtle text-primary shadow-[0_0_15px_rgba(197,160,89,0.15)] active:scale-95 transition-transform" type="button">
              <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            </button>
          </div>
          
          {/* Legend Status Filter / Info */}
          <div className="flex items-center justify-between px-space-sm py-2 rounded-xl bg-surface-container-low/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"></span>
              <span className="font-label-sm text-text-muted">Boş</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-bright shadow-[0_0_6px_rgba(229,193,88,0.7)]"></span>
              <span className="font-label-sm text-text-muted">Yıkıyor / Sırada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-crimson shadow-[0_0_6px_rgba(153,27,27,0.7)]"></span>
              <span className="font-label-sm text-text-muted">Dolu / Kapalı</span>
            </div>
          </div>
          
          {/* 3-Column Washing Machine Grid */}
          <div className="grid grid-cols-3 gap-gutter">
            {renderStationCard(1, 'free', 'Standart')}
            {renderStationCard(2, 'free', 'Standart')}
            {renderStationCard(3, 'busy', '24 dk')}
            {renderStationCard(4, 'free', '9 kg Sepet')}
            {renderStationCard(5, 'free', 'Geniş Sepet')}
            {renderStationCard(6, 'waiting', '12 dk')}
            {renderStationCard(7, 'free', 'Standart')}
            {renderStationCard(8, 'offline', 'Kullanım Dışı')}
            {renderStationCard(9, 'free', 'Standart')}
            {renderStationCard(10, 'busy', '40 dk')}
            {renderStationCard(11, 'free', 'Standart')}
            {renderStationCard(12, 'free', 'Geniş Sepet')}
          </div>
          
          {/* Selection Detail Panel */}
          {selectedStation && (
            <div className="flex flex-col p-space-md rounded-xl bg-surface-card shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden mt-4">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary/10 blur-xl pointer-events-none"></div>
              <div className="flex items-center gap-space-sm mb-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <span className="font-label-sm text-primary uppercase font-bold tracking-wider">Mevcut Seçim</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">shopping_basket</span>
                    <span>Seçilen Sepet İstasyonu: İstasyon {selectedStation.toString().padStart(2, '0')}</span>
                    <span className="text-text-muted font-body-sm font-normal hidden sm:inline">(Zemin Kat - Sol Blok)</span>
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[15px] text-emerald-400">check_circle</span>
                    <span>Durum: Sepet bırakmaya uygun • Görevli sırasına eklenecek</span>
                  </div>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Floating Sticky Action Bar */}
          <div className="pt-space-xs mt-6">
            <button 
              className={`w-full py-4 px-space-md rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2 transition-transform ${
                selectedStation 
                  ? 'bg-primary text-on-primary shadow-[0_4px_24px_rgba(197,160,89,0.35)] active:scale-[0.99]' 
                  : 'bg-surface-variant text-text-muted cursor-not-allowed opacity-50'
              }`} 
              type="button"
              disabled={!selectedStation}
              onClick={() => navigate('/laundry/step2')}
            >
              <span>Devam Et: Yıkama Modu Seçimi</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default LaundryStep1;
