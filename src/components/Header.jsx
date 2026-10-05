import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-100 dark:border-[#C5A059]/15 transition-colors duration-300">
      <div className="h-16 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-AT7oTa3IgYWL3P6Dz1pN0tSoNV7ph0MsQm-je--5MzhcNx99qjS9vDN-01JaSpf7ZXmefJWBfv0O5bdb4LL58L8QgIqHxNlmcncK9eQ5MlFfgkRfV_bqs2vm4PB74mlFgv7A_c_fZuzFG6AoeTkPM4l9EcCHVpYt9_ThuQiTEt2ewGdRQdAHSFOfamuNhB7Q2SzCJItISBTDeDe1PoZxVejrZM11VFuFHQuB8zl6T__Gr44Q7t_VV08ypb99WOnifFo" 
              alt="AD Logo" 
              className="w-full h-full object-contain dark:hidden" 
            />
            {/* Show alternative logo for dark mode if preferred, or keep same. Using same for now */}
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Ak8liCl33aOJrCPEu9Hld-4uP8FwevV3tyHjuenrik8-4HRQHT9d0Pspldbsf5Kdy8Us-l7rZO6ZngU_1Q3qidOMVf0XKPST6rv9waXKZ9kvWHFEp9dOtV2ChTPHVEqogJxGjO3ztcUwbl49GJpUEAThHuyI3kxXdJw-eoFv2ja1TbdXQGE7bJ7mkwTR0qgciX_eV6nTGAYkBMLeFr-ei9d_kyOLLycStKhEILkOHs_xOoQkK_B-h8oSbX30240isJ8yCIc3zFBbT3k" 
              alt="AD Logo Dark" 
              className="w-full h-full object-contain hidden dark:block" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-slate-500 dark:text-text-muted leading-none">Hoş geldin</span>
            <h1 className="text-[19px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-tight mt-0.5">Ahmet Yılmaz</h1>
            <span className="text-[11px] text-[#C5A059] font-medium leading-none mt-0.5">Talebe</span>
          </div>
        </div>
        <button aria-label="Bildirimler" className="relative w-10 h-10 dark:w-11 dark:h-11 rounded-full bg-white dark:bg-surface-card border border-slate-200 dark:border-[#C5A059]/20 flex items-center justify-center text-slate-700 dark:text-white shadow-sm dark:shadow-none active:scale-95 transition-all" type="button">
          <span className="material-symbols-outlined text-[20px] dark:text-[21px] text-slate-700 dark:text-[#C5A059]">notifications</span>
          <span className="absolute top-2 right-2 dark:top-2.5 dark:right-2.5 w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
