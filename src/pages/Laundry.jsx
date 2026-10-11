import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { supabase } from '../supabase';

const Laundry = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [busyStationCount, setBusyStationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('laundry_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setActiveOrders(data.filter(o => o.status === 'pending' || o.status === 'active'));
        setPastOrders(data.filter(o => o.status === 'completed' || o.status === 'canceled').slice(0, 10));
      }
      
      const { data: allOrders } = await supabase
        .from('laundry_orders')
        .select('id')
        .in('status', ['pending', 'active']);
      
      if (allOrders) {
        setBusyStationCount(allOrders.length);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#07090e] text-[#0F172A] dark:text-white font-sans flex flex-col min-h-screen selection:bg-[#C5A059]/20 antialiased transition-colors duration-300">
      <Header title="Çamaşırhane" showUserName={false} />

      {/* Main Scrollable Body */}
      <main className="flex flex-col relative w-full pt-16 pb-28 min-h-screen">
        <div className="flex flex-col w-full px-5 py-3 space-y-4">
          
          {/* Konum & Canlı İstasyon Durum Özeti Bandı */}
          <div className="flex items-center justify-between bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-3.5 rounded-2xl shadow-sm transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#C5A059]/10 border border-amber-200/60 dark:border-[#C5A059]/20 flex items-center justify-center text-amber-700 dark:text-[#C5A059] shrink-0">
                <span className="material-symbols-outlined text-[22px]">shopping_basket</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-[#0F172A] dark:text-white truncate">Sepet İstasyonları</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Sepet Bırakma Alanı (3. Kat)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/70 dark:border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 tracking-tight">{12 - busyStationCount} Boş / {busyStationCount} Dolu</span>
            </div>
          </div>

          {/* Aktif Yıkama Takip Bölümü */}
          {activeOrders.length > 0 && (
            <div className="flex flex-col space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C5A059] text-[20px]">motion_photos_on</span>
                  <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">Aktif Siparişim</h2>
                </div>
                <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-widest bg-amber-50 dark:bg-[#C5A059]/10 border border-amber-200/70 dark:border-[#C5A059]/20 px-2.5 py-0.5 rounded-full">Canlı Akış</span>
              </div>
              
              {/* Canlı Ana Takip Kartı */}
              {activeOrders.map((order, idx) => (
                <div key={order.id} className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-4 shadow-sm mb-3 transition-colors">
                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex flex-col space-y-3.5 relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-[#C5A059]/10 border border-amber-200/70 dark:border-[#C5A059]/20 flex items-center justify-center shrink-0 shadow-sm text-amber-700 dark:text-[#C5A059]">
                          <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-bold text-[#0F172A] dark:text-white truncate">{idx + 1}. Sepetim • {order.station}</span>
                          <span className="text-[12px] text-slate-500 dark:text-slate-400 truncate">Zemin Kat Sol Blok Sepet Alanı</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-[#C5A059]/10 border border-amber-300/80 dark:border-[#C5A059]/20 px-2.5 py-1 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-[#C5A059] animate-ping"></span>
                        <span className="text-[10px] font-bold text-amber-900 dark:text-[#C5A059] tracking-wide uppercase">{order.status === 'active' ? 'ÇALIŞIYOR' : 'SIRADA BEKLİYOR'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-amber-700 dark:text-[#C5A059] text-[18px] shrink-0">tune</span>
                      <span className="text-[12px] font-medium truncate">{order.mode} ({order.temperature}) • {order.softener}</span>
                    </div>

                    <div className="flex items-start gap-2 bg-amber-50/70 dark:bg-[#C5A059]/5 border border-amber-200/80 dark:border-[#C5A059]/20 px-3 py-2 rounded-xl text-amber-900 dark:text-amber-200/80">
                      <span className="material-symbols-outlined text-amber-700 dark:text-[#C5A059] text-[18px] shrink-0 mt-0.5">info</span>
                      <span className="text-[12px] font-medium leading-relaxed">
                        {order.status === 'active' 
                          ? `🧺 Çamaşırlarınız ${order.machine_id || 'makinede'} yıkanıyor. ${order.time_left || ''}` 
                          : `🧺 Sepetiniz ${order.station}'te görevlinin yıkaması için bekliyor / sıraya alındı.`}
                      </span>
                    </div>

                    <div className="flex flex-col space-y-2 bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sipariş Durumu</span>
                        <span className="text-[13px] font-bold font-mono text-[#0F172A] dark:text-white">#{order.id.split('-')[0]}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl ${order.status === 'pending' ? 'bg-white dark:bg-[#0f1523] border-2 border-[#C5A059] shadow-sm text-amber-700 dark:text-[#C5A059]' : 'bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5 opacity-65 text-slate-500 dark:text-slate-400'} text-center`}>
                          <span className="material-symbols-outlined text-[19px]">pending_actions</span>
                          <span className="text-[10px] font-bold text-[#0F172A] dark:text-white">Sepet Bekliyor</span>
                        </div>
                        <div className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl ${order.status === 'active' ? 'bg-white dark:bg-[#0f1523] border-2 border-[#C5A059] shadow-sm text-amber-700 dark:text-[#C5A059]' : 'bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5 opacity-65 text-slate-500 dark:text-slate-400'} text-center`}>
                          <span className="material-symbols-outlined text-[19px]">local_laundry_service</span>
                          <span className="text-[10px] font-medium">Yıkanıyor</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-center opacity-65 text-slate-500 dark:text-slate-400">
                          <span className="material-symbols-outlined text-[19px]">check_circle</span>
                          <span className="text-[10px] font-medium">Yıkandı & Hazır</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Yeni Yıkama Siparişi Bölümü */}
          <div className="flex flex-col space-y-2.5">
            <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-[#C5A059] text-[20px]">add_circle</span>
              <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">Hızlı Rezervasyon</h2>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-4 shadow-sm flex flex-col space-y-3.5 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white leading-snug">Yeni Sepet Bırak / Sıra Al</h3>
                  <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">Boş olan 12 sepet alanından birine kirli sepetinizi bırakın, yıkama modunuzu seçip sıraya girin.</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-[#C5A059]/10 border border-amber-200/70 dark:border-[#C5A059]/20 flex items-center justify-center shrink-0 shadow-sm text-amber-700 dark:text-[#C5A059]">
                  <span className="material-symbols-outlined text-[28px]">shopping_basket</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 px-3.5 py-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C5A059] text-[20px]">monetization_on</span>
                  <span className="text-[12px] text-slate-600 dark:text-slate-400 font-medium">Standart Yıkama:</span>
                </div>
                <span className="text-[13px] font-bold text-[#92400e] dark:text-[#C5A059]">15 AD Coin'den başlayanlarla</span>
              </div>
              
              <button onClick={() => navigate('/laundry/step1')} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#b38e45] text-white py-3.5 px-4 rounded-xl font-bold text-[14px] shadow-[0_4px_14px_rgba(197,160,89,0.35)] active:scale-95 hover:opacity-95 transition-all">
                <span>Sepet Bırak & Sıra Al</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Hatırlatma & Yurt Kuralları Bandı */}
          <div className="flex items-start gap-3 bg-white dark:bg-[#0f1523] border border-amber-200/80 dark:border-amber-500/20 p-3.5 rounded-2xl shadow-sm transition-colors">
            <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-transparent flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">Öğrenci Bilgilendirmesi</span>
              <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">Yıkama bittiğinde çamaşırlarınızı yıkananlar alanından teslim alıp kurutmayı kendiniz yapabilirsiniz.</p>
            </div>
          </div>

          {/* Geçmiş Yıkamaları İncele Buton Kartı */}
          <div className="flex flex-col">
            <div onClick={() => setIsHistoryModalOpen(true)} className="flex items-center justify-between bg-white dark:bg-[#0f1523] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/90 dark:border-white/5 transition-all p-3.5 rounded-2xl cursor-pointer shadow-sm">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 text-[#0F172A] dark:text-white">
                  <span className="material-symbols-outlined text-[22px]">history</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-[#0F172A] dark:text-white truncate">Geçmiş Yıkamaları İncele</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Önceki tamamlanan siparişler ve makine detayları</span>
                </div>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        {/* Geçmiş Modal */}
        <div className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end transition-opacity duration-300 ${isHistoryModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setIsHistoryModalOpen(false)}>
          <div className={`bg-white dark:bg-[#0f1523] rounded-t-3xl border-t border-slate-200 dark:border-white/10 p-5 max-h-[82vh] overflow-y-auto shadow-2xl flex flex-col space-y-4 pb-safe transition-transform duration-300 ${isHistoryModalOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/20 rounded-full mx-auto self-center mb-1"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#C5A059] text-[24px]">history</span>
                <h3 className="text-[17px] font-bold text-[#0F172A] dark:text-white">Geçmiş Yıkamalarım</h3>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col space-y-2.5">
              {pastOrders.length > 0 ? pastOrders.map((order, idx) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${order.status === 'completed' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200/60 dark:border-transparent text-amber-700 dark:text-amber-400' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-transparent text-rose-500 dark:text-rose-400'}`}>
                      <span className="material-symbols-outlined text-[20px]">{order.status === 'completed' ? 'shopping_basket' : 'cancel'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#0F172A] dark:text-white">{idx + 1}. Sepetim • {order.station}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{new Date(order.created_at).toLocaleDateString('tr-TR')} • {new Date(order.created_at).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[12px] font-bold font-mono ${order.status === 'completed' ? 'text-amber-800 dark:text-[#C5A059]' : 'text-slate-500 dark:text-slate-400'}`}>
                      {order.status === 'completed' ? `-${order.cost} AD Coin` : '0 AD Coin'}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${order.status === 'completed' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'}`}>
                      {order.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">Geçmiş işlem bulunamadı.</div>
              )}
            </div>
            <button onClick={() => setIsHistoryModalOpen(false)} className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-[13px] mt-1 transition-all">
              Kapat
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Laundry;
