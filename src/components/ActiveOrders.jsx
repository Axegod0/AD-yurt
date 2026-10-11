import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

const ActiveOrders = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('laundry_orders')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['pending', 'active', 'washing'])
          .order('created_at', { ascending: true })
          .limit(2);
        
        if (!error && data) {
          setActiveJobs(data);
        }
      } catch (err) {
        console.error("Error fetching active jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">Aktif Sipariş & Durum</h2>
        </div>
        <div className="bg-white dark:bg-surface-card rounded-2xl dark:rounded-[22px] p-4 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3.5 min-w-0 w-full">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
            <div className="flex flex-col w-full gap-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeJobs.length === 0) {
    return null;
  }

  const primaryJob = activeJobs[0];
  const secondaryJob = activeJobs[1];

  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">Aktif İşlemler</h2>
        <Link to="/orders" className="text-[13px] font-bold text-[#C5A059] hover:opacity-80 flex items-center gap-1">
          Tümünü Gör <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
      
      {/* Highlight Card */}
      <div className="bg-white dark:bg-surface-card rounded-2xl dark:rounded-[22px] p-4 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex items-center justify-between gap-3 transition-colors duration-300">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-surface-card-subtle border border-[#C5A059]/25 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-[#C5A059]">
            <span className="material-symbols-outlined text-[24px]">
              local_laundry_service
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-white truncate leading-tight">
              {primaryJob.station || 'Makine'}
            </h3>
            <span className="text-[12px] text-slate-500 dark:text-text-muted mt-0.5 font-medium">
              Rezervasyon • <span className="text-amber-800 dark:text-[#E5C158] font-semibold dark:font-mono">#{primaryJob.id.split('-')[0]}</span>
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-[#C5A059] text-amber-800 dark:text-[#0f172a] border border-amber-200/60 dark:border-none px-3.5 py-1.5 rounded-full font-bold text-[11px] shadow-sm dark:shadow-[0_0_12px_rgba(197,160,89,0.35)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-[#0f172a] animate-pulse"></span>
            {primaryJob.status === 'active' || primaryJob.status === 'washing' ? 'Çalışıyor' : 'Bekliyor'}
          </span>
        </div>
      </div>
      
      {/* Second status item */}
      {secondaryJob && (
        <div className="bg-white dark:bg-surface-card/60 rounded-2xl dark:rounded-[18px] px-4 py-3 border border-slate-200/80 dark:border-border-dark/60 shadow-sm dark:shadow-none flex items-center justify-between text-[12px] transition-colors duration-300">
          <div className="flex items-center gap-2 text-slate-500 dark:text-text-muted">
            <span className="material-symbols-outlined text-[16px] text-[#C5A059]">
              local_laundry_service
            </span>
            <span className="font-medium dark:font-normal text-slate-600 dark:text-text-muted">
              {secondaryJob.station || 'Makine'} Randevusu
            </span>
          </div>
          <span className="font-semibold text-[#0F172A] dark:text-white">
            {new Date(secondaryJob.created_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
