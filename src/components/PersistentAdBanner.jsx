import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
} from '@capacitor-community/admob';
import { useAuthStore } from '../stores/authStore';
import { useAds, ADS_CONFIG } from '../hooks/useAds';
import { isAndroid } from '../hooks/usePlatform';

/* Test ad unit IDs de Google — SOLO desarrollo. Reemplazar en Fase 6. */
const TEST_BANNER_AD_ID = isAndroid
  ? 'ca-app-pub-3940256099942544/6300978111' // Android test banner
  : 'ca-app-pub-3940256099942544/2934735716'; // iOS test banner

/* Alto del banner (BannerAdSize.BANNER = 50px). Ajustá si hiciera falta. */
const BANNER_HEIGHT = 50;

function isBannerExcludedPath(pathname) {
  return (ADS_CONFIG.bannerExcludedPaths || []).some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

/**
 * <PersistentAdBanner /> — un ÚNICO banner nativo a nivel de app.
 *
 * Se monta una sola vez (dentro del Router). Se muestra a usuarios free
 * logueados en TODAS las pantallas, excepto las rutas excluidas (ej. el
 * paywall). Se mantiene fijo al navegar (no parpadea). Para premium o
 * deslogueado, permanece oculto.
 *
 * El banner es un overlay nativo (no DOM); el espaciado para que no tape
 * el contenido se maneja global vía la clase body.has-ad-banner.
 */
export default function PersistentAdBanner() {
  const { showAds } = useAds();
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();

  const shouldShow = showAds && !!user && !isBannerExcludedPath(pathname);
  const createdRef = useRef(false);

  // Inyecta UNA sola vez la regla de espaciado global (no depende de ningún
  // archivo CSS tuyo; se auto-contiene acá).
  useEffect(() => {
    const id = 'ad-banner-spacing-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent =
      `body.has-ad-banner { padding-bottom: calc(${BANNER_HEIGHT}px + env(safe-area-inset-bottom, 0px)); }`;
    document.head.appendChild(style);
  }, []);

  // Listeners de diagnóstico + limpieza total al desmontar la app.
  useEffect(() => {
    const loaded = AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log('[PersistentAdBanner] banner cargado ✅');
    });
    const failed = AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
      console.error('[PersistentAdBanner] banner FALLÓ ❌', err);
    });
    return () => {
      loaded.then((l) => l.remove()).catch(() => {});
      failed.then((l) => l.remove()).catch(() => {});
      document.body.classList.remove('has-ad-banner');
      AdMob.removeBanner().catch(() => {});
    };
  }, []);

  // Muestra / oculta según corresponda, manteniendo el banner fijo entre rutas.
  useEffect(() => {
    if (shouldShow) {
      document.body.classList.add('has-ad-banner');
      if (!createdRef.current) {
        createdRef.current = true;
        console.log('[PersistentAdBanner] mostrando banner...');
        AdMob.showBanner({
          adId: TEST_BANNER_AD_ID,
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        }).catch((e) => console.error('[PersistentAdBanner] showBanner error ❌', e));
      } else {
        // Ya se creó antes y estaba oculto → re-mostrarlo (sin recrearlo).
        AdMob.resumeBanner().catch(() => {});
      }
    } else {
      document.body.classList.remove('has-ad-banner');
      if (createdRef.current) {
        AdMob.hideBanner().catch(() => {});
      }
    }
  }, [shouldShow]);

  return null;
}