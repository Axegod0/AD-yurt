import React from 'react';

const BalanceCard = () => {
  return (
    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0c1836] dark:from-[#101b38] via-[#10224d] dark:via-[#0b1426] to-[#081026] dark:to-[#070a13] text-white border border-[#C5A059]/25 dark:border-[#C5A059]/35 shadow-[0_12px_30px_rgba(15,23,42,0.15)] dark:shadow-[0_12px_36px_rgba(15,23,42,0.6),0_0_20px_rgba(197,160,89,0.12)] px-5 py-4 dark:py-3.5 transition-all duration-300">
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
              <span className="text-[34px] font-extrabold tracking-tight leading-none text-white drop-shadow-sm">145</span>
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
        <span className="truncate">Son işlem: <span className="text-[#E5C158] font-semibold">-15 AD Coin</span> (Kantin)</span>
      </div>
    </div>
  );
};

export default BalanceCard;
