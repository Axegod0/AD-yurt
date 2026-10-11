import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { supabase } from '../supabase';

const Profile = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [userData, setUserData] = useState({ fullName: '', role: '', initials: 'AD', balance: 0, roomNumber: 'Bilinmiyor', id: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('full_name, role, balance, room_number')
          .eq('id', user.id)
          .single();
          
        if (profile) {
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
            balance: profile.balance || 0,
            roomNumber: profile.room_number || 'Bilinmiyor',
            id: user.id.substring(0, 6).toUpperCase()
          });
        }
      }
    };
    fetchUser();
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setShowThemeOptions(false);
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <>
      <div className="bg-[#F8FAFC] dark:bg-[#07090e] text-[#0F172A] dark:text-white flex flex-col min-h-screen antialiased selection:bg-[#C5A059]/20 font-sans transition-colors duration-300">
        <Header title="Profil" showAdminButton={true} />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col relative w-full pt-[72px] pb-28">
        <div className="flex flex-col w-full px-margin space-y-4 pt-2">
          {/* 2. Öğrenci Profil Kartı (Hero White Card) */}
          <section className="bg-white dark:bg-[#0f1523] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E2E8F0] dark:border-white/5 relative overflow-hidden transition-colors duration-300">
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Avatar with Monogram and Verified Checkmark */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0e1b38] via-[#162a56] to-[#1e3a8a] text-white flex items-center justify-center shadow-md">
                    <span className="font-bold text-lg text-[#E5C158] tracking-wider">{userData.initials}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center ring-2 ring-white dark:ring-[#0f1523] shadow-sm">
                    <span className="material-symbols-outlined text-[13px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                </div>
                {/* Student Credentials */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-[#0F172A] dark:text-white truncate">{userData.fullName}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#966b1a] dark:text-[#C5A059] text-[10px] font-bold tracking-wide uppercase">{userData.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#64748B] dark:text-slate-400">
                      <span className="material-symbols-outlined text-[15px] text-[#C5A059]">meeting_room</span>
                      Oda: {userData.roomNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. AD Coin Cüzdanım (Signature Deep Navy Blue Gradient Card) */}
          <section className="rounded-2xl p-5 shadow-lg relative overflow-hidden" style={{ background: userData.balance < 0 ? 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #450a0a 100%)' : 'linear-gradient(135deg, #0e1b38 0%, #162a56 50%, #0b152d 100%)' }}>
            <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-6 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col space-y-1">
                {/* Coin Wallet Pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm self-start border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-[#E5C158]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                  <span className="text-[10px] font-bold text-[#E5C158] tracking-wider uppercase">AD COİN CÜZDANIM</span>
                </div>
                {/* Balance display */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#E5C158] tracking-tight">{userData.balance}</span>
                    <span className="text-lg font-bold text-white tracking-wide">AD COİN</span>
                  </div>
                </div>
              </div>
              {/* 3D Gold Coin Asset */}
              <div className="relative shrink-0 w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#C5A059]/25 rounded-full blur-lg"></div>
                <img alt="AD Coin 3D" className="relative z-10 w-20 h-20 object-contain drop-shadow-[0_8px_16px_rgba(229,193,88,0.35)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRUQ_7DjBPaqikH-48pvGMrmlzeUDiOSvnHKh1J32qEl4xx1oW3T9_MvMb7F9-DwGNVc-2ZRzETHB0AhbZMQG7LOlkhEE3MIKC1dX7dPNvLFJDjEGKa82AqmeeTM8IliY2kxmjlGlB0azl31HTEH7klTjLygadIylmuF5QwuLIHPpe8dp5gNAObdLm-gdqPgl5dC860ZQ2cWN7gYtZ9pccFNifn28DQ0a4wCfTed1GvgZUtGElKWXVrz-9QcCgWOTeI6c" />
              </div>
            </div>
            {/* Actions inside balance card */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-1 relative z-10">
              <a href="https://wa.me/905336775003?text=AD%20coin%20y%C3%BCklemek%20istiyorum." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#0F172A] font-bold text-xs shadow-md active:scale-95 transition-all hover:brightness-105">
                <span className="material-symbols-outlined text-[17px]">add_card</span>
                <span>Bakiye Yükle</span>
              </a>
              <button onClick={() => navigate('/transactions')} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-semibold text-xs active:scale-95 transition-all backdrop-blur-sm" type="button">
                <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                <span>Hareketler</span>
              </button>
            </div>
          </section>

          {/* 6. Hesap ve Ayarlar (Settings Navigation List - White Light Theme) */}
          <section className="flex flex-col space-y-2.5 pt-1">
            <div className="flex items-center gap-2 px-0.5">
              <span className="material-symbols-outlined text-[#C5A059] text-[20px]">settings</span>
              <h3 className="text-xs font-bold text-[#0F172A] dark:text-white tracking-wider uppercase">Hesap ve Ayarlar</h3>
            </div>
            <div className="bg-white dark:bg-[#0f1523] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-[#E2E8F0] dark:border-white/5 flex flex-col divide-y divide-slate-100 dark:divide-white/5">
              {/* Row 1: Bildirim */}
              <button onClick={() => navigate('/notifications-settings')} className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left" type="button">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#0F172A] dark:text-white shrink-0">
                    <span className="material-symbols-outlined text-[19px]">notifications</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">Bildirim Tercihleri</span>
                    <span className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">Çamaşırhane, yemek ve duyuru alarmları</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </button>
              {/* Row 2: Güvenlik */}
              <button onClick={() => navigate('/reset-password')} className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left" type="button">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#0F172A] dark:text-white shrink-0">
                    <span className="material-symbols-outlined text-[19px]">lock</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">Şifre Yenileme</span>
                    <span className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">Hesap şifresini güvenle değiştirin</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </button>
              {/* Row 3: Rehber */}
              <button onClick={() => navigate('/dorm-rules')} className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left" type="button">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#0F172A] dark:text-white shrink-0">
                    <span className="material-symbols-outlined text-[19px]">menu_book</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">Yurt Kuralları ve Rehberi</span>
                    <span className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">Giriş-çıkış, etüt ve ortak alan esasları</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </button>
              {/* Row 4: Destek */}
              <button onClick={() => navigate('/contact')} className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left" type="button">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#0F172A] dark:text-white shrink-0">
                    <span className="material-symbols-outlined text-[19px]">support_agent</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">Destek & İdareyle İletişim</span>
                    <span className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">Müdüriyet ve acil durum hatları</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </button>
              {/* Row 5: Tema Tercihi */}
              <div className="flex flex-col border-t border-slate-100 dark:border-white/5">
                <button onClick={() => setShowThemeOptions(!showThemeOptions)} className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full text-left" type="button">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#0F172A] dark:text-white shrink-0">
                      <span className="material-symbols-outlined text-[19px]">dark_mode</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">Tema Tercihi</span>
                      <span className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">
                        {theme === 'dark' ? 'Koyu Mod' : theme === 'light' ? 'Açık Mod' : 'Sistem Varsayılanı'}
                      </span>
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-slate-400 text-[18px] transition-transform ${showThemeOptions ? 'rotate-90' : ''}`}>chevron_right</span>
                </button>
                
                {showThemeOptions && (
                  <div className="flex flex-col bg-slate-50/50 dark:bg-white/[0.02] px-12 py-2 gap-1 border-t border-slate-100/50 dark:border-white/5">
                    <button onClick={() => changeTheme('light')} className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${theme === 'light' ? 'bg-white dark:bg-white/10 shadow-sm text-[#C5A059]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                      <span>Açık Mod</span>
                      {theme === 'light' && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <button onClick={() => changeTheme('dark')} className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-white dark:bg-white/10 shadow-sm text-[#C5A059]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                      <span>Koyu Mod</span>
                      {theme === 'dark' && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <button onClick={() => changeTheme('system')} className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${theme === 'system' ? 'bg-white dark:bg-white/10 shadow-sm text-[#C5A059]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                      <span>Sistem Varsayılanı</span>
                      {theme === 'system' && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Row 6: Oturumu Kapat */}
              <button 
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {}
                  localStorage.clear();
                  navigate('/login');
                }} 
                className="w-full flex items-center justify-between p-3.5 hover:bg-red-50/60 dark:hover:bg-red-500/10 transition-colors text-left group border-t border-slate-100 dark:border-white/5" 
                type="button"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-red-100/70 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[19px]">logout</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 truncate">Oturumu Kapat</span>
                    <span className="text-[11px] text-red-400 dark:text-red-500/80 truncate">Hesaptan güvenli çıkış yap</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-red-400 dark:text-red-500/80 text-[18px]">chevron_right</span>
              </button>
            </div>
          </section>

          {/* 7. Footer Info */}
          <footer className="pt-4 pb-6 flex flex-col items-center justify-center text-center space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-[#94A3B8] dark:text-slate-600 uppercase">
              ALİ DAYI TALEBE YURDU MOBİL V2.4.0
            </p>
            <p className="text-[11px] font-normal text-[#94A3B8] dark:text-slate-600">
              Öğrenci Yönetim & Kampüs Yaşam Ekosistemi
            </p>
          </footer>
        </div>
      </main>

      {/* 8. Bottom Navigation Bar */}
      <BottomNav />
    </div>
    </>
  );
};

export default Profile;
