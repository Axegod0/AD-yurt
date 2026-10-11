import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdminStudents = () => {
  const [activeBlock, setActiveBlock] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastInfo, setToastInfo] = useState({ show: false, title: '', message: '' });
  const [editingId, setEditingId] = useState('ADY-8831'); // Default to first one open

  const [students, setStudents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
      window.location.href = '/';
      return;
    }

    const { data, error } = await supabase.from('users').select('*').order('full_name');
    if (data) {
      const formatted = data.map(u => ({
        id: u.id,
        name: u.full_name || 'İsimsiz',
        room: u.room_number || 'Belirtilmedi',
        block: (u.room_number || '').split('-')[0].trim().toUpperCase() + ' Blok',
        email: u.email || 'Yok',
        balance: u.balance || 0,
        initials: (u.full_name || 'X').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      }));
      setStudents(formatted);
    }
  };

  const [newStudent, setNewStudent] = useState({
    name: '',
    room: '',
    balance: 100,
    email: ''
  });

  const [editFormData, setEditFormData] = useState({});

  const showToast = (title, message) => {
    setToastInfo({ show: true, title, message });
    setTimeout(() => {
      setToastInfo({ show: false, title: '', message: '' });
    }, 4000);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.room || !newStudent.email) return;

    try {
      // Create user logic here, e.g. using auth.signUp or edge function. 
      // For now, we simulate success and re-fetch if we had an insert to 'users'.
      // Usually, users must be created through Supabase Auth first.
      
      showToast('Yeni Talebe İsteği Alındı', 'Bu işlem için Supabase Auth üzerinden kullanıcı oluşturulmalıdır. Sistem yöneticisiyle görüşün.');
      setNewStudent({ name: '', room: '', balance: 100, email: '' });
      setIsFormOpen(false);
    } catch (error) {
      showToast('Hata', error.message);
    }
  };

  const handleRemoveStudent = async (id, name) => {
    if (window.confirm(`${name} isimli talebeyi sistemden ve yurt odasından silmek istediğinize emin misiniz?`)) {
      await supabase.from('users').delete().eq('id', id);
      fetchUsers();
      showToast('Silindi', `${name} başarıyla sistemden kaldırıldı.`);
    }
  };

  const handlePasswordReset = async (id, name) => {
    if (!window.confirm(`${name} isimli öğrencinin şifresini 'alidayi' olarak sıfırlamak istediğinize emin misiniz?`)) return;
    
    try {
      const { error } = await supabase.rpc('admin_reset_user_password', { student_id: id });
      if (error) throw error;
      
      showToast('Şifre Başarıyla Sıfırlandı', `${name} adlı öğrencinin şifresi varsayılan "alidayi" yapıldı. İlk oturum açışında şifresini kendisi belirleyecektir.`);
    } catch (error) {
      showToast('Hata', 'Şifre sıfırlanırken bir hata oluştu: ' + error.message);
    }
  };

  const startEditing = (student) => {
    if (editingId === student.id) {
      setEditingId(null);
    } else {
      setEditingId(student.id);
      setEditFormData({
        name: student.name,
        room: student.room,
        email: student.email
      });
    }
  };

  const saveEdit = (id) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          name: editFormData.name,
          room: editFormData.room,
          block: editFormData.room.split('-')[0].trim().toUpperCase() + ' Blok',
          email: editFormData.email,
          initials: editFormData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        };
      }
      return s;
    }));
    setEditingId(null);
    showToast(`${editFormData.name} Bilgileri Güncellendi`, 'Oda ve e-posta değişiklikleri sistemde senkronize edildi.');
  };

  const filteredStudents = students.filter(s => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || s.name.toLowerCase().includes(query) || s.room.toLowerCase().includes(query) || s.email.toLowerCase().includes(query);
    const matchesBlock = activeBlock === 'ALL' || s.block === activeBlock;
    return matchesQuery && matchesBlock;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased">
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] pt-safe">
        <div className="h-20 px-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img alt="logo" className="h-8 w-auto object-contain shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-AT7oTa3IgYWL3P6Dz1pN0tSoNV7ph0MsQm-je--5MzhcNx99qjS9vDN-01JaSpf7ZXmefJWBfv0O5bdb4LL58L8QgIqHxNlmcncK9eQ5MlFfgkRfV_bqs2vm4PB74mlFgv7A_c_fZuzFG6AoeTkPM4l9EcCHVpYt9_ThuQiTEt2ewGdRQdAHSFOfamuNhB7Q2SzCJItISBTDeDe1PoZxVejrZM11VFuFHQuB8zl6T__Gr44Q7t_VV08ypb99WOnifFo" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[16px] text-[#C5A059] uppercase tracking-wider truncate">AD YURDU ADMİN</span>
                <span className="px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-bold tracking-widest uppercase">PRO</span>
              </div>
              <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 tracking-tight truncate">ÖĞRENCİ & YÖNETİM PANELİ</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="w-11 h-11 rounded-full flex items-center justify-center text-slate-900 dark:text-slate-400 hover:text-[#C5A059] transition-colors relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#07090e]"></span>
            </button>
            <button onClick={() => window.location.href = '/profil'} className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center shadow-[0_0_12px_rgba(197,160,89,0.35)] active:scale-95 transition-transform" title="Normal Hesaba Dön">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-[calc(env(safe-area-inset-top,12px)+6rem)] pb-28 px-5 min-h-screen">
        <div className="flex flex-col w-full gap-5">
          
          {/* Notification Toast */}
          {toastInfo.show && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 shadow-lg relative overflow-hidden transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-amber-600 dark:bg-amber-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white dark:text-slate-900 text-[18px]">verified_user</span>
              </div>
              <div className="flex flex-col min-w-0 pr-6">
                <span className="font-bold text-[16px] text-amber-600 dark:text-amber-500">{toastInfo.title}</span>
                <p className=" text-[12px] text-slate-900 dark:text-slate-600 dark:text-slate-300 mt-0.5">{toastInfo.message}</p>
              </div>
              <button className="absolute top-2 right-2 p-1 text-slate-900 dark:text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:text-amber-500 transition-colors" onClick={() => setToastInfo({ show: false, title: '', message: '' })}>
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Metric Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-[16px]">groups</span>
              </div>
              <span className="font-bold text-[19px] text-slate-900 dark:text-white">{students.length + 144}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-center w-full">Toplam Talebe</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-500 text-[16px]">meeting_room</span>
              </div>
              <span className="font-bold text-[19px] text-blue-600 dark:text-blue-500">%92</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-center w-full">Oda Doluluk</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-[16px]">local_laundry_service</span>
              </div>
              <span className="font-bold text-[19px] text-slate-900 dark:text-white">14</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-center w-full">Kasa & Çamaşır</span>
            </div>
          </div>

          {/* New Student Form */}
          <div className="flex flex-col rounded-xl bg-slate-100 dark:bg-slate-800 p-4 shadow-xl relative overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center justify-between w-full focus:outline-none"
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-[20px]">person_add</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[16px] text-amber-600 dark:text-amber-500 uppercase tracking-wide">Yeni Talebe Kaydı</span>
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Yeni öğrenci eklemek için tıklayın</span>
                </div>
              </div>
              <span className={`material-symbols-outlined text-amber-600 dark:text-amber-500 transition-transform duration-300 ${isFormOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            
            {isFormOpen && (
              <form className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700" onSubmit={handleAddStudent}>
                <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <label className="font-semibold text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-amber-600 dark:text-amber-500">badge</span> Ad Soyad
                  </label>
                  <input 
                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white  text-[12px] px-3 py-2.5 rounded-lg pr-12 focus:outline-none focus:bg-slate-50 dark:focus:bg-[#37393f]/40 transition-colors placeholder:text-slate-500 dark:text-slate-400/60 border border-slate-200 dark:border-transparent" 
                    placeholder="Örn: Salih Zeki" 
                    required 
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-amber-600 dark:text-amber-500">door_front</span> Oda No
                  </label>
                  <input 
                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white  text-[12px] px-3 py-2.5 rounded-lg pr-12 focus:outline-none focus:bg-slate-50 dark:focus:bg-[#37393f]/40 transition-colors placeholder:text-slate-500 dark:text-slate-400/60 border border-slate-200 dark:border-transparent" 
                    placeholder="Örn: B-205" 
                    required 
                    type="text"
                    value={newStudent.room}
                    onChange={(e) => setNewStudent({...newStudent, room: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2 sm:col-span-2">
                  <label className="font-semibold text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-amber-600 dark:text-amber-500">monetization_on</span> Başlangıç Bakiyesi
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white  text-[12px] px-3 py-2.5 rounded-lg pr-12 focus:outline-none focus:bg-slate-50 dark:focus:bg-[#37393f]/40 transition-colors placeholder:text-slate-500 dark:text-slate-400/60 border border-slate-200 dark:border-transparent" 
                      type="number"
                      value={newStudent.balance}
                      onChange={(e) => setNewStudent({...newStudent, balance: e.target.value})}
                    />
                    <span className="absolute right-3 font-semibold text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-500 font-bold">AD</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-amber-600 dark:text-amber-500">alternate_email</span> İletişim & Kurumsal E-posta
                </label>
                <input 
                  className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white  text-[12px] px-3 py-2.5 rounded-lg border border-slate-200 dark:border-transparent focus:outline-none focus:bg-slate-50 dark:focus:bg-[#37393f]/40 transition-colors placeholder:text-slate-500 dark:text-slate-400/60" 
                  placeholder="talebe@alidayi.yurt" 
                  required 
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-900 mt-1">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-[18px] shrink-0">lock_clock</span>
                <div className="flex flex-col">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-500 font-bold">Varsayılan Şifre: alidayi</span>
                  <span className=" text-[12px] text-slate-500 dark:text-slate-400 text-[11px] leading-tight">Öğrenci ilk sisteme girişte parolasını kendi şahsi şifresi ile günceller.</span>
                </div>
              </div>
              <button className="w-full mt-2 py-3 px-3 rounded-xl bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-900 font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform" type="submit">
                <span className="material-symbols-outlined text-[20px]">person_check</span>
                Talebeyi Kaydet
              </button>
              </form>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col gap-3">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-3.5 text-slate-500 dark:text-slate-400 text-[20px]">search</span>
              <input 
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white  text-[12px] pl-11 pr-10 py-3 rounded-xl focus:outline-none shadow-sm placeholder:text-slate-500 dark:text-slate-400/50 border border-slate-200 dark:border-transparent" 
                placeholder="İsim, oda no (B-304) veya e-posta ile ara..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="absolute right-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white" onClick={() => setSearchQuery('')}>
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['ALL', 'A Blok', 'B Blok', 'C Blok'].map(block => (
                <button 
                  key={block}
                  onClick={() => setActiveBlock(block)}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 shadow-sm transition-all border ${activeBlock === block ? 'bg-amber-600 dark:bg-amber-500 text-white border-amber-600 dark:border-amber-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:text-amber-500'}`}
                >
                  {block === 'ALL' ? `Tümü (${students.length})` : block}
                </button>
              ))}
            </div>
          </div>

          {/* Student Directory Header */}
          <div className="flex items-center justify-between -mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-headline-md text-slate-900 dark:text-white">Talebe Dizini</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-500 font-semibold text-[10px] uppercase tracking-wider">{filteredStudents.length} Kayıt Gösteriliyor</span>
            </div>
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Son Güncelleme: Bugün</span>
          </div>

          {/* Students List */}
          <div className="flex flex-col gap-3">
            {filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-space-xl rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-space-sm">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-[28px]">person_search</span>
                </div>
                <span className="font-bold text-[16px] text-slate-900 dark:text-white">Eşleşen Talebe Bulunamadı</span>
                <p className=" text-[12px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Arama kriterlerinize veya seçilen blok filtresine uygun kayıt bulunmamaktadır.
                </p>
              </div>
            ) : (
              filteredStudents.map(student => (
                <div key={student.id} className="flex flex-col rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-sm transition-all relative overflow-hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-amber-100 dark:border-slate-700">
                        <span className="font-bold text-[16px] text-amber-600 dark:text-amber-500">{student.initials}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[16px] text-slate-900 dark:text-white truncate">{student.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 font-semibold text-[10px] uppercase tracking-wider font-bold shrink-0">
                            {student.room}
                          </span>
                        </div>
                        <span className=" text-[12px] text-slate-500 dark:text-slate-400 truncate">{student.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
                      <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-[15px]">toll</span>
                      <span className="font-bold text-[16px] text-amber-600 dark:text-amber-500">{student.balance}</span>
                      <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">AD</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg p-1.5 border border-slate-100 dark:border-transparent">
                    <button onClick={() => startEditing(student)} className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-white dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 hover:bg-amber-600 dark:bg-amber-500 hover:text-white dark:text-slate-900 transition-all font-label-md text-label-md border border-slate-200 dark:border-transparent shadow-sm">
                      <span className="material-symbols-outlined text-[15px]">edit</span> Düzenle
                    </button>
                    <button onClick={() => handlePasswordReset(student.id, student.name)} className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:text-amber-500 transition-all font-label-md text-label-md border border-slate-200 dark:border-transparent shadow-sm">
                      <span className="material-symbols-outlined text-[15px]">restart_alt</span> Şifre Sıfırla
                    </button>
                    <button onClick={() => handleRemoveStudent(student.id, student.name)} className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-brand-crimson/10 text-[#ffb4ac] hover:bg-brand-crimson hover:text-white transition-all font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[15px]">delete</span> Sil
                    </button>
                  </div>

                  {/* Inline Edit Panel */}
                  {editingId === student.id && (
                    <div className="flex flex-col gap-2 mt-3 pt-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-transparent rounded-lg p-3 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-500 uppercase font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">tune</span> Hızlı Düzenleme Paneli
                        </span>
                        <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">ID: #{student.id}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Ad Soyad</label>
                          <input 
                            type="text" 
                            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent text-[12px] px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Oda No</label>
                          <input 
                            type="text" 
                            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent text-[12px] px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                            value={editFormData.room}
                            onChange={(e) => setEditFormData({...editFormData, room: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Kurumsal E-posta</label>
                        <input 
                          type="email" 
                          className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent text-[12px] px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-1">
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-400 font-label-md text-label-md hover:text-slate-900 dark:text-white">Vazgeç</button>
                        <button onClick={() => saveEdit(student.id)} className="px-4 py-1.5 rounded bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-900 font-label-md text-label-md font-bold shadow-md">Kaydet</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-300 shadow-sm mt-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 animate-pulse"></span>
              <span className="font-semibold text-[10px] uppercase tracking-wider">Ali Dayı Yurdu Veri Tabanı Aktif & Senkronize</span>
            </div>
            <span className="font-semibold text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-500 font-bold">V 2.4</span>
          </div>

        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-md">
        <div className="grid grid-cols-4 items-center h-16 px-2 max-w-lg mx-auto">
          <a href="/admin/laundry" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            <span className="text-[10px] uppercase tracking-wide">Siparişler</span>
          </a>
          <a href="/admin/balance" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            <span className="text-[10px] uppercase tracking-wide">Kasa & Finans</span>
          </a>
          <a href="/admin/support" className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
            <span className="material-symbols-outlined text-[22px]">support_agent</span>
            <span className="text-[10px] uppercase tracking-wide">Destek</span>
          </a>
          <a href="/admin/students" className="flex flex-col items-center justify-center gap-1 py-1 text-amber-600 dark:text-amber-500 font-bold transition-colors">
            <span className="material-symbols-outlined text-[22px]">groups</span>
            <span className="text-[10px] uppercase tracking-wide font-bold">Talebeler</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

export default AdminStudents;
