import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdminBalanceManagement = () => {
  const [activeTab, setActiveTab] = useState('topup');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('100');
  const [description, setDescription] = useState('');
  const [donorName, setDonorName] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    fetchInitialData();
    const subscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
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

      // Fetch users for dropdown
      const { data: usersData } = await supabase.from('users').select('id, full_name, room_number, balance').order('full_name');
      if (usersData) setUsers(usersData);

      // Fetch transactions with user info
      const { data: txData } = await supabase
        .from('transactions')
        .select(`
          *,
          users!transactions_user_id_fkey (
            full_name,
            room_number
          )
        `)
        .order('created_at', { ascending: false });
      
      if (txData) setTransactions(txData);
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAmount('100');
    setDescription('');
    setSelectedUserId('');
    setDonorName('');
    setExpenseName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminUser) return alert("Admin oturumu bulunamadı!");
    
    let txAmount = parseInt(amount);
    if (isNaN(txAmount) || txAmount <= 0) return alert("Geçerli bir tutar girin.");

    try {
      if (activeTab === 'topup' || activeTab === 'deduct') {
        if (!selectedUserId) return alert("Lütfen bir öğrenci seçin.");
        const selectedUser = users.find(u => u.id === selectedUserId);
        if (!selectedUser) return;

        const isDeduct = activeTab === 'deduct';
        const type = isDeduct ? 'wash_payment' : 'topup_cash';
        let txDesc = description || (isDeduct ? "Bakiye Düşümü (Admin)" : "Bakiye Yükleme (Nakit)");
        if (isDeduct) txDesc = `[KESINTI] ${txDesc}`;
        
        const newBalance = isDeduct ? (selectedUser.balance || 0) - txAmount : (selectedUser.balance || 0) + txAmount;

        // 1. Log transaction
        const { error: txError } = await supabase.from('transactions').insert([{
          user_id: selectedUser.id,
          admin_id: adminUser.id,
          amount: txAmount,
          type: type,
          description: txDesc
        }]);
        if (txError) throw txError;

        // 2. Update user balance
        const { error: updateError } = await supabase.from('users')
          .update({ balance: newBalance })
          .eq('id', selectedUser.id);
        if (updateError) throw updateError;
        
        alert("İşlem başarıyla gerçekleşti.");

      } else if (activeTab === 'bagis' || activeTab === 'gider') {
        const isExpense = activeTab === 'gider';
        const type = isExpense ? 'wash_payment' : 'topup_cash';
        
        const entityName = isExpense ? expenseName : donorName;
        if (!entityName) return alert(isExpense ? "Gider kalemi girin." : "Bağışçı adı girin.");
        
        let txDesc = description || (isExpense ? "Kasa Gideri" : "Dış Bağış");
        txDesc = isExpense ? `[GIDER - ${entityName}] ${txDesc}` : `[BAGIS - ${entityName}] ${txDesc}`;
        
        // Log transaction tied to admin user (since user_id is required)
        const { error: txError } = await supabase.from('transactions').insert([{
          user_id: adminUser.id,
          admin_id: adminUser.id,
          amount: txAmount,
          type: type,
          description: txDesc
        }]);
        if (txError) throw txError;
        
        alert("Kasa hareketi başarıyla işlendi.");
      }
      
      handleTabChange(activeTab); // Reset form
      fetchInitialData();
    } catch (error) {
      console.error(error);
      alert("İşlem sırasında hata oluştu: " + error.message);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'topup':
        return {
          title: 'Talebe Seç',
          placeholder: 'Örn: Ahmet Yılmaz, B-304',
          btnText: '+ BAKİYE YÜKLE',
          btnColor: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
          btnTextColor: 'text-white dark:text-slate-900',
          sign: '+'
        };
      case 'deduct':
        return {
          title: 'Talebe Seç',
          placeholder: 'Örn: Kadir Arslan, A-108',
          btnText: '- BAKİYE DÜŞ',
          btnColor: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
          btnTextColor: 'text-white',
          sign: '-'
        };
      case 'bagis':
        return {
          title: 'Dış Bağışçı Adı veya Kurum',
          placeholder: 'Örn: Hacı Mahmut Vakfı...',
          btnText: '+ KASAYA BAĞIŞ EKLE',
          btnColor: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
          btnTextColor: 'text-white dark:text-slate-900',
          sign: '+'
        };
      case 'gider':
        return {
          title: 'Gider Kalemi / Tedarikçi Firma',
          placeholder: 'Örn: Deterjan Alımı...',
          btnText: '- GİDERİ KASADAN DÜŞ',
          btnColor: 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700',
          btnTextColor: 'text-white',
          sign: '-'
        };
      default:
        return {};
    }
  };

  const tabInfo = getTabContent();

  // Metrics calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let netKasa = 0;
  let gunlukYuklenen = 0;
  let bugunYikamaSayisi = 0;
  let giderVeIade = 0;

  transactions.forEach(tx => {
    const isToday = new Date(tx.created_at) >= today;
    const isTopup = tx.type === 'topup_cash';
    const isBagis = tx.description?.includes('[BAGIS');
    const isGider = tx.description?.includes('[GIDER');
    const isKesinti = tx.description?.includes('[KESINTI');
    const isWash = tx.type === 'wash_payment' && !isGider && !isKesinti && !tx.description?.includes('password_changed'); // standard wash

    if (isTopup) {
      netKasa += tx.amount;
      if (isToday && !isBagis) {
        gunlukYuklenen += tx.amount;
      }
    } else if (tx.type === 'wash_payment') {
      if (isGider || isKesinti) {
        netKasa -= tx.amount;
        if (isToday) giderVeIade += tx.amount;
      } else {
        // wash_payment is just student spending coin, doesn't change actual cash if they already paid.
        // Wait, does "Net Kasa" include cash on hand or total coin circulating? 
        // Real cash comes in during topup_cash, goes out during refund (kesinti) or gider.
        if (isToday && isWash) bugunYikamaSayisi++;
      }
    }
  });

  const parsedTransactions = transactions.map(tx => {
    const dateStr = new Date(tx.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const isTopup = tx.type === 'topup_cash';
    const isBagis = tx.description?.includes('[BAGIS');
    const isGider = tx.description?.includes('[GIDER');
    const isKesinti = tx.description?.includes('[KESINTI');

    let badge = 'Bilinmeyen';
    let actionStr = 'İşlem';
    let uiType = 'topup'; 
    let subject = tx.users?.full_name || 'Bilinmiyor';

    if (isBagis) {
      uiType = 'bagis';
      badge = 'Nakit Bağış / Destek';
      actionStr = 'Makbuzlu';
      const match = tx.description.match(/\[BAGIS - (.*?)\]/);
      if (match) subject = match[1];
    } else if (isGider) {
      uiType = 'gider';
      badge = 'Gider / Sarf Tedarik';
      actionStr = 'Kasa Çıkışı';
      const match = tx.description.match(/\[GIDER - (.*?)\]/);
      if (match) subject = match[1];
    } else if (isKesinti) {
      uiType = 'deduct';
      badge = 'Bakiye Düş / Düzeltme';
      actionStr = 'Düşüldü';
    } else if (isTopup) {
      uiType = 'topup';
      badge = 'Bakiye Yükleme (Nakit)';
      actionStr = 'Yüklendi';
    } else if (tx.type === 'wash_payment') {
      uiType = 'income';
      badge = 'Çamaşır Yıkama';
      actionStr = 'Tahsil Edildi';
    } else if (tx.type === 'password_changed') {
      uiType = 'system';
      badge = 'Sistem İşlemi';
      actionStr = 'Log';
    }

    return {
      id: tx.id,
      type: uiType,
      subject: subject + (tx.users?.room_number && !isBagis && !isGider && !isKesinti ? ` (${tx.users.room_number})` : ''),
      badge: badge,
      time: dateStr,
      amount: (uiType === 'topup' || uiType === 'bagis' ? '+' : uiType === 'system' ? '' : '-') + tx.amount,
      actionStr: actionStr,
      desc: tx.description?.replace(/\[.*?\]\s*/, '') || '', // remove tags
      user: tx.admin_id === adminUser?.id ? adminUser?.full_name : (tx.admin_id ? 'Admin' : (uiType === 'income' ? 'Sistem' : tx.users?.full_name))
    };
  });

  const filteredTransactions = parsedTransactions.filter(tx => {
    if (tx.type === 'system') return false; // Hide password logs from cash flow
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = tx.subject.toLowerCase().includes(searchLow) || 
                          tx.desc.toLowerCase().includes(searchLow);
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
              <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 tracking-tight truncate">FİNANS VE KASA YÖNETİMİ</span>
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

      <main className="flex flex-col relative w-full px-5 pt-[calc(env(safe-area-inset-top,12px)+6rem)] pb-28 min-h-screen">
        <div className="flex flex-col w-full gap-5">
          {/* Page Header & Live Status */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <span className="w-2 h-2 rounded-full animate-pulse bg-green-600 dark:bg-green-500"></span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-green-700 dark:text-green-400">Canlı Kasa Aktif</span>
              </div>
              <span className="text-[10px] flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[14px] text-amber-600 dark:text-amber-500">sync</span>
                Oto-Güncelleme: Açık
              </span>
            </div>
            <div className="flex flex-col mt-1">
              <h1 className="text-[19px] tracking-tight font-extrabold text-slate-900 dark:text-white">Çamaşırhane Kasa & Finans</h1>
              <p className="text-[12px] leading-snug mt-1 text-slate-600 dark:text-slate-400">
                Çamaşır gelirleri, dış bağışlar, gider kayıtları ve operasyonel kasa hareketleri
              </p>
            </div>
          </div>

          {/* Top Metric Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="flex flex-col justify-between p-3 rounded-xl border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-tight leading-none text-slate-500 dark:text-slate-400">Günlük Yüklenen</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  <span className="material-symbols-outlined text-[14px]">add_circle</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[16px] font-extrabold block leading-tight text-amber-700 dark:text-amber-400">{gunlukYuklenen.toLocaleString('tr-TR')} AD</span>
                <span className="text-[10px] mt-0.5 block font-medium text-slate-400 dark:text-slate-500">Nakit Tahsilat</span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-3 rounded-xl border shadow-sm relative overflow-hidden transition-all hover:shadow-md bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-tight leading-none text-amber-600 dark:text-amber-500">Net Kasa</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500">
                  <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[16px] font-extrabold block leading-tight text-slate-900 dark:text-white">{netKasa.toLocaleString('tr-TR')} AD</span>
                <span className="text-[10px] mt-0.5 block font-medium text-slate-500 dark:text-slate-400">Mevcut Fon</span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-3 rounded-xl border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-tight leading-none text-slate-500 dark:text-slate-400">Bugün Yıkama</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-[14px]">local_laundry_service</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[16px] font-extrabold block leading-tight text-blue-600 dark:text-blue-400">{bugunYikamaSayisi}</span>
                <span className="text-[10px] mt-0.5 block font-medium text-slate-400 dark:text-slate-500">İşlem</span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-3 rounded-xl border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-tight leading-none text-slate-500 dark:text-slate-400">Gider & İade</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined text-[14px]">trending_down</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[16px] font-extrabold block leading-tight text-red-600 dark:text-red-400">{giderVeIade.toLocaleString('tr-TR')} AD</span>
                <span className="text-[10px] mt-0.5 block font-medium text-slate-400 dark:text-slate-500">Sarf & İptal</span>
              </div>
            </div>
          </section>

          {/* Quick Action Section */}
          <section className="flex flex-col p-4 rounded-xl border shadow-sm gap-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500">
                  <span className="material-symbols-outlined text-[17px]">account_balance</span>
                </div>
                <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">Hızlı Kasa & Bakiye İşlemi</h2>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold border bg-slate-50 dark:bg-slate-900 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800">Admin Paneli</span>
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg border bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <button onClick={() => handleTabChange('topup')} className={`py-2 px-1 text-center rounded-md text-[10px] transition-all font-bold leading-tight ${activeTab === 'topup' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>+ Bakiye Yükle</button>
              <button onClick={() => handleTabChange('deduct')} className={`py-2 px-1 text-center rounded-md text-[10px] transition-all font-bold leading-tight ${activeTab === 'deduct' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>- Bakiye Düş</button>
              <button onClick={() => handleTabChange('bagis')} className={`py-2 px-1 text-center rounded-md text-[10px] transition-all font-bold leading-tight ${activeTab === 'bagis' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>+ Kasa / Bağış</button>
              <button onClick={() => handleTabChange('gider')} className={`py-2 px-1 text-center rounded-md text-[10px] transition-all font-bold leading-tight ${activeTab === 'gider' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>- Gider / Masraf</button>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{tabInfo.title}</label>
                  {(activeTab === 'topup' || activeTab === 'deduct') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">Öğrenci Bakiyesi Aktif</span>
                  )}
                </div>
                
                {(activeTab === 'topup' || activeTab === 'deduct') ? (
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-slate-400">person_search</span>
                    <select 
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-[13px] focus:outline-none transition-colors bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Kullanıcı Seçin...</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.full_name} {u.room_number ? `(${u.room_number})` : ''} - Mevcut: {u.balance} AD</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[18px] text-slate-400">edit_note</span>
                    <input 
                      type="text" 
                      value={activeTab === 'gider' ? expenseName : donorName}
                      onChange={e => activeTab === 'gider' ? setExpenseName(e.target.value) : setDonorName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-[13px] focus:outline-none transition-colors bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" 
                      placeholder={tabInfo.placeholder} 
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">İşlem Tutarı (AD Coin)</label>
                <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                  <button type="button" onClick={() => setAmount('50')} className={`py-1.5 rounded-md border text-[11px] font-semibold transition-all ${amount === '50' ? 'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'}`}>{tabInfo.sign}50 AD</button>
                  <button type="button" onClick={() => setAmount('100')} className={`py-1.5 rounded-md border text-[11px] font-semibold transition-all ${amount === '100' ? 'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'}`}>{tabInfo.sign}100 AD</button>
                  <button type="button" onClick={() => setAmount('200')} className={`py-1.5 rounded-md border text-[11px] font-semibold transition-all ${amount === '200' ? 'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'}`}>{tabInfo.sign}200 AD</button>
                  <button type="button" onClick={() => setAmount('500')} className={`py-1.5 rounded-md border text-[11px] font-semibold transition-all ${amount === '500' ? 'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'}`}>{tabInfo.sign}500 AD</button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-amber-600 dark:text-amber-500">paid</span>
                  <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full pl-10 pr-20 py-2.5 rounded-lg border text-[17px] font-extrabold focus:outline-none transition-colors bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Örn: 350" />
                  <span className="absolute right-3 text-[11px] font-bold text-amber-700 dark:text-amber-500">AD Coin</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">İşlem Gerekçesi / Açıklama Notu</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-slate-400">edit_note</span>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-[13px] focus:outline-none transition-colors bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Örn: Nakit tahsilat, Hatalı yükleme düzeltmesi, Deterjan alımı vb." />
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 mt-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-500">verified_user</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Kayıt Yapan Görevli:</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{adminUser ? adminUser.full_name : 'Yükleniyor...'}</span>
              </div>

              <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${tabInfo.btnColor} ${tabInfo.btnTextColor} ${loading ? 'opacity-50' : ''}`}>
                <span className="material-symbols-outlined text-[18px]">toll</span>
                <span>{tabInfo.btnText}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-amber-700 dark:text-amber-500 mt-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>⚡ İşlem anında kasaya işlenir ve loglanır</span>
              </div>
            </form>
          </section>

          {/* Search & Filter Bar */}
          <section className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">Kasa Hareketleri Logu</h2>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Son İşlemler</span>
            </div>

            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-slate-400">search</span>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-[12px] focus:outline-none transition-colors shadow-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Öğrenci, açıklama, görevli veya makbuz ara..." />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
              <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-colors ${filterType === 'all' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>Tümü ({filteredTransactions.length})</button>
              <button onClick={() => setFilterType('topup')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-colors ${filterType === 'topup' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>Bakiye Yükleme</button>
              <button onClick={() => setFilterType('deduct')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-colors ${filterType === 'deduct' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>Bakiye Kesinti</button>
              <button onClick={() => setFilterType('income')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-colors ${filterType === 'income' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>Yıkama Geliri</button>
              <button onClick={() => setFilterType('bagis')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-colors ${filterType === 'bagis' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>Dış Bağış</button>
              <button onClick={() => setFilterType('gider')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-colors ${filterType === 'gider' ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-900' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>Gider</button>
            </div>
          </section>

          {/* Transaction Log List */}
          <div className="flex flex-col gap-2.5">
            {loading && filteredTransactions.length === 0 ? (
              <div className="text-center text-slate-500 p-4 text-[12px]">Yükleniyor...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center text-slate-500 p-4 text-[12px]">Sonuç bulunamadı.</div>
            ) : filteredTransactions.map(tx => (
              <article key={tx.id} className="flex flex-col p-3.5 rounded-xl border shadow-sm gap-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-bold text-slate-900 dark:text-white">{tx.subject}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${tx.type === 'topup' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : tx.type === 'deduct' || tx.type === 'gider' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : tx.type === 'income' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'}`}>
                        {tx.badge}
                      </span>
                    </div>
                    <span className="text-[10px] mt-0.5 text-slate-500 dark:text-slate-400">{tx.time}</span>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`text-[17px] font-extrabold ${tx.type === 'topup' || tx.type === 'income' ? 'text-green-600 dark:text-green-400' : tx.type === 'bagis' ? 'text-amber-700 dark:text-amber-500' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.amount} AD
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{tx.actionStr}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg border text-[12px] bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-300">
                  {tx.desc}
                </div>
                <div className="flex items-center justify-between pt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className={`material-symbols-outlined text-[15px] ${tx.type === 'topup' ? 'text-amber-600 dark:text-amber-500' : tx.type === 'deduct' || tx.type === 'gider' ? 'text-red-600 dark:text-red-400' : tx.type === 'income' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-500'}`}>
                      {tx.type === 'topup' ? 'person' : tx.type === 'deduct' ? 'assignment_return' : tx.type === 'income' ? 'person' : tx.type === 'bagis' ? 'verified' : 'shopping_cart_checkout'}
                    </span>
                    <span>İşlemi Yapan: <strong className="text-slate-900 dark:text-white">{tx.user}</strong></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-md">
        <div className="grid grid-cols-4 items-center h-16 px-2 max-w-lg mx-auto">
          <a href="/admin/laundry" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            <span className="text-[10px] uppercase tracking-wide">Siparişler</span>
          </a>
          <a href="/admin/balance" className="flex flex-col items-center justify-center gap-1 py-1 text-amber-600 dark:text-amber-500 font-bold transition-colors">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            <span className="text-[10px] uppercase tracking-wide font-bold">Kasa & Finans</span>
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

export default AdminBalanceManagement;
