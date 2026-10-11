import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const BalanceCard = () => {
  const [balance, setBalance] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalanceAndTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch balance
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('balance')
          .eq('id', user.id)
          .single();
        
        if (!userError && userData) {
          setBalance(userData.balance);
        }

        // Fetch last transaction
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('amount, type, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!txError && txData) {
          setLastTransaction(txData);
        }
      } catch (err) {
        console.error("Error fetching balance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceAndTransactions();
  }, []);

  const isNegative = balance < 0;
  const bgClasses = isNegative
    ? "bg-gradient-to-br from-[#450a0a] dark:from-[#7f1d1d] via-[#450a0a] dark:via-[#7f1d1d] to-[#450a0a] dark:to-[#450a0a] border-red-500/50"
    : "bg-gradient-to-br from-[#0c1836] dark:from-[#101b38] via-[#10224d] dark:via-[#0b1426] to-[#081026] dark:to-[#070a13] border-[#C5A059]/25 dark:border-[#C5A059]/35";

  return (
    <div className={`relative overflow-hidden rounded-[26px] ${bgClasses} text-white shadow-[0_12px_30px_rgba(15,23,42,0.15)] dark:shadow-[0_12px_36px_rgba(15,23,42,0.6),0_0_20px_rgba(197,160,89,0.12)] px-5 py-4 dark:py-3.5 transition-all duration-300`}>
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex flex-col flex-1 min-w-0 pr-2 dark:pr-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#C5A059] text-[16px]">account_balance_wallet</span>
            </div>
            <span className="text-[13px] font-bold tracking-tight text-[#C5A059]">AD Coin Bakiyesi</span>
          </div>
          <div className="mt-3">
            <span className="text-[13px] font-medium text-slate-300 block leading-tight">Yurt Bakiyeniz</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              {loading ? (
                <div className="w-16 h-8 bg-white/20 rounded animate-pulse"></div>
              ) : (
                <span className="text-[34px] font-extrabold tracking-tight leading-none text-white drop-shadow-sm">{balance}</span>
              )}
              <span className="text-[15px] font-bold text-[#E5C158]">AD Coin</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 dark:w-32 dark:h-32 drop-shadow-[0_6px_18px_rgba(197,160,89,0.35)]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqd90a0q3UtwHT9K0PvGKMvYgId6-rzGUoOLUEnOexAcH3yYuyJvcErjdDYeN192vQkuoLRkhfTi3q2aLRINmiQJab82sIksrnUHDDsjqxP4nygWyn0eELx9d-gBcIEJUHCIGTvujF5yEZA9QU_2gFzPpTnZA64T0JtClTxZTAlGs5PKuBPKXCBmCq_nvCi0SSOVm3iwuNUFezdQmlmXhNs_NP0Mq_wWXMzX2844cr6NJrrIl_mkcy2zHLGhznZVwm4UQ" 
            alt="3D Gold AD Coin" 
            className="w-full h-full object-contain" 
          />
        </div>
      </div>
      <div className="relative z-10 pt-2.5 border-t border-white/10 dark:border-[#C5A059]/20 flex items-center justify-between text-[11px] font-medium text-slate-300 mt-2.5">
        <span className="truncate">
          Son işlem: 
          {loading ? (
            <span className="ml-1 animate-pulse bg-white/20 px-4 rounded text-transparent">yükleniyor</span>
          ) : lastTransaction ? (
            <span className={`ml-1 font-semibold ${lastTransaction.type === 'harcama' ? 'text-red-400' : 'text-[#E5C158]'}`}>
              {lastTransaction.type === 'harcama' ? '-' : '+'}{lastTransaction.amount} AD Coin
            </span>
          ) : (
            <span className="ml-1 text-slate-400">İşlem Yok</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default BalanceCard;
