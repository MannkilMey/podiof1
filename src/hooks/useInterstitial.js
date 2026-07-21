import { useEffect, useRef, useCallback } from 'react';
import { AdMob } from '@capacitor-community/admob';
import { useAds } from './useAds';
import { isAndroid } from './usePlatform';

/* Test ad unit IDs de Google — SOLO desarrollo. Reemplazar en Fase 6. */
const TEST_INTERSTITIAL_AD_ID = isAndroid
  ? 'ca-app-pub-3940256099942544/1033173712' // Android test interstitial
  : 'ca-app-pub-3940256099942544/4411468910'; // iOS test interstitial

/**
 * useInterstitial(screenKey)
 *
 * Prepara (descarga) un interstitial al montar la pantalla, y lo muestra
 * recién cuando vos lo pedís — en una pausa natural del flujo.
 *
 * Reglas (heredadas de useAds):
 *   - Solo usuarios free, en nativo, con el estado premium ya cargado.
 *   - Máximo 1 por sesión por pantalla (ADS_CONFIG).
 *   - Si el anuncio NO alcanzó a cargar, NO se muestra y NO se cuenta:
 *     jamás bloquea al usuario esperando publicidad.
 *
 * Devuelve:
 *   showIfReady() -> Promise<boolean>  (true si se llegó a mostrar)
 */
export function useInterstitial(screenKey) {
  const { canShowInterstitial, markInterstitialShown } = useAds();
  const readyRef = useRef(false);   // ¿el anuncio terminó de descargarse?
  const shownRef = useRef(false);   // ¿ya lo mostramos en esta pantalla?

  // Preparar al montar (descarga en segundo plano mientras el usuario predice).
  useEffect(() => {
    if (!canShowInterstitial(screenKey)) return;

    let cancelled = false;
    console.log(`[Interstitial:${screenKey}] preparando...`);
    AdMob.prepareInterstitial({ adId: TEST_INTERSTITIAL_AD_ID })
      .then(() => {
        if (cancelled) return;
        readyRef.current = true;
        console.log(`[Interstitial:${screenKey}] listo ✅`);
      })
      .catch((e) => {
        if (cancelled) return;
        readyRef.current = false;
        console.warn(`[Interstitial:${screenKey}] no se pudo preparar (se omite)`, e);
      });

    return () => { cancelled = true; };
  }, [screenKey, canShowInterstitial]);

  const showIfReady = useCallback(async () => {
    if (shownRef.current) return false;                    // ya se mostró acá
    if (!readyRef.current) {                               // no cargó a tiempo
      console.log(`[Interstitial:${screenKey}] no está listo, se omite`);
      return false;
    }
    if (!canShowInterstitial(screenKey)) return false;      // tope o premium

    try {
      shownRef.current = true;
      console.log(`[Interstitial:${screenKey}] mostrando...`);
      await AdMob.showInterstitial();                       // resuelve al cerrarse
      markInterstitialShown(screenKey);
      console.log(`[Interstitial:${screenKey}] cerrado ✅`);
      return true;
    } catch (e) {
      console.error(`[Interstitial:${screenKey}] error al mostrar ❌`, e);
      return false;
    }
  }, [screenKey, canShowInterstitial, markInterstitialShown]);

  return { showIfReady };
}