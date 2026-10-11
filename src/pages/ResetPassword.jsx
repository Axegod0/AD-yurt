import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Header from '../components/Header';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        // Log transaction for password change if we have user
        if (user) {
          await supabase.from('transactions').insert([{
            user_id: user.id,
            amount: 0,
            type: 'password_changed',
            description: 'Kullanıcı şifresini yeniledi.'
          }]);
        }
        
        setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
        setTimeout(() => navigate('/profil'), 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body-md flex flex-col min-h-screen transition-colors duration-300">
      <Header title="Şifre Yenileme" showUserName={false} />

      <main className="flex flex-col relative w-full pt-24 pb-safe min-h-screen px-margin">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold">Şifre Yenileme</h1>
        </div>

        <div className="bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-3xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-brand-gold mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[32px]">password</span>
          </div>
          <h2 className="font-headline-sm font-bold mb-2">Yeni Şifre Belirle</h2>
          <p className="text-center text-sm text-slate-500 mb-6">Hesabınızın güvenliği için güçlü bir şifre kullanmanızı öneririz.</p>

          <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-1 uppercase tracking-wider">Yeni Şifre</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">lock</span>
                <input 
                  type="password" 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all dark:text-white"
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-1 uppercase tracking-wider">Yeni Şifre (Tekrar)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">key</span>
                <input 
                  type="password" 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all dark:text-white"
                  placeholder="Şifrenizi doğrulayın"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {message.text && (
              <div className={`mt-2 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'}`}>
                <span className="material-symbols-outlined text-[18px]">
                  {message.type === 'error' ? 'error' : 'check_circle'}
                </span>
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 w-full py-3.5 px-4 rounded-xl bg-brand-gold hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Şifreyi Güncelle
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
