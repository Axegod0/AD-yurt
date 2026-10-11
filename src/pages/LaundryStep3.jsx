import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceBadge from '../components/BalanceBadge';

const LaundryStep3 = () => {
  const navigate = useNavigate();
  const [careOption, setCareOption] = useState('dorm');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const selectedStation = localStorage.getItem('laundry_selected_station') || 'İstasyon 04';
  const selectedProgram = JSON.parse(localStorage.getItem('laundry_selected_program') || '{"name":"Günlük Pamuklu","temp":"40°C","time":"45 Dk","price":18}');

  const baseCost = selectedProgram.price;
  const softenerCost = careOption === 'dorm' ? 5 : 0;
  const totalCost = baseCost + softenerCost;

  const handleNext = () => {
    localStorage.setItem('laundry_softener', JSON.stringify({ type: careOption, cost: softenerCost }));
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/laundry/step4');
    }, 400);
  };

  return (
    <div className={`bg-[#F8FAFC] dark:bg-[#07090e] text-[#0F172A] dark:text-white font-sans flex flex-col min-h-screen selection:bg-[#C5A059]/20 antialiased transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-100 dark:border-[#C5A059]/15 shadow-sm transition-colors duration-300">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-1 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex items-center justify-center text-slate-700 dark:text-white hover:text-[#C5A059] dark:hover:text-[#C5A059] transition-colors active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-[#0F172A] dark:text-white tracking-tight uppercase truncate">Makine Detay</h1>
          </div>
          <div className="flex items-center gap-2">
            <BalanceBadge />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe bg-[#F8FAFC] dark:bg-[#07090e] min-h-screen transition-colors duration-300">
        <div className="flex flex-col w-full pb-28">
          
          <section className="px-4 pt-4">
            <div className="bg-white dark:bg-[#0f1523] border border-slate-200/80 dark:border-white/5 rounded-2xl p-4 mb-4 shadow-sm relative overflow-hidden transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-[#C5A059] uppercase tracking-wider font-bold">ADIM 3 / 4 • YUMUŞATICI & BAKIM</span>
                <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 font-semibold">%75 Tamamlandı</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 my-2.5">
                <div className="h-1.5 rounded-full bg-[#C5A059]"></div>
                <div className="h-1.5 rounded-full bg-[#C5A059]"></div>
                <div className="h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></div>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2 items-start text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-slate-700 dark:text-slate-300 font-medium truncate w-full">1. Sepet</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-slate-700 dark:text-slate-300 font-medium truncate w-full">2. Program</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#C5A059] text-white font-bold flex items-center justify-center shadow-md ring-2 ring-[#C5A059]/30">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#C5A059] font-bold truncate w-full">3. Yumuşatıcı</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-slate-400 truncate w-full">4. Onay</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#C5A059] text-[18px]">local_laundry_service</span>
                  <p className="font-label-md text-label-md text-[#0F172A] dark:text-white font-medium truncate">{selectedStation} • {selectedProgram.name} ({selectedProgram.temp}) • {selectedProgram.time}</p>
                </div>
                <span className="bg-amber-100/70 dark:bg-[#C5A059]/10 text-amber-900 dark:text-[#C5A059] border border-[#C5A059]/30 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold flex-shrink-0">Hazır</span>
              </div>
            </div>
          </section>

          <section className="px-4 mt-2">
            <h2 className="font-headline-lg text-headline-lg text-[#0F172A] dark:text-white tracking-tight">Yumuşatıcı & Bakım Tercihi</h2>
            <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 mt-1">
              Yurt otomatından lüks kokulu yumuşatıcı ekleyebilir veya kendi ürününüzü kullanabilirsiniz.
            </p>
          </section>


          <section className="px-4 mt-4 flex flex-col gap-4">
            
            {/* Option 1 */}
            <div onClick={() => setCareOption('dorm')} className={`cursor-pointer bg-white dark:bg-[#0f1523] rounded-2xl p-4 shadow-sm transition-all relative overflow-hidden ${careOption === 'dorm' ? 'border-2 border-[#C5A059]' : 'border border-slate-200/80 dark:border-white/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${careOption === 'dorm' ? 'bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059]' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[22px]">spa</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-[#0F172A] dark:text-white">Yumuşatıcı İstiyorum</h4>
                    <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mt-1">
                      Yurt deposundan profesyonel Yumoş/Vernel ekstra kalıcı koku & doku koruma formülü otomatik dozlanır.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`${careOption === 'dorm' ? 'bg-[#C5A059] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'} font-headline-sm text-headline-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
                    +5 AD
                  </span>
                  <span className={`material-symbols-outlined text-[24px] mt-2 ${careOption === 'dorm' ? 'text-[#C5A059]' : 'text-slate-300 dark:text-slate-600'}`} style={careOption === 'dorm' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {careOption === 'dorm' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Option 2 */}
            <div onClick={() => setCareOption('self')} className={`cursor-pointer bg-white dark:bg-[#0f1523] rounded-2xl p-4 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20 ${careOption === 'self' ? 'border-2 border-[#C5A059]' : 'border border-slate-200/80 dark:border-white/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${careOption === 'self' ? 'bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059]' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[22px]">water_bottle</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-[#0F172A] dark:text-white">Kendi Yumuşatıcımı Kullanacağım</h4>
                    <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mt-1">
                      Sepetin içine bıraktığınız yumuşatıcıyı kullanırız.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-headline-sm text-headline-sm px-2.5 py-1 rounded-full font-semibold">
                    0 AD
                  </span>
                  <span className={`material-symbols-outlined text-[24px] mt-2 ${careOption === 'self' ? 'text-[#C5A059]' : 'text-slate-300 dark:text-slate-600'}`} style={careOption === 'self' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {careOption === 'self' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Option 3 */}
            <div onClick={() => setCareOption('none')} className={`cursor-pointer bg-white dark:bg-[#0f1523] rounded-2xl p-4 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20 ${careOption === 'none' ? 'border-2 border-[#C5A059]' : 'border border-slate-200/80 dark:border-white/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${careOption === 'none' ? 'bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059]' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[22px]">block</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-[#0F172A] dark:text-white">Yurt Yumuşatıcısı İstemiyorum</h4>
                    <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mt-1">
                      Sadece standart çamaşır deterjanı ile yıkanır; ek koku veya yumuşatıcı ilave edilmez.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-headline-sm text-headline-sm px-2.5 py-1 rounded-full font-semibold">
                    0 AD
                  </span>
                  <span className={`material-symbols-outlined text-[24px] mt-2 ${careOption === 'none' ? 'text-[#C5A059]' : 'text-slate-300 dark:text-slate-600'}`} style={careOption === 'none' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {careOption === 'none' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              </div>
            </div>

          </section>


          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl px-4 py-3 border-t border-slate-100 dark:border-white/5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-safe transition-colors">
            <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Toplam Tutar</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#C5A059] text-[20px]">monetization_on</span>
                  <span className="font-display-hero text-headline-lg text-[#0F172A] dark:text-white font-extrabold">{totalCost} AD</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <button onClick={() => navigate(-1)} className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex items-center justify-center text-slate-700 dark:text-white hover:text-[#0F172A] dark:hover:text-[#C5A059] hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                </button>
                <button onClick={handleNext} className="h-12 px-4 rounded-xl bg-[#C5A059] hover:bg-[#b8934a] text-white font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(197,160,89,0.35)] active:scale-[0.98] transition-all flex-1 max-w-[200px]" type="button">
                  <span className="font-bold">Devam Et</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LaundryStep3;
