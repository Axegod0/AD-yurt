import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const DormRules = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body-md flex flex-col min-h-screen transition-colors duration-300">
      <Header title="Yurt Kuralları" showUserName={false} />

      <main className="flex flex-col relative w-full pt-24 pb-safe min-h-screen px-margin">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold transition-colors shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold">Yurt Kuralları ve Rehberi</h1>
        </div>

        <div className="bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-3xl p-5 shadow-sm flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-brand-gold mb-1">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
              <h2 className="font-bold text-sm uppercase tracking-wider">Giriş ve Çıkış Saatleri</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Hafta içi ve hafta sonu yurda son giriş saati <strong>23:30</strong>'dur. İzinli olunan günler dışında bu kurala titizlikle riayet edilmesi gerekmektedir. Geç kalma durumlarında mutlaka nöbetçi idareciye önceden bilgi verilmelidir.
            </p>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-white/5"></div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-brand-gold mb-1">
              <span className="material-symbols-outlined text-[20px]">meeting_room</span>
              <h2 className="font-bold text-sm uppercase tracking-wider">Oda Düzeni ve Temizlik</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Odalarda yiyecek bulundurmak ve kokulu yemek yemek yasaktır. Sabah çıkışlarında yatakların toplanması ve çöplerin koridordaki genel çöp kutularına atılması zorunludur.
            </p>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-white/5"></div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-brand-gold mb-1">
              <span className="material-symbols-outlined text-[20px]">volume_off</span>
              <h2 className="font-bold text-sm uppercase tracking-wider">Etüt ve Ortak Alanlar</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Etüt salonlarında sessiz olunması, cep telefonlarının sessize alınması esastır. Ortak dinlenme alanlarında (kantin, lobi) diğer öğrencileri rahatsız edecek şekilde yüksek sesle konuşmaktan kaçınılmalıdır.
            </p>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-white/5"></div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-brand-gold mb-1">
              <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
              <h2 className="font-bold text-sm uppercase tracking-wider">Güvenlik ve Cihazlar</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Odalarda su ısıtıcısı, elektrikli ocak, ütü gibi yangın riski taşıyan cihazların kullanımı kesinlikle yasaktır. Ütüleme işlemleri için çamaşırhanedeki ayrılmış bölüm kullanılmalıdır.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DormRules;
