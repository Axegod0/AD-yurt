import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const BalanceBadge = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('users')
            .select('balance')
            .eq('id', user.id)
            .single();
          if (data) setBalance(data.balance || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const isNegative = balance < 0;

  return (
    <div className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full shadow-sm transition-colors ${isNegative ? 'bg-red-50/80 border-red-200/80' : 'bg-amber-50/80 border-amber-200/80'}`}>
      <span className={`material-symbols-outlined text-[18px] ${isNegative ? 'text-red-500' : 'text-[#C5A059]'}`}>monetization_on</span>
      {loading ? (
        <span className="w-8 h-4 bg-black/10 rounded animate-pulse"></span>
      ) : (
        <span className={`text-[13px] font-bold tracking-tight ${isNegative ? 'text-red-800' : 'text-[#92400e]'}`}>{balance} AD</span>
      )}
    </div>
  );
};

export default BalanceBadge;
