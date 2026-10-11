import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Could not fetch notifications. Table might be missing.", error);
      } else if (data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
      
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-[#07090e] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#C5A059]/10 pt-safe">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A059]">notifications</span>
            Bildirimler
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
              <span className="text-sm font-medium">Yükleniyor...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 space-y-3">
              <span className="material-symbols-outlined text-[48px] opacity-20">notifications_off</span>
              <p className="text-sm font-medium">Yeni bildiriminiz yok</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const timeDisplay = new Date(notif.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
              return (
              <div key={notif.id} className={`bg-white dark:bg-transparent border ${notif.type === 'laundry' ? 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5' : 'border-slate-200 dark:border-white/10'} rounded-2xl p-3.5 relative overflow-hidden ${notif.type === 'wallet' ? 'opacity-75' : ''}`}>
                {notif.type === 'laundry' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C5A059]"></div>}
                <div className={`flex gap-3 ${notif.type === 'laundry' ? 'pl-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === 'laundry' ? 'bg-amber-100 dark:bg-[#C5A059]/20 text-[#C5A059]' :
                    notif.type === 'announcement' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' :
                    'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500'
                  }`}>
                    <span className="material-symbols-outlined">{notif.icon || 'notifications'}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{notif.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{timeDisplay}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                      {notif.content}
                    </p>
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-[#C5A059]/10 pb-safe">
            <button 
              onClick={handleClearNotifications}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Tümünü Okundu İşaretle ve Sil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;
