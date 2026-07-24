import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { usePremium } from './usePremium';
import { isNative } from './usePlatform';
import { subscribeConsent, getCanRequestAds } from './consent';

/* ============================================================================
 *  ADS_CONFIG — EL ÚNICO LUGAR PARA AJUSTAR LOS ANUNCIOS
 *  ----------------------------------------------------------------------------
 *  Para mostrar MÁS ads: poné banner/interstitial en true, o subí el tope.
 *  Para mostrar MENOS: al revés. No hace falta tocar la lógica de abajo.
 *
 *    masterEnabled ............ interruptor global. false = CERO ads para todos
 *                               (útil como "kill switch" si algo sale mal).
 *    bannerExcludedPaths ...... rutas donde NO se muestra el banner.
 *    interstitialMaxPerSessionPerScreen .. cuántos interstitials como máximo
 *                               por pantalla en una misma sesión de la app.
 *    screens[key] ............. qué formatos habilitar en cada pantalla.
 * ========================================================================== */
export const ADS_CONFIG = {
  masterEnabled: true,
  bannerExcludedPaths: ['/upgrade'],
  interstitialMaxPerSessionPerScreen: 1,
  screens: {
    prediction:     { banner: false, interstitial: true  },
    races:          { banner: true,  interstitial: false },
    raceDetail:     { banner: true,  interstitial: false },
    statsDeep:      { banner: true,  interstitial: false },
    statsAnalysis:  { banner: true,  interstitial: false },
    statsHistogram: { banner: true,  interstitial: false },
  },
};

/* Poné en false para silenciar los logs de diagnóstico en consola. */
const DEBUG_ADS = false;

/* ----------------------------------------------------------------------------
 *  decideShowAds — decisión PURA, sin React ni AdMob.
 *
 *  Se muestran ads SOLO si...
 *    - la config global está encendida (masterEnabled), y
 *    - estamos en la app nativa (nunca en la web), y
 *    - ya terminó de cargar el estado premium (nunca durante loading), y
 *    - el usuario NO es premium, y
 *    - el consentimiento ya se resolvió y permite pedir anuncios.
 *
 *  Usamos isPremium (no canAccess): un usuario free debe ver ads tenga el
 *  paywall encendido o apagado.
 * -------------------------------------------------------------------------- */
export function decideShowAds({ masterEnabled, isNative, loading, isPremium, canRequestAds }) {
  return Boolean(masterEnabled && isNative && !loading && !isPremium && canRequestAds);
}

/* Registro EN MEMORIA de interstitials ya mostrados en esta sesión. */
const interstitialCounts = new Map(); // screenKey -> veces mostrado esta sesión

/* ----------------------------------------------------------------------------
 *  useAds — única fuente de verdad para decidir CUÁNDO mostrar anuncios.
 * -------------------------------------------------------------------------- */
export function useAds() {
  const { isPremium, loading } = usePremium();

  // Estado del consentimiento (se actualiza solo cuando initConsent resuelve).
  const canRequestAds = useSyncExternalStore(
    subscribeConsent,
    getCanRequestAds,
    () => false // valor en SSR / web: sin anuncios
  );

  const showAds = decideShowAds({
    masterEnabled: ADS_CONFIG.masterEnabled,
    isNative,
    loading,
    isPremium,
    canRequestAds,
  });

  useEffect(() => {
    if (!DEBUG_ADS) return;
    console.log(
      `[useAds] masterEnabled=${ADS_CONFIG.masterEnabled} isNative=${isNative} ` +
      `loading=${loading} isPremium=${isPremium} canRequestAds=${canRequestAds} -> showAds=${showAds}`
    );
  }, [loading, isPremium, canRequestAds, showAds]);

  const isBannerEnabled = useCallback(
    (screenKey) => showAds && Boolean(ADS_CONFIG.screens[screenKey]?.banner),
    [showAds]
  );

  const canShowInterstitial = useCallback(
    (screenKey) => {
      if (!showAds) return false;
      const screenCfg = ADS_CONFIG.screens[screenKey];
      if (!screenCfg?.interstitial) return false;
      const shown = interstitialCounts.get(screenKey) || 0;
      return shown < ADS_CONFIG.interstitialMaxPerSessionPerScreen;
    },
    [showAds]
  );

  const markInterstitialShown = useCallback((screenKey) => {
    interstitialCounts.set(screenKey, (interstitialCounts.get(screenKey) || 0) + 1);
  }, []);

  return { showAds, isBannerEnabled, canShowInterstitial, markInterstitialShown };
}