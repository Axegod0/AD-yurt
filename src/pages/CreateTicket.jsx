import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [type, setType] = useState('ariza');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [machineId, setMachineId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Lütfen başlık ve açıklama giriniz.");
      return;
    }
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Oturumunuz bulunamadı.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('support_tickets').insert([{
        user_id: user.id,
        type,
        title,
        description,
        machine_id: machineId || null,
        status: 'pending'
      }]);

      if (error) throw error;

      alert("Talebiniz başarıyla oluşturuldu.");
      navigate('/services');
    } catch (err) {
      console.error(err);
      alert("Talep oluşturulurken bir hata oluştu. Veritabanı tablosu hazır olmayabilir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white min-h-screen flex flex-col font-body-md transition-colors duration-300">
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-md pt-safe border-b border-slate-200 dark:border-white/5">
        <div className="h-14 px-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-brand-gold transition-colors shrink-0">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold">Yeni Talep Oluştur</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-20 pb-safe px-4 max-w-lg mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-slate-700 dark:text-slate-300">Talep Türü</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setType('ariza')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${type === 'ariza' ? 'bg-amber-50 dark:bg-brand-gold/20 border-brand-gold text-brand-gold' : 'bg-white dark:bg-[#0f1523] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}>
                <span className="material-symbols-outlined">build_circle</span>
                <span className="text-[12px] font-bold">Arıza</span>
              </button>
              <button type="button" onClick={() => setType('sepet')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${type === 'sepet' ? 'bg-amber-50 dark:bg-brand-gold/20 border-brand-gold text-brand-gold' : 'bg-white dark:bg-[#0f1523] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}>
                <span className="material-symbols-outlined">inventory_2</span>
                <span className="text-[12px] font-bold">Sepet/Eşya</span>
              </button>
              <button type="button" onClick={() => setType('oneri')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${type === 'oneri' ? 'bg-amber-50 dark:bg-brand-gold/20 border-brand-gold text-brand-gold' : 'bg-white dark:bg-[#0f1523] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}>
                <span className="material-symbols-outlined">lightbulb</span>
                <span className="text-[12px] font-bold">Öneri</span>
              </button>
              <button type="button" onClick={() => setType('bakiye')} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${type === 'bakiye' ? 'bg-amber-50 dark:bg-brand-gold/20 border-brand-gold text-brand-gold' : 'bg-white dark:bg-[#0f1523] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}>
                <span className="material-symbols-outlined">account_balance_wallet</span>
                <span className="text-[12px] font-bold">Bakiye/İade</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-slate-700 dark:text-slate-300">Konu Başlığı</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white dark:bg-[#0f1523] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-brand-gold"
              placeholder="Örn: 4. İstasyon Çalışmıyor"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md font-bold text-slate-700 dark:text-slate-300">Detaylı Açıklama</label>
            <textarea 
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="4"
              className="w-full bg-white dark:bg-[#0f1523] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-brand-gold resize-none"
              placeholder="Sorunu veya talebinizi detaylıca anlatınız..."
            ></textarea>
          </div>

          {type === 'ariza' && (
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md font-bold text-slate-700 dark:text-slate-300">Makine / İstasyon No (Opsiyonel)</label>
              <input 
                type="text" 
                value={machineId}
                onChange={e => setMachineId(e.target.value)}
                className="w-full bg-white dark:bg-[#0f1523] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:border-brand-gold"
                placeholder="Örn: M-03 veya İstasyon 4"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 rounded-xl bg-brand-gold hover:bg-amber-500 text-slate-900 font-bold flex items-center justify-center gap-2 shadow-sm transition-all mt-4 ${loading ? 'opacity-70' : ''}`}
          >
            <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'send'}</span>
            <span>{loading ? 'Gönderiliyor...' : 'Talebi Gönder'}</span>
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateTicket;
