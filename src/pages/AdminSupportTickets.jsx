import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdminSupportTickets = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // States for interactive updates
  const [replyText, setReplyText] = useState('');
  const [activeTicketId, setActiveTicketId] = useState(null); // the ticket currently being replied to

  useEffect(() => {
    fetchInitialData();
    const subscription = supabase
      .channel('public:support_tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
        fetchInitialData();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (!userData || userData.role !== 'admin') {
        window.location.href = '/';
        return;
      }
      setAdminUser(userData);

      // Fetch tickets with user info and resolver info
      const { data: ticketData, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          users!support_tickets_user_id_fkey ( full_name, room_number ),
          resolved_by_user:users!support_tickets_resolved_by_fkey ( full_name )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        // Table might not exist yet
        console.warn("Could not fetch support_tickets. Table might be missing.", error);
      } else if (ticketData) {
        setTickets(ticketData);
      }
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus, resolution = null) => {
    if (!adminUser) return alert("Admin yetkisi bulunamadı!");
    
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'resolved') {
        updateData.resolution_note = resolution || replyText || 'Çözüldü olarak işaretlendi.';
        updateData.resolved_by = adminUser.id;
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId);
        
      if (error) throw error;
      
      setReplyText('');
      setActiveTicketId(null);
      fetchInitialData();
    } catch (error) {
      console.error(error);
      alert("Durum güncellenirken hata oluştu: " + (error.message || JSON.stringify(error)));
    }
  };

  const getTicketTypeInfo = (type) => {
    switch (type) {
      case 'ariza':
        return { label: 'Arıza İhbarı', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: 'build_circle', iconBg: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-500' };
      case 'sepet':
        return { label: 'Sepet / Eşya İhbarı', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: 'inventory_2', iconBg: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-500' };
      case 'oneri':
        return { label: 'Öneri & Talep', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: 'lightbulb', iconBg: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400' };
      case 'bakiye':
        return { label: 'Bakiye / Kesinti', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: 'account_balance_wallet', iconBg: 'bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800/50 dark:text-purple-400' };
      default:
        return { label: 'Destek', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400', icon: 'support_agent', iconBg: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900/20 dark:border-slate-800/50 dark:text-slate-500' };
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = ticket.title.toLowerCase().includes(searchLow) || 
                          (ticket.description || '').toLowerCase().includes(searchLow) ||
                          (ticket.users?.full_name || '').toLowerCase().includes(searchLow);
    const matchesFilter = activeFilter === 'all' || ticket.type === activeFilter || (activeFilter === 'cozuldu' && ticket.status === 'resolved');
    return matchesSearch && matchesFilter;
  });

  const pendingCount = tickets.filter(t => t.status === 'pending').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  // Find one high priority ticket to show expanded (oldest pending ariza/sepet)
  const highPriorityTicket = tickets.find(t => t.status === 'pending' && (t.type === 'ariza' || t.type === 'sepet' || t.type === 'bakiye'));

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
              <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 tracking-tight truncate">TALEPLER VE DESTEK</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="w-11 h-11 rounded-full flex items-center justify-center text-slate-900 dark:text-slate-400 hover:text-[#C5A059] transition-colors relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {pendingCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#07090e]"></span>
              )}
            </button>
            <button onClick={() => window.location.href = '/profil'} className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center shadow-[0_0_12px_rgba(197,160,89,0.35)] active:scale-95 transition-transform" title="Normal Hesaba Dön">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full pt-[calc(env(safe-area-inset-top,12px)+6rem)] pb-28 px-5">
        <div className="flex flex-col w-full gap-5">
          {/* Top Hero & Live Support Status */}
          <section className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/50 px-2.5 py-1 rounded-full">
                {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-ping"></span>}
                <span className="text-red-700 dark:text-red-400 text-[10px] uppercase tracking-wider font-semibold">{pendingCount} Bekleyen İnceleme</span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-800/50 px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-green-600 dark:text-green-500 text-[14px]">bolt</span>
                <span className="text-green-700 dark:text-green-400 text-[10px] uppercase tracking-wider font-semibold">Canlı Hat Aktif</span>
              </div>
            </div>
            <div className="flex flex-col pt-1">
              <h1 className="text-slate-900 dark:text-white text-[19px] tracking-tight font-bold">Destek, İhbar & Öneriler</h1>
              <p className="text-slate-600 dark:text-slate-400 text-[12px] leading-relaxed mt-0.5">Öğrencilerden gelen makine arızaları, sepet karışıklığı ihbarları ve öneriler</p>
            </div>
          </section>

          {/* Metrics Horizontal Grid */}
          <section className="grid grid-cols-3 gap-2.5">
            <div className="flex flex-col justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-[18px]">report_problem</span>
                </div>
                {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
              </div>
              <div>
                <span className="text-slate-900 dark:text-white text-[17px] font-bold">{pendingCount}</span>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase truncate font-medium">Bekleyen</p>
              </div>
              <div className="mt-1 pt-1 bg-red-50/70 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50 rounded px-1.5 py-0.5 flex items-center gap-1">
                <span className="text-red-700 dark:text-red-400 text-[9px] font-bold">Yeni İhbar</span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-500 text-[18px]">engineering</span>
                </div>
                {inProgressCount > 0 && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
              </div>
              <div>
                <span className="text-slate-900 dark:text-white text-[17px] font-bold">{inProgressCount}</span>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase truncate font-medium">İşlemde</p>
              </div>
              <div className="mt-1 pt-1 bg-blue-50/70 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded px-1.5 py-0.5 flex items-center gap-1">
                <span className="text-blue-700 dark:text-blue-400 text-[9px] font-bold">Görevli Bakıyor</span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-500 text-[18px]">task_alt</span>
                </div>
              </div>
              <div>
                <span className="text-slate-900 dark:text-white text-[17px] font-bold">{resolvedCount}</span>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase truncate font-medium">Çözülen</p>
              </div>
              <div className="mt-1 pt-1 bg-green-50/70 dark:bg-green-900/30 border border-green-100 dark:border-green-800/50 rounded px-1.5 py-0.5 flex items-center gap-1">
                <span className="text-green-700 dark:text-green-400 text-[9px] font-bold">Toplam Kayıt</span>
              </div>
            </div>
          </section>

          {/* Search & Category Filters */}
          <section className="flex flex-col gap-2">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-[12px] border border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none focus:border-amber-500 transition-all" 
                placeholder="Talep no, talebe, makine veya konu ara (#TK-108)..."
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button onClick={() => setActiveFilter('all')} className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider shrink-0 shadow-sm transition-transform active:scale-95 ${activeFilter === 'all' ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium'}`}>Tümü ({tickets.length})</button>
              <button onClick={() => setActiveFilter('ariza')} className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider shrink-0 shadow-sm transition-transform active:scale-95 ${activeFilter === 'ariza' ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium'}`}>Arıza İhbarı</button>
              <button onClick={() => setActiveFilter('sepet')} className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider shrink-0 shadow-sm transition-transform active:scale-95 ${activeFilter === 'sepet' ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium'}`}>Sepet / Karışıklık</button>
              <button onClick={() => setActiveFilter('oneri')} className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider shrink-0 shadow-sm transition-transform active:scale-95 ${activeFilter === 'oneri' ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium'}`}>Öneri</button>
              <button onClick={() => setActiveFilter('cozuldu')} className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider shrink-0 shadow-sm transition-transform active:scale-95 ${activeFilter === 'cozuldu' ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium'}`}>Çözülenler</button>
            </div>
          </section>

          {/* Ticket Items */}
          <section className="flex flex-col gap-4 mt-2">
            {loading && tickets.length === 0 ? (
              <div className="text-center text-[12px] text-slate-500 py-4">Veriler yükleniyor...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center text-[12px] text-slate-500 py-4">Gösterilecek talep bulunamadı. Veritabanında (support_tickets) kayıt olmayabilir.</div>
            ) : filteredTickets.map((ticket) => {
              const info = getTicketTypeInfo(ticket.type);
              const dateStr = new Date(ticket.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
              const userStr = ticket.users?.full_name + (ticket.users?.room_number ? ` (Oda: ${ticket.users.room_number})` : '');
              const ticketIdDisplay = `#TK-${ticket.ticket_number || ticket.id.substring(0,4).toUpperCase()}`;

              // Expand high priority ticket
              if (highPriorityTicket && ticket.id === highPriorityTicket.id) {
                return (
                  <div key={ticket.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-semibold">Öncelikli Talep İnceleme</span>
                      <span className="text-red-600 dark:text-red-400 text-[10px] flex items-center gap-1 font-bold bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">priority_high</span> Yüksek Öncelik
                      </span>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md p-4 flex flex-col gap-4 relative overflow-hidden">
                      <div className="flex items-start justify-between gap-2 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${info.iconBg}`}>
                            <span className="material-symbols-outlined text-[20px]">{info.icon}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-900 dark:text-white text-[14px] font-bold">{ticketIdDisplay}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${info.color}`}>{info.label}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 text-[12px] truncate">{userStr} • {dateStr}</span>
                          </div>
                        </div>
                        {ticket.machine_id && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-[10px] font-bold shrink-0">{ticket.machine_id}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 relative z-10">
                        <h2 className="text-slate-900 dark:text-white text-[14px] font-bold">{ticket.title}</h2>
                        <p className="text-slate-700 dark:text-slate-300 text-[12px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-2 rounded-xl leading-relaxed">{ticket.description}</p>
                      </div>
                      
                      {ticket.image_url && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 relative z-10">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                              <img className="w-full h-full object-cover" src={ticket.image_url} alt="Hata Resmi" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-slate-900 dark:text-white text-[11px] font-semibold truncate">Ekli Görsel</span>
                              <span className="text-slate-500 dark:text-slate-400 text-[10px]">Makine Hata Ekranı / Sorun Resmi</span>
                            </div>
                          </div>
                          <button onClick={() => window.open(ticket.image_url, '_blank')} className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm text-[10px] flex items-center gap-1 active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>Aç</span>
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col gap-3 pt-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-3 rounded-xl relative z-10 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-900 dark:text-white text-[13px] font-bold">Görevli Yanıtı Yaz</span>
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">Nöbetçi: {adminUser?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                          <button onClick={() => setReplyText('Teknik servis arıza kaydı açıldı, makine durduruldu. İlginiz için teşekkürler.')} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm text-[11px] whitespace-nowrap active:scale-95 transition-transform hover:bg-slate-50 dark:hover:bg-slate-700">Teknik servis çağrıldı</button>
                          <button onClick={() => setReplyText('Makine güvenli şekilde durduruldu. Sepetiniz rafta muhafaza ediliyor.')} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm text-[11px] whitespace-nowrap active:scale-95 transition-transform hover:bg-slate-50 dark:hover:bg-slate-700">Sepetiniz rafta</button>
                          <button onClick={() => setReplyText('Yaşanan aksaklık için özür dileriz. Bakiyeniz hesabınıza iade edilmiştir.')} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm text-[11px] whitespace-nowrap active:scale-95 transition-transform hover:bg-slate-50 dark:hover:bg-slate-700">Bakiye iadesi yapıldı</button>
                        </div>
                        <textarea 
                          className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 p-2 rounded-lg text-[12px] border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-500 transition-all resize-none shadow-inner" 
                          placeholder="Öğrenciye iletilecek açıklama..." 
                          rows="3"
                          value={activeTicketId === ticket.id ? replyText : ''}
                          onChange={e => { setActiveTicketId(ticket.id); setReplyText(e.target.value); }}
                        ></textarea>
                        <div className="flex flex-col gap-1 pt-1">
                          <button onClick={() => handleUpdateStatus(ticket.id, 'resolved')} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white dark:text-slate-900 text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                            <span>Yanıtla & Çözüldü İşaretle</span>
                          </button>
                          <button onClick={() => handleUpdateStatus(ticket.id, 'in_progress')} className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm mt-1">
                            <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                            <span>İşleme Alındı Olarak Güncelle</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Normal display
              return (
                <div key={ticket.id} className={`flex flex-col p-4 rounded-2xl ${ticket.status === 'resolved' ? 'bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} gap-3 shadow-sm`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${info.iconBg}`}>
                        <span className="material-symbols-outlined text-[18px]">{info.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-900 dark:text-white text-[13px] font-bold">{ticketIdDisplay}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${info.color}`}>{info.label}</span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{userStr} • {dateStr}</span>
                      </div>
                    </div>
                    {ticket.status === 'in_progress' && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 text-[10px] font-bold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>İşlemde
                      </span>
                    )}
                    {ticket.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-semibold shrink-0">Bekliyor</span>
                    )}
                    {ticket.status === 'resolved' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-400 text-[10px] font-bold shrink-0">Çözüldü</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-slate-900 dark:text-white text-[14px] font-bold">{ticket.title}</h3>
                    {ticket.description && <p className="text-slate-600 dark:text-slate-300 text-[12px] line-clamp-2 mt-0.5 leading-relaxed">{ticket.description}</p>}
                  </div>
                  
                  {ticket.status === 'resolved' && ticket.resolution_note && (
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-500 text-[16px] shrink-0 mt-0.5">verified_user</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-slate-800 dark:text-slate-200 text-[11px] font-bold">{ticket.resolution_note} • {ticket.resolved_by_user?.full_name || 'Admin'}</span>
                      </div>
                    </div>
                  )}

                  {ticket.status !== 'resolved' && (
                    <div className="flex items-center justify-between pt-1">
                      {ticket.status === 'in_progress' && (
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px]">shield_person</span> İlgileniliyor
                        </span>
                      )}
                      {ticket.status === 'pending' && (
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Kategori: {info.label}</span>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        {ticket.status === 'pending' && (
                           <button onClick={() => handleUpdateStatus(ticket.id, 'in_progress')} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] uppercase active:scale-95 transition-transform font-bold">Hızlı İncele</button>
                        )}
                        {/* A button to trigger the expanded view (simulated by scrolling/opening) */}
                        {ticket.status === 'in_progress' && (
                           <button onClick={() => handleUpdateStatus(ticket.id, 'resolved', 'Sorun giderildi.')} className={`px-3 py-1.5 rounded-lg text-[11px] uppercase font-bold active:scale-95 transition-transform shadow-sm bg-slate-900 text-white dark:bg-slate-700`}>Çözüldü İşaretle</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>
      </main>

      {/* Admin Navigasyon Barı */}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-md">
        <div className="grid grid-cols-4 items-center h-16 px-2 max-w-lg mx-auto">
          <a href="/admin/laundry" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            <span className="text-[10px] uppercase tracking-wide">Siparişler</span>
          </a>
          <a href="/admin/balance" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            <span className="text-[10px] uppercase tracking-wide">Kasa & Finans</span>
          </a>
          <a href="/admin/support" className="flex flex-col items-center justify-center gap-1 py-1 text-amber-600 dark:text-amber-500 font-bold transition-colors">
            <span className="material-symbols-outlined text-[22px]">support_agent</span>
            <span className="text-[10px] uppercase tracking-wide font-bold">Destek</span>
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

export default AdminSupportTickets;
