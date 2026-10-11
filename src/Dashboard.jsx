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

  useEffect(() => {
    // Check auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/login');
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
      <Header />
      
      <main className="flex flex-col relative w-full pt-24 pb-28 px-5 space-y-5">
        <BalanceCard />

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
