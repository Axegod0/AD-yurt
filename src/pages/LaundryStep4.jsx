import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LaundryStep4 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Accept total cost from navigation state if available, otherwise default to 22 (18 base + 4 softener)
  const totalCost = location.state?.totalCost || 22;
  const discount = 2;
  const netAmount = totalCost - discount;
  
  const currentBalance = 145;
  const remainingBalance = currentBalance - netAmount;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Navigate back to the laundry dashboard after success
      setTimeout(() => {
        navigate('/laundry');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="bg-surface-dark text-on-surface font-body-md text-body-md flex flex-col min-h-screen selection:bg-brand-gold/30">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-dark/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <button 
              aria-label="Geri Dön" 
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95" 
              onClick={() => navigate(-1)}
              disabled={isProcessing || isSuccess}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight uppercase truncate">
              Bakiye Yükle
            </h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-surface-card px-space-sm py-1 rounded-full shadow-[0_0_12px_rgba(197,160,89,0.15)]">
              <span className="material-symbols-outlined text-primary text-[18px]">monetization_on</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">{currentBalance} AD</span>
            </div>
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1Umi-vFsj8j_T0eYltaHg1Buj2RYmu6Hen2oBFpTX0M3qM9pq4e7dQ_r0Mm3RImZsQSFC2gyV4ifC7o2gSuN_Vpt9FH9wcBGkNCFtLsRR-MFB22CReA1i2EvHsPdZ4xFo77_VVwhO9Q42UV5d4Rpg8wo5LyV50ItcjQEWoXbHAai9IwWG8Qf1cvLHcn5PvpvjVeOhwJEoLKG5mczZ7UEfsBEUx2zj5aohDke-ev79Jg3kK8yx61HGxiydlbLcScXOMEcJD1u8ixvIQ" 
            />
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-safe bg-surface-dark min-h-screen">
        <div className="flex flex-col w-full px-margin pb-10 space-y-space-lg text-on-surface">
          
          {/* Stepper & Flow Indicator */}
          <div className="flex flex-col bg-[#111625]/90 border border-primary/20 rounded-2xl p-4 mb-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[16px]">fact_check</span>
                ADIM 4 / 4 • SİPARİŞ ÖZETİ & ONAY
              </span>
              <span className="text-primary font-bold">%100 Tamamlandı</span>
            </div>
            <div className="w-full flex gap-1.5 h-1.5">
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
              <div className="h-full flex-1 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(197,160,89,0.4)]"></div>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              <div className="flex flex-col items-center text-center gap-1 text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-medium leading-tight">1. Sepet</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-medium leading-tight">2. Program</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-medium leading-tight">3. Yumuşatıcı</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 text-primary">
                <div className="w-6 h-6 rounded-full bg-primary text-surface-dark flex items-center justify-center shadow-[0_0_8px_rgba(197,160,89,0.5)]">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
                <span className="text-[11px] font-bold leading-tight">4. Onay</span>
              </div>
            </div>
          </div>

          {/* Screen Heading */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-2">
                Sipariş Özeti
              </h2>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Hazır
              </span>
            </div>
            <p className="font-body-md text-body-md text-text-muted">
              Seçtiğiniz yıkama detaylarını kontrol edin ve onaylayın.
            </p>
          </div>

          {/* Primary Cart Card (1. Sepet: İstasyon 04) */}
          <div className="flex flex-col bg-surface-card rounded-xl p-space-md space-y-space-md shadow-[0_8px_24px_rgba(0,0,0,0.45)] relative overflow-hidden">
            {/* Subtle Golden Radiance Accent */}
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_laundry_service</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface">1. Sepet: İstasyon 04</span>
                  <span className="font-label-sm text-label-sm text-primary">Standart Yıkama</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button aria-label="Sepeti Düzenle" className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-primary transition-colors active:scale-95 bg-surface-container/60" type="button" onClick={() => navigate(-3)}>
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button aria-label="Sepeti Sil" className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-error transition-colors active:scale-95 bg-surface-container/60" type="button" onClick={() => navigate('/laundry')}>
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>

            {/* Specs Breakdown Table/Rows */}
            <div className="flex flex-col space-y-2.5 pt-1">
              <div className="flex items-start justify-between gap-3 text-body-sm font-body-sm">
                <span className="text-text-muted flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-text-muted">location_on</span>
                  Makine Konumu
                </span>
                <span className="text-on-surface text-right font-medium">İstasyon 04 (Zemin Kat - Sol)</span>
              </div>
              
              <div className="flex items-start justify-between gap-3 text-body-sm font-body-sm">
                <span className="text-text-muted flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-text-muted">tune</span>
                  Program & Sıcaklık
                </span>
                <span className="text-on-surface text-right font-medium">Günlük Pamuklu (40°C • 1000 D.) <span className="text-primary font-semibold ml-1">18 AD</span></span>
              </div>
              
              <div className="flex items-start justify-between gap-3 text-body-sm font-body-sm">
                <span className="text-text-muted flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-text-muted">sanitizer</span>
                  Yumuşatıcı
                </span>
                <span className="text-on-surface text-right font-medium">Lavanta Esansı <span className="text-primary font-semibold ml-1">{totalCost - 18} AD</span></span>
              </div>
              
              <div className="flex items-start justify-between gap-3 text-body-sm font-body-sm">
                <span className="text-text-muted flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-text-muted">schedule</span>
                  Tahmini Süre
                </span>
                <span className="text-on-surface text-right font-medium">~45 Dakika</span>
              </div>
            </div>

            {/* Subtotal Footer Strip */}
            <div className="flex items-center justify-between pt-2.5 mt-1 bg-surface-card-subtle/80 -mx-space-md -mb-space-md px-space-md py-space-sm">
              <span className="font-label-md text-label-md text-text-muted">Sepet Ara Toplamı</span>
              <div className="flex items-center gap-1 text-primary">
                <img alt="AD Coin" className="w-4 h-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUeSH1vw1vxBodoRvkLk8rz0sHjz7dl6PHTd8cHSFdD_WTFnA5bTXgyTAab-c1PRv-uyHV2u5Z4i71b9RDXShsvOWQWBLuFlC4d7fOlSGg7E5htsxjLhR5i6KiVmYRg8N0tmVS9gNGLZ-Eb0tPG3HXVWw57ulN38_Lk3qYnxUrXkKMsJ4oXxlOVQ-JGbR3W7KzI1kV_vE0GxZvajAWsdlEpwFqz0460V4YEJW_reqo-RAAFHhf19IHuK9u-DdC8cDPy-E" />
                <span className="font-headline-sm text-headline-sm font-bold">{totalCost} AD Coin</span>
              </div>
            </div>
          </div>

          {/* Add 2nd Basket Action Area */}
          <div className="flex flex-col bg-surface-card/60 rounded-xl p-space-md space-y-space-sm shadow-md relative overflow-hidden">
            <div className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
              </div>
              <span className="">Yeni Bir Sepet / Makine Ekle</span>
            </div>
            <p className="font-body-sm text-body-sm text-text-muted leading-relaxed">
              Aynı anda başka bir makine (örneğin beyazlar veya renkliler için 2. sepet) çalıştırmak için hemen ekleyin.
            </p>
            <div className="pt-1">
              <button 
                className="w-full py-2.5 px-4 rounded-lg bg-surface-container hover:bg-surface-card-subtle text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm" 
                type="button"
                onClick={() => navigate('/laundry/step1')}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                + 2. Sepeti Ekle
              </button>
            </div>
          </div>

          {/* Smart Dosage Badge Callout */}
          <div className="flex items-start gap-2.5 bg-surface-container-low p-3 rounded-lg">
            <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">eco</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <strong className="text-primary font-semibold">Ekolojik Akıllı Dozaj: </strong> 
              Otomatik tartım ve dozlama ile çamaşırlarınız özenle yıkanır, su ve deterjan israfı önlenir.
            </p>
          </div>

          {/* Pricing & Balance Breakdown Panel */}
          <div className="flex flex-col bg-surface-card rounded-xl p-space-md space-y-space-md shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">Ödeme Özeti</span>
              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">İşlem Detayları</span>
            </div>
            
            {/* Line Items */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-text-muted">Sepet Toplamı (1 Yıkama)</span>
                <span className="text-on-surface font-medium">{totalCost} AD</span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-text-muted flex items-center gap-1">
                  <span className="">Yurt Öğrenci İndirimi</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-brand-crimson/20 text-tertiary font-bold tracking-tight">KAMPÜS</span>
                </span>
                <span className="text-tertiary font-semibold">-{discount} AD</span>
              </div>
            </div>
            
            {/* Big Net Amount Box */}
            <div className="flex items-center justify-between bg-primary-container/20 rounded-xl p-3.5 shadow-sm">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-primary uppercase font-bold tracking-wider">Ödenecek Net Tutar</span>
                <span className="font-label-sm text-label-sm text-text-muted">KDV & Servis Bedeli Dahil</span>
              </div>
              <div className="flex items-center gap-2">
                <img alt="AD Medallion" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(229,193,88,0.4)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRh-f_pCW0lECp3PTHupxhI4WrFD6-5Ip6ob_EbIwxkU0EqNbS6V0qQtcstzD-YtId8upnURLclpVPDq1KfUm0AxaLV6VB1_Ya0JorEHdcUK0zl9Y8L0HxolLzkjcApojHyVAaVOOUeeFEJfoFidIF3PoGEphagX33BjYVIANoeSmabsokWt5RePKO9R08HdXSLFsMPITRnIpxNhrF9umNAxyjyJjVtz6riTX5Mks2a74Ne5Zl8Mp_33ayaLVmwwCOosI" />
                <span className="font-display-hero text-headline-lg text-primary font-extrabold tracking-tight">{netAmount} AD</span>
              </div>
            </div>
            
            {/* Student Wallet Diagnostics */}
            <div className="flex flex-col bg-surface-container rounded-lg p-space-sm space-y-1.5">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-text-muted flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">account_balance_wallet</span>
                  Mevcut Cüzdan Bakiyesi:
                </span>
                <span className="text-on-surface font-semibold">{currentBalance} AD Coin</span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-text-muted">İşlem Sonrası Kalan:</span>
                <div className="flex items-center gap-2">
                  <span className="text-on-surface font-semibold">{remainingBalance} AD Coin</span>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-card text-[10px] font-bold shadow-xs ${remainingBalance >= 0 ? 'text-primary' : 'text-error'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${remainingBalance >= 0 ? 'bg-primary' : 'bg-error'}`}></span>
                    {remainingBalance >= 0 ? 'Bakiye Yeterli' : 'Yetersiz Bakiye'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Option Checkbox */}
          <label className="flex items-start gap-3 select-none cursor-pointer bg-surface-card/40 p-3 rounded-xl transition-colors active:bg-surface-card mt-2">
            <div className="relative flex items-center justify-center mt-0.5">
              <input defaultChecked className="peer sr-only" id="notif-check" type="checkbox" />
              <div className="w-5 h-5 rounded bg-surface-container flex items-center justify-center peer-checked:bg-primary transition-all">
                <span className="material-symbols-outlined text-[16px] text-surface-dark font-bold opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-body-md text-on-surface font-medium leading-snug">
                Yıkama bitimine 5 dakika kala SMS & anlık bildirim gönder
              </span>
              <span className="font-body-sm text-body-sm text-text-muted">
                Sepetinizi bekletmeden teslim almanız için hatırlatıcı kurulur.
              </span>
            </div>
          </label>

          {/* Primary CTA Payment Button & Sub-info */}
          <div className="flex flex-col space-y-space-sm pt-2">
            <button 
              className={`w-full py-4 px-6 rounded-xl text-surface-dark font-headline-md text-headline-md flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(197,160,89,0.3)] transition-transform ${
                isProcessing || isSuccess ? 'bg-surface-variant scale-[0.99] opacity-90' : 'bg-gradient-to-r from-primary via-brand-gold to-brand-gold-bright active:scale-[0.98]'
              }`} 
              type="button"
              onClick={handlePayment}
              disabled={isProcessing || isSuccess}
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin text-primary">progress_activity</span>
                  <span className="font-bold text-primary">Ödeme İşleniyor...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                  <span className="font-bold text-primary">Sipariş Başlatıldı!</span>
                </>
              ) : (
                <>
                  <img alt="Coin" className="w-5 h-5 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaHodVw6a-3BmznVSVElMGZL6SSAj_45ZtXeVELUmmPwiHnRZbcNtpAlF5nQvTp4OvoNUiOYrvTPGhLGV8Zq3kaz3UDZ264iNWfCVUtgp4T_QKYwy7r-EgxQTfmY872po0gl_1kkiCmsUaoQFkZ9GG1IqKniSvYyZuz_Fc1KEocdf-e0byaLgvwI8wQZLEYWtWpenX9gXenhMg9rxnxMz7N5ia4HT_d9LDh_7A1WeTGCmfAlDKXmEL64WsdqQ0cH9LYw4" />
                  <span className="font-bold">{netAmount} AD Coin ile Öde ve Başlat</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-center text-text-muted font-body-sm text-body-sm px-2">
              <span className="material-symbols-outlined text-[15px] text-primary shrink-0">lock</span>
              <span className="">Ödeme onaylandığında siparişiniz aktifleşir ve Çamaşırhane Ana Sayfasına yönlendirilirsiniz.</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LaundryStep4;
