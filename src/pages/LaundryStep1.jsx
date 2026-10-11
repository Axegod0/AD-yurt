import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const LaundryStep1 = () => {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState(null);
  const [busyStations, setBusyStations] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      // 1. Eski sistemin stations tablosundan 'busy' olanları al
      const { data: stationData } = await supabase
        .from('stations')
        .select('id, status');

      // 2. Yeni sistemin aktif siparişlerinden istasyonları al
      const { data: orderData } = await supabase
        .from('laundry_orders')
        .select('station')
        .in('status', ['pending', 'active', 'washing']);
        
      const busySet = new Set();
      if (stationData) {
        stationData.filter(s => s.status === 'busy').forEach(s => busySet.add(s.id));
      }
      if (orderData) {
        orderData.forEach(order => {
          const num = parseInt((order.station || '').replace(/\D/g, ''));
          if (num) busySet.add(num);
        });
      }
      setBusyStations(Array.from(busySet));
    };
    fetchStations();
  }, []);

  const stations = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    const isBusy = busyStations.includes(id);
    return {
      id,
      status: isBusy ? 'waiting' : 'free',
      name: id > 10 ? 'Geniş Sepet' : 'Standart'
    };
  });

  const handleSelect = (id) => {
    const station = stations.find(s => s.id === id);
    if (station.status === 'free' && !isTransitioning) {
      setSelectedStation(id);
      setIsTransitioning(true);
      
      // Save selected station locally to pass to next steps
      localStorage.setItem('laundry_selected_station', `İstasyon ${id.toString().padStart(2, '0')}`);
      
      setTimeout(() => {
        navigate('/laundry/step2');
      }, 400); // 400ms delay for animation
    }
  };

  const hasSelection = localStorage.getItem('laundry_selected_station');

  return (
    <div className={`bg-[#F8FAFC] dark:bg-[#07090e] text-[#0F172A] dark:text-white font-sans flex flex-col min-h-screen selection:bg-[#C5A059]/30 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header Section */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#C5A059]/15 shadow-sm transition-colors duration-300">
        <div className="h-16 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-700 dark:text-white hover:text-[#C5A059] dark:hover:text-[#C5A059] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors active:scale-95" 
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight uppercase truncate">Makine Detay</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-amber-50/80 dark:bg-[#C5A059]/10 border border-amber-200/60 dark:border-[#C5A059]/20 px-3 py-1.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-amber-600 dark:text-[#C5A059] text-[18px]">monetization_on</span>
              <span className="text-[13px] text-amber-800 dark:text-[#C5A059] font-bold tracking-tight">AD Coin</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-safe bg-[#F8FAFC] dark:bg-[#07090e] min-h-screen transition-colors duration-300">
        <div className="flex flex-col w-full px-5 pb-32 space-y-4">
          
          {/* Stepper Header */}
          <div className="flex flex-col bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-2xl p-4 shadow-sm mb-1 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span className="text-[#C5A059] uppercase tracking-wider font-bold text-[11px]">ADIM 1 / 4 • SEPET İSTASYONU</span>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 text-amber-800 dark:text-[#C5A059] border border-amber-200/60 dark:border-[#C5A059]/30 font-semibold">%25 Tamamlandı</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              <div className="h-1.5 rounded-full bg-[#C5A059] shadow-sm"></div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-1">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#0F172A] dark:bg-black text-[#C5A059] flex items-center justify-center mb-1 shadow-sm ring-2 ring-[#C5A059]/30">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_basket</span>
                </div>
                <span className="text-[#0F172A] dark:text-white font-bold text-[11px]">1. Sepet</span>
              </div>
              <div className="flex flex-col items-center opacity-50">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-1 border border-slate-200 dark:border-white/5">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">2. Program</span>
              </div>
              <div className="flex flex-col items-center opacity-50">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-1 border border-slate-200 dark:border-white/5">
                  <span className="material-symbols-outlined text-[16px]">soap</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">3. Yumuşatıcı</span>
              </div>
              <div className="flex flex-col items-center opacity-50">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-1 border border-slate-200 dark:border-white/5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">4. Onay</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex flex-col min-w-0">
              <h2 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">Sepet Bırakma İstasyonu Seçin</h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">Kirli çamaşır sepetinizi bırakacağınız 1-12 arasındaki boş sepet istasyonunu seçin. Görevli sepetinizi buradan teslim alacaktır.</p>
            </div>
          </div>

          {/* Legend Status Filter / Info */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f1523] border border-slate-200/70 dark:border-white/5 shadow-sm text-[11px] transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Boş</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Sırada Bekliyor</span>
            </div>
          </div>

          {/* 3-Column Washing Machine Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {stations.map(station => {
              if (station.status === 'free') {
                const isSelected = selectedStation === station.id;
                return (
                  <button 
                    key={station.id}
                    onClick={() => handleSelect(station.id)}
                    className={`text-left p-3 rounded-xl transition-all flex flex-col justify-between h-32 relative shadow-sm ${isSelected ? 'bg-[#0F172A] text-[#C5A059] border-2 border-[#C5A059] active:scale-[0.98] shadow-md dark:bg-black' : 'bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 active:scale-[0.98]'}`}
                    type="button"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-[12px] font-extrabold text-[#C5A059]' : 'text-slate-800 dark:text-slate-300'}`}>#{station.id.toString().padStart(2, '0')}</span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-[#C5A059] text-[#0F172A] flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[11px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <div className={`flex flex-col items-center justify-center my-auto ${isSelected ? 'text-[#C5A059]' : ''}`}>
                      <span className={`material-symbols-outlined ${isSelected ? 'text-[30px]' : 'text-[28px] text-slate-400'}`} style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_basket</span>
                      <span className={`mt-1 font-bold ${isSelected ? 'text-[11px] text-[#C5A059] uppercase tracking-tight' : 'text-[11px] text-emerald-600 dark:text-emerald-400'}`}>{isSelected ? 'Seçildi' : 'Boş'}</span>
                    </div>
                    <div className={`flex items-center justify-between w-full text-[10px] font-medium ${isSelected ? 'text-[#C5A059]' : 'text-slate-400'}`}>
                      <span>{station.name}</span>
                      <span className={`material-symbols-outlined ${isSelected ? 'text-[14px]' : 'text-[13px]'}`}>{isSelected ? 'done_all' : 'arrow_forward'}</span>
                    </div>
                  </button>
                );
              } else if (station.status === 'busy' || station.status === 'waiting') {
                return (
                  <div key={station.id} className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-left flex flex-col justify-between h-32 relative">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">#{station.id.toString().padStart(2, '0')}</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    </div>
                    <div className="flex flex-col items-center justify-center my-auto text-amber-700 dark:text-[#C5A059]">
                      <span className="material-symbols-outlined text-[24px]">schedule</span>
                      <span className="text-[10px] text-amber-800 dark:text-[#C5A059] mt-1 font-bold text-center leading-tight">Sırada Bekliyor</span>
                    </div>
                    <div className="flex items-center justify-between w-full text-slate-500 dark:text-slate-400 text-[10px] font-medium">
                      <span>Dolu</span>
                      <span className="material-symbols-outlined text-[13px] text-amber-600 dark:text-[#C5A059]">timelapse</span>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

        </div>
      </main>
      
      {hasSelection && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl px-4 py-3 border-t border-slate-100 dark:border-white/5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-safe transition-colors">
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Seçili İstasyon</span>
              <span className="font-display-hero text-headline-sm text-[#0F172A] dark:text-white font-bold">{hasSelection}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button onClick={() => navigate('/laundry/step2')} className="h-12 px-4 rounded-xl bg-[#C5A059] hover:bg-[#b8934a] text-white font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(197,160,89,0.35)] active:scale-[0.98] transition-all flex-1 max-w-[200px]" type="button">
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

export default LaundryStep1;
