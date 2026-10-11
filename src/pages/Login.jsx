import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase.from('users').select('must_change_password').eq('id', data.user.id).single();
        if (profile?.must_change_password) {
          navigate('/force-password');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Giriş başarısız. Bilgilerinizi kontrol ediniz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-800 antialiased flex flex-col min-h-screen selection:bg-amber-100 selection:text-amber-900">
      <main className="flex-1 flex flex-col justify-between relative w-full pt-safe pb-safe px-5">
        <div className="flex flex-col w-full max-w-sm mx-auto my-auto pt-4 pb-2">
          {/* Ambient Subtle Glow */}
          <div className="relative w-full flex flex-col items-center">
            <div className="absolute -top-10 w-56 h-56 rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-48 w-60 h-60 rounded-full bg-blue-100/40 blur-3xl pointer-events-none -z-10"></div>
            
            {/* Institutional Identity & Brand Insignia */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3 flex items-center justify-center">
                <img alt="Ali Dayı Öğrenci Yurdu Amblemi" className="relative w-24 h-20 object-contain drop-shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA47AtkBXEDbmIiYFTWjJLOxrAUZHu1XYX2zNcYFNg5Ej5K-g_wkpXQr5WNCN7e56rQOhphINeICt7209ldOLn-AsEGq4YQ9gdvLug0ca-hxmgAv4jYzFfu-4XWd8u1lo-e_fThWQX4F984GcLrVNiy61S6s-2uyAqajyNG-u97ELe-1TVDr6RfkaFii7zAGjQZCrHGL_ZWmgFOOYN1kUQVkv_Wl8afM9VHwTn5u1gTMXUS5tiHB48zNdpRc47wwYne8ng" />
              </div>
              <h1 className="text-[19px] font-bold tracking-[0.16em] text-[#0F172A] uppercase text-center leading-tight">
                ALİ DAYI ÖĞRENCİ YURDU
              </h1>
              <p className="text-[12px] font-medium tracking-wider text-slate-500 mt-1 uppercase">
                Öğrenci Giriş Portalı
              </p>
              
              {/* Motto Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-amber-50 border border-amber-200/80 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest text-[#B45309] uppercase">Değerli Hissettirir</span>
              </div>
            </div>
            
            {/* Primary Elevated Authentication Container */}
            <div className="w-full mt-6 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)] relative">
              {/* Top Gold Accent Indicator */}
              <div className="absolute top-0 inset-x-6 h-[2.5px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent rounded-full"></div>
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-5 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#C5A059]">
                    <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#0F172A] tracking-tight">Hoş Geldiniz</span>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 tracking-wider">
                  GİRİŞ YAPINIZ
                </span>
              </div>
              
              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
                    {error}
                  </div>
                )}
                
                {/* Input Field 1: Identifier */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-slate-700 flex items-center justify-between" htmlFor="email">
                    <span>E-Posta</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#C5A059] pointer-events-none text-[20px]">
                      badge
                    </span>
                    <input 
                      autoComplete="username" 
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50/80 border border-slate-200 text-[#0F172A] text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 transition-all duration-200" 
                      id="email" 
                      name="email" 
                      placeholder="Örn: isimsoyisim@alidayi.edu.tr" 
                      required 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Input Field 2: Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-slate-700 flex items-center justify-between" htmlFor="password">
                    <span>Kurumsal Şifre</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#C5A059] pointer-events-none text-[20px]">
                      lock
                    </span>
                    <input 
                      autoComplete="current-password" 
                      className="w-full h-12 pl-11 pr-11 rounded-xl bg-slate-50/80 border border-slate-200 text-[#0F172A] text-[13px] font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 transition-all duration-200" 
                      id="password" 
                      name="password" 
                      placeholder="••••••••" 
                      required 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      aria-label="Şifreyi Göster veya Gizle" 
                      className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-[#C5A059] transition-colors flex items-center justify-center" 
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Administrative Security Note */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/50 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#C5A059] text-[18px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    info
                  </span>
                  <p className="text-[12px] text-slate-600 leading-snug">
                    İlk şifreniz yurt idaresi tarafından tanımlanan varsayılan paroladır.
                  </p>
                </div>
                
                {/* Primary Action Button */}
                <button 
                  className={`relative w-full h-[50px] mt-1 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#C5A059] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(197,160,89,0.35)] hover:brightness-105 active:scale-[0.98] transition-all duration-150 overflow-hidden ${loading ? 'opacity-90 pointer-events-none' : ''}`} 
                  type="submit"
                  disabled={loading}
                >
                  <span className="tracking-wide">{loading ? 'Doğrulanıyor...' : 'Giriş Yap'}</span>
                  <span className="material-symbols-outlined text-[20px]">{loading ? 'hourglass_empty' : 'arrow_forward'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Institutional Footer & Verification */}
        <footer className="mt-4 pb-2 flex flex-col items-center text-center gap-1">
          <div className="inline-flex items-center gap-1.5 text-slate-400 text-[12px] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#C5A059]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span>Ali Dayı Öğrenci Yurdu Bilgi İşlem</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-semibold text-[10px] tracking-wider uppercase">SSL 256-BİT</span>
          </div>
          <p className="text-[10px] text-slate-400 tracking-wider">
            v2.4 Güvenli Oturum Protokolü
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Login;
