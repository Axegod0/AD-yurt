import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import ActiveOrders from './components/ActiveOrders';
import Announcements from './components/Announcements';
import QuickActions from './components/QuickActions';
import BottomNav from './components/BottomNav';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check auth
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        navigate('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile && profile.role === 'admin') {
        setIsAdmin(true);
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#07090e] font-sans text-slate-800 dark:text-white antialiased flex flex-col min-h-screen select-none transition-colors duration-300">
      <Header showAdminButton={true} />
      
      <main className="flex flex-col relative w-full pt-24 pb-28 px-5 space-y-5">
        <BalanceCard />

        {/* Admin Paneli Hızlı Erişim (Sadece Yöneticilere Görünür) */}
        {isAdmin && (
          <div className="bg-amber-500/10 border border-[#C5A059]/40 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059] text-[20px]">admin_panel_settings</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Yönetici Panelleri</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-[#C5A059] font-bold px-2 py-0.5 rounded-full">Yetkili</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => navigate('/admin/laundry')} 
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#0e1422] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white shadow-sm active:scale-95 transition-all text-left"
              >
                <span className="material-symbols-outlined text-blue-500 text-[18px]">local_laundry_service</span>
                <span className="truncate">Sipariş Yönetimi</span>
              </button>
              <button 
                onClick={() => navigate('/admin/balance')} 
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#0e1422] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white shadow-sm active:scale-95 transition-all text-left"
              >
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">account_balance_wallet</span>
                <span className="truncate">Kasa & Finans</span>
              </button>
              <button 
                onClick={() => navigate('/admin/students')} 
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#0e1422] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white shadow-sm active:scale-95 transition-all text-left"
              >
                <span className="material-symbols-outlined text-amber-500 text-[18px]">group</span>
                <span className="truncate">Talebeler</span>
              </button>
              <button 
                onClick={() => navigate('/admin/support')} 
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#0e1422] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white shadow-sm active:scale-95 transition-all text-left"
              >
                <span className="material-symbols-outlined text-purple-500 text-[18px]">confirmation_number</span>
                <span className="truncate">Destek Talepleri</span>
              </button>
            </div>
          </div>
        )}

        {/* Announcements shown compactly at the top */}
        <Announcements isCompact={true} />
        
        {/* Active orders component manages itself (returns null if empty) */}
        <ActiveOrders />

        <QuickActions />
        
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
