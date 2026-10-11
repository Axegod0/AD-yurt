import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { supabase } from '../supabase';

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loadingArchive, setLoadingArchive] = useState(false);
  const [archiveLoaded, setArchiveLoaded] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setAnnouncements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleArchive = () => {
    setLoadingArchive(true);
    setTimeout(() => {
      setLoadingArchive(false);
      setArchiveLoaded(true);
    }, 600);
  };

  const filteredAnnouncements = announcements.filter(item => {
    const itemCategory = item.category || 'all';
    const matchesFilter = filter === 'all' || itemCategory === filter;
    const desc = item.description || '';
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryStyles = (category, icon) => {
    if (category === 'tesis') {
      return { iconColor: 'text-blue-600', bgIcon: 'bg-blue-50', borderIcon: 'border-blue-100', catLabel: 'Yurt Tesisleri', defaultIcon: 'business' };
    }
    if (category === 'kantin') {
      return { iconColor: 'text-amber-600', bgIcon: 'bg-amber-50', borderIcon: 'border-amber-100', catLabel: 'Kantin & Yemek', defaultIcon: 'restaurant' };
    }
    if (category === 'akademik') {
      return { iconColor: 'text-emerald-600', bgIcon: 'bg-emerald-50', borderIcon: 'border-emerald-100', catLabel: 'Akademik', defaultIcon: 'school' };
    }
    return { iconColor: 'text-brand-gold', bgIcon: 'bg-amber-50', borderIcon: 'border-amber-100', catLabel: 'Duyuru', defaultIcon: icon || 'campaign' };
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white antialiased flex flex-col min-h-screen selection:bg-brand-gold selection:text-white transition-colors duration-300">
      <Header title="Duyurular" />

      <main className="flex flex-col relative w-full pt-16 pb-28 bg-[#f8fafc] dark:bg-[#07090e] min-h-screen">
        <div className="flex flex-col w-full">
          
          <section className="px-margin flex flex-col gap-space-sm pt-space-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[20px]">search</span>
              <input 
                className="w-full h-11 pl-11 pr-10 rounded-xl bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-body-md text-body-md placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all" 
                placeholder="Duyuru veya haber ara..." 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button aria-label="Aramayı temizle" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-brand-gold dark:hover:text-brand-gold transition-colors" onClick={() => setSearch('')} type="button">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 -mx-margin px-margin no-scrollbar">
              <button onClick={() => setFilter('all')} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform ${filter === 'all' ? 'bg-brand-gold text-white' : 'bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`} type="button">
                Tümü
              </button>
              <button onClick={() => setFilter('tesis')} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform ${filter === 'tesis' ? 'bg-brand-gold text-white' : 'bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`} type="button">
                Yurt İçi & Tesis
              </button>
              <button onClick={() => setFilter('akademik')} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform ${filter === 'akademik' ? 'bg-brand-gold text-white' : 'bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`} type="button">
                Akademik & İzin
              </button>
              <button onClick={() => setFilter('kantin')} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform ${filter === 'kantin' ? 'bg-brand-gold text-white' : 'bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`} type="button">
                Kantin & Yemek
              </button>
              <button onClick={() => setFilter('acil')} className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform flex items-center gap-1.5 ${filter === 'acil' ? 'bg-brand-gold text-white' : 'bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`} type="button">
                <span>Acil & Önemli</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)] animate-pulse"></span>
              </button>
            </div>
          </section>



          <section className="px-margin mt-space-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-brand-gold"></span>
              <h3 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white uppercase tracking-wide font-bold">Güncel Duyurular</h3>
            </div>
            <span className="font-label-sm text-label-sm text-slate-500 dark:text-slate-400 font-medium">Son 7 Gün</span>
          </section>

          <section className="px-margin mt-space-sm flex flex-col gap-space-sm">
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-4 shadow-sm flex flex-col gap-2.5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0 animate-pulse"></div>
                      <div className="flex flex-col flex-1 gap-1.5 pt-1">
                        <div className="flex justify-between items-center">
                          <div className="w-20 h-3 rounded bg-slate-200 dark:bg-white/10 animate-pulse"></div>
                          <div className="w-12 h-3 rounded bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                        </div>
                        <div className="w-3/4 h-4 rounded bg-slate-200 dark:bg-white/10 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="pl-[52px] flex flex-col gap-1.5">
                      <div className="w-full h-3 rounded bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                      <div className="w-4/5 h-3 rounded bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map(ann => {
                const styles = getCategoryStyles(ann.category, ann.icon);
                const date = new Date(ann.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
                return (
                <article key={ann.id} className="rounded-2xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 p-4 shadow-sm flex flex-col gap-2.5 active:bg-slate-50 dark:active:bg-[#151b2b] transition-colors cursor-pointer hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${styles.bgIcon} dark:bg-white/5 ${styles.borderIcon} dark:border-white/10 border`}>
                      <span className={`material-symbols-outlined ${styles.iconColor} dark:text-brand-gold text-[22px]`}>{styles.defaultIcon}</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-label-sm text-label-sm text-amber-700 dark:text-brand-gold font-semibold uppercase tracking-wider truncate">{styles.catLabel}</span>
                        <span className="font-label-sm text-label-sm text-slate-400 dark:text-slate-500 shrink-0">{date}</span>
                      </div>
                      <h4 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white mt-0.5 leading-snug font-bold">{ann.title}</h4>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-slate-600 dark:text-slate-400 pl-[52px]">{ann.description}</p>
                  <div className="flex items-center justify-between pl-[52px] pt-1">
                    {ann.badge && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/20 text-amber-700 dark:text-brand-gold font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[13px] text-amber-600 dark:text-brand-gold">redeem</span>
                        {ann.badge}
                      </span>
                    )}
                    {ann.badgeNum && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[13px] text-slate-500 dark:text-slate-400">groups</span>
                        {ann.badgeNum}
                      </span>
                    )}
                    {ann.catAction && (
                      <button className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-brand-gold dark:hover:bg-brand-gold hover:text-white dark:hover:text-white text-slate-800 dark:text-white font-label-md text-label-md transition-colors active:scale-95 font-semibold ${ann.category === 'akademik' ? '!bg-transparent !text-brand-gold !p-0 hover:!text-amber-700 dark:hover:!text-amber-500' : ''}`} type="button">
                        {ann.catActionIcon && <span className={`material-symbols-outlined text-[15px] ${ann.category === 'akademik' ? '' : 'text-brand-gold dark:text-brand-gold group-hover:text-white dark:group-hover:text-white'}`}>{ann.catActionIcon}</span>}
                        <span>{ann.catAction}</span>
                      </button>
                    )}
                    {ann.actionText && (
                      <button className="inline-flex items-center gap-1 text-brand-gold hover:text-amber-700 dark:hover:text-amber-500 font-label-md text-label-md transition-colors active:scale-95 font-semibold" type="button">
                        <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                        <span>{ann.actionText}</span>
                      </button>
                    )}
                    
                    {!ann.actionText && (
                      <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-label-sm text-label-sm flex items-center gap-0.5 transition-colors font-medium ml-auto" type="button">
                        <span>Detay</span>
                        <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                      </button>
                    )}
                  </div>
                </article>
                );
              })
            ) : (
              <div className="px-margin py-8 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-[#0f1523] border border-slate-200 dark:border-white/10 flex items-center justify-center mb-3 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[28px]">search_off</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-slate-900 dark:text-white font-bold">Sonuç Bulunamadı</h4>
                <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">Aradığınız kriterlere uygun duyuru bulunmamaktadır.</p>
              </div>
            )}
          </section>

          <section className="px-margin mt-space-lg mb-space-sm flex flex-col items-center gap-space-sm">
            <button 
              onClick={handleArchive}
              className={`w-full h-11 rounded-xl bg-white dark:bg-[#0f1523] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 text-amber-700 dark:text-brand-gold font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all font-semibold ${archiveLoaded ? 'opacity-75 pointer-events-none' : ''}`} 
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${loadingArchive ? 'animate-spin' : ''}`}>{archiveLoaded ? 'check_circle' : 'history_edu'}</span>
              <span>{archiveLoaded ? 'Tüm Arşiv Yüklendi (2025 - 2026)' : 'Daha Eski Duyuruları Yükle (Geçmiş Arşiv)'}</span>
            </button>
            <div className="flex items-center gap-1.5 text-center">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[14px]">shield</span>
              <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400">Yurt idaresi tarafından yayınlanan tüm resmi duyurular burada arşivlenir.</p>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AnnouncementsPage;
