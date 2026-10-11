import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabase';
import Header from '../components/Header';

const Orders = () => {
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('laundry_orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          const active = data.filter(job => job.status === 'active' || job.status === 'pending' || job.status === 'washing');
          setActiveJobs(active);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  const handleCancelOrder = async (id, cost) => {
    if (!window.confirm('Bu siparişi iptal etmek istediğinize emin misiniz? (Ücretiniz iade edilecektir)')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Update order status
      const { error: updateError } = await supabase
        .from('laundry_orders')
        .delete()
        .eq('id', id);
        
      if (updateError) throw updateError;

      // Refund transaction via secure RPC
      const { error: rpcError } = await supabase.rpc('process_refund', {
        user_id_param: user.id,
        refund_amount: cost,
        admin_id_param: null,
        description_text: 'Sipariş İptal İadesi'
      });
      
      if (rpcError) throw new Error(rpcError.message || 'İade işlemi başarısız oldu.');

      alert('Sipariş iptal edildi ve ücretiniz iade edildi.');
      // Refresh page data
      window.location.reload();
    } catch (err) {
      alert('İptal sırasında hata oluştu: ' + err.message);
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body flex flex-col min-h-screen selection:bg-[#C5A059] selection:text-white transition-colors duration-300">
      <Header title="Siparişler" />

      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28">
        <div className="flex flex-col w-full">
          <div className="px-4 pt-3.5 pb-4 flex flex-col gap-3.5">
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
              </div>
            ) : (
              <>
                {/* LIVE ACTIVE ORDERS SECTION */}
                {activeJobs.length > 0 && (
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A338] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A059]"></span>
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold text-xs tracking-wider uppercase">Aktif Siparişlerim</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{activeJobs.length} İşlem</span>
                    </div>
                    
                    {activeJobs.map(job => (
                      <div key={job.id} className="rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden cursor-pointer active:bg-slate-50 dark:active:bg-white/5 transition-colors">
                        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#C5A059]/10 rounded-full blur-xl pointer-events-none"></div>
                        <div className="flex items-start justify-between gap-3 relative z-10">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shrink-0 shadow-xs">
                              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                local_laundry_service
                              </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <h2 className="text-slate-900 dark:text-white font-bold text-sm truncate leading-snug">{job.station || 'Makine'}</h2>
                              <span className="text-slate-500 dark:text-slate-400 text-xs truncate">Rezervasyon: #{job.id.split('-')[0]}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-[#a37920] dark:text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                              {job.status === 'active' || job.status === 'washing' ? (
                                <span className="material-symbols-outlined text-[13px] animate-spin">cyclone</span>
                              ) : (
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                              )}
                              {job.status === 'active' || job.status === 'washing' ? 'Çalışıyor' : 'Bekliyor'}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-2.5 flex items-center justify-between gap-3 relative z-10 mt-1">
                          <div className="flex items-center gap-2 min-w-0">
                            {job.status === 'active' || job.status === 'washing' ? (
                              <>
                                <span className="material-symbols-outlined text-blue-500 text-[18px] shrink-0">local_laundry_service</span>
                                <span className="text-slate-700 dark:text-slate-300 text-xs truncate">Durum: <span className="font-semibold text-blue-600 dark:text-blue-400">Yıkanıyor</span></span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[#C5A059] text-[18px] shrink-0">schedule</span>
                                <span className="text-slate-700 dark:text-slate-300 text-xs truncate">Başlangıç: <span className="font-semibold text-slate-900 dark:text-white">{new Date(job.created_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span></span>
                              </>
                            )}
                          </div>
                          {job.status === 'pending' && (
                            <button onClick={() => handleCancelOrder(job.id, job.cost)} className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-md border border-red-200 dark:border-red-500/20 active:scale-95 transition-all">
                              İptal Et
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
              </>
            )}
            
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
