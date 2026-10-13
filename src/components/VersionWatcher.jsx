import { useEffect, useRef } from 'react';

/**
 * VersionWatcher:
 * Arka planda sunucudaki version.json dosyasını periyodik olarak ve sayfa görünürlüğü
 * değiştiğinde (kullanıcı uygulamaya geri döndüğünde) kontrol eder.
 * Yeni bir sürüm tespit edildiğinde:
 * 1. Eski Service Worker'ları ve CacheStorage'ı temizler.
 * 2. Kullanıcı verilerine (Supabase oturumu, tokenlar vb.) DOKUNMAZ.
 * 3. Sayfayı en yeni sürümle yeniler.
 */
export default function VersionWatcher() {
  const currentBuildTimeRef = useRef(null);
  const checkingRef = useRef(false);

  const checkVersion = async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;

    try {
      // no-cache ve rastgele query param ile sunucuya direkt sor
      const response = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) return;

      const data = await response.json();
      if (!data || !data.buildTime) return;

      const serverBuildTime = data.buildTime;
      const storedBuildTime = localStorage.getItem('ad_yurt_build_time');

      // İlk yükleme: Hafızaya mevcut sürümü kaydet
      if (!storedBuildTime) {
        localStorage.setItem('ad_yurt_build_time', String(serverBuildTime));
        currentBuildTimeRef.current = serverBuildTime;
        return;
      }

      // Yeni bir sürüm deploy edilmişse
      if (Number(serverBuildTime) > Number(storedBuildTime)) {
        console.log('[VersionWatcher] Yeni sürüm algılandı, önbellek temizlenip güncelleniyor...');
        localStorage.setItem('ad_yurt_build_time', String(serverBuildTime));

        // 1. Service Worker'ları kayıttan düşür
        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          } catch (e) {
            console.warn('[VersionWatcher] SW unregister error:', e);
          }
        }

        // 2. CacheStorage havuzunu temizle
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            for (const name of cacheNames) {
              await caches.delete(name);
            }
          } catch (e) {
            console.warn('[VersionWatcher] Cache delete error:', e);
          }
        }

        // 3. Sayfayı en yeni varlıklarla yeniden yükle
        window.location.reload();
      }
    } catch (err) {
      // Ağ hatası veya offline durumu sessizce geç
    } finally {
      checkingRef.current = false;
    }
  };

  useEffect(() => {
    // 1. İlk açılışta kontrol et
    checkVersion();

    // 2. Kullanıcı uygulamayı arka plandan öne getirdiğinde (PWA / sekme geçişi)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkVersion);

    // 3. Her 3 dakikada bir arka planda kontrol et
    const interval = setInterval(checkVersion, 3 * 60 * 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkVersion);
      clearInterval(interval);
    };
  }, []);

  return null;
}
