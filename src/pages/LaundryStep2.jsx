import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceBadge from '../components/BalanceBadge';

const LaundryStep2 = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const programs = [
    { name: '30° Sentetik', price: 15, desc: 'Sentetik Programı', icon: 'checkroom' },
    { name: '40° Sentetik', price: 15, desc: 'Sentetik Programı', icon: 'styler', popular: true },
    { name: '30° Hassas', price: 15, desc: 'Narin Bakım', icon: 'spa' },
    { name: '30° Yünlü', price: 15, desc: 'Yünlü Koruması', icon: 'dry_cleaning' },
    { name: '30° Mix', price: 15, desc: 'Karışık Yıkama', icon: 'layers' },
    { name: '20° Pamuklu', price: 15, desc: 'Eko Pamuklu', icon: 'local_laundry_service', eco: true },
    { name: '30° Pamuklu', price: 15, desc: 'Standart Pamuklu', icon: 'local_laundry_service' },
    { name: '40° Pamuklu', price: 15, desc: 'Standart Pamuklu', icon: 'local_laundry_service' },
    { name: '60° Pamuklu', price: 15, desc: 'Yoğun & Hijyen', icon: 'local_laundry_service' },
    { name: '15 DK KISA', price: 10, desc: 'Hızlı Program', icon: 'timer' },
  ];

  const handleSelect = (prog) => {
    if (!isTransitioning) {
      setSelectedProgram(prog);
      setIsTransitioning(true);
      
      localStorage.setItem('laundry_selected_program', JSON.stringify(prog));
      
      setTimeout(() => {
        navigate('/laundry/step3');
      }, 400);
    }
  };

  const savedProgram = JSON.parse(localStorage.getItem('laundry_selected_program') || 'null');

  return (
    <div className={`bg-[#F8FAFC] dark:bg-[#07090e] text-[#0F172A] dark:text-white font-body-md text-body-md flex flex-col min-h-screen selection:bg-brand-gold/30 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/95 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-100 dark:border-[#C5A059]/15 shadow-sm transition-colors duration-300">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-700 dark:text-white hover:text-[#C5A059] dark:hover:text-[#C5A059] transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-[#0F172A] dark:text-white tracking-tight uppercase truncate">Makine Detay</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <BalanceBadge />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe bg-[#F8FAFC] dark:bg-[#07090e] min-h-screen transition-colors duration-300">
        <div className="flex flex-col w-full pb-28">
          <div className="px-4 pt-4 flex flex-col gap-4">
            {/* Stepper Panel */}
            <div className="bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-sm transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-label-sm text-label-sm text-[#C5A059] uppercase tracking-wider font-bold">ADIM 2 / 4 • YIKAMA PROGRAMI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-amber-700 dark:text-amber-500 font-semibold">%50 Tamamlandı</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                <div className="bg-[#C5A059] rounded-full h-full"></div>
                <div className="bg-[#C5A059] rounded-full h-full"></div>
                <div className="bg-slate-200 dark:bg-white/10 rounded-full h-full"></div>
                <div className="bg-slate-200 dark:bg-white/10 rounded-full h-full"></div>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#C5A059] font-medium truncate w-full">1. Sepet</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-9 h-9 rounded-full bg-[#0F172A] dark:bg-black text-[#C5A059] flex items-center justify-center shadow-md ring-2 ring-[#C5A059]/50">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#0F172A] dark:text-white font-bold truncate w-full">2. Program</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center opacity-50">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-slate-400 truncate w-full">3. Yumuşatıcı</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center opacity-50">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-slate-400 truncate w-full">4. Onay</span>
                </div>
              </div>
            </div>

            {/* Headings */}
            <div className="flex flex-col gap-1 px-1">
              <h2 className="font-headline-lg text-headline-lg text-[#0F172A] dark:text-white tracking-tight">Yıkama Programını Belirleyin</h2>
              <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400">Çamaşırlarınızın türüne uygun sıcaklık ve devir modunu seçin.</p>
            </div>

            {/* Program List */}
            <div className="flex flex-col gap-3">
              {programs.map(prog => {
                const isSelected = selectedProgram?.name === prog.name;
                return (
                  <div 
                    key={prog.name}
                    onClick={() => handleSelect(prog)}
                    className={`cursor-pointer p-4 rounded-2xl transition-all duration-200 active:scale-[0.99] flex flex-col gap-1.5 shadow-sm ${isSelected ? 'relative bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 dark:from-[#C5A059]/10 dark:to-transparent border-2 border-[#C5A059] shadow-[0_8px_20px_rgba(197,160,89,0.14)]' : 'bg-white dark:bg-[#0f1523] hover:bg-slate-50/80 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-amber-100/70 border border-[#C5A059]/40 text-amber-700' : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-slate-700 dark:text-slate-300'}`}>
                          <span className="material-symbols-outlined text-[20px]">{prog.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-headline-sm text-headline-sm text-[#0F172A] dark:text-white truncate">{prog.name}</span>
                            {prog.popular && <span className="bg-[#C5A059] text-white font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wide shadow-sm">Popüler</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {prog.eco && <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-label-sm text-label-sm px-1.5 py-0.5 rounded font-medium text-[10px]">Eco 20°C</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${isSelected ? 'bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/30 dark:border-[#C5A059]/30' : 'bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5'}`}>
                          <span className="material-symbols-outlined text-[#C5A059] text-[15px]">monetization_on</span>
                          <span className={`font-headline-sm text-headline-sm font-bold ${isSelected ? 'text-amber-900 dark:text-[#C5A059]' : 'text-slate-800 dark:text-white'}`}>{prog.price} AD</span>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#C5A059] flex items-center justify-center text-white shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`font-body-sm text-body-sm pl-[52px] ${isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{prog.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>

      {savedProgram && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl px-4 py-3 border-t border-slate-100 dark:border-white/5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-safe transition-colors">
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Seçili Program</span>
              <span className="font-display-hero text-headline-sm text-[#0F172A] dark:text-white font-bold">{savedProgram.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button onClick={() => navigate('/laundry/step1')} className="h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all" type="button">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <button onClick={() => navigate('/laundry/step3')} className="h-12 px-4 rounded-xl bg-[#C5A059] hover:bg-[#b8934a] text-white font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(197,160,89,0.35)] active:scale-[0.98] transition-all flex-1 max-w-[200px]" type="button">
                <span className="font-bold">Devam Et</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryStep2;
