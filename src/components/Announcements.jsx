import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

const Announcements = ({ isCompact }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(isCompact ? 1 : 2);
        
        if (!error && data) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, [isCompact]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-card rounded-2xl dark:rounded-[22px] p-4 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex items-center gap-3 relative overflow-hidden animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (isCompact) {
    const ann = announcements[0];
    if (!ann) return null;
    
    return (
      <div className="bg-white dark:bg-surface-card rounded-2xl dark:rounded-[22px] p-4 border border-slate-200/80 dark:border-border-dark shadow-sm dark:shadow-none flex items-center justify-between gap-3 relative overflow-hidden transition-colors duration-300">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-full ${ann.category === 'acil' ? 'bg-rose-50 dark:bg-brand-crimson/15 border-rose-100 text-rose-500' : 'bg-blue-50 dark:bg-blue-900/15 border-blue-100 text-blue-500'} flex items-center justify-center flex-shrink-0 border`}>
            <span className="material-symbols-outlined text-[20px]">{ann.category === 'acil' ? 'campaign' : 'info'}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#0F172A] dark:text-white truncate">{ann.title}</span>
            <span className="text-[11px] text-slate-500 dark:text-text-muted">{new Date(ann.created_at).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
        <Link to="/duyurular" className="bg-[#C5A059]/10 dark:bg-[#C5A059]/15 text-amber-800 dark:text-[#C5A059] border border-[#C5A059]/25 dark:border-[#C5A059]/30 hover:bg-[#C5A059] dark:hover:bg-[#C5A059] hover:text-white dark:hover:text-[#0f172a] transition-colors px-3.5 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0" type="button">
          Detay
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">Duyurular & Gelişmeler</h2>
          {announcements.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-[#C5A059]/15 text-amber-800 dark:text-[#C5A059] border-none dark:border dark:border-[#C5A059]/25">
              {announcements.length} Yeni
            </span>
          )}
        </div>
        <Link className="text-[12px] font-semibold text-amber-700 dark:text-[#C5A059] hover:underline flex items-center gap-0.5" to="/duyurular">
          Tümü<span className="material-symbols-outlined text-[14px]">chevron_right</span>
        </Link>
      </div>
      
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className="relative overflow-hidden rounded-2xl dark:rounded-[22px] bg-white dark:bg-surface-card border border-slate-100 dark:border-border-dark p-4 shadow-sm dark:shadow-none group hover:border-slate-300 dark:hover:border-[#C5A059]/30 transition-all duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${ann.category === 'acil' ? 'bg-rose-50 dark:bg-brand-crimson/15 text-rose-500' : 'bg-amber-50 dark:bg-[#C5A059]/15 text-amber-600 dark:text-[#C5A059]'} flex items-center justify-center flex-shrink-0`}>
                  <span className="material-symbols-outlined text-[20px]">{ann.category === 'acil' ? 'campaign' : 'emoji_events'}</span>
                </div>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${ann.category === 'acil' ? 'bg-rose-50 dark:bg-brand-crimson/20 text-rose-600 dark:text-[#f87171] border border-rose-200 dark:border-brand-crimson/30' : 'bg-amber-50 dark:bg-[#C5A059]/20 text-amber-700 dark:text-[#E5C158] border border-amber-200 dark:border-[#C5A059]/30'} leading-none mb-1`}>
                    {ann.category || 'Duyuru'}
                  </span>
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">{ann.title}</h3>
                </div>
              </div>
            </div>
            <p className="text-[12px] text-slate-600 dark:text-text-muted mt-2.5 leading-relaxed">{ann.content || ann.description}</p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-border-dark/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-text-muted flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-slate-400 dark:text-[#C5A059]">schedule</span>
                {new Date(ann.created_at).toLocaleDateString('tr-TR')}
              </span>
              <Link to="/duyurular" className="text-[11px] font-bold text-[#C5A059] hover:text-amber-800 dark:hover:text-[#E5C158] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform" type="button">
                Detayları Gör<span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
