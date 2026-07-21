import { useEffect } from 'react';
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
} from '@capacitor-community/admob';
import { useAds } from '../hooks/useAds';
import { isAndroid } from '../hooks/usePlatform';

/* Test ad unit IDs de Google — SOLO para desarrollo.
 * Siempre devuelven anuncios de prueba, en cualquier dispositivo.
 * En la Fase 6 se reemplazan por las unidades reales de AdMob. */
const TEST_BANNER_AD_ID = isAndroid
  ? 'ca-app-pub-3940256099942544/6300978111' // Android test banner
  : 'ca-app-pub-3940256099942544/2934735716'; // iOS test banner

/* Alto del espaciador para que el banner (overlay nativo) no tape el contenido.
 * BannerAdSize.BANNER mide 50px de alto. Si en el device ves que tapa o sobra,
 * ajustá SOLO este número. */
const BANNER_HEIGHT = 50;

/**
 * <AdBanner screen="races" />
 *
 * Controla el banner nativo de AdMob para una pantalla:
 *  - Si corresponde mostrar ads en esa pantalla (usuario free, nativo, no premium),
 *    muestra el banner al montar y lo quita al desmontar.
 *  - Renderiza un espaciador para que el contenido pueda scrollear por encima
 *    del banner (que flota como capa nativa, no es parte del DOM).
 *
 * Si no corresponde mostrar ads, no hace nada y no ocupa espacio.
 */
export default function AdBanner({ screen }) {
  const { isBannerEnabled } = useAds();
  const enabled = isBannerEnabled(screen);

  useEffect(() => {
    if (!enabled) return;

    // Listeners de diagnóstico: para VER en consola si el banner cargó o falló.
    const loadedPromise = AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log(`[AdBanner:${screen}] banner cargado ✅`);
    });
    const failedPromise = AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
      console.error(`[AdBanner:${screen}] banner FALLÓ ❌`, err);
    });

    console.log(`[AdBanner:${screen}] mostrando banner...`);
    AdMob.showBanner({
      adId: TEST_BANNER_AD_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    }).catch((e) => console.error(`[AdBanner:${screen}] showBanner error ❌`, e));

    // Al salir de la pantalla: quitar el banner y limpiar listeners.
    return () => {
      AdMob.removeBanner().catch(() => {});
      loadedPromise.then((l) => l.remove()).catch(() => {});
      failedPromise.then((l) => l.remove()).catch(() => {});
    };
  }, [enabled, screen]);

  if (!enabled) return null;

  // Espaciador: reserva el alto del banner + la safe area inferior del iPhone.
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${BANNER_HEIGHT}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}