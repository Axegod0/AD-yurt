import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Header from '../components/Header';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (data) setTransactions(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body-md flex flex-col min-h-screen selection:bg-brand-gold selection:text-white transition-colors duration-300">
      <Header title="Hesap Hareketleri" showUserName={false} />

      <main className="flex flex-col relative w-full pt-20 pb-safe min-h-screen">
        <div className="flex items-center gap-3 px-margin pb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold">Cüzdan Hareketleri</h1>
        </div>

        <div className="px-margin flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse"></div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-24 h-4 rounded bg-slate-200 dark:bg-white/10 animate-pulse"></div>
                      <div className="w-16 h-3 rounded bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-16 h-4 rounded bg-slate-200 dark:bg-white/10 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            transactions.map(tx => {
              const isExpense = tx.type === 'wash_payment';
              const date = new Date(tx.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
              return (
                <div key={tx.id} className="bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isExpense ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                      <span className="material-symbols-outlined text-[20px]">{isExpense ? 'shopping_cart' : 'add_card'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[14px] font-bold">{tx.description || (isExpense ? 'Harcama' : 'Yükleme')}</span>
                      <span className="font-label-sm text-[11px] text-slate-500">{date}</span>
                    </div>
                  </div>
                  <span className={`font-bold ${isExpense ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isExpense ? '-' : '+'}{tx.amount} AD
                  </span>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-3">receipt_long</span>
              <h3 className="font-headline-sm font-bold text-slate-700 dark:text-slate-300">Henüz İşlem Yok</h3>
              <p className="text-[12px] text-slate-500 mt-1">Cüzdanınıza AD Coin yükleyerek veya harcama yaparak hareketlerinizi burada görebilirsiniz.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
