import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import NotificationsModal from './NotificationsModal';

const Header = ({ title, showUserName = true, showAdminButton = false }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState({ fullName: '', role: '', initials: 'AD', badge: '' });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          if (profile.must_change_password) {
            navigate('/force-password');
            return;
          }

          const names = profile.full_name ? profile.full_name.split(' ') : [];
          let initials = 'AD';
          if (names.length >= 2) {
            initials = `${names[0][0]}${names[names.length-1][0]}`;
          } else if (names.length === 1) {
            initials = names[0].substring(0, 2).toUpperCase();
          }
          
          setUserData({
            fullName: profile.full_name || 'Misafir',
            role: profile.role === 'student' ? 'Talebe' : profile.role === 'admin' ? 'Yönetici' : 'Kullanıcı',
            initials,
            badge: profile.badge || ''
          });
        }
      }
      setLoading(false);
    };

    const fetchUnreadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
        setUnreadCount(count || 0);
      }
    };

    fetchUser();
    fetchUnreadCount();

    // Request browser notification permissions
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    let subscription;
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        subscription = supabase
          .channel('public:notifications')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
            const newNotif = payload.new;
            setUnreadCount(prev => prev + 1);
            
            // Trigger push notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(newNotif.title, {
                body: newNotif.content,
                icon: '/vite.svg'
              });
            }
          })
          .subscribe();
      }
    };

    setupRealtime();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-100 dark:border-[#C5A059]/15 transition-colors duration-300">
        <div className="h-16 px-5 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer active:opacity-70 transition-opacity"
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-AT7oTa3IgYWL3P6Dz1pN0tSoNV7ph0MsQm-je--5MzhcNx99qjS9vDN-01JaSpf7ZXmefJWBfv0O5bdb4LL58L8QgIqHxNlmcncK9eQ5MlFfgkRfV_bqs2vm4PB74mlFgv7A_c_fZuzFG6AoeTkPM4l9EcCHVpYt9_ThuQiTEt2ewGdRQdAHSFOfamuNhB7Q2SzCJItISBTDeDe1PoZxVejrZM11VFuFHQuB8zl6T__Gr44Q7t_VV08ypb99WOnifFo" 
                alt="AD Logo" 
                className="w-full h-full object-contain dark:hidden" 
              />
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Ak8liCl33aOJrCPEu9Hld-4uP8FwevV3tyHjuenrik8-4HRQHT9d0Pspldbsf5Kdy8Us-l7rZO6ZngU_1Q3qidOMVf0XKPST6rv9waXKZ9kvWHFEp9dOtV2ChTPHVEqogJxGjO3ztcUwbl49GJpUEAThHuyI3kxXdJw-eoFv2ja1TbdXQGE7bJ7mkwTR0qgciX_eV6nTGAYkBMLeFr-ei9d_kyOLLycStKhEILkOHs_xOoQkK_B-h8oSbX30240isJ8yCIc3zFBbT3k" 
                alt="AD Logo Dark" 
                className="w-full h-full object-contain hidden dark:block" 
              />
            </div>
            <div className="flex flex-col justify-center">
              {loading ? (
                <div className="flex flex-col gap-1.5 py-1">
                  <div className="w-24 h-4 bg-slate-200 dark:bg-white/10 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-slate-100 dark:bg-white/5 rounded animate-pulse"></div>
                </div>
              ) : title ? (
                <>
                  <h1 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-tight">{title}</h1>
                  {showUserName && <span className="text-[11px] font-medium text-slate-500 dark:text-text-muted leading-none mt-0.5">{userData.fullName} • {userData.role}</span>}
                </>
              ) : (
                <>
                  <span className="text-[12px] font-medium text-slate-500 dark:text-text-muted leading-none">Hoş geldin</span>
                  <h1 className="text-[19px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-tight mt-0.5">{userData.fullName}</h1>
                  <span className="text-[11px] text-[#C5A059] font-medium leading-none mt-0.5">{userData.role}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showAdminButton && userData.role === 'Yönetici' && (
              <button
                onClick={() => {
                  if (userData.badge === 'developer' || userData.badge === 'çamaşırhaneci') {
                    navigate('/admin/laundry');
                  } else {
                    // Default fallback
                    navigate('/admin/laundry');
                  }
                }}
                className="relative h-10 px-3 rounded-full bg-amber-50 dark:bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-amber-900 dark:text-[#C5A059] shadow-sm font-bold text-xs active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] mr-1">admin_panel_settings</span>
                Admin
              </button>
            )}
            <button 
              onClick={() => setShowNotifications(true)}
              aria-label="Bildirimler" 
              className="relative w-10 h-10 dark:w-11 dark:h-11 rounded-full bg-white dark:bg-surface-card border border-slate-200 dark:border-[#C5A059]/20 flex items-center justify-center text-slate-700 dark:text-white shadow-sm dark:shadow-none active:scale-95 transition-all" 
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] dark:text-[21px] text-slate-700 dark:text-[#C5A059]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 dark:top-2.5 dark:right-2.5 w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};

export default Header;
