import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdminLaundryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    
    // Verify admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
      window.location.href = '/';
      return;
    }

    const { data, error } = await supabase
      .from('laundry_orders')
      .select(`
        *,
        users:user_id (full_name, room_number)
      `)
      .in('status', ['pending', 'active', 'washing'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('laundry_orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'laundry_orders' }, payload => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleStartWashing = async (id, currentStatus) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const { error } = await supabase
      .from('laundry_orders')
      .update({ 
        status: 'active', 
        progress_percentage: 0,
        progress_label: 'Yıkama Başladı',
        started_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      await supabase.from('notifications').insert([{
        user_id: order.user_id,
        type: 'laundry',
        icon: 'cyclone',
        title: 'Yıkama Başladı',
        content: `Çamaşırınız yıkanmaya başlandı.`
      }]);
    }
    fetchOrders();
  };

  const handleCancelOrder = async (id, cost, userId) => {
    const confirmCancel = window.confirm('Siparişi iptal edip ücreti iade etmek istiyor musunuz?');
    if (!confirmCancel) return;

    const { data: { user: adminUser } } = await supabase.auth.getUser();
    
    // Atomically refund via RPC
    const { error: rpcError } = await supabase.rpc('process_refund', {
      user_id_param: userId,
      refund_amount: cost,
      admin_id_param: adminUser ? adminUser.id : null,
      description_text: 'Sipariş İptal İadesi (Admin)'
    });
    
    if (rpcError) {
      alert('İade işlemi sırasında hata oluştu: ' + rpcError.message);
      return;
    }

    const { error } = await supabase.from('laundry_orders').delete().eq('id', id);
    if (error) {
      alert('Hata oluştu: ' + error.message);
    } else {
      const order = orders.find(o => o.id === id);
      if (order) {
        const stationNum = parseInt((order.station || '').replace(/\D/g, ''));
        if (stationNum) {
          try { await supabase.from('stations').update({ status: 'available' }).eq('id', stationNum); } catch (e) {}
        }
      }
      fetchOrders();
    }
  };

  const handleEarlyComplete = async (id) => {
    const order = orders.find(o => o.id === id);
    const confirmComplete = window.confirm('Yıkamayı tamamlayıp rafa almak istiyor musunuz?');
    if (!confirmComplete || !order) return;

    const { error } = await supabase.from('laundry_orders').delete().eq('id', id);

    if (!error) {
      const stationNum = parseInt((order.station || '').replace(/\D/g, ''));
      if (stationNum) {
        try { await supabase.from('stations').update({ status: 'available' }).eq('id', stationNum); } catch (e) {}
      }

      await supabase.from('notifications').insert([{
        user_id: order.user_id,
        type: 'laundry',
        icon: 'check_circle',
        title: 'Çamaşırınız Hazır',
        content: `Çamaşırınızın yıkaması tamamlandı. İstasyon: ${order.station} numaralı raftan teslim alabilirsiniz.`
      }]);
    }
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return order.status === 'pending';
    if (activeFilter === 'active') return order.status === 'active' || order.status === 'washing';
    return false;
  });

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status === 'active' || o.status === 'washing');

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased">
      <header className="fixed top-0 inset-x-0 z-50 bg-white dark:bg-[#07090e]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] pt-safe">
        <div className="h-20 px-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img alt="logo" className="h-8 w-auto object-contain shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-AT7oTa3IgYWL3P6Dz1pN0tSoNV7ph0MsQm-je--5MzhcNx99qjS9vDN-01JaSpf7ZXmefJWBfv0O5bdb4LL58L8QgIqHxNlmcncK9eQ5MlFfgkRfV_bqs2vm4PB74mlFgv7A_c_fZuzFG6AoeTkPM4l9EcCHVpYt9_ThuQiTEt2ewGdRQdAHSFOfamuNhB7Q2SzCJItISBTDeDe1PoZxVejrZM11VFuFHQuB8zl6T__Gr44Q7t_VV08ypb99WOnifFo" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-[#C5A059] uppercase tracking-wider truncate">AD YURDU ADMİN</span>
                <span className="px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-bold tracking-widest uppercase">PRO</span>
              </div>
              <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 tracking-tight truncate">ÇAMAŞIRHANE YÖNETİM PANELİ</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="w-11 h-11 rounded-full flex items-center justify-center text-slate-900 dark:text-slate-400 hover:text-[#C5A059] transition-colors relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#07090e]"></span>
            </button>
            <button onClick={() => window.location.href = '/profil'} className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center shadow-[0_0_12px_rgba(197,160,89,0.35)] active:scale-95 transition-transform" title="Normal Hesaba Dön">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-[calc(env(safe-area-inset-top,12px)+6rem)] pb-28 px-5">
        <section className="flex flex-col gap-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-800 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-500">Bekleyen</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[19px] font-bold text-amber-600 dark:text-amber-400">{pendingOrders.length}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-800 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">Yıkanıyor</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[19px] font-bold text-blue-600 dark:text-blue-400">{activeOrders.length}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap transition-colors ${activeFilter === 'all' ? 'bg-slate-900 text-white dark:bg-amber-600' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
            >
              Tümü ({orders.length})
            </button>
            <button 
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Bekleyenler
            </button>
            <button 
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeFilter === 'active' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Yıkananlar
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined animate-spin text-amber-500 text-3xl">sync</span>
          </div>
        ) : (
          <section className="flex flex-col gap-5 mt-6">
            {filteredOrders.length === 0 && (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
                Gösterilecek sipariş bulunamadı.
              </div>
            )}
            
            {filteredOrders.map(order => (
              <article key={order.id} className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden p-3 gap-3 bg-white dark:bg-slate-800">
                <div className="absolute top-0 left-0 h-1 w-full" style={{ background: order.status === 'pending' ? '#f59e0b' : order.status === 'active' ? '#3b82f6' : '#10b981' }}></div>
                
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <h3 className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
                          {order.users?.full_name || 'Bilinmiyor'}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : order.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                          {order.status === 'pending' ? 'Sırada' : order.status === 'active' ? 'Yıkanıyor' : 'Hazır'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Oda: {order.users?.room_number || '-'} • İstasyon: {order.station}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md text-[13px] font-bold shrink-0 bg-slate-50 dark:bg-slate-900 text-amber-600 dark:text-amber-500">
                    {order.cost} AD
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 gap-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Mod / Devir</span>
                      <span className="text-[12px] font-bold text-slate-900 dark:text-white mt-0.5">{order.mode}</span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">{order.temperature || '-'}</span>
                    </div>
                    <div className="flex flex-col p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 gap-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Yumuşatıcı</span>
                      <span className="text-[12px] font-bold text-slate-900 dark:text-white mt-0.5">{order.softener || 'İstenmedi'}</span>
                    </div>
                  </div>
                </div>

                {order.status === 'active' && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <span className="material-symbols-outlined text-blue-500 text-[18px] animate-spin">rotate_right</span>
                    <span className="text-[12px] font-semibold text-blue-700 dark:text-blue-300">Yıkanıyor</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 mt-1 border-t border-slate-100 dark:border-slate-700/50">
                  {order.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStartWashing(order.id, order.status)}
                        className="flex-1 py-2 px-3 rounded-lg text-white text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
                      >
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span> Yıkamayı Başlat
                      </button>
                      <button 
                        onClick={() => handleCancelOrder(order.id, order.cost, order.user_id)}
                        className="py-2 px-3 rounded-lg border border-red-200 dark:border-red-900/50 text-[13px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                      >
                        İptal
                      </button>
                    </>
                  )}
                  {order.status === 'active' && (
                    <button 
                      onClick={() => handleEarlyComplete(order.id)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-amber-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span> Tamamlandı İşaretle / Rafa Al
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <button 
                      onClick={() => handleDeliverToStudent(order.id)}
                      className="w-full py-2 px-3 rounded-lg text-white text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all bg-green-600 hover:bg-green-700"
                    >
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span> Öğrenciye Teslim Edildi
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* Bottom Nav Simulation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-md">
        <div className="grid grid-cols-4 items-center h-16 px-2 max-w-lg mx-auto">
          <a href="/admin/laundry" className="flex flex-col items-center justify-center gap-1 py-1 text-amber-600 dark:text-amber-500 font-bold transition-colors">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            <span className="text-[10px] uppercase tracking-wide font-bold">Siparişler</span>
          </a>
          <a href="/admin/balance" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            <span className="text-[10px] uppercase tracking-wide">Kasa & Finans</span>
          </a>
          <a href="/admin/support" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]">support_agent</span>
            <span className="text-[10px] uppercase tracking-wide">Destek</span>
          </a>
          <a href="/admin/students" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]">groups</span>
            <span className="text-[10px] uppercase tracking-wide">Talebeler</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default AdminLaundryOrders;
