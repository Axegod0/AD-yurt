import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceBadge from '../components/BalanceBadge';
import { supabase } from '../supabase';

const LaundryStep4 = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [balance, setBalance] = useState(0);

  const selectedStation = localStorage.getItem('laundry_selected_station') || 'İstasyon 04';
  const selectedProgram = JSON.parse(localStorage.getItem('laundry_selected_program') || '{"name":"Günlük Pamuklu","temp":"40°C","time":"45 Dk","price":18}');
  const selectedSoftener = JSON.parse(localStorage.getItem('laundry_softener') || '{"type":"dorm","cost":5}');
  
  const currentBasketCost = selectedProgram.price + selectedSoftener.cost;
  const currentBasket = { station: selectedStation, program: selectedProgram, softener: selectedSoftener, cost: currentBasketCost };

  const previousBaskets = JSON.parse(localStorage.getItem('laundry_baskets') || '[]');
  const allBaskets = [...previousBaskets, currentBasket];
  
  const totalCost = allBaskets.reduce((acc, b) => acc + b.cost, 0);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('balance')
          .eq('id', user.id)
          .single();
        if (data) setBalance(data.balance || 0);
      }
    };
    fetchBalance();
  }, []);

  const canAfford = balance - totalCost >= 0;

  const handleCancelAll = () => {
    localStorage.removeItem('laundry_baskets');
    localStorage.removeItem('laundry_selected_station');
    localStorage.removeItem('laundry_selected_program');
    localStorage.removeItem('laundry_softener');
    navigate('/laundry/step1');
  };

  const handleAddBasket = () => {
    localStorage.setItem('laundry_baskets', JSON.stringify(allBaskets));
    localStorage.removeItem('laundry_selected_station');
    localStorage.removeItem('laundry_selected_program');
    localStorage.removeItem('laundry_softener');
    navigate('/laundry/step1');
  };

  const handlePayment = async () => {
    if (!canAfford) return;
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum açık değil.");

      // Atomically update balance and create transaction via secure RPC
      const { error: rpcError } = await supabase.rpc('process_laundry_payment', {
        user_id_param: user.id,
        total_cost: totalCost,
        order_count: allBaskets.length
      });

      if (rpcError) throw new Error(rpcError.message || 'Ödeme işlemi başarısız oldu.');

      // 3. Create laundry orders for all baskets
      const orderInserts = allBaskets.map(basket => ({
        user_id: user.id,
        status: 'pending',
        station: basket.station,
        mode: basket.program.name,
        softener: basket.softener.type === 'dorm' ? 'Yurt Yumuşatıcısı' : (basket.softener.type === 'self' ? 'Kişisel' : 'Yok'),
        cost: basket.cost,
        progress_label: 'Sıra Bekliyor',
        time_left: `Sırada`
      }));

      await supabase.from('laundry_orders').insert(orderInserts);

      // Eski sistem ile uyumluluk için stations tablosunu da güncelle
      try {
        for (const basket of allBaskets) {
          const stationNum = parseInt((basket.station || '').replace(/\D/g, ''));
          if (stationNum) {
            await supabase.from('stations').update({ status: 'busy' }).eq('id', stationNum);
          }
        }
      } catch (stErr) {
        console.warn("Could not update stations table:", stErr);
      }

      // Clean up localStorage
      localStorage.removeItem('laundry_baskets');
      localStorage.removeItem('laundry_selected_station');
      localStorage.removeItem('laundry_selected_program');
      localStorage.removeItem('laundry_softener');

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/laundry');
      }, 1500);

    } catch (err) {
      console.error(err);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveBasket = (indexToRemove) => {
    const updatedBaskets = allBaskets.filter((_, idx) => idx !== indexToRemove);
    if (updatedBaskets.length === 0) {
      localStorage.removeItem('laundry_baskets');
      navigate('/laundry');
    } else {
      localStorage.setItem('laundry_baskets', JSON.stringify(updatedBaskets));
      setAllBaskets(updatedBaskets);
    }
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#07090e] text-[#0F172A] dark:text-white font-body-md text-body-md flex flex-col min-h-screen selection:bg-brand-gold/30 antialiased transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#C5A059]/15 shadow-sm transition-colors">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-700 dark:text-white hover:text-brand-gold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-[#0F172A] dark:text-white tracking-tight uppercase truncate">Sipariş Onay</h1>
          </div>
          <div className="flex items-center gap-2">
            <BalanceBadge />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-safe bg-[#F8FAFC] dark:bg-[#07090e] min-h-screen transition-colors duration-300">
        <div className="flex flex-col w-full px-4 pb-10 space-y-4 text-[#0F172A] dark:text-white">
          
          {/* Stepper & Flow Indicator */}
          <div className="flex flex-col bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-2xl p-4 space-y-3 shadow-sm transition-colors">
            <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold">
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="material-symbols-outlined text-[16px] text-[#C5A059]">fact_check</span>
                ADIM 4 / 4 • SİPARİŞ ÖZETİ & ONAY
              </span>
              <span className="text-amber-800 font-bold">%100 Tamamlandı</span>
            </div>
            <div className="w-full flex gap-1.5 h-1.5">
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-sm"></div>
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-sm"></div>
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-sm"></div>
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-sm"></div>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              <div className="flex flex-col items-center text-center gap-1 text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-400">1. Sepet</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-400">2. Program</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-400">3. Yumuşatıcı</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-[#0F172A] dark:text-white">
                <div className="w-6 h-6 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-bold leading-tight text-amber-900 dark:text-[#C5A059]">4. Onay</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                Sipariş Özeti
              </h2>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
                Hazır
              </span>
            </div>
            <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400">
              Seçtiğiniz yıkama detaylarını kontrol edin ve onaylayın.
            </p>
          </div>

          {/* Render All Baskets */}
          <div className="flex flex-col gap-4">
            {allBaskets.map((basket, index) => (
              <div key={index} className="flex flex-col bg-white dark:bg-[#0f1523] rounded-2xl p-4 space-y-4 border border-slate-200/90 dark:border-white/5 shadow-sm relative overflow-hidden transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#C5A059]/10 border border-amber-200/50 dark:border-[#C5A059]/20 flex items-center justify-center text-amber-700 dark:text-[#C5A059] shadow-sm">
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_laundry_service</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-[#0F172A] dark:text-white">{index + 1}. Sepet: {basket.station}</span>
                      <span className="font-label-sm text-label-sm text-[#C5A059] font-semibold">{basket.program.name}</span>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveBasket(index)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 flex items-center justify-center text-red-500 transition-colors active:scale-95" type="button" title="Sepeti Sil">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div className="flex flex-col space-y-2.5 pt-1">
                  <div className="flex items-start justify-between gap-3 text-body-sm font-body-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                      Makine Konumu
                    </span>
                    <span className="text-[#0F172A] dark:text-white text-right font-medium">{basket.station}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-body-sm font-body-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">tune</span>
                      Program & Sıcaklık
                    </span>
                    <span className="text-[#0F172A] dark:text-white text-right font-medium">{basket.program.name} ({basket.program.temp}) <span className="text-amber-800 dark:text-[#C5A059] font-bold ml-1">{basket.program.price} AD</span></span>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-body-sm font-body-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">sanitizer</span>
                      Yumuşatıcı
                    </span>
                    <span className="text-[#0F172A] dark:text-white text-right font-medium">{basket.softener.type === 'dorm' ? 'Yurt Yumuşatıcısı' : (basket.softener.type === 'self' ? 'Kendi Ürünüm' : 'İstemiyorum')} <span className="text-amber-800 dark:text-[#C5A059] font-bold ml-1">{basket.softener.cost} AD</span></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-1 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl transition-colors">
                  <span className="font-label-md text-label-md text-slate-600 dark:text-slate-300 font-medium">Sepet Ara Toplamı</span>
                  <div className="flex items-center gap-1.5 text-amber-900 dark:text-[#C5A059]">
                    <img alt="AD Coin" className="w-4 h-4 object-contain brightness-0 invert opacity-60 dark:opacity-100" style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(35%) saturate(760%) hue-rotate(352deg) brightness(97%) contrast(93%)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUeSH1vw1vxBodoRvkLk8rz0sHjz7dl6PHTd8cHSFdD_WTFnA5bTXgyTAab-c1PRv-uyHV2u5Z4i71b9RDXShsvOWQWBLuFlC4d7fOlSGg7E5htsxjLhR5i6KiVmYRg8N0tmVS9gNGLZ-Eb0tPG3HXVWw57ulN38_Lk3qYnxUrXkKMsJ4oXxlOVQ-JGbR3W7KzI1kV_vE0GxZvajAWsdlEpwFqz0460V4YEJW_reqo-RAAFHhf19IHuK9u-DdC8cDPy-E" />
                    <span className="font-headline-sm text-headline-sm font-bold">{basket.cost} AD Coin</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Basket Action Area */}
          <div className="flex flex-col bg-white dark:bg-[#0f1523] rounded-2xl p-4 space-y-3 border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-[#C5A059]/50 transition-colors shadow-sm relative overflow-hidden mt-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-[#C5A059] font-headline-sm text-headline-sm">
              <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 border border-amber-200/60 dark:border-[#C5A059]/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
              </div>
              <span>Yeni Bir Sepet / Makine Ekle</span>
            </div>
            <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Aynı anda başka bir makine (örneğin beyazlar veya renkliler için) çalıştırmak için sepet ekleyin.
            </p>
            <div className="pt-1">
              <button onClick={handleAddBasket} className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-amber-50/70 dark:hover:bg-[#C5A059]/10 border border-slate-200 dark:border-white/10 hover:border-amber-200 dark:hover:border-[#C5A059]/30 text-slate-700 dark:text-slate-300 hover:text-amber-900 dark:hover:text-[#C5A059] font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-semibold" type="button">
                <span className="material-symbols-outlined text-[16px]">add</span>
                {allBaskets.length + 1}. Sepeti Ekle
              </button>
            </div>
          </div>

          {/* Premium Pricing & Balance Breakdown Panel */}
          <div className="flex flex-col mt-6 space-y-4">
            <div className="bg-gradient-to-b from-[#0F172A] to-[#07090e] border border-slate-700/50 dark:border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="font-headline-sm text-headline-sm text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C5A059] text-[20px]">receipt_long</span>
                  Ödeme Özeti
                </span>
                <span className="font-label-sm text-label-sm text-slate-400 uppercase tracking-wider font-semibold">{allBaskets.length} İşlem</span>
              </div>
              
              <div className="flex flex-col space-y-3 relative z-10">
                <div className="flex items-center justify-between text-body-sm font-body-sm pb-3 border-b border-white/5">
                  <span className="text-slate-300">Sepet Toplamı ({allBaskets.length} Yıkama)</span>
                  <span className="text-white font-semibold">{totalCost} AD Coin</span>
                </div>
                
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-[#C5A059] uppercase font-bold tracking-wider">Ödenecek Net Tutar</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#C5A059]/10 border border-[#C5A059]/20 px-3 py-1.5 rounded-xl">
                    <span className="material-symbols-outlined text-[#C5A059] text-[18px]">account_balance_wallet</span>
                    <span className="font-display-hero text-headline-lg text-[#C5A059] font-extrabold tracking-tight">{totalCost} AD</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-2.5 relative z-10">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-slate-400">Mevcut Cüzdan Bakiyesi:</span>
                  <span className={`${!canAfford ? 'text-red-400' : 'text-slate-200'} font-bold`}>{balance} AD Coin</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-slate-400">İşlem Sonrası Kalan:</span>
                  <div className="flex items-center gap-2">
                    <span className={`${!canAfford ? 'text-red-400' : 'text-emerald-400'} font-semibold`}>{balance - totalCost} AD Coin</span>
                    {canAfford ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Yeterli
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        Yetersiz
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Notification Option Checkbox */}
          <label className="flex items-start gap-3 select-none cursor-pointer bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-3.5 rounded-2xl shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 mt-4">
            <div className="relative flex items-center justify-center mt-0.5">
              <input defaultChecked className="peer sr-only" type="checkbox" />
              <div className="w-5 h-5 rounded-md border border-slate-300 dark:border-white/20 bg-white dark:bg-black flex items-center justify-center peer-checked:bg-[#C5A059] peer-checked:border-[#C5A059] transition-all">
                <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-body-md text-[#0F172A] dark:text-white font-medium leading-snug">
                Yıkama bitimine 5 dakika kala SMS & anlık bildirim gönder
              </span>
              <span className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400">
                Sepetinizi bekletmeden teslim almanız için hatırlatıcı kurulur.
              </span>
            </div>
          </label>

          <div className="flex flex-col space-y-space-sm pt-2">
            <button 
              onClick={handlePayment}
              disabled={!canAfford || isProcessing || isSuccess}
              className={`w-full py-4 px-6 rounded-2xl ${canAfford ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#b38f46] hover:from-[#c5a059] hover:to-[#a88237] shadow-[0_6px_20px_rgba(197,160,89,0.35)] active:scale-[0.98] text-slate-900' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 cursor-not-allowed'} font-headline-md text-headline-md flex items-center justify-center gap-2 transition-all ${isProcessing || isSuccess ? 'opacity-90 pointer-events-none' : ''}`}
              type="button"
            >
              {isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="font-bold">Sipariş Başlatıldı!</span>
                </>
              ) : isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span className="font-bold">Ödeme İşleniyor...</span>
                </>
              ) : !canAfford ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span className="font-bold">Yetersiz Bakiye</span>
                </>
              ) : (
                <>
                  <img alt="Coin" className="w-5 h-5 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaHodVw6a-3BmznVSVElMGZL6SSAj_45ZtXeVELUmmPwiHnRZbcNtpAlF5nQvTp4OvoNUiOYrvTPGhLGV8Zq3kaz3UDZ264iNWfCVUtgp4T_QKYwy7r-EgxQTfmY872po0gl_1kkiCmsUaoQFkZ9GG1IqKniSvYyZuz_Fc1KEocdf-e0byaLgvwI8wQZLEYWtWpenX9gXenhMg9rxnxMz7N5ia4HT_d9LDh_7A1WeTGCmfAlDKXmEL64WsdqQ0cH9LYw4" />
                  <span className="font-bold tracking-tight">{totalCost} AD Coin ile Öde ve Başlat</span>
                  <span className="material-symbols-outlined text-[20px] text-slate-900">arrow_forward</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all" type="button">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span className="font-bold">Geri Dön</span>
              </button>
              <button onClick={() => { localStorage.removeItem('laundry_baskets'); navigate('/laundry'); }} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all" type="button">
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span className="font-bold">İptal Et</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-center text-slate-500 font-body-sm text-body-sm px-2 pt-2">
              <span className="material-symbols-outlined text-[15px] text-[#C5A059] shrink-0">lock</span>
              <span>Ödeme onaylandığında siparişiniz aktifleşir ve Çamaşırhane Ana Sayfasına yönlendirilirsiniz.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaundryStep4;
