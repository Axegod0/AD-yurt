import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const NotificationsSettings = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    laundry: true,
    canteen: true,
    announcements: true,
    sms: false,
    email: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body-md flex flex-col min-h-screen transition-colors duration-300">
      <Header title="Bildirim Tercihleri" showUserName={false} />

      <main className="flex flex-col relative w-full pt-24 pb-safe min-h-screen px-margin">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold">Tercihlerim</h1>
        </div>

        <div className="bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-3xl p-5 shadow-sm flex flex-col gap-5">
          
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider px-1">Uygulama İçi Bildirimler</h3>
            
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Çamaşırhane Durumu</span>
                    <span className="text-xs text-slate-500">Yıkama bitimi ve boş makine haberleri</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('laundry')} 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.laundry ? 'bg-brand-gold' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${settings.laundry ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">restaurant</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Kantin & Yemekhane</span>
                    <span className="text-xs text-slate-500">Sıcak satış ve yeni menü bildirimleri</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('canteen')} 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.canteen ? 'bg-brand-gold' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${settings.canteen ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-gold dark:bg-brand-gold/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">campaign</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Genel Duyurular</span>
                    <span className="text-xs text-slate-500">Yurt yönetimi duyuruları ve etkinlikler</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('announcements')} 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.announcements ? 'bg-brand-gold' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${settings.announcements ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider px-1">İletişim Kanalları</h3>
            
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">sms</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">SMS Bildirimleri</span>
                    <span className="text-xs text-slate-500">Sadece acil durumlarda mesaj al</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('sms')} 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.sms ? 'bg-brand-gold' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${settings.sms ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">E-Posta Bülteni</span>
                    <span className="text-xs text-slate-500">Haftalık özet ve önemli bilgilendirmeler</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('email')} 
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.email ? 'bg-brand-gold' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${settings.email ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default NotificationsSettings;
