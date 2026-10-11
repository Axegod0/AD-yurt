import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Contact = () => {
  const navigate = useNavigate();

  const teachers = [
    {
      id: 1,
      name: 'Ahmet Hoca',
      role: 'Yurt Müdürü',
      phone: '905336775003',
      isDuty: false
    },
    {
      id: 2,
      name: 'Mehmet Hoca',
      role: 'Nöbetçi İdareci',
      phone: '905336775003',
      isDuty: true
    },
    {
      id: 3,
      name: 'Hasan Hoca',
      role: 'Kat Sorumlusu',
      phone: '905336775003',
      isDuty: false
    }
  ];

  return (
    <div className="bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-white font-body-md flex flex-col min-h-screen transition-colors duration-300">
      <Header title="İletişim" showUserName={false} />

      <main className="flex flex-col relative w-full pt-24 pb-safe min-h-screen px-margin">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold transition-colors shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold">Destek & İdareyle İletişim</h1>
        </div>

        <div className="flex flex-col gap-4">
          
          {/* Duty Teacher Highlight */}
          {teachers.filter(t => t.isDuty).map(duty => (
            <div key={duty.id} className="bg-gradient-to-br from-[#0c1836] via-[#10224d] to-[#081026] rounded-3xl p-5 shadow-lg border border-[#C5A059]/30 relative overflow-hidden text-white">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Nöbetçi Hoca
                </div>
              </div>

              <div className="flex flex-col gap-1 relative z-10 mb-5">
                <h2 className="text-xl font-bold tracking-tight">{duty.name}</h2>
                <span className="text-[#C5A059] text-sm font-medium">{duty.role}</span>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <button onClick={() => navigate('/coming-soon', { state: { title: 'Arama', icon: 'call' } })} className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Ara
                </button>
                <button onClick={() => navigate('/coming-soon', { state: { title: 'WhatsApp', icon: 'chat' } })} className="flex-1 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  WhatsApp
                </button>
              </div>
            </div>
          ))}

          {/* Other Teachers */}
          <div className="bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-white/5 rounded-3xl p-4 shadow-sm flex flex-col divide-y divide-slate-100 dark:divide-white/5 mt-2">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider px-2 py-3">Diğer İdareciler</h3>
            
            {teachers.filter(t => !t.isDuty).map(teacher => (
              <div key={teacher.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0F172A] dark:text-white text-sm">{teacher.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{teacher.role}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-14 sm:ml-0">
                  <a href={`tel:+${teacher.phone}`} className="flex-1 sm:flex-none px-4 py-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </a>
                  <a href={`https://wa.me/${teacher.phone}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Contact;
